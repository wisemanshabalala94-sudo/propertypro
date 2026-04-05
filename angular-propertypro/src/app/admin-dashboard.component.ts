import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { SupabaseService } from './services/supabase.service';
import type { Profile, Property, Invoice, AuditLog, OnboardingApplication } from './services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styles: [`
    .admin-dashboard {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: white;
    }

    .dashboard-header h1 {
      color: white;
    }

    .dashboard-header p {
      color: rgba(255, 255, 255, 0.9);
    }

    .system-status {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .status-label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-value.operational {
      font-size: 0.875rem;
      font-weight: 600;
      color: #10B981;
    }

    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .metric-icon.users {
      background: #10B981;
    }

    .metric-icon.properties {
      background: #3B82F6;
    }

    .metric-icon.transactions {
      background: #8B5CF6;
    }

    .metric-icon.revenue {
      background: #F59E0B;
    }

    .metric-content {
      flex: 1;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #6B7280;
      margin-bottom: 4px;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }

    .metric-change {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .metric-change.positive {
      color: #10B981;
    }

    .metric-change.negative {
      color: #EF4444;
    }

    .management-actions {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 24px;
    }

    .section-subtitle {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
    }

    .action-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #E5E7EB;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .action-icon.users {
      background: #10B981;
    }

    .action-icon.properties {
      background: #3B82F6;
    }

    .action-icon.reports {
      background: #8B5CF6;
    }

    .action-icon.settings {
      background: #F59E0B;
    }

    .action-icon.security {
      background: #EF4444;
    }

    .action-icon.support {
      background: #6B7280;
    }

    .action-content {
      flex: 1;
    }

    .action-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }

    .action-content p {
      color: #6B7280;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #F9FAFB;
      border-color: #9CA3AF;
    }

    .data-table-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #E5E7EB;
      overflow: hidden;
      margin-bottom: 32px;
    }

    .data-table-card .card-header {
      padding: 16px 24px;
      border-bottom: 1px solid #E5E7EB;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      text-align: left;
      padding: 12px 24px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6B7280;
      background: #F9FAFB;
      border-bottom: 1px solid #E5E7EB;
    }

    .data-table td {
      padding: 12px 24px;
      font-size: 0.875rem;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
    }

    .data-table tr:last-child td {
      border-bottom: none;
    }

    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #FEF3C7;
      color: #92400E;
    }

    .status-badge.approved {
      background: #D1FAE5;
      color: #065F46;
    }

    .status-badge.in_review {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .status-badge.declined {
      background: #FEE2E2;
      color: #991B1B;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #6B7280;
    }

    .error-state {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 8px;
      padding: 16px;
      color: #991B1B;
      margin-bottom: 24px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly supabaseService = inject(SupabaseService);

  readonly currentYear = new Date().getFullYear();
  readonly currentDate = new Date();

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly totalUsers = signal(0);
  readonly totalProperties = signal(0);
  readonly totalInvoices = signal(0);
  readonly totalRevenue = signal(0);
  readonly outstandingInvoices = signal(0);
  readonly occupancyRate = signal(0);
  readonly activeTenants = signal(0);
  readonly pendingMaintenance = signal(0);

  readonly allUsers = signal<Profile[]>([]);
  readonly allProperties = signal<Property[]>([]);
  readonly recentAuditLogs = signal<AuditLog[]>([]);
  readonly pendingApplications = signal<OnboardingApplication[]>([]);
  readonly allInvoices = signal<Invoice[]>([]);

  currentUser = this.authService.getCurrentUser();

  async ngOnInit(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      const user = this.authService.getCurrentUser();
      if (!user) {
        this.error.set('No authenticated user found.');
        this.loading.set(false);
        return;
      }

      const orgId = user.organizationId;
      const accessToken = user.auth?.accessToken ?? undefined;

      if (!orgId) {
        this.error.set('No organization ID found for current user.');
        this.loading.set(false);
        return;
      }

      const [users, properties, invoices, auditLogs, applications, metrics] = await Promise.all([
        this.supabaseService.getProfilesByOrg(orgId, accessToken).catch(() => [] as Profile[]),
        this.supabaseService.getPropertiesByOrg(orgId, accessToken).catch(() => [] as Property[]),
        this.supabaseService.getInvoicesByOrg(orgId, undefined, accessToken).catch(() => [] as Invoice[]),
        this.supabaseService.getAuditLogs(orgId, 20, accessToken).catch(() => [] as AuditLog[]),
        this.supabaseService.getOnboardingApplications(orgId, 'in_review', accessToken).catch(() => [] as OnboardingApplication[]),
        this.supabaseService.getDashboardMetrics(orgId, accessToken).catch(() => null)
      ]);

      this.totalUsers.set(users.length);
      this.totalProperties.set(properties.length);
      this.totalInvoices.set(invoices.length);

      if (metrics) {
        this.totalRevenue.set(metrics.totalRevenue);
        this.outstandingInvoices.set(metrics.outstandingInvoices);
        this.occupancyRate.set(metrics.occupancyRate);
        this.activeTenants.set(metrics.activeTenants);
        this.pendingMaintenance.set(metrics.pendingMaintenance);
      }

      this.allUsers.set(users);
      this.allProperties.set(properties);
      this.allInvoices.set(invoices);
      this.recentAuditLogs.set(auditLogs.slice(0, 10));
      this.pendingApplications.set(applications);

      this.currentUser = user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-NG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
