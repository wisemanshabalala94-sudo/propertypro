import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SupabaseService, Invoice, MaintenanceRequest, Lease, Profile, Payment } from '../services/supabase.service';
import { PaystackService, PaystackSuccessResponse } from '../services/paystack.service';

interface MaintForm { title: string; description: string; category: string; priority: string; }

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-page">
      @if (loading) { <div class="loading-container"><div class="spinner"></div><p>Loading your dashboard...</p></div> }
      @else if (error) { <div class="error-banner"><span>{{ error }}</span><button class="btn btn-sm btn-secondary" (click)="loadData()">Retry</button></div> }
      @else {

      <!-- Header -->
      <header class="page-header">
        <div>
          <h1 class="page-title">My Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ tenantName }}.</p>
        </div>
      </header>

      <!-- Balance Card -->
      <section class="balance-card">
        <div>
          <div class="balance-label">Total Outstanding</div>
          <div class="balance-amount">{{ fmtCur(accountBalance) }}</div>
          @if (nextDueDate) { <div class="balance-due">Next payment due: {{ fmtDate(nextDueDate) }}</div> }
        </div>
        <div>
          @if (unpaidInvoices.length > 0) {
            <button class="btn btn-primary btn-lg" (click)="payNow(unpaidInvoices[0])">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Pay Now
            </button>
          } @else {
            <div class="paid-badge"><svg width="24" height="24" fill="none" stroke="#10B981" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>All caught up!</span></div>
          }
        </div>
      </section>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button class="tab-item" [class.active]="tab === 'payments'" (click)="tab = 'payments'">Payments</button>
        <button class="tab-item" [class.active]="tab === 'maintenance'" (click)="tab = 'maintenance'">Maintenance</button>
        <button class="tab-item" [class.active]="tab === 'documents'" (click)="tab = 'documents'">Documents</button>
        <button class="tab-item" [class.active]="tab === 'messages'" (click)="tab = 'messages'">Messages</button>
        <button class="tab-item" [class.active]="tab === 'profile'" (click)="tab = 'profile'">Profile</button>
      </div>

      <!-- Payments -->
      @if (tab === 'payments') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Invoice History</h2></div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead><tr><th>Invoice #</th><th>Type</th><th>Amount</th><th>Due Date</th><th>Paid Date</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                @for (inv of invoices; track inv.id) {
                  <tr>
                    <td class="font-medium">{{ inv.invoice_number }}</td>
                    <td><span class="badge badge-purple">{{ inv.invoice_type }}</span></td>
                    <td class="font-semibold">{{ fmtCur(inv.amount) }}</td>
                    <td>{{ fmtDate(inv.due_date) }}</td>
                    <td>{{ inv.paid_at ? fmtDate(inv.paid_at) : '—' }}</td>
                    <td>{{ inv.payment_method || '—' }}</td>
                    <td><span class="badge badge-{{ statusBadge(inv.status) }}">{{ inv.status }}</span></td>
                    <td>
                      @if (inv.status !== 'paid') { <button class="btn btn-sm btn-primary" (click)="payNow(inv)">Pay</button> }
                      @else { <button class="btn btn-sm btn-secondary">Receipt</button> }
                    </td>
                  </tr>
                } @empty { <tr><td colspan="8" class="text-center py-8 text-gray-500">No invoices</td></tr> }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Maintenance -->
      @if (tab === 'maintenance') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Maintenance Requests</h2>
            <button class="btn btn-primary btn-sm" (click)="showModal = true">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Request
            </button>
          </div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Submitted</th><th>Updated</th></tr></thead>
              <tbody>
                @for (req of maintenanceRequests; track req.id) {
                  <tr>
                    <td class="font-medium">{{ req.title }}</td>
                    <td><span class="badge badge-purple">{{ req.category }}</span></td>
                    <td><span class="badge badge-{{ priorityBadge(req.priority) }}">{{ req.priority }}</span></td>
                    <td><span class="badge badge-{{ req.status === 'completed' ? 'success' : req.status === 'in_progress' ? 'info' : 'warning' }}">{{ req.status }}</span></td>
                    <td>{{ fmtDate(req.created_at) }}</td>
                    <td>{{ fmtDate(req.updated_at) }}</td>
                  </tr>
                } @empty { <tr><td colspan="6" class="text-center py-8 text-gray-500">No maintenance requests</td></tr> }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Documents -->
      @if (tab === 'documents') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Lease Documents</h2></div>
          <div class="card-body">
            <div class="doc-grid">
              <div class="doc-card">
                <svg width="32" height="32" fill="none" stroke="#7C3AED" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div class="doc-title">Lease Agreement</div>
                <div class="doc-meta">PDF • 2.4 MB</div>
                <button class="btn btn-sm btn-secondary mt-2">Download</button>
              </div>
              <div class="doc-card">
                <svg width="32" height="32" fill="none" stroke="#7C3AED" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div class="doc-title">Move-in Inspection</div>
                <div class="doc-meta">PDF • 1.8 MB</div>
                <button class="btn btn-sm btn-secondary mt-2">Download</button>
              </div>
              <div class="doc-card">
                <svg width="32" height="32" fill="none" stroke="#7C3AED" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div class="doc-title">House Rules</div>
                <div class="doc-meta">PDF • 340 KB</div>
                <button class="btn btn-sm btn-secondary mt-2">Download</button>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Messages -->
      @if (tab === 'messages') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Messages</h2><button class="btn btn-primary btn-sm">New Message</button></div>
          <div class="card-body">
            <div class="empty-state py-12">
              <svg width="48" height="48" fill="none" stroke="#D1D5DB" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <p class="font-semibold text-gray-700 mt-2">No messages yet</p>
              <p class="text-gray-500">Messages from your property manager will appear here.</p>
            </div>
          </div>
        </section>
      }

      <!-- Profile -->
      @if (tab === 'profile') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Profile Settings</h2></div>
          <div class="card-body">
            <div class="profile-grid">
              <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" [value]="profile?.full_name || ''" /></div>
              <div class="form-group"><label class="form-label">Email</label><input class="form-input" [value]="profile?.email || ''" readonly /></div>
              <div class="form-group"><label class="form-label">Phone</label><input class="form-input" [value]="profile?.phone || ''" /></div>
              <div class="form-group"><label class="form-label">ID Number</label><input class="form-input" [value]="profile?.id_number || ''" /></div>
            </div>
            <button class="btn btn-primary mt-4">Save Changes</button>
          </div>
        </section>
      }

      }

      <footer class="app-footer">
        <div class="app-footer__inner">
          <img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="app-footer__logo" />
          <p class="app-footer__text">&copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.</p>
        </div>
      </footer>

      <!-- New Maintenance Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header"><h3 class="font-semibold text-lg">New Maintenance Request</h3><button class="modal-close" (click)="closeModal()">&times;</button></div>
            <div class="modal-body">
              <div class="form-group mb-4"><label class="form-label">Title *</label><input type="text" class="form-input" [(ngModel)]="mf.title" placeholder="e.g. Leaky faucet" /></div>
              <div class="form-group mb-4"><label class="form-label">Description *</label><textarea class="form-textarea" [(ngModel)]="mf.description" placeholder="Describe the issue..."></textarea></div>
              <div class="grid-2 mb-4">
                <div class="form-group"><label class="form-label">Category</label><select class="form-select" [(ngModel)]="mf.category"><option value="plumbing">Plumbing</option><option value="electrical">Electrical</option><option value="security">Security</option><option value="cleaning">Cleaning</option><option value="structural">Structural</option><option value="other">Other</option></select></div>
                <div class="form-group"><label class="form-label">Priority</label><select class="form-select" [(ngModel)]="mf.priority"><option value="low">Low</option><option value="medium">Standard</option><option value="high">High</option><option value="emergency">Emergency</option></select></div>
              </div>
            </div>
            <div class="modal-footer"><button class="btn btn-secondary" (click)="closeModal()">Cancel</button><button class="btn btn-primary" (click)="submitMaint()" [disabled]="!mf.title || !mf.description">Submit</button></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-page { min-height: 100vh; background: #F9FAFB; }
    .page-header { padding: 2rem 2rem 1rem; max-width: 1280px; margin: 0 auto; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1F2937; margin: 0; }
    .page-subtitle { font-size: 0.875rem; color: #6B7280; margin: 0.25rem 0 0; }
    .balance-card { max-width: 1280px; margin: 0 auto 1.5rem; padding: 0 2rem; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); border-radius: 1rem; display: flex; align-items: center; justify-content: space-between; padding: 2rem; color: white; box-shadow: 0 8px 24px rgba(124,58,237,0.2); }
    .balance-label { font-size: 0.875rem; opacity: 0.8; margin-bottom: 0.25rem; }
    .balance-amount { font-size: 2.5rem; font-weight: 800; }
    .balance-due { font-size: 0.875rem; opacity: 0.8; margin-top: 0.25rem; }
    .paid-badge { display: flex; align-items: center; gap: 0.75rem; color: #D1FAE5; font-weight: 600; }
    .tabs-bar { display: flex; border-bottom: 1px solid #E5E7EB; background: white; padding: 0 2rem; max-width: 1280px; margin: 0 auto; overflow-x: auto; }
    .tab-item { padding: 0.875rem 1.25rem; font-size: 0.875rem; font-weight: 500; color: #6B7280; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; white-space: nowrap; }
    .tab-item:hover { color: #1F2937; } .tab-item.active { color: #7C3AED; border-bottom-color: #7C3AED; }
    .mb-6 { margin-bottom: 1.5rem; } .mb-4 { margin-bottom: 1rem; } .mt-2 { margin-top: 0.5rem; } .mt-4 { margin-top: 1rem; } .p-0 { padding: 0; } .py-8 { padding: 2rem 0; } .py-12 { padding: 3rem 0; } .text-center { text-align: center; } .text-gray-500 { color: #6B7280; } .text-gray-700 { color: #374151; } .text-lg { font-size: 1.125rem; } .font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .doc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .doc-card { border: 1px solid #E5E7EB; border-radius: 0.5rem; padding: 1.5rem; text-align: center; transition: all 0.2s ease; }
    .doc-card:hover { border-color: #C4B5FD; box-shadow: 0 2px 8px rgba(124,58,237,0.08); }
    .doc-title { font-weight: 600; font-size: 0.875rem; color: #1F2937; margin-top: 0.75rem; margin-bottom: 0.25rem; }
    .doc-meta { font-size: 0.75rem; color: #6B7280; }
    .empty-state { text-align: center; }
    .app-footer { padding: 1.5rem 2rem 2rem; }
    .app-footer__inner { max-width: 1280px; margin: 0 auto; padding: 1.25rem; border-radius: 0.75rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid #E5E7EB; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .app-footer__logo { height: 2rem; width: auto; } .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6B7280; gap: 1rem; }
    .error-banner { margin: 2rem; padding: 1rem 1.5rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.5rem; display: flex; align-items: center; justify-content: space-between; color: #991B1B; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
    .modal { background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px rgba(0,0,0,0.15); width: 100%; max-width: 28rem; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; }
    .modal-body { padding: 1.5rem; } .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end; gap: 0.75rem; }
    .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6B7280; }
    @media (max-width: 768px) { .balance-card { flex-direction: column; gap: 1rem; text-align: center; } .doc-grid { grid-template-columns: 1fr; } .profile-grid { grid-template-columns: 1fr; } .grid-2 { grid-template-columns: 1fr; } }
  `]
})
export class TenantDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);
  private paystack = inject(PaystackService);

  loading = true; error: string | null = null;
  profile: Profile | null = null; lease: Lease | null = null;
  invoices: Invoice[] = []; maintenanceRequests: MaintenanceRequest[] = []; payments: Payment[] = [];
  tab = 'payments'; showModal = false;
  mf: MaintForm = { title: '', description: '', category: 'other', priority: 'medium' };
  readonly currentYear = new Date().getFullYear();

  get tenantName(): string { return this.profile?.full_name ?? 'Tenant'; }
  get accountBalance(): number { return this.invoices.filter(i => ['unpaid','partial','overdue'].includes(i.status)).reduce((s, i) => s + (Number(i.amount) - Number(i.amount_paid)), 0); }
  get nextDueDate(): string | null { const u = this.invoices.filter(i => i.status === 'unpaid').sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()); return u[0]?.due_date ?? null; }
  get unpaidInvoices(): Invoice[] { return this.invoices.filter(i => ['unpaid','partial','overdue'].includes(i.status)); }

  ngOnInit(): void { void this.loadData(); }

  private async loadData(): Promise<void> {
    this.loading = true; this.error = null;
    try {
      const user = this.auth.getCurrentUser();
      if (!user) { this.error = 'Not authenticated'; return; }
      if (user.auth?.accessToken) {
        const profile = await this.supabase.getProfile(user.id, user.auth.accessToken);
        this.profile = profile;
        if (profile) {
          const [leases, invoices, maintenance, payments] = await Promise.all([
            this.supabase.getLeasesByTenant(user.id, user.auth.accessToken).catch(() => []),
            this.supabase.getInvoicesByTenant(user.id, user.auth.accessToken).catch(() => []),
            this.supabase.getMaintenanceRequests(user.id, undefined, user.auth.accessToken).catch(() => []),
            this.supabase.getPaymentsByOrg(profile.organization_id, user.auth.accessToken).catch(() => [])
          ]);
          this.lease = leases[0] ?? null; this.invoices = invoices;
          this.maintenanceRequests = maintenance; this.payments = payments;
        } else { this.error = 'Profile not found'; }
      } else { this.error = 'Session expired'; }
    } catch (e) { this.error = e instanceof Error ? e.message : 'Failed to load'; }
    finally { this.loading = false; }
  }

  async payNow(inv: Invoice): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.email) return;
    const ref = this.paystack.buildInvoiceReference(inv.id, user.id);
    this.paystack.pay({ email: user.email, amount: Number(inv.amount), reference: ref, invoiceId: inv.id, tenantId: user.id, organizationId: user.organizationId,
      onSuccess: async (res: PaystackSuccessResponse) => {
        try {
          if (user.auth?.accessToken) {
            await this.supabase.updateInvoice(inv.id, { status: 'paid', amount_paid: inv.amount, paid_at: new Date().toISOString(), payment_method: 'paystack', payment_reference_code: res.reference }, user.auth.accessToken);
            await this.supabase.createPayment({ organization_id: user.organizationId ?? '', invoice_id: inv.id, tenant_id: user.id, amount: Number(inv.amount), payment_method: 'paystack_card', paystack_reference: res.reference, status: 'completed', processed_at: new Date().toISOString() }, user.auth.accessToken);
            await this.loadData();
          }
        } catch (e) { this.error = e instanceof Error ? e.message : 'Payment update failed'; }
      }, onClose: () => {}
    });
  }

  closeModal(): void { this.showModal = false; this.mf = { title: '', description: '', category: 'other', priority: 'medium' }; }
  async submitMaint(): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user || !this.profile || !this.mf.title || !this.mf.description) return;
    try {
      await this.supabase.createMaintenanceRequest({ organization_id: this.profile.organization_id, property_id: null, unit_id: null, tenant_id: user.id, assigned_staff_id: null, title: this.mf.title, description: this.mf.description, category: this.mf.category, priority: this.mf.priority as 'low'|'medium'|'high'|'emergency', status: 'submitted', estimated_cost: null, actual_cost: null, completed_at: null, tenant_satisfaction: null }, user.auth?.accessToken);
      await this.loadData(); this.closeModal();
    } catch (e) { this.error = e instanceof Error ? e.message : 'Failed'; }
  }

  fmtCur(n: number): string { return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n); }
  fmtDate(d: string): string { return new Date(d).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' }); }
  statusBadge(s: string): string { return { paid: 'success', unpaid: 'warning', overdue: 'error', partial: 'warning', sent: 'info' }[s] || 'info'; }
  priorityBadge(p: string): string { return { emergency: 'error', high: 'warning', medium: 'info', low: 'success' }[p] || 'info'; }
}
