import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService, Property, Lease, Invoice, Profile } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

interface DashboardData {
  properties: Property[];
  leases: Lease[];
  invoices: Invoice[];
  tenants: Profile[];
  metrics: {
    totalRevenue: number;
    outstandingInvoices: number;
    occupancyRate: number;
    activeTenants: number;
    pendingMaintenance: number;
  } | null;
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="owner-dashboard min-h-screen bg-gray-50">
      <div class="container mx-auto px-6 py-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            @if (userName()) {
              <p class="text-gray-500 mt-1">Welcome back, {{ userName() }}</p>
            }
          </div>
          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ error() }}
            </div>
          }
        </div>

        <!-- Loading State -->
        @if (loading()) {
          <div class="flex items-center justify-center py-24">
            <div class="text-center">
              <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p class="text-gray-500 mt-3">Loading dashboard data...</p>
            </div>
          </div>
        }

        <!-- Dashboard Content -->
        @if (!loading() && dashboardData()) {
          @let data = dashboardData()!;

          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Properties -->
            <div class="card">
              <h3 class="text-sm font-medium text-gray-500">Total Properties</h3>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ data.properties.length }}</p>
            </div>

            <!-- Monthly Revenue -->
            <div class="card">
              <h3 class="text-sm font-medium text-gray-500">Monthly Revenue</h3>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatCurrency(getMonthlyRevenue(data.leases)) }}</p>
              <p class="text-sm text-green-600 mt-1">{{ data.leases.length }} active leases</p>
            </div>

            <!-- Occupancy Rate -->
            <div class="card">
              <h3 class="text-sm font-medium text-gray-500">Occupancy Rate</h3>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ getOccupancyRate(data.metrics) }}%</p>
              <p class="text-sm text-blue-600 mt-1">{{ data.metrics?.activeTenants ?? 0 }} active tenants</p>
            </div>

            <!-- Outstanding Invoices -->
            <div class="card">
              <h3 class="text-sm font-medium text-gray-500">Outstanding</h3>
              <p class="text-3xl font-bold text-red-600 mt-2">{{ formatCurrency(getOutstandingAmount(data.invoices)) }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ getOutstandingCount(data.invoices) }} unpaid invoices</p>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="card mb-8">
            <h2 class="card-title mb-6">Financial Summary</h2>
            <div class="space-y-4">
              <div class="finance-row">
                <span class="text-gray-600">Total Revenue (Paid Invoices)</span>
                <span class="font-semibold text-green-600">{{ formatCurrency(data.metrics?.totalRevenue ?? 0) }}</span>
              </div>
              <div class="finance-row">
                <span class="text-gray-600">Outstanding Invoices</span>
                <span class="font-semibold text-red-600">{{ formatCurrency(data.metrics?.outstandingInvoices ?? 0) }}</span>
              </div>
              <div class="finance-row">
                <span class="text-gray-600">Monthly Lease Revenue</span>
                <span class="font-semibold">{{ formatCurrency(getMonthlyRevenue(data.leases)) }}</span>
              </div>
              <div class="finance-row border-t-2 pt-4">
                <span class="font-bold text-gray-900">Total Properties</span>
                <span class="font-bold text-gray-900">{{ data.properties.length }}</span>
              </div>
              <div class="finance-row">
                <span class="font-bold text-gray-900">Active Tenants</span>
                <span class="font-bold text-gray-900">{{ data.metrics?.activeTenants ?? 0 }}</span>
              </div>
              <div class="finance-row">
                <span class="font-bold text-gray-900">Pending Maintenance</span>
                <span class="font-bold text-orange-600">{{ data.metrics?.pendingMaintenance ?? 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Invoices -->
          @if (data.invoices.length > 0) {
            <div class="card mb-8">
              <h2 class="card-title mb-4">Recent Invoices</h2>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-3 px-2 text-gray-500 font-medium">Invoice #</th>
                      <th class="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
                      <th class="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                      <th class="text-left py-3 px-2 text-gray-500 font-medium">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (invoice of data.invoices.slice(0, 10); track invoice.id) {
                      <tr class="border-b border-gray-100">
                        <td class="py-3 px-2 font-mono text-xs">{{ invoice.invoice_number }}</td>
                        <td class="py-3 px-2 font-semibold">{{ formatCurrency(invoice.amount_due) }}</td>
                        <td class="py-3 px-2">
                          <span [class]="getStatusClass(invoice.status)">{{ invoice.status }}</span>
                        </td>
                        <td class="py-3 px-2 text-gray-500">{{ formatDate(invoice.due_date) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- Properties List -->
          @if (data.properties.length > 0) {
            <div class="card">
              <h2 class="card-title mb-4">Properties</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (property of data.properties; track property.id) {
                  <div class="border border-gray-200 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900">{{ property.name }}</h3>
                    @if (property.address) {
                      <p class="text-sm text-gray-500 mt-1">{{ property.address }}</p>
                    }
                    <p class="text-xs text-gray-400 mt-2">Added {{ formatDate(property.created_at) }}</p>
                  </div>
                }
              </div>
            </div>
          }
        }

        <!-- Empty State -->
        @if (!loading() && !error() && !dashboardData()) {
          <div class="text-center py-24">
            <p class="text-gray-500 text-lg">No data available. Add properties and leases to see your dashboard.</p>
          </div>
        }
      </div>

      <!-- WiseWorx Footer -->
      <footer class="bg-white p-6 border-t border-gray-200 mt-8">
        <div class="flex items-center justify-center">
          <div class="flex items-center space-x-2">
            <img src="/wiseworx-logo.svg" alt="WiseWorx" class="h-10 w-auto object-contain" />
          </div>
        </div>
        <p class="text-center text-gray-500 text-xs mt-3">
          &copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.
        </p>
      </footer>
    </div>
  `,
  styles: [`
    .owner-dashboard {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .container {
      max-width: 1200px;
    }

    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .finance-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }

    .space-y-4 > * + * {
      margin-top: 1rem;
    }

    .border-t-2 {
      border-top: 2px solid #e5e7eb;
    }

    .pt-4 {
      padding-top: 1rem;
    }
  `]
})
export class OwnerDashboardComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  currentYear = new Date().getFullYear();

  loading = signal(true);
  error = signal<string | null>(null);
  userName = signal<string | null>(null);
  dashboardData = signal<DashboardData | null>(null);

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (user?.fullName) {
      this.userName.set(user.fullName);
    }

    const orgId = user?.organizationId;
    const accessToken = user?.auth?.accessToken;

    if (!orgId) {
      this.error.set('No organization found for this user.');
      this.loading.set(false);
      return;
    }

    try {
      const [properties, leases, invoices, tenants, metrics] = await Promise.all([
        this.supabaseService.getPropertiesByOrg(orgId, accessToken),
        this.supabaseService.getLeasesByOrg(orgId, accessToken),
        this.supabaseService.getInvoicesByOrg(orgId, undefined, accessToken),
        this.supabaseService.getProfilesByOrg(orgId, accessToken).then(profiles =>
          profiles.filter(p => p.role === 'tenant')
        ),
        this.supabaseService.getDashboardMetrics(orgId, accessToken)
      ]);

      this.dashboardData.set({
        properties,
        leases,
        invoices,
        tenants,
        metrics
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data.';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  getMonthlyRevenue(leases: Lease[]): number {
    return leases
      .filter(l => l.status === 'active')
      .reduce((sum, l) => sum + Number(l.monthly_rent_amount), 0);
  }

  getOutstandingAmount(invoices: Invoice[]): number {
    return invoices
      .filter(i => i.status === 'unpaid' || i.status === 'partial' || i.status === 'overdue')
      .reduce((sum, i) => sum + (Number(i.amount_due) - Number(i.amount_paid)), 0);
  }

  getOutstandingCount(invoices: Invoice[]): number {
    return invoices.filter(i => i.status === 'unpaid' || i.status === 'partial' || i.status === 'overdue').length;
  }

  getOccupancyRate(metrics: DashboardData['metrics']): string {
    if (!metrics) return '0';
    return metrics.occupancyRate.toFixed(1);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'paid':
        return `${base} bg-green-100 text-green-800`;
      case 'partial':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'unpaid':
        return `${base} bg-gray-100 text-gray-800`;
      case 'overdue':
        return `${base} bg-red-100 text-red-800`;
      case 'void':
        return `${base} bg-gray-100 text-gray-500`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  }
}
