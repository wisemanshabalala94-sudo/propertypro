import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SupabaseService, Property, Lease, Invoice, Profile } from '../services/supabase.service';

interface DashboardMetrics {
  totalProperties: number;
  totalUnits: number;
  occupancyRate: number;
  totalRevenue: number;
  outstandingInvoices: number;
  monthlyRevenue: number;
  pendingMaintenance: number;
  activeTenants: number;
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">

      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      } @else if (error()) {
        <div class="error-banner">
          <span>{{ error() }}</span>
          <button class="btn btn-sm btn-secondary" (click)="loadData()">Retry</button>
        </div>
      } @else {

      <!-- Page Header -->
      <header class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ userName() }}. Here's your portfolio overview.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary btn-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Property
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--purple">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ metrics().totalProperties }}</div>
            <div class="stat-label">Properties</div>
            <div class="stat-change positive">{{ metrics().totalUnits }} total units</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--green">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(metrics().monthlyRevenue) }}</div>
            <div class="stat-label">Monthly Revenue</div>
            <div class="stat-change positive">From {{ metrics().activeTenants }} active tenants</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--amber">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ metrics().occupancyRate }}%</div>
            <div class="stat-label">Occupancy Rate</div>
            <div class="stat-change positive">+2.3% from last month</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--red">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(metrics().outstandingInvoices) }}</div>
            <div class="stat-label">Outstanding</div>
            <div class="stat-change negative">{{ metrics().pendingMaintenance }} pending maintenance</div>
          </div>
        </div>
      </section>

      <!-- Revenue Chart -->
      <section class="card mb-6">
        <div class="card-header">
          <h2 class="card-title">Revenue Overview (12 Months)</h2>
          <div class="tabs">
            <span class="tab active">Monthly</span>
            <span class="tab">Quarterly</span>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container">
            @for (month of monthlyRevenue; track month.label) {
              <div class="chart-bar" [style.height.%]="(month.value / maxRevenue) * 100">
                <span class="chart-bar-value">R{{ month.value }}</span>
                <span class="chart-bar-label">{{ month.label }}</span>
              </div>
            }
          </div>
          <div class="chart-legend">
            <div class="chart-legend__item">
              <span class="chart-legend__dot chart-legend__dot--primary"></span>
              <span>Rent Revenue</span>
            </div>
            <div class="chart-legend__item">
              <span class="chart-legend__dot chart-legend__dot--light"></span>
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Rent Roll Table -->
      <section class="card mb-6">
        <div class="card-header">
          <h2 class="card-title">Rent Roll</h2>
          <div class="flex items-center gap-2">
            <input type="text" class="form-input form-input--sm" placeholder="Search..." [(ngModel)]="searchTerm" />
            <select class="form-select form-select--sm" [(ngModel)]="statusFilter">
              <option value="">All Status</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div class="card-body p-0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Unit</th>
                <th>Tenant</th>
                <th>Rent Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (invoice of filteredInvoices(); track invoice.id) {
                <tr>
                  <td class="font-medium">{{ getPropertyName(invoice) }}</td>
                  <td>{{ invoice.lease_id.slice(0, 8) }}</td>
                  <td>{{ invoice.tenant_id.slice(0, 8) }}</td>
                  <td class="font-semibold">{{ formatCurrency(invoice.amount_due) }}</td>
                  <td>{{ formatDate(invoice.due_date) }}</td>
                  <td>
                    <span class="badge" [class]="'badge-' + getStatusColor(invoice.status)">
                      {{ invoice.status }}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-sm btn-secondary">View</button>
                      @if (invoice.status !== 'paid') {
                        <button class="btn btn-sm btn-primary">Remind</button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-8 text-gray-500">
                    No invoices found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Two Column: Properties + Maintenance -->
      <div class="grid-2">
        <!-- Properties -->
        <section class="card">
          <div class="card-header">
            <h2 class="card-title">Properties</h2>
            <span class="badge badge-purple">{{ properties().length }} total</span>
          </div>
          <div class="card-body p-0">
            @for (prop of properties(); track prop.id) {
              <div class="property-row">
                <div class="property-row__icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                </div>
                <div class="property-row__info">
                  <div class="font-semibold">{{ prop.name }}</div>
                  <div class="text-sm text-gray-500">{{ prop.address }}</div>
                </div>
                <div class="property-row__stats">
                  <span class="badge badge-success">{{ getUnitCount(prop.id) }} units</span>
                </div>
              </div>
            } @empty {
              <div class="empty-state py-6">
                <p class="empty-state-text">No properties added yet</p>
              </div>
            }
          </div>
        </section>

        <!-- Maintenance Overview -->
        <section class="card">
          <div class="card-header">
            <h2 class="card-title">Maintenance Overview</h2>
            <span class="badge badge-warning">{{ maintenanceCount() }} open</span>
          </div>
          <div class="card-body">
            <div class="donut-chart" [style.background]="donutGradient">
              <div class="donut-center">
                <div class="donut-center-value">{{ maintenanceCount() }}</div>
                <div class="donut-center-label">Open</div>
              </div>
            </div>
            <div class="mt-6 space-y-2">
              <div class="flex justify-between items-center">
                <span class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-purple-500"></span>
                  In Progress
                </span>
                <span class="font-semibold">{{ inProgressCount() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                  Pending
                </span>
                <span class="font-semibold">{{ pendingCount() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-green-500"></span>
                  Resolved (30d)
                </span>
                <span class="font-semibold">{{ resolvedCount() }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      }

      <!-- Footer -->
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
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 2rem 1.5rem;
      max-width: 1280px;
      margin: 0 auto;
    }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1F2937; margin: 0; }
    .page-subtitle { font-size: 0.875rem; color: #6B7280; margin: 0.25rem 0 0; }
    .page-actions { display: flex; gap: 0.75rem; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      padding: 0 2rem;
      max-width: 1280px;
      margin: 0 auto 2rem;
    }
    .stat-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.25rem;
      border: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .stat-card__icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      flex-shrink: 0;
    }
    .stat-card__icon--purple { background: #F5F3FF; color: #7C3AED; }
    .stat-card__icon--green { background: #D1FAE5; color: #10B981; }
    .stat-card__icon--amber { background: #FEF3C7; color: #F59E0B; }
    .stat-card__icon--red { background: #FEE2E2; color: #EF4444; }
    .stat-card__content { flex: 1; min-width: 0; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #111827; line-height: 1.1; }
    .stat-label { font-size: 0.8rem; color: #6B7280; margin-top: 0.125rem; }
    .stat-change { font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem; }
    .stat-change.positive { color: #10B981; }
    .stat-change.negative { color: #EF4444; }
    .mb-6 { margin-bottom: 1.5rem; }
    .p-0 { padding: 0; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .text-center { text-align: center; }
    .text-gray-500 { color: #6B7280; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .text-sm { font-size: 0.75rem; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .gap-1 { gap: 0.25rem; }
    .gap-2 { gap: 0.5rem; }
    .mt-6 { margin-top: 1.5rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .w-3 { width: 0.75rem; }
    .h-3 { height: 0.75rem; }
    .rounded-full { border-radius: 9999px; }
    .bg-purple-500 { background: #7C3AED; }
    .bg-amber-500 { background: #F59E0B; }
    .bg-green-500 { background: #10B981; }
    .form-input--sm, .form-select--sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
    .chart-container { min-height: 180px; padding-bottom: 2rem; }
    .chart-legend { display: flex; gap: 2rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
    .chart-legend__item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #6B7280; }
    .chart-legend__dot { width: 0.5rem; height: 0.5rem; border-radius: 9999px; }
    .chart-legend__dot--primary { background: #7C3AED; }
    .chart-legend__dot--light { background: #C4B5FD; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 0 2rem 2rem; max-width: 1280px; margin: 0 auto; }
    .property-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      border-bottom: 1px solid #F3F4F6;
      transition: background 0.15s ease;
    }
    .property-row:hover { background: #F5F3FF; }
    .property-row:last-child { border-bottom: none; }
    .property-row__icon { color: #7C3AED; flex-shrink: 0; }
    .property-row__info { flex: 1; min-width: 0; }
    .donut-chart {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .donut-center { text-align: center; z-index: 1; }
    .donut-center-value { font-size: 1.25rem; font-weight: 700; color: #111827; }
    .donut-center-label { font-size: 0.625rem; color: #6B7280; }
    .app-footer { padding: 1.5rem 2rem 2rem; }
    .app-footer__inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1.25rem;
      border-radius: 0.75rem;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      border: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .app-footer__logo { height: 2rem; width: auto; }
    .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6B7280; gap: 1rem; }
    .error-banner {
      margin: 2rem;
      padding: 1rem 1.5rem;
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #991B1B;
    }
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .grid-2 { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .data-table { font-size: 0.75rem; }
    }
  `]
})
export class OwnerDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private supabase = inject(SupabaseService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly properties = signal<Property[]>([]);
  protected readonly leases = signal<Lease[]>([]);
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly tenants = signal<Profile[]>([]);
  protected readonly maintenanceCount = signal(0);
  protected readonly inProgressCount = signal(0);
  protected readonly pendingCount = signal(0);
  protected readonly resolvedCount = signal(0);
  protected readonly userName = signal('Owner');
  protected readonly metrics = signal<DashboardMetrics>({
    totalProperties: 0, totalUnits: 0, occupancyRate: 0,
    totalRevenue: 0, outstandingInvoices: 0, monthlyRevenue: 0,
    pendingMaintenance: 0, activeTenants: 0
  });

  protected searchTerm = '';
  protected statusFilter = '';
  protected readonly currentYear = new Date().getFullYear();

  protected readonly monthlyRevenue = [
    { label: 'May', value: 32000 },
    { label: 'Jun', value: 35000 },
    { label: 'Jul', value: 38000 },
    { label: 'Aug', value: 41000 },
    { label: 'Sep', value: 39000 },
    { label: 'Oct', value: 42000 },
    { label: 'Nov', value: 45000 },
    { label: 'Dec', value: 43000 },
    { label: 'Jan', value: 46000 },
    { label: 'Feb', value: 44000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 45600 }
  ];

  protected get maxRevenue(): number {
    return Math.max(...this.monthlyRevenue.map(m => m.value));
  }

  protected get donutGradient(): string {
    const total = this.inProgressCount() + this.pendingCount() + this.resolvedCount() || 1;
    const p1 = (this.inProgressCount() / total) * 100;
    const p2 = p1 + (this.pendingCount() / total) * 100;
    return `conic-gradient(#7C3AED 0% ${p1}%, #F59E0B ${p1}% ${p2}%, #10B981 ${p2}% 100%)`;
  }

  protected filteredInvoices(): Invoice[] {
    let result = this.invoices();
    if (this.statusFilter) {
      result = result.filter(inv => inv.status === this.statusFilter);
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(inv =>
        inv.invoice_number.toLowerCase().includes(term) ||
        inv.tenant_id.toLowerCase().includes(term)
      );
    }
    return result;
  }

  ngOnInit(): void {
    void this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const user = this.authService.getCurrentUser();
      if (!user?.organizationId) {
        this.error.set('No organization found');
        return;
      }

      const token = user.auth?.accessToken;
      const [properties, leases, invoices, tenants] = await Promise.all([
        this.supabase.getPropertiesByOrg(user.organizationId, token).catch(() => []),
        this.supabase.getLeasesByOrg(user.organizationId, token).catch(() => []),
        this.supabase.getInvoicesByOrg(user.organizationId, undefined, token).catch(() => []),
        this.supabase.getProfilesByOrg(user.organizationId, token).catch(() => [])
      ]);

      this.properties.set(properties);
      this.leases.set(leases);
      this.invoices.set(invoices);
      this.tenants.set(tenants);

      const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount_due), 0);
      const outstanding = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').reduce((s, i) => s + (Number(i.amount_due) - Number(i.amount_paid)), 0);
      const activeTenants = new Set(leases.map(l => l.tenant_id)).size;
      const totalUnits = leases.length;
      const occupancyRate = totalUnits > 0 ? Math.round((activeTenants / totalUnits) * 100) : 0;

      this.metrics.set({
        totalProperties: properties.length,
        totalUnits,
        occupancyRate,
        totalRevenue,
        outstandingInvoices: outstanding,
        monthlyRevenue: totalRevenue / 12,
        pendingMaintenance: 0,
        activeTenants
      });

      this.userName.set(user.fullName || 'Owner');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      this.loading.set(false);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(amount);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getPropertyName(invoice: Invoice): string {
    const lease = this.leases().find(l => l.id === invoice.lease_id);
    if (!lease) return 'N/A';
    const prop = this.properties().find(p => lease.unit_id.startsWith(p.id.slice(0, 8)));
    return prop?.name || 'Property';
  }

  getUnitCount(propertyId: string): number {
    return this.leases().filter(l => {
      const prop = this.properties().find(p => l.unit_id.startsWith(p.id.slice(0, 8)));
      return prop?.id === propertyId;
    }).length;
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = { paid: 'success', unpaid: 'warning', overdue: 'error', partial: 'warning', void: 'info' };
    return map[status] || 'info';
  }
}
