import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SupabaseService, Invoice, MaintenanceRequest, Lease, Profile } from '../services/supabase.service';
import { PaystackService, PaystackSuccessResponse } from '../services/paystack.service';

interface MaintenanceFormData {
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'security' | 'cleaning' | 'structural' | 'other';
  priority: 'low' | 'standard' | 'high' | 'critical';
}

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-page">

      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      } @else if (error) {
        <div class="error-banner">
          <span>{{ error }}</span>
          <button class="btn btn-sm btn-secondary" (click)="loadData()">Retry</button>
        </div>
      } @else {

      <!-- Header -->
      <header class="page-header">
        <div>
          <h1 class="page-title">My Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ tenantName }}. Here's your account overview.</p>
        </div>
      </header>

      <!-- Balance Card -->
      <section class="balance-card">
        <div class="balance-card__left">
          <div class="balance-card__label">Total Outstanding</div>
          <div class="balance-card__amount">{{ formatCurrency(accountBalance) }}</div>
          @if (nextDueDate) {
            <div class="balance-card__due">Next payment due: {{ formatDate(nextDueDate) }}</div>
          }
        </div>
        <div class="balance-card__right">
          @if (unpaidInvoices.length > 0) {
            <button class="btn btn-primary btn-lg" (click)="payNow(unpaidInvoices[0])">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Pay Now
            </button>
          } @else {
            <div class="balance-card__paid">
              <svg width="24" height="24" fill="none" stroke="#10B981" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>All caught up!</span>
            </div>
          }
        </div>
      </section>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button class="tab-item" [class.active]="activeTab === 'payments'" (click)="activeTab = 'payments'">Payments</button>
        <button class="tab-item" [class.active]="activeTab === 'maintenance'" (click)="activeTab = 'maintenance'">Maintenance</button>
        <button class="tab-item" [class.active]="activeTab === 'documents'" (click)="activeTab = 'documents'">Documents</button>
        <button class="tab-item" [class.active]="activeTab === 'messages'" (click)="activeTab = 'messages'">Messages</button>
      </div>

      <!-- Payments Tab -->
      @if (activeTab === 'payments') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Invoice History</h2>
          </div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (invoice of invoices; track invoice.id) {
                  <tr>
                    <td class="font-medium">{{ invoice.invoice_number }}</td>
                    <td class="font-semibold">{{ formatCurrency(invoice.amount_due) }}</td>
                    <td>{{ formatDate(invoice.due_date) }}</td>
                    <td>{{ invoice.paid_at ? formatDate(invoice.paid_at) : '—' }}</td>
                    <td>{{ invoice.payment_method || '—' }}</td>
                    <td>
                      <span class="badge" [class]="'badge-' + getStatusBadge(invoice.status)">
                        {{ invoice.status }}
                      </span>
                    </td>
                    <td>
                      @if (invoice.status !== 'paid') {
                        <button class="btn btn-sm btn-primary" (click)="payNow(invoice)">Pay</button>
                      } @else {
                        <button class="btn btn-sm btn-secondary">Receipt</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="7" class="text-center py-8 text-gray-500">No invoices found</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Maintenance Tab -->
      @if (activeTab === 'maintenance') {
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
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                @for (req of maintenanceRequests; track req.id) {
                  <tr>
                    <td class="font-medium">{{ req.title }}</td>
                    <td><span class="badge badge-purple">{{ req.category }}</span></td>
                    <td>
                      <span class="badge" [class]="getPriorityBadge(req.priority)">
                        {{ req.priority }}
                      </span>
                    </td>
                    <td><span class="badge badge-{{ req.status === 'resolved' ? 'success' : req.status === 'in_progress' ? 'info' : 'warning' }}">{{ req.status }}</span></td>
                    <td>{{ formatDate(req.created_at) }}</td>
                    <td>{{ formatDate(req.updated_at) }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="text-center py-8 text-gray-500">No maintenance requests</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Documents Tab -->
      @if (activeTab === 'documents') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Lease Documents</h2>
          </div>
          <div class="card-body">
            <div class="doc-grid">
              <div class="doc-card">
                <div class="doc-card__icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div class="doc-card__title">Lease Agreement</div>
                <div class="doc-card__meta">PDF • 2.4 MB</div>
                <button class="btn btn-sm btn-secondary mt-2">Download</button>
              </div>
              <div class="doc-card">
                <div class="doc-card__icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div class="doc-card__title">Move-in Inspection</div>
                <div class="doc-card__meta">PDF • 1.8 MB</div>
                <button class="btn btn-sm btn-secondary mt-2">Download</button>
              </div>
              <div class="doc-card">
                <div class="doc-card__icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div class="doc-card__title">House Rules</div>
                <div class="doc-card__meta">PDF • 340 KB</div>
                <button class="btn btn-sm btn-secondary mt-2">Download</button>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Messages Tab -->
      @if (activeTab === 'messages') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Messages</h2>
            <button class="btn btn-primary btn-sm">New Message</button>
          </div>
          <div class="card-body">
            <div class="empty-state py-12">
              <div class="empty-state-icon">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <p class="empty-state-title">No messages yet</p>
              <p class="empty-state-text">Messages from your property manager will appear here.</p>
            </div>
          </div>
        </section>
      }

      }

      <!-- Footer -->
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
            <div class="modal-header">
              <h3 class="font-semibold text-lg">New Maintenance Request</h3>
              <button class="modal-close" (click)="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group mb-4">
                <label class="form-label">Title *</label>
                <input type="text" class="form-input" [(ngModel)]="maintForm.title" placeholder="e.g. Leaky faucet in kitchen" />
              </div>
              <div class="form-group mb-4">
                <label class="form-label">Description *</label>
                <textarea class="form-textarea" [(ngModel)]="maintForm.description" placeholder="Describe the issue in detail..."></textarea>
              </div>
              <div class="grid-2 mb-4">
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="maintForm.category">
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="security">Security</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="structural">Structural</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select class="form-select" [(ngModel)]="maintForm.priority">
                    <option value="low">Low</option>
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button class="btn btn-primary" (click)="submitMaintenance()" [disabled]="!maintForm.title || !maintForm.description">Submit Request</button>
            </div>
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
    .balance-card {
      max-width: 1280px;
      margin: 0 auto 1.5rem;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .balance-card__inner {
      background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
      border-radius: 1rem;
      padding: 2rem;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
    }
    .balance-card__left { }
    .balance-card__label { font-size: 0.875rem; opacity: 0.8; margin-bottom: 0.25rem; }
    .balance-card__amount { font-size: 2.5rem; font-weight: 800; line-height: 1.1; }
    .balance-card__due { font-size: 0.875rem; opacity: 0.8; margin-top: 0.25rem; }
    .balance-card__right { }
    .balance-card__paid { display: flex; align-items: center; gap: 0.75rem; color: #D1FAE5; font-weight: 600; }
    .tabs-bar {
      display: flex;
      border-bottom: 1px solid #E5E7EB;
      background: white;
      padding: 0 2rem;
      max-width: 1280px;
      margin: 0 auto;
    }
    .tab-item {
      padding: 0.875rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6B7280;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-item:hover { color: #1F2937; }
    .tab-item.active { color: #7C3AED; border-bottom-color: #7C3AED; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .p-0 { padding: 0; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .text-center { text-align: center; }
    .text-gray-500 { color: #6B7280; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .text-lg { font-size: 1.125rem; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .gap-2 { gap: 0.5rem; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .doc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .doc-card {
      border: 1px solid #E5E7EB;
      border-radius: 0.5rem;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.2s ease;
    }
    .doc-card:hover { border-color: #C4B5FD; box-shadow: 0 2px 8px rgba(124,58,237,0.08); }
    .doc-card__icon { color: #7C3AED; margin-bottom: 0.75rem; }
    .doc-card__title { font-weight: 600; font-size: 0.875rem; color: #1F2937; margin-bottom: 0.25rem; }
    .doc-card__meta { font-size: 0.75rem; color: #6B7280; }
    .empty-state { text-align: center; }
    .empty-state-icon { color: #D1D5DB; margin-bottom: 1rem; }
    .empty-state-title { font-weight: 600; color: #374151; margin-bottom: 0.25rem; }
    .empty-state-text { font-size: 0.875rem; color: #6B7280; }
    .app-footer { padding: 1.5rem 2rem 2rem; }
    .app-footer__inner {
      max-width: 1280px; margin: 0 auto; padding: 1.25rem;
      border-radius: 0.75rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      border: 1px solid #E5E7EB; display: flex; flex-direction: column;
      align-items: center; gap: 0.5rem;
    }
    .app-footer__logo { height: 2rem; width: auto; }
    .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6B7280; gap: 1rem; }
    .error-banner { margin: 2rem; padding: 1rem 1.5rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.5rem; display: flex; align-items: center; justify-content: space-between; color: #991B1B; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
    .modal { background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px rgba(0,0,0,0.15); width: 100%; max-width: 28rem; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; }
    .modal-body { padding: 1.5rem; }
    .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end; gap: 0.75rem; }
    .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6B7280; padding: 0.25rem; }
    @media (max-width: 768px) {
      .balance-card { flex-direction: column; gap: 1rem; text-align: center; }
      .doc-grid { grid-template-columns: 1fr; }
      .grid-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class TenantDashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private supabase = inject(SupabaseService);
  private paystack = inject(PaystackService);
  private readonly destroy$ = new Subject<void>();

  protected loading = true;
  protected error: string | null = null;
  protected profile: Profile | null = null;
  protected lease: Lease | null = null;
  protected invoices: Invoice[] = [];
  protected maintenanceRequests: MaintenanceRequest[] = [];
  protected activeTab = 'payments';
  protected showModal = false;
  protected readonly currentYear = new Date().getFullYear();

  protected maintForm: MaintenanceFormData = {
    title: '', description: '', category: 'other', priority: 'standard'
  };

  get tenantName(): string { return this.profile?.full_name ?? 'Tenant'; }
  get accountBalance(): number {
    return this.invoices.filter(i => i.status === 'unpaid' || i.status === 'partial').reduce((s, i) => s + (Number(i.amount_due) - Number(i.amount_paid)), 0);
  }
  get nextDueDate(): string | null {
    const unpaid = this.invoices.filter(i => i.status === 'unpaid').sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    return unpaid[0]?.due_date ?? null;
  }
  get unpaidInvoices(): Invoice[] { return this.invoices.filter(i => i.status === 'unpaid' || i.status === 'partial'); }

  ngOnInit(): void { void this.loadData(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private async loadData(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) { this.error = 'Not authenticated'; return; }
      if (user.auth?.accessToken) {
        const profile = await this.supabase.getProfile(user.id, user.auth.accessToken);
        this.profile = profile;
        if (profile) {
          const [leases, invoices, maintenance] = await Promise.all([
            this.supabase.getLeasesByTenant(user.id, user.auth.accessToken).catch(() => []),
            this.supabase.getInvoicesByTenant(user.id, user.auth.accessToken).catch(() => []),
            this.supabase.getMaintenanceRequests(user.id, undefined, user.auth.accessToken).catch(() => [])
          ]);
          this.lease = leases[0] ?? null;
          this.invoices = invoices;
          this.maintenanceRequests = maintenance;
        } else {
          this.error = 'Profile not found';
        }
      } else {
        this.error = 'Session expired. Please log in again.';
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load dashboard';
    } finally {
      this.loading = false;
    }
  }

  async payNow(invoice: Invoice): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user?.email) return;
    const ref = this.paystack.buildInvoiceReference(invoice.id, user.id);
    this.paystack.pay({
      email: user.email, amount: Number(invoice.amount_due), reference: ref,
      invoiceId: invoice.id, tenantId: user.id, organizationId: user.organizationId,
      onSuccess: async (res: PaystackSuccessResponse) => {
        try {
          if (user.auth?.accessToken) {
            await this.supabase.updateInvoice(invoice.id, {
              status: 'paid', amount_paid: invoice.amount_due, paid_at: new Date().toISOString(),
              payment_method: 'paystack', payment_reference_code: res.reference
            }, user.auth.accessToken);
            await this.loadData();
          }
        } catch (e) { this.error = e instanceof Error ? e.message : 'Payment update failed'; }
      },
      onClose: () => {}
    });
  }

  closeModal(): void { this.showModal = false; this.maintForm = { title: '', description: '', category: 'other', priority: 'standard' }; }

  async submitMaintenance(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.profile) return;
    try {
      await this.supabase.createMaintenanceRequest({
        organization_id: this.profile.organization_id, property_id: null, unit_id: null,
        tenant_id: user.id, assigned_owner_id: null, category: this.maintForm.category,
        priority: this.maintForm.priority, status: 'submitted', title: this.maintForm.title,
        description: this.maintForm.description, ai_triage_summary: null
      }, user.auth?.accessToken);
      await this.loadData();
      this.closeModal();
    } catch (e) { this.error = e instanceof Error ? e.message : 'Failed to submit request'; }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(amount);
  }
  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' }); }
  getStatusBadge(s: string): string { return { paid: 'success', unpaid: 'warning', overdue: 'error', partial: 'warning' }[s] || 'info'; }
  getPriorityBadge(p: string): string { return { critical: 'error', high: 'warning', standard: 'info', low: 'success' }[p] || 'info'; }
}
