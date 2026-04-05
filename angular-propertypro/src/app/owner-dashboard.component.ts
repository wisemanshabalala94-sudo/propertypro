import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SupabaseService, Property, Lease, Invoice, Profile, MaintenanceRequest, Expense, TenantApplication } from '../services/supabase.service';

interface DashboardMetrics {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  totalRevenue: number;
  outstandingInvoices: number;
  monthlyRevenue: number;
  pendingApplications: number;
  pendingMaintenance: number;
  totalExpenses: number;
  netProfit: number;
  activeTenants: number;
}

interface ChartDataPoint {
  label: string;
  value: number;
  income?: number;
  expense?: number;
}

interface ExpenseFormData {
  description: string;
  category: string;
  amount: number;
  vendor: string;
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        <div class="flex gap-2">
          <button class="btn btn-primary btn-sm" (click)="activeSection = 'properties'">
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
          <div class="stat-card__icon stat-card__icon--primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ fmtCur(metrics().monthlyRevenue) }}</div>
            <div class="stat-label">Monthly Revenue</div>
            <div class="stat-change positive">{{ metrics().activeTenants }} active tenants</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--amber">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ metrics().occupancyRate }}%</div>
            <div class="stat-label">Occupancy Rate</div>
            <div class="stat-change positive">{{ metrics().occupiedUnits }}/{{ metrics().totalUnits }} occupied</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--red">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ fmtCur(metrics().outstandingInvoices) }}</div>
            <div class="stat-label">Outstanding</div>
            <div class="stat-change negative">{{ metrics().pendingMaintenance }} pending maintenance</div>
          </div>
        </div>
      </section>

      <!-- Navigation Tabs -->
      <div class="tabs-bar">
        <button class="tab-item" [class.active]="activeSection === 'overview'" (click)="activeSection = 'overview'">Overview</button>
        <button class="tab-item" [class.active]="activeSection === 'rentroll'" (click)="activeSection = 'rentroll'">Rent Roll</button>
        <button class="tab-item" [class.active]="activeSection === 'applications'" (click)="activeSection = 'applications'">Applications</button>
        <button class="tab-item" [class.active]="activeSection === 'maintenance'" (click)="activeSection = 'maintenance'">Maintenance</button>
        <button class="tab-item" [class.active]="activeSection === 'expenses'" (click)="activeSection = 'expenses'">Expenses</button>
        <button class="tab-item" [class.active]="activeSection === 'financials'" (click)="activeSection = 'financials'">Financials</button>
      </div>

      <!-- Overview Section -->
      @if (activeSection === 'overview') {
        <!-- Revenue Chart -->
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Revenue Overview (12 Months)</h2></div>
          <div class="card-body">
            <div class="chart-container">
              @for (month of revenueData; track month.label) {
                <div class="chart-bar" [style.height.%]="(month.value / maxRev) * 100">
                  <span class="chart-bar-value">R{{ month.value }}</span>
                  <span class="chart-bar-label">{{ month.label }}</span>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- Two Column: Properties + Applications -->
        <div class="grid-2">
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
                    <div class="text-sm text-gray-500">{{ prop.city }}</div>
                  </div>
                  <span class="badge badge-success">{{ getPropOccupancy(prop.id) }}% occ</span>
                </div>
              } @empty {
                <div class="empty-state py-6"><p class="text-gray-500">No properties added yet</p></div>
              }
            </div>
          </section>

          <section class="card">
            <div class="card-header">
              <h2 class="card-title">Pending Applications</h2>
              <span class="badge badge-warning">{{ pendingApps().length }} pending</span>
            </div>
            <div class="card-body p-0">
              @for (app of pendingApps().slice(0, 5); track app.id) {
                <div class="application-row">
                  <div>
                    <div class="font-semibold">{{ app.applicant_full_name }}</div>
                    <div class="text-sm text-gray-500">{{ app.applicant_email }}</div>
                  </div>
                  <div class="flex gap-1">
                    <button class="btn btn-sm btn-primary" (click)="approveApplication(app)">Approve</button>
                    <button class="btn btn-sm btn-secondary" (click)="rejectApplication(app)">Reject</button>
                  </div>
                </div>
              } @empty {
                <div class="empty-state py-6"><p class="text-gray-500">No pending applications</p></div>
              }
            </div>
          </section>
        </div>
      }

      <!-- Rent Roll Section -->
      @if (activeSection === 'rentroll') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Rent Roll</h2>
            <div class="flex gap-2">
              <input type="text" class="form-input form-input--sm" placeholder="Search tenant..." [(ngModel)]="searchTerm" />
              <select class="form-select form-select--sm" [(ngModel)]="statusFilter">
                <option value="">All Status</option>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="partial">Partial</option>
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
                @for (inv of filteredInvoices(); track inv.id) {
                  <tr>
                    <td class="font-medium">{{ getPropertyName(inv.lease_id) }}</td>
                    <td>{{ inv.lease_id.slice(0, 8) }}</td>
                    <td>{{ inv.tenant_id.slice(0, 8) }}</td>
                    <td class="font-semibold">{{ fmtCur(inv.amount) }}</td>
                    <td>{{ fmtDate(inv.due_date) }}</td>
                    <td><span class="badge badge-{{ statusColor(inv.status) }}">{{ inv.status }}</span></td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-sm btn-secondary">View</button>
                        @if (inv.status !== 'paid') { <button class="btn btn-sm btn-primary">Remind</button> }
                      </div>
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

      <!-- Applications Section -->
      @if (activeSection === 'applications') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">All Applications</h2></div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead><tr><th>Applicant</th><th>Email</th><th>Income</th><th>Credit Score</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
              <tbody>
                @for (app of allApps(); track app.id) {
                  <tr>
                    <td class="font-medium">{{ app.applicant_full_name }}</td>
                    <td>{{ app.applicant_email }}</td>
                    <td>{{ app.monthly_income ? fmtCur(app.monthly_income) : 'N/A' }}</td>
                    <td>{{ app.credit_score ?? 'N/A' }}</td>
                    <td><span class="badge badge-{{ app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'error' : 'warning' }}">{{ app.status }}</span></td>
                    <td>{{ fmtDate(app.created_at) }}</td>
                    <td>
                      <div class="flex gap-1">
                        @if (app.status === 'pending') {
                          <button class="btn btn-sm btn-primary" (click)="approveApplication(app)">Approve</button>
                          <button class="btn btn-sm btn-secondary" (click)="rejectApplication(app)">Reject</button>
                        }
                        <button class="btn btn-sm btn-secondary">View</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="7" class="text-center py-8 text-gray-500">No applications found</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Maintenance Section -->
      @if (activeSection === 'maintenance') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Maintenance Requests</h2><span class="badge badge-warning">{{ maintenanceRequests().length }} total</span></div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Cost</th><th>Submitted</th></tr></thead>
              <tbody>
                @for (req of maintenanceRequests(); track req.id) {
                  <tr>
                    <td class="font-medium">{{ req.title }}</td>
                    <td><span class="badge badge-purple">{{ req.category }}</span></td>
                    <td><span class="badge badge-{{ req.priority === 'emergency' ? 'error' : req.priority === 'high' ? 'warning' : 'info' }}">{{ req.priority }}</span></td>
                    <td><span class="badge badge-{{ req.status === 'completed' ? 'success' : req.status === 'in_progress' ? 'info' : 'warning' }}">{{ req.status }}</span></td>
                    <td>{{ req.actual_cost ? fmtCur(req.actual_cost) : '—' }}</td>
                    <td>{{ fmtDate(req.created_at) }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="text-center py-8 text-gray-500">No maintenance requests</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Expenses Section -->
      @if (activeSection === 'expenses') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Expenses</h2>
            <button class="btn btn-primary btn-sm" (click)="showExpenseModal = true">Add Expense</button>
          </div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Vendor</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                @for (exp of expenses(); track exp.id) {
                  <tr>
                    <td class="font-medium">{{ exp.description }}</td>
                    <td><span class="badge badge-purple">{{ exp.category }}</span></td>
                    <td class="font-semibold">{{ fmtCur(exp.amount) }}</td>
                    <td>{{ exp.vendor_name ?? '—' }}</td>
                    <td><span class="badge badge-{{ exp.status === 'paid' ? 'success' : exp.status === 'approved' ? 'info' : 'warning' }}">{{ exp.status }}</span></td>
                    <td>{{ fmtDate(exp.created_at) }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="text-center py-8 text-gray-500">No expenses recorded</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Financials Section -->
      @if (activeSection === 'financials') {
        <div class="grid-2">
          <section class="card">
            <div class="card-header"><h2 class="card-title">Income vs Expenses</h2></div>
            <div class="card-body">
              <div class="chart-container">
                @for (month of financialData; track month.label) {
                  <div class="chart-group">
                    <div class="chart-bar chart-bar--income" [style.height.%]="((month.income ?? 0) / maxFin) * 100"></div>
                    <div class="chart-bar chart-bar--expense" [style.height.%]="((month.expense ?? 0) / maxFin) * 100"></div>
                    <span class="chart-bar-label">{{ month.label }}</span>
                  </div>
                }
              </div>
              <div class="chart-legend">
                <span class="chart-legend__item"><span class="chart-legend__dot chart-legend__dot--primary"></span>Income</span>
                <span class="chart-legend__item"><span class="chart-legend__dot chart-legend__dot--red"></span>Expenses</span>
              </div>
            </div>
          </section>
          <section class="card">
            <div class="card-header"><h2 class="card-title">Financial Summary</h2></div>
            <div class="card-body">
              <div class="finance-summary">
                <div class="finance-row"><span>Total Revenue (YTD)</span><span class="font-semibold text-primary">{{ fmtCur(metrics().totalRevenue) }}</span></div>
                <div class="finance-row"><span>Total Expenses (YTD)</span><span class="font-semibold text-red">{{ fmtCur(metrics().totalExpenses) }}</span></div>
                <div class="finance-row border-top"><span class="font-bold">Net Profit</span><span class="font-bold" [class.text-primary]="metrics().netProfit >= 0" [class.text-red]="metrics().netProfit < 0">{{ fmtCur(metrics().netProfit) }}</span></div>
                <div class="finance-row"><span>Outstanding Invoices</span><span class="font-semibold text-amber">{{ fmtCur(metrics().outstandingInvoices) }}</span></div>
                <div class="finance-row"><span>Monthly Recurring</span><span class="font-semibold">{{ fmtCur(metrics().monthlyRevenue) }}</span></div>
              </div>
            </div>
          </section>
        </div>
      }

      }

      <footer class="app-footer">
        <div class="app-footer__inner">
          <img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="app-footer__logo" />
          <p class="app-footer__text">&copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.</p>
        </div>
      </footer>

      <!-- Expense Modal -->
      @if (showExpenseModal) {
        <div class="modal-overlay" (click)="showExpenseModal = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header"><h3 class="font-semibold text-lg">Add Expense</h3><button class="modal-close" (click)="showExpenseModal = false">&times;</button></div>
            <div class="modal-body">
              <div class="form-group mb-4"><label class="form-label">Description *</label><input type="text" class="form-input" [(ngModel)]="expenseForm.description" /></div>
              <div class="grid-2 mb-4">
                <div class="form-group"><label class="form-label">Category</label><select class="form-select" [(ngModel)]="expenseForm.category"><option value="maintenance">Maintenance</option><option value="repairs">Repairs</option><option value="utilities">Utilities</option><option value="insurance">Insurance</option><option value="rates">Rates</option><option value="management">Management</option><option value="other">Other</option></select></div>
                <div class="form-group"><label class="form-label">Amount *</label><input type="number" class="form-input" [(ngModel)]="expenseForm.amount" /></div>
              </div>
              <div class="form-group"><label class="form-label">Vendor</label><input type="text" class="form-input" [(ngModel)]="expenseForm.vendor" /></div>
            </div>
            <div class="modal-footer"><button class="btn btn-secondary" (click)="showExpenseModal = false">Cancel</button><button class="btn btn-primary" (click)="submitExpense()" [disabled]="!expenseForm.description || !expenseForm.amount">Submit</button></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-page { min-height: 100vh; background: #F9FAFB; }
    .page-header { display: flex; align-items: center; justify-content: space-between; padding: 2rem 2rem 1rem; max-width: 1280px; margin: 0 auto; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1F2937; margin: 0; }
    .page-subtitle { font-size: 0.875rem; color: #6B7280; margin: 0.25rem 0 0; }
    .flex { display: flex; } .items-center { align-items: center; } .gap-1 { gap: 0.25rem; } .gap-2 { gap: 0.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 0 2rem; max-width: 1280px; margin: 0 auto 1.5rem; }
    .stat-card { background: white; border-radius: 0.75rem; padding: 1.25rem; border: 1px solid #E5E7EB; display: flex; align-items: center; gap: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .stat-card__icon { width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; flex-shrink: 0; }
    .stat-card__icon--purple { background: #F5F3FF; color: #7C3AED; }
    .stat-card__icon--primary { background: #EDE9FE; color: #7C3AED; }
    .stat-card__icon--amber { background: #FEF3C7; color: #F59E0B; }
    .stat-card__icon--red { background: #FEE2E2; color: #EF4444; }
    .stat-card__content { flex: 1; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #111827; }
    .stat-label { font-size: 0.8rem; color: #6B7280; margin-top: 0.125rem; }
    .stat-change { font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem; }
    .stat-change.positive { color: #7C3AED; } .stat-change.negative { color: #EF4444; }
    .tabs-bar { display: flex; border-bottom: 1px solid #E5E7EB; background: white; padding: 0 2rem; max-width: 1280px; margin: 0 auto; overflow-x: auto; }
    .tab-item { padding: 0.875rem 1.25rem; font-size: 0.875rem; font-weight: 500; color: #6B7280; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; white-space: nowrap; transition: all 0.2s ease; }
    .tab-item:hover { color: #1F2937; } .tab-item.active { color: #7C3AED; border-bottom-color: #7C3AED; }
    .mb-6 { margin-bottom: 1.5rem; } .p-0 { padding: 0; } .py-8 { padding: 2rem 0; } .py-6 { padding: 1.5rem 0; } .text-center { text-align: center; } .text-gray-500 { color: #6B7280; } .text-sm { font-size: 0.75rem; } .font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; } .text-lg { font-size: 1.125rem; } .text-primary { color: #7C3AED; } .text-red { color: #EF4444; } .text-amber { color: #F59E0B; } .border-top { border-top: 2px solid #E5E7EB; padding-top: 0.75rem; margin-top: 0.75rem; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 0 2rem 2rem; max-width: 1280px; margin: 0 auto; }
    .property-row, .application-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1.5rem; border-bottom: 1px solid #F3F4F6; transition: background 0.15s ease; }
    .property-row:hover, .application-row:hover { background: #F5F3FF; }
    .property-row:last-child, .application-row:last-child { border-bottom: none; }
    .property-row__icon { color: #7C3AED; flex-shrink: 0; } .property-row__info { flex: 1; }
    .chart-container { min-height: 180px; display: flex; align-items: flex-end; gap: 0.375rem; padding-bottom: 2rem; }
    .chart-bar { flex: 1; background: linear-gradient(180deg, #7C3AED 0%, #A78BFA 100%); border-radius: 0.25rem 0.25rem 0 0; min-height: 0.5rem; transition: opacity 0.2s ease; position: relative; }
    .chart-bar:hover { opacity: 0.8; }
    .chart-bar-value { position: absolute; top: -1.25rem; left: 50%; transform: translateX(-50%); font-size: 0.625rem; font-weight: 600; color: #374151; white-space: nowrap; }
    .chart-bar-label { position: absolute; bottom: -1.5rem; left: 50%; transform: translateX(-50%); font-size: 0.625rem; color: #6B7280; white-space: nowrap; }
    .chart-group { flex: 1; display: flex; gap: 0.125rem; align-items: flex-end; position: relative; }
    .chart-bar--income { background: linear-gradient(180deg, #7C3AED 0%, #A78BFA 100%); }
    .chart-bar--expense { background: linear-gradient(180deg, #EF4444 0%, #FCA5A5 100%); }
    .chart-legend { display: flex; gap: 2rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
    .chart-legend__item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #6B7280; }
    .chart-legend__dot { width: 0.5rem; height: 0.5rem; border-radius: 9999px; }
    .chart-legend__dot--primary { background: #7C3AED; } .chart-legend__dot--red { background: #EF4444; }
    .finance-summary { display: flex; flex-direction: column; gap: 0.75rem; }
    .finance-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
    .empty-state { text-align: center; } .empty-state-text { font-size: 0.875rem; }
    .form-input--sm, .form-select--sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
    .app-footer { padding: 1.5rem 1rem 2rem; background: white; border-top: 1px solid #E5E7EB; }
    .app-footer__inner { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .app-footer__logo { height: 2.5rem; width: auto; }
    .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6B7280; gap: 1rem; }
    .error-banner { margin: 2rem; padding: 1rem 1.5rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.5rem; display: flex; align-items: center; justify-content: space-between; color: #991B1B; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: 1px solid transparent; text-decoration: none; transition: all 0.2s ease; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
    .btn-primary { background: #7C3AED; color: white; border-color: #7C3AED; } .btn-primary:hover { background: #6D28D9; }
    .btn-secondary { background: white; color: #374151; border-color: #D1D5DB; } .btn-secondary:hover { background: #F9FAFB; }
    .badge { display: inline-flex; align-items: center; padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; }
    .badge-purple { background: #F5F3FF; color: #7C3AED; } .badge-success { background: #D1FAE5; color: #065F46; } .badge-warning { background: #FEF3C7; color: #92400E; } .badge-error { background: #FEE2E2; color: #991B1B; } .badge-info { background: #DBEAFE; color: #1E40AF; }
    .card { background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid #E5E7EB; overflow: hidden; }
    .card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #F3F4F6; display: flex; align-items: center; justify-content: space-between; }
    .card-title { font-size: 1rem; font-weight: 600; color: #1F2937; }
    .card-body { padding: 1.5rem; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .data-table thead { background: #F9FAFB; }
    .data-table th { padding: 0.75rem 1rem; text-align: left; font-weight: 600; color: #6B7280; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; border-bottom: 1px solid #E5E7EB; }
    .data-table td { padding: 0.875rem 1rem; border-bottom: 1px solid #F3F4F6; color: #374151; }
    .data-table tbody tr:hover { background: #F5F3FF; }
    .data-table tbody tr:last-child td { border-bottom: none; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1rem; }
    .form-label { font-size: 0.875rem; font-weight: 500; color: #374151; }
    .form-input, .form-select { padding: 0.625rem 0.875rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 0.875rem; }
    .form-input:focus, .form-select:focus { outline: none; border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
    .modal { background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px rgba(0,0,0,0.15); width: 100%; max-width: 32rem; max-height: 90vh; overflow-y: auto; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; }
    .modal-body { padding: 1.5rem; }
    .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end; gap: 0.75rem; }
    .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6B7280; padding: 0.25rem; }
    .spinner { width: 2rem; height: 2rem; border: 3px solid #E5E7EB; border-top-color: #7C3AED; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .grid-2 { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; } .tabs-bar { padding: 0 1rem; } .data-table { font-size: 0.75rem; } }
  `]
})
export class OwnerDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private supabaseService = inject(SupabaseService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly properties = signal<Property[]>([]);
  protected readonly leases = signal<Lease[]>([]);
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly tenants = signal<Profile[]>([]);
  protected readonly maintenanceRequests = signal<MaintenanceRequest[]>([]);
  protected readonly expenses = signal<Expense[]>([]);
  protected readonly pendingApps = signal<TenantApplication[]>([]);
  protected readonly allApps = signal<TenantApplication[]>([]);
  protected readonly userName = signal('Owner');
  protected readonly metrics = signal<DashboardMetrics>({
    totalProperties: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    outstandingInvoices: 0,
    monthlyRevenue: 0,
    pendingApplications: 0,
    pendingMaintenance: 0,
    totalExpenses: 0,
    netProfit: 0,
    activeTenants: 0
  });

  protected activeSection = 'overview';
  protected searchTerm = '';
  protected statusFilter = '';
  protected showExpenseModal = false;
  protected expenseForm: ExpenseFormData = { description: '', category: 'maintenance', amount: 0, vendor: '' };
  protected readonly currentYear = new Date().getFullYear();

  protected readonly revenueData: ChartDataPoint[] = [
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

  protected readonly financialData: ChartDataPoint[] = [
    { label: 'May', income: 32000, expense: 8000 },
    { label: 'Jun', income: 35000, expense: 9500 },
    { label: 'Jul', income: 38000, expense: 7200 },
    { label: 'Aug', income: 41000, expense: 11000 },
    { label: 'Sep', income: 39000, expense: 8800 },
    { label: 'Oct', income: 42000, expense: 10200 },
    { label: 'Nov', income: 45000, expense: 9000 },
    { label: 'Dec', income: 43000, expense: 12000 },
    { label: 'Jan', income: 46000, expense: 8500 },
    { label: 'Feb', income: 44000, expense: 9800 },
    { label: 'Mar', income: 48000, expense: 10500 },
    { label: 'Apr', income: 45600, expense: 9200 }
  ];

  protected get maxRev(): number {
    return Math.max(...this.revenueData.map(m => m.value));
  }

  protected get maxFin(): number {
    return Math.max(...this.financialData.map(m => Math.max(m.income ?? 0, m.expense ?? 0)));
  }

  ngOnInit(): void {
    void this.loadData();
  }

  protected async loadData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const user = this.authService.getCurrentUser();
      if (!user?.organizationId) {
        this.error.set('No organization found. Please log in as an owner.');
        return;
      }

      const token = user.auth?.accessToken;

      const [properties, leases, invoices, tenants, maintenance, expenseList, pendingApps, allApps] = await Promise.all([
        this.supabaseService.getPropertiesByOrg(user.organizationId, token).catch(() => [] as Property[]),
        this.supabaseService.getLeasesByOrg(user.organizationId, token).catch(() => [] as Lease[]),
        this.supabaseService.getInvoicesByOrg(user.organizationId, undefined, token).catch(() => [] as Invoice[]),
        this.supabaseService.getProfilesByOrg(user.organizationId, token).catch(() => [] as Profile[]),
        this.supabaseService.getMaintenanceRequests(undefined, user.organizationId, token).catch(() => [] as MaintenanceRequest[]),
        this.supabaseService.getExpensesByOrg(user.organizationId, token).catch(() => [] as Expense[]),
        this.supabaseService.getTenantApplications(user.organizationId, 'pending', token).catch(() => [] as TenantApplication[]),
        this.supabaseService.getTenantApplications(user.organizationId, undefined, token).catch(() => [] as TenantApplication[])
      ]);

      this.properties.set(properties);
      this.leases.set(leases);
      this.invoices.set(invoices);
      this.tenants.set(tenants);
      this.maintenanceRequests.set(maintenance);
      this.expenses.set(expenseList);
      this.pendingApps.set(pendingApps);
      this.allApps.set(allApps);

      const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0);
      const outstanding = invoices.filter(i => ['unpaid', 'partial', 'overdue'].includes(i.status)).reduce((sum, i) => sum + (Number(i.amount) - Number(i.amount_paid)), 0);
      const totalExpenses = expenseList.reduce((sum, e) => sum + Number(e.amount), 0);
      const activeTenants = new Set(leases.filter(l => l.status === 'active').map(l => l.tenant_id)).size;
      const occupiedUnits = leases.filter(l => l.status === 'active').length;
      const totalUnits = leases.length;
      const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

      this.metrics.set({
        totalProperties: properties.length,
        totalUnits,
        occupiedUnits,
        occupancyRate,
        totalRevenue,
        outstandingInvoices: outstanding,
        monthlyRevenue: totalRevenue / 12,
        pendingApplications: pendingApps.length,
        pendingMaintenance: maintenance.filter(m => !['completed', 'cancelled'].includes(m.status)).length,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        activeTenants
      });

      this.userName.set(user.fullName || 'Owner');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      this.loading.set(false);
    }
  }

  protected filteredInvoices(): Invoice[] {
    let result = this.invoices();
    if (this.statusFilter) {
      result = result.filter(inv => inv.status === this.statusFilter);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(inv =>
        inv.invoice_number.toLowerCase().includes(term) ||
        inv.tenant_id.toLowerCase().includes(term)
      );
    }
    return result;
  }

  protected getPropertyName(leaseId: string): string {
    const lease = this.leases().find(l => l.id === leaseId);
    if (!lease?.property_id) return 'Property';
    const prop = this.properties().find(p => p.id === lease.property_id);
    return prop?.name || 'Property';
  }

  protected getPropOccupancy(propId: string): number {
    const propUnits = this.leases().filter(l => l.property_id === propId);
    const occupied = propUnits.filter(l => l.status === 'active').length;
    return propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : 0;
  }

  protected statusColor(status: string): string {
    const colorMap: Record<string, string> = {
      paid: 'success',
      unpaid: 'warning',
      overdue: 'error',
      partial: 'warning',
      sent: 'info'
    };
    return colorMap[status] || 'info';
  }

  protected async approveApplication(app: TenantApplication): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user?.auth?.accessToken) return;

    try {
      await this.supabaseService.patch('tenant_applications', app.id, {
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      } as Record<string, unknown>, user.auth.accessToken);
      await this.loadData();
    } catch {
      this.error.set('Failed to approve application');
    }
  }

  protected async rejectApplication(app: TenantApplication): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user?.auth?.accessToken) return;

    try {
      await this.supabaseService.patch('tenant_applications', app.id, {
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: 'Application rejected by owner'
      } as Record<string, unknown>, user.auth.accessToken);
      await this.loadData();
    } catch {
      this.error.set('Failed to reject application');
    }
  }

  protected async submitExpense(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.expenseForm.description || !this.expenseForm.amount) return;

    try {
      await this.supabaseService.createExpense({
        organization_id: user.organizationId ?? '',
        property_id: null,
        category: this.expenseForm.category,
        description: this.expenseForm.description,
        amount: this.expenseForm.amount,
        vendor_name: this.expenseForm.vendor || null,
        status: 'pending',
        approved_by: null,
        paid_at: null
      }, user.auth?.accessToken);

      this.showExpenseModal = false;
      this.expenseForm = { description: '', category: 'maintenance', amount: 0, vendor: '' };
      await this.loadData();
    } catch {
      this.error.set('Failed to submit expense');
    }
  }

  protected fmtCur(amount: number): string {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(amount);
  }

  protected fmtDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
