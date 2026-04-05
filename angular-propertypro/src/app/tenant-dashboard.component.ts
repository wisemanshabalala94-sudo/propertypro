import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SupabaseService, Invoice, MaintenanceRequest, Lease, Profile } from '../services/supabase.service';
import { PaystackService, PaystackSuccessResponse } from '../services/paystack.service';

interface PaymentFormData {
  amount: number;
  method: 'card' | 'bank';
}

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
  templateUrl: './tenant-dashboard.component.html',
  styles: [`
    .tenant-dashboard {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .welcome-header {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    }
    .quick-stats { margin-bottom: 2rem; }
    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .stat-icon.rent { background: #10b981; }
    .stat-icon.balance { background: #3b82f6; }
    .stat-icon.lease { background: #8b5cf6; }
    .stat-content { flex: 1; }
    .stat-label { font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
    .stat-status { font-size: 0.875rem; color: #6b7280; }
    .stat-change.positive { color: #10b981; }
    .stat-change.negative { color: #ef4444; }
    .dashboard-section { margin-bottom: 3rem; }
    .section-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-header h3 { font-size: 1.125rem; font-weight: 600; color: #111827; margin: 0; }
    .card-content { padding: 1.5rem; }
    .btn-primary {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary:hover { background: #059669; }
    .btn-primary:disabled { background: #d1d5db; cursor: not-allowed; }
    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { background: #e5e7eb; }
    .payment-list { display: flex; flex-direction: column; gap: 1rem; }
    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .payment-item:last-child { border-bottom: none; }
    .payment-info { display: flex; flex-direction: column; }
    .payment-date { font-size: 0.875rem; color: #6b7280; }
    .payment-amount { font-weight: 600; color: #111827; }
    .payment-status {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-paid { background: #dcfce7; color: #166534; }
    .status-partial { background: #fef3c7; color: #92400e; }
    .status-unpaid { background: #fee2e2; color: #991b1b; }
    .status-overdue { background: #fee2e2; color: #991b1b; }
    .status-void { background: #f3f4f6; color: #6b7280; }
    .payment-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
    .form-input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }
    .form-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    .request-list { display: flex; flex-direction: column; gap: 1rem; }
    .request-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }
    .request-info h4 { font-weight: 600; color: #111827; margin-bottom: 0.25rem; }
    .request-info p { color: #6b7280; margin-bottom: 0.5rem; }
    .request-date { font-size: 0.875rem; color: #9ca3af; }
    .request-status {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-submitted { background: #fef3c7; color: #92400e; }
    .status-triaged { background: #dbeafe; color: #1e40af; }
    .status-in_progress { background: #dbeafe; color: #1e40af; }
    .status-awaiting_vendor { background: #fef3c7; color: #92400e; }
    .status-resolved { background: #dcfce7; color: #166534; }
    .status-cancelled { background: #f3f4f6; color: #6b7280; }
    .empty-state { text-align: center; padding: 2rem; color: #6b7280; }
    .empty-state p { margin-bottom: 1rem; }
    .quick-actions { display: flex; flex-direction: column; gap: 0.75rem; }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      color: #374151;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }
    .action-btn:hover { border-color: #10b981; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
    .announcement-list { display: flex; flex-direction: column; gap: 1rem; }
    .announcement-item { padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .announcement-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .announcement-header h4 { font-weight: 600; color: #111827; margin: 0; }
    .announcement-date { font-size: 0.875rem; color: #9ca3af; }
    .announcement-item p { color: #6b7280; margin: 0; }
    .event-list { display: flex; flex-direction: column; gap: 1rem; }
    .event-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }
    .event-info h4 { font-weight: 600; color: #111827; margin-bottom: 0.25rem; }
    .event-info p { color: #6b7280; margin-bottom: 0.5rem; }
    .event-date { font-size: 0.875rem; color: #9ca3af; }

    /* Loading & Error States */
    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }
    .spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid #e5e7eb;
      border-top-color: #10b981;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-banner {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .error-banner button {
      background: #b91c1c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 28rem;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    }
    .modal h3 { font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 1rem; }
    .modal-close {
      float: right;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .grid-cols-1.md\\:grid-cols-3 { grid-template-columns: 1fr; }
      .grid-cols-1.lg\\:grid-cols-2 { grid-template-columns: 1fr; }
      .card-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
    }
  `]
})
export class TenantDashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);
  private readonly paystack = inject(PaystackService);
  private readonly destroy$ = new Subject<void>();

  // State
  protected loading = true;
  protected error: string | null = null;
  protected profile: Profile | null = null;
  protected lease: Lease | null = null;
  protected invoices: Invoice[] = [];
  protected maintenanceRequests: MaintenanceRequest[] = [];
  protected showMaintenanceModal = false;

  // Payment form
  protected selectedInvoice: Invoice | null = null;
  protected paymentProcessing = false;

  // Maintenance form
  protected maintenanceForm: MaintenanceFormData = {
    title: '',
    description: '',
    category: 'other',
    priority: 'standard'
  };

  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    void this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.error = 'Not authenticated';
        this.loading = false;
        return;
      }

      // Load profile
      if (user.auth?.accessToken) {
        const profile = await this.supabase.getProfile(user.id, user.auth.accessToken);
        this.profile = profile;

        if (!profile) {
          this.error = 'Profile not found';
          this.loading = false;
          return;
        }

        // Load lease
        const leases = await this.supabase.getLeasesByTenant(user.id, user.auth.accessToken);
        this.lease = leases[0] ?? null;

        // Load invoices
        this.invoices = await this.supabase.getInvoicesByTenant(user.id, user.auth.accessToken);

        // Load maintenance requests
        this.maintenanceRequests = await this.supabase.getMaintenanceRequests(user.id, undefined, user.auth.accessToken);
      } else {
        // No access token - show fallback message
        this.error = 'Session expired. Please log in again.';
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load dashboard data';
    } finally {
      this.loading = false;
    }
  }

  // ===== Computed Properties =====

  get tenantName(): string {
    return this.profile?.full_name ?? this.lease?.tenant_id?.slice(0, 8) ?? 'Tenant';
  }

  get accountBalance(): number {
    return this.invoices
      .filter((inv) => inv.status === 'unpaid' || inv.status === 'partial')
      .reduce((sum, inv) => sum + (Number(inv.amount_due) - Number(inv.amount_paid)), 0);
  }

  get nextDueDate(): string | null {
    const unpaid = this.invoices
      .filter((inv) => inv.status === 'unpaid')
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    return unpaid[0]?.due_date ?? null;
  }

  get monthlyRent(): number {
    return Number(this.lease?.monthly_rent_amount ?? 0);
  }

  get propertyAddress(): string {
    return this.lease?.unit_id ? 'Unit ' + this.lease.unit_id.slice(0, 8) : 'N/A';
  }

  get unitNumber(): string {
    return this.lease?.unit_id?.slice(0, 8) ?? 'N/A';
  }

  get leaseDaysRemaining(): number {
    if (!this.lease?.end_date) return 0;
    const end = new Date(this.lease.end_date);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  // ===== Payment Methods =====

  async initiatePayment(invoice: Invoice): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !user.email) return;

    this.selectedInvoice = invoice;
    this.paymentProcessing = true;

    const reference = this.paystack.buildInvoiceReference(invoice.id, user.id);

    this.paystack.pay({
      email: user.email,
      amount: Number(invoice.amount_due),
      reference,
      invoiceId: invoice.id,
      tenantId: user.id,
      organizationId: user.organizationId,
      onSuccess: (response: PaystackSuccessResponse) => {
        void this.handlePaymentSuccess(response, invoice);
      },
      onClose: () => {
        this.paymentProcessing = false;
        this.selectedInvoice = null;
      }
    });
  }

  private async handlePaymentSuccess(response: PaystackSuccessResponse, invoice: Invoice): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user?.auth?.accessToken) return;

      // Update invoice status
      await this.supabase.updateInvoice(
        invoice.id,
        {
          status: 'paid',
          amount_paid: invoice.amount_due,
          paid_at: new Date().toISOString(),
          payment_method: 'paystack',
          payment_reference_code: response.reference
        },
        user.auth.accessToken
      );

      // Reload data
      await this.loadData();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Payment verification failed';
    } finally {
      this.paymentProcessing = false;
      this.selectedInvoice = null;
    }
  }

  // ===== Maintenance Methods =====

  openNewRequest(): void {
    this.showMaintenanceModal = true;
  }

  closeMaintenanceModal(): void {
    this.showMaintenanceModal = false;
    this.maintenanceForm = { title: '', description: '', category: 'other', priority: 'standard' };
  }

  async submitMaintenanceRequest(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.maintenanceForm.title || !this.maintenanceForm.description) return;

    try {
      const profile = this.profile;
      if (!profile) return;

      await this.supabase.createMaintenanceRequest({
        organization_id: profile.organization_id,
        property_id: null,
        unit_id: null,
        tenant_id: user.id,
        assigned_owner_id: null,
        category: this.maintenanceForm.category,
        priority: this.maintenanceForm.priority,
        status: 'submitted',
        title: this.maintenanceForm.title,
        description: this.maintenanceForm.description,
        ai_triage_summary: null
      }, user.auth?.accessToken);

      await this.loadData();
      this.closeMaintenanceModal();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to submit maintenance request';
    }
  }

  // ===== Utility Methods =====

  formatCurrency(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(num);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getInvoiceStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }

  getMaintenanceStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }

  getPaymentStatusClass(): string {
    if (!this.nextDueDate) return 'on-time';
    const dueDate = new Date(this.nextDueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'due-soon';
    return 'on-time';
  }

  viewLease(): void {
    // Future: navigate to lease detail
  }

  contactManagement(): void {
    // Future: open messaging modal
  }

  downloadStatements(): void {
    // Future: generate PDF
  }

  rsvpEvent(_eventId: string): void {
    // Future: implement RSVP
  }
}
