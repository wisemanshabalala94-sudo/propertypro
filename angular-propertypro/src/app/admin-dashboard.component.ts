import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SupabaseService, Profile, Property, Invoice, AuditLog, OnboardingApplication } from '../services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">

      @if (loading()) {
        <div class="loading-container"><div class="spinner"></div><p>Loading admin dashboard...</p></div>
      } @else if (error()) {
        <div class="error-banner"><span>{{ error() }}</span><button class="btn btn-sm btn-secondary" (click)="loadData()">Retry</button></div>
      } @else {

      <header class="page-header">
        <div>
          <h1 class="page-title">System Administration</h1>
          <p class="page-subtitle">Platform overview &bull; {{ today | date:'fullDate' }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge badge-success">All Systems Operational</span>
        </div>
      </header>

      <!-- Metrics -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--purple">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ totalUsers() }}</div>
            <div class="stat-label">Total Users</div>
            <div class="stat-change positive">+12% this month</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--blue">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ totalProperties() }}</div>
            <div class="stat-label">Active Properties</div>
            <div class="stat-change positive">+5 this week</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--green">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ totalInvoices() }}</div>
            <div class="stat-label">Total Invoices</div>
            <div class="stat-change positive">+18% vs last month</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--amber">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(totalRevenue()) }}</div>
            <div class="stat-label">Platform Revenue</div>
            <div class="stat-change positive">+22% growth</div>
          </div>
        </div>
      </section>

      <!-- Pending Applications -->
      @if (pendingApps().length > 0) {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Pending Tenant Applications</h2>
            <span class="badge badge-warning">{{ pendingApps().length }} pending</span>
          </div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (app of pendingApps(); track app.id) {
                  <tr>
                    <td class="font-medium">{{ app.profile_id?.slice(0, 8) ?? 'New' }}</td>
                    <td>{{ app.role }}</td>
                    <td><span class="badge badge-purple">{{ app.role }}</span></td>
                    <td><span class="badge badge-warning">{{ app.status }}</span></td>
                    <td>{{ formatDate(app.created_at) }}</td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-sm btn-primary">Approve</button>
                        <button class="btn btn-sm btn-secondary">Review</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Management Actions -->
      <section class="card mb-6">
        <div class="card-header"><h2 class="card-title">System Management</h2></div>
        <div class="card-body">
          <div class="action-grid">
            <div class="action-card">
              <div class="action-card__icon action-card__icon--purple">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
              <div class="action-card__title">User Management</div>
              <div class="action-card__desc">Manage user accounts, roles, and permissions</div>
              <button class="btn btn-sm btn-secondary mt-3">Manage Users</button>
            </div>
            <div class="action-card">
              <div class="action-card__icon action-card__icon--blue">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </div>
              <div class="action-card__title">Property Management</div>
              <div class="action-card__desc">Oversee property listings and configurations</div>
              <button class="btn btn-sm btn-secondary mt-3">Manage Properties</button>
            </div>
            <div class="action-card">
              <div class="action-card__icon action-card__icon--green">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              </div>
              <div class="action-card__title">System Reports</div>
              <div class="action-card__desc">View analytics and generate reports</div>
              <button class="btn btn-sm btn-secondary mt-3">View Reports</button>
            </div>
            <div class="action-card">
              <div class="action-card__icon action-card__icon--amber">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9"/></svg>
              </div>
              <div class="action-card__title">System Settings</div>
              <div class="action-card__desc">Configure platform settings and preferences</div>
              <button class="btn btn-sm btn-secondary mt-3">Settings</button>
            </div>
            <div class="action-card">
              <div class="action-card__icon action-card__icon--red">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div class="action-card__title">Security &amp; Access</div>
              <div class="action-card__desc">Manage security settings and access controls</div>
              <button class="btn btn-sm btn-secondary mt-3">Security</button>
            </div>
            <div class="action-card">
              <div class="action-card__icon action-card__icon--gray">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div class="action-card__title">Support Center</div>
              <div class="action-card__desc">Access help resources and support tickets</div>
              <button class="btn btn-sm btn-secondary mt-3">Support</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Audit Log -->
      <section class="card mb-6">
        <div class="card-header">
          <h2 class="card-title">Recent Audit Log</h2>
          <button class="btn btn-sm btn-secondary">Export</button>
        </div>
        <div class="card-body p-0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Table</th>
                <th>Record ID</th>
              </tr>
            </thead>
            <tbody>
              @for (log of auditLogs(); track log.id) {
                <tr>
                  <td class="font-mono text-sm">{{ formatDate(log.created_at) }}</td>
                  <td class="font-medium">{{ log.user_id?.slice(0, 8) ?? 'System' }}</td>
                  <td><span class="badge badge-{{ log.action === 'INSERT' ? 'success' : log.action === 'UPDATE' ? 'info' : 'error' }}">{{ log.action }}</span></td>
                  <td class="font-mono text-sm">{{ log.table_affected }}</td>
                  <td class="font-mono text-sm">{{ log.record_id?.slice(0, 8) ?? '—' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="text-center py-8 text-gray-500">No audit logs found</td></tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      }

      <footer class="app-footer">
        <div class="app-footer__inner">
          <img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="app-footer__logo" />
          <p class="app-footer__text">&copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .dashboard-page { min-height: 100vh; background: #F9FAFB; }
    .page-header { display: flex; align-items: center; justify-content: space-between; padding: 2rem 2rem 1.5rem; max-width: 1280px; margin: 0 auto; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1F2937; margin: 0; }
    .page-subtitle { font-size: 0.875rem; color: #6B7280; margin: 0.25rem 0 0; }
    .flex { display: flex; } .items-center { align-items: center; } .gap-1 { gap: 0.25rem; } .gap-2 { gap: 0.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 0 2rem; max-width: 1280px; margin: 0 auto 2rem; }
    .stat-card { background: white; border-radius: 0.75rem; padding: 1.25rem; border: 1px solid #E5E7EB; display: flex; align-items: center; gap: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .stat-card__icon { width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; flex-shrink: 0; }
    .stat-card__icon--purple { background: #F5F3FF; color: #7C3AED; }
    .stat-card__icon--blue { background: #DBEAFE; color: #3B82F6; }
    .stat-card__icon--green { background: #D1FAE5; color: #10B981; }
    .stat-card__icon--amber { background: #FEF3C7; color: #F59E0B; }
    .stat-card__content { flex: 1; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #111827; }
    .stat-label { font-size: 0.8rem; color: #6B7280; margin-top: 0.125rem; }
    .stat-change { font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem; }
    .stat-change.positive { color: #10B981; }
    .mb-6 { margin-bottom: 1.5rem; } .mt-3 { margin-top: 0.75rem; } .p-0 { padding: 0; } .py-8 { padding: 2rem 0; } .text-center { text-align: center; } .text-gray-500 { color: #6B7280; } .font-medium { font-weight: 500; } .font-mono { font-family: monospace; } .text-sm { font-size: 0.75rem; }
    .action-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .action-card { border: 1px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; text-align: center; transition: all 0.2s ease; }
    .action-card:hover { border-color: #C4B5FD; box-shadow: 0 4px 12px rgba(124,58,237,0.06); transform: translateY(-2px); }
    .action-card__icon { width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; margin: 0 auto 0.75rem; }
    .action-card__icon--purple { background: #F5F3FF; color: #7C3AED; }
    .action-card__icon--blue { background: #DBEAFE; color: #3B82F6; }
    .action-card__icon--green { background: #D1FAE5; color: #10B981; }
    .action-card__icon--amber { background: #FEF3C7; color: #F59E0B; }
    .action-card__icon--red { background: #FEE2E2; color: #EF4444; }
    .action-card__icon--gray { background: #F3F4F6; color: #6B7280; }
    .action-card__title { font-weight: 600; font-size: 0.875rem; color: #1F2937; margin-bottom: 0.25rem; }
    .action-card__desc { font-size: 0.75rem; color: #6B7280; line-height: 1.5; }
    .app-footer { padding: 1.5rem 2rem 2rem; }
    .app-footer__inner { max-width: 1280px; margin: 0 auto; padding: 1.25rem; border-radius: 0.75rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid #E5E7EB; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .app-footer__logo { height: 2rem; width: auto; }
    .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6B7280; gap: 1rem; }
    .error-banner { margin: 2rem; padding: 1rem 1.5rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.5rem; display: flex; align-items: center; justify-content: space-between; color: #991B1B; }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .action-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } .action-grid { grid-template-columns: 1fr; } .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private supabase = inject(SupabaseService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly allUsers = signal<Profile[]>([]);
  protected readonly allProperties = signal<Property[]>([]);
  protected readonly allInvoices = signal<Invoice[]>([]);
  protected readonly auditLogs = signal<AuditLog[]>([]);
  protected readonly pendingApps = signal<OnboardingApplication[]>([]);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly today = new Date();

  protected totalUsers = signal(0);
  protected totalProperties = signal(0);
  protected totalInvoices = signal(0);
  protected totalRevenue = signal(0);

  ngOnInit(): void { void this.loadData(); }

  async loadData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const user = this.authService.getCurrentUser();
      if (!user) { this.error.set('Not authenticated'); return; }
      const orgId = user.organizationId ?? '';
      const token = user.auth?.accessToken;
      const [users, properties, invoices, logs, apps] = await Promise.all([
        this.supabase.getProfilesByOrg(orgId, token).catch(() => []),
        this.supabase.getPropertiesByOrg(orgId, token).catch(() => []),
        this.supabase.getInvoicesByOrg(orgId, undefined, token).catch(() => []),
        this.supabase.getAuditLogs(orgId, 20, token).catch(() => []),
        this.supabase.getOnboardingApplications(orgId, 'in_review', token).catch(() => [])
      ]);
      this.allUsers.set(users);
      this.allProperties.set(properties);
      this.allInvoices.set(invoices);
      this.auditLogs.set(logs);
      this.pendingApps.set(apps);
      this.totalUsers.set(users.length);
      this.totalProperties.set(properties.length);
      this.totalInvoices.set(invoices.length);
      this.totalRevenue.set(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount_due), 0));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      this.loading.set(false);
    }
  }

  formatCurrency(n: number): string {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n);
  }
  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
