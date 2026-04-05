import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';

// ===== Domain Types matching Supabase Schema =====

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string | null;
  email: string;
  role: 'admin' | 'owner' | 'tenant' | 'staff';
  is_verified: boolean;
  tenant_reference_code: string | null;
  phone?: string;
  id_number?: string;
  is_approved: boolean;
  is_active: boolean;
  onboarding_complete: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  subscription_status: string;
  platform_fee_enabled: boolean;
  platform_fee_amount: number;
  payout_bank_name: string | null;
  payout_bank_account: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  organization_id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  total_units: number;
  occupied_units: number;
  created_at: string;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  unit_type: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'reserved';
  tenant_id: string | null;
  created_at: string;
}

export interface Lease {
  id: string;
  unit_id: string;
  tenant_id: string;
  organization_id: string;
  lease_number: string;
  lease_start: string;
  lease_end: string;
  monthly_rent: number;
  deposit_amount: number;
  status: 'draft' | 'pending_signature' | 'active' | 'expiring' | 'expired' | 'terminated' | 'renewed';
  created_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  tenant_id: string;
  lease_id: string;
  invoice_number: string;
  invoice_type: 'rent' | 'utility' | 'water' | 'electricity' | 'maintenance' | 'late_fee' | 'deposit' | 'other';
  amount: number;
  platform_fee: number;
  net_amount: number;
  amount_paid: number;
  balance_due: number;
  due_date: string;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  payment_reference: string | null;
  paystack_reference: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  payment_method: string | null;
}

export interface Payment {
  id: string;
  organization_id: string;
  invoice_id: string | null;
  tenant_id: string | null;
  amount: number;
  payment_method: string;
  paystack_reference: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
  processed_at: string | null;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  organization_id: string;
  property_id: string | null;
  unit_id: string | null;
  tenant_id: string | null;
  assigned_staff_id: string | null;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
  estimated_cost: number | null;
  actual_cost: number | null;
  completed_at: string | null;
  tenant_satisfaction: number | null;
  created_at: string;
  updated_at: string;
}

export interface StaffMember {
  id: string;
  organization_id: string;
  profile_id: string;
  job_title: string;
  department: string | null;
  salary_amount: number;
  employment_status: string;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface StaffAttendance {
  id: string;
  organization_id: string;
  staff_member_id: string;
  attendance_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  hours_worked: number | null;
  status: 'present' | 'absent' | 'late' | 'leave' | 'holiday';
  notes: string | null;
  created_at: string;
}

export interface StaffLeaveRequest {
  id: string;
  organization_id: string;
  staff_member_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  num_days: number;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface Payslip {
  id: string;
  organization_id: string;
  staff_member_id: string;
  payslip_number: string;
  pay_period_start: string;
  pay_period_end: string;
  payment_date: string;
  gross_amount: number;
  total_deductions: number;
  net_amount: number;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  notes: string | null;
  created_at: string;
}

export interface BankAccount {
  id: string;
  organization_id: string;
  account_name: string;
  account_number_masked: string;
  bank_provider: string;
  is_payout_target: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: string;
  table_affected: string;
  record_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface OnboardingApplication {
  id: string;
  organization_id: string;
  profile_id: string | null;
  role: 'admin' | 'owner' | 'tenant';
  status: 'draft' | 'in_review' | 'approved' | 'declined';
  affordability_score: number | null;
  ai_summary: string | null;
  preferred_payment_method: string | null;
  debit_authorized: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  organization_id: string;
  property_id: string | null;
  category: string;
  description: string;
  amount: number;
  vendor_name: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approved_by: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  organization_id: string;
  assigned_to: string | null;
  created_by: string | null;
  property_id: string | null;
  title: string;
  description: string | null;
  task_type: string;
  priority: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  due_date: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface TenantApplication {
  id: string;
  property_id: string | null;
  unit_id: string | null;
  applicant_email: string;
  applicant_phone: string | null;
  applicant_full_name: string;
  applicant_id_number: string | null;
  employment_status: string | null;
  monthly_income: number | null;
  credit_score: number | null;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
}

interface SupabaseErrorResponse {
  message?: string;
  code?: string;
  hint?: string;
  details?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private get supabaseUrl(): string { return environment.supabaseUrl; }
  private get supabaseKey(): string { return environment.supabaseKey; }
  private get isConfigured(): boolean { return Boolean(this.supabaseUrl && this.supabaseKey); }

  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  readonly isLoading = this.loadingSignal;
  readonly error = this.errorSignal;
  readonly hasError = computed(() => this.errorSignal() !== null);

  private buildHeaders(accessToken?: string): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', apikey: this.supabaseKey, 'X-Client-Info': 'propertypro-angular' };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    return headers;
  }

  private setLoading(loading: boolean): void { this.loadingSignal.set(loading); }
  private setError(error: string | null): void { this.errorSignal.set(error); }

  private async handleResponse<T>(response: Response, operation: string): Promise<T> {
    if (!response.ok) {
      let errorBody: SupabaseErrorResponse | null = null;
      try { errorBody = (await response.json()) as SupabaseErrorResponse; } catch { /* not JSON */ }
      const message = errorBody?.message ?? `${operation} failed (${response.status})`;
      this.setError(message);
      throw new Error(message);
    }
    this.setError(null);
    return (await response.json()) as T;
  }

  // Generic CRUD
  async get<T>(table: string, params: Record<string, string> = {}, accessToken?: string): Promise<T[]> {
    if (!this.isConfigured) return [];
    this.setLoading(true);
    try {
      const url = new URL(`${this.supabaseUrl}/rest/v1/${table}`);
      url.searchParams.set('select', params.select ?? '*');
      delete params.select;
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
      const response = await fetch(url.toString(), { method: 'GET', headers: this.buildHeaders(accessToken) });
      return this.handleResponse<T[]>(response, `GET ${table}`);
    } finally { this.setLoading(false); }
  }

  async getById<T>(table: string, id: string, select = '*', accessToken?: string): Promise<T | null> {
    if (!this.isConfigured) return null;
    this.setLoading(true);
    try {
      const url = new URL(`${this.supabaseUrl}/rest/v1/${table}`);
      url.searchParams.set('select', select);
      url.searchParams.set('id', `eq.${id}`);
      const response = await fetch(url.toString(), { method: 'GET', headers: this.buildHeaders(accessToken) });
      const results = await this.handleResponse<T[]>(response, `GET ${table}/${id}`);
      return results[0] ?? null;
    } finally { this.setLoading(false); }
  }

  async post<T>(table: string, data: Record<string, unknown>, accessToken?: string): Promise<T> {
    if (!this.isConfigured) throw new Error('Supabase not configured');
    this.setLoading(true);
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
        method: 'POST', headers: { ...this.buildHeaders(accessToken), Prefer: 'return=representation' }, body: JSON.stringify(data)
      });
      const result = await this.handleResponse<T[]>(response, `POST ${table}`);
      return result[0];
    } finally { this.setLoading(false); }
  }

  async patch<T>(table: string, id: string, data: Record<string, unknown>, accessToken?: string): Promise<T> {
    if (!this.isConfigured) throw new Error('Supabase not configured');
    this.setLoading(true);
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH', headers: { ...this.buildHeaders(accessToken), Prefer: 'return=representation' }, body: JSON.stringify(data)
      });
      const result = await this.handleResponse<T[]>(response, `PATCH ${table}/${id}`);
      return result[0];
    } finally { this.setLoading(false); }
  }

  async delete(table: string, id: string, accessToken?: string): Promise<void> {
    if (!this.isConfigured) throw new Error('Supabase not configured');
    this.setLoading(true);
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers: this.buildHeaders(accessToken) });
      await this.handleResponse<never>(response, `DELETE ${table}/${id}`);
    } finally { this.setLoading(false); }
  }

  // Profiles & Auth
  async getProfile(userId: string, accessToken?: string): Promise<Profile | null> {
    return this.getById<Profile>('profiles', userId, '*', accessToken);
  }
  async getProfilesByOrg(orgId: string, accessToken?: string): Promise<Profile[]> {
    return this.get<Profile>('profiles', { organization_id: `eq.${orgId}` }, accessToken);
  }
  async updateProfile(userId: string, data: Partial<Profile>, accessToken?: string): Promise<Profile> {
    return this.patch<Profile>('profiles', userId, data as Record<string, unknown>, accessToken);
  }

  // Organization
  async getOrganization(orgId: string, accessToken?: string): Promise<Organization | null> {
    return this.getById<Organization>('organizations', orgId, '*', accessToken);
  }

  // Properties & Units
  async getPropertiesByOrg(orgId: string, accessToken?: string): Promise<Property[]> {
    return this.get<Property>('properties', { organization_id: `eq.${orgId}`, order: 'created_at.desc' }, accessToken);
  }
  async getUnitsByProperty(propertyId: string, accessToken?: string): Promise<Unit[]> {
    return this.get<Unit>('units', { property_id: `eq.${propertyId}` }, accessToken);
  }
  async getVacantUnits(orgId: string, accessToken?: string): Promise<Unit[]> {
    return this.get<Unit>('units', { organization_id: `eq.${orgId}`, status: 'eq.vacant' }, accessToken);
  }

  // Leases
  async getLeasesByTenant(tenantId: string, accessToken?: string): Promise<Lease[]> {
    return this.get<Lease>('leases', { tenant_id: `eq.${tenantId}`, status: 'eq.active' }, accessToken);
  }
  async getLeasesByOrg(orgId: string, accessToken?: string): Promise<Lease[]> {
    return this.get<Lease>('leases', { organization_id: `eq.${orgId}`, status: 'eq.active' }, accessToken);
  }

  // Invoices
  async getInvoicesByTenant(tenantId: string, accessToken?: string): Promise<Invoice[]> {
    return this.get<Invoice>('invoices', { tenant_id: `eq.${tenantId}`, order: 'created_at.desc' }, accessToken);
  }
  async getInvoicesByOrg(orgId: string, status?: string, accessToken?: string): Promise<Invoice[]> {
    const params: Record<string, string> = { organization_id: `eq.${orgId}`, order: 'created_at.desc' };
    if (status) params.status = `eq.${status}`;
    return this.get<Invoice>('invoices', params, accessToken);
  }
  async updateInvoice(id: string, data: Partial<Invoice>, accessToken?: string): Promise<Invoice> {
    return this.patch<Invoice>('invoices', id, data as Record<string, unknown>, accessToken);
  }
  async getUnpaidInvoices(tenantId: string, accessToken?: string): Promise<Invoice[]> {
    return this.get<Invoice>('invoices', { tenant_id: `eq.${tenantId}`, status: 'in.(unpaid,partial)' }, accessToken);
  }

  // Payments
  async getPaymentsByOrg(orgId: string, accessToken?: string): Promise<Payment[]> {
    return this.get<Payment>('payments', { organization_id: `eq.${orgId}`, order: 'created_at.desc' }, accessToken);
  }
  async createPayment(data: Omit<Payment, 'id' | 'created_at'>, accessToken?: string): Promise<Payment> {
    return this.post<Payment>('payments', { ...data, created_at: new Date().toISOString() } as Record<string, unknown>, accessToken);
  }

  // Maintenance
  async getMaintenanceRequests(tenantId?: string, orgId?: string, accessToken?: string): Promise<MaintenanceRequest[]> {
    const params: Record<string, string> = { order: 'created_at.desc' };
    if (tenantId) params.tenant_id = `eq.${tenantId}`;
    else if (orgId) params.organization_id = `eq.${orgId}`;
    return this.get<MaintenanceRequest>('maintenance_requests', params, accessToken);
  }
  async createMaintenanceRequest(data: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>, accessToken?: string): Promise<MaintenanceRequest> {
    const now = new Date().toISOString();
    return this.post<MaintenanceRequest>('maintenance_requests', { ...data, created_at: now, updated_at: now } as Record<string, unknown>, accessToken);
  }
  async updateMaintenanceRequest(id: string, data: Partial<MaintenanceRequest>, accessToken?: string): Promise<MaintenanceRequest> {
    return this.patch<MaintenanceRequest>('maintenance_requests', id, { ...data, updated_at: new Date().toISOString() } as Record<string, unknown>, accessToken);
  }

  // Expenses
  async getExpensesByOrg(orgId: string, accessToken?: string): Promise<Expense[]> {
    return this.get<Expense>('expenses', { organization_id: `eq.${orgId}`, order: 'created_at.desc' }, accessToken);
  }
  async createExpense(data: Omit<Expense, 'id' | 'created_at'>, accessToken?: string): Promise<Expense> {
    return this.post<Expense>('expenses', { ...data, created_at: new Date().toISOString() } as Record<string, unknown>, accessToken);
  }

  // Staff & Payroll
  async getStaffMembers(orgId: string, accessToken?: string): Promise<StaffMember[]> {
    return this.get<StaffMember>('staff_members', { organization_id: `eq.${orgId}`, employment_status: 'eq.active' }, accessToken);
  }
  async getStaffMemberById(profileId: string, accessToken?: string): Promise<StaffMember | null> {
    const results = await this.get<StaffMember>('staff_members', { profile_id: `eq.${profileId}` }, accessToken);
    return results[0] ?? null;
  }
  async getPayslipsByStaff(staffId: string, accessToken?: string): Promise<Payslip[]> {
    return this.get<Payslip>('payslips', { staff_member_id: `eq.${staffId}`, order: 'payment_date.desc' }, accessToken);
  }
  async getPayslipsByOrg(orgId: string, accessToken?: string): Promise<Payslip[]> {
    return this.get<Payslip>('payslips', { organization_id: `eq.${orgId}`, order: 'payment_date.desc' }, accessToken);
  }
  async getStaffAttendance(staffId: string, accessToken?: string): Promise<StaffAttendance[]> {
    return this.get<StaffAttendance>('staff_attendance', { staff_member_id: `eq.${staffId}`, order: 'attendance_date.desc' }, accessToken);
  }
  async recordAttendance(data: Omit<StaffAttendance, 'id' | 'created_at'>, accessToken?: string): Promise<StaffAttendance> {
    return this.post<StaffAttendance>('staff_attendance', { ...data, created_at: new Date().toISOString() } as Record<string, unknown>, accessToken);
  }
  async getStaffLeaveRequests(staffId: string, accessToken?: string): Promise<StaffLeaveRequest[]> {
    return this.get<StaffLeaveRequest>('staff_leave_requests', { staff_member_id: `eq.${staffId}`, order: 'created_at.desc' }, accessToken);
  }
  async createLeaveRequest(data: Omit<StaffLeaveRequest, 'id' | 'created_at' | 'approved_by' | 'approved_at'>, accessToken?: string): Promise<StaffLeaveRequest> {
    return this.post<StaffLeaveRequest>('staff_leave_requests', { ...data, created_at: new Date().toISOString() } as Record<string, unknown>, accessToken);
  }

  // Tasks
  async getTasksByOrg(orgId: string, accessToken?: string): Promise<Task[]> {
    return this.get<Task>('tasks', { organization_id: `eq.${orgId}`, order: 'due_date.asc' }, accessToken);
  }
  async getTasksByAssignee(assigneeId: string, accessToken?: string): Promise<Task[]> {
    return this.get<Task>('tasks', { assigned_to: `eq.${assigneeId}`, order: 'created_at.desc' }, accessToken);
  }
  async createTask(data: Omit<Task, 'id' | 'created_at'>, accessToken?: string): Promise<Task> {
    return this.post<Task>('tasks', { ...data, created_at: new Date().toISOString() } as Record<string, unknown>, accessToken);
  }
  async updateTask(id: string, data: Partial<Task>, accessToken?: string): Promise<Task> {
    return this.patch<Task>('tasks', id, data as Record<string, unknown>, accessToken);
  }

  // Tenant Applications
  async getTenantApplications(orgId: string, status?: string, accessToken?: string): Promise<TenantApplication[]> {
    const params: Record<string, string> = { organization_id: `eq.${orgId}`, order: 'created_at.desc' };
    if (status) params.status = `eq.${status}`;
    return this.get<TenantApplication>('tenant_applications', params, accessToken);
  }
  async createTenantApplication(data: Omit<TenantApplication, 'id' | 'created_at' | 'updated_at'>, accessToken?: string): Promise<TenantApplication> {
    return this.post<TenantApplication>('tenant_applications', { ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Record<string, unknown>, accessToken);
  }

  // Bank Accounts
  async getBankAccounts(orgId: string, accessToken?: string): Promise<BankAccount[]> {
    return this.get<BankAccount>('bank_accounts', { organization_id: `eq.${orgId}` }, accessToken);
  }
  async getPayoutAccount(orgId: string, accessToken?: string): Promise<BankAccount | null> {
    const results = await this.get<BankAccount>('bank_accounts', { organization_id: `eq.${orgId}`, is_payout_target: 'eq.true' }, accessToken);
    return results[0] ?? null;
  }

  // Audit Logs
  async getAuditLogs(orgId: string, limit = 50, accessToken?: string): Promise<AuditLog[]> {
    return this.get<AuditLog>('audit_logs', { organization_id: `eq.${orgId}`, order: 'created_at.desc', limit: `${limit}` }, accessToken);
  }

  // Onboarding
  async getOnboardingApplications(orgId: string, status?: string, accessToken?: string): Promise<OnboardingApplication[]> {
    const params: Record<string, string> = { organization_id: `eq.${orgId}`, order: 'created_at.desc' };
    if (status) params.status = `eq.${status}`;
    return this.get<OnboardingApplication>('onboarding_applications', params, accessToken);
  }

  // Dashboard Metrics
  async getDashboardMetrics(orgId: string, accessToken?: string): Promise<{
    totalRevenue: number; outstandingInvoices: number; occupancyRate: number;
    activeTenants: number; pendingMaintenance: number; totalProperties: number; totalUnits: number;
  } | null> {
    if (!this.isConfigured) return null;
    try {
      const [invoices, leases, maintenance, properties] = await Promise.all([
        this.getInvoicesByOrg(orgId, undefined, accessToken),
        this.getLeasesByOrg(orgId, accessToken),
        this.getMaintenanceRequests(undefined, orgId, accessToken),
        this.getPropertiesByOrg(orgId, accessToken)
      ]);
      const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);
      const outstanding = invoices.filter(i => i.status === 'unpaid' || i.status === 'partial' || i.status === 'overdue').reduce((s, i) => s + (Number(i.amount) - Number(i.amount_paid)), 0);
      const activeTenants = new Set(leases.map(l => l.tenant_id)).size;
      const totalUnits = leases.length;
      const occupancyRate = totalUnits > 0 ? Math.round((activeTenants / totalUnits) * 100) : 0;
      return {
        totalRevenue, outstandingInvoices: outstanding, occupancyRate,
        activeTenants, pendingMaintenance: maintenance.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length,
        totalProperties: properties.length, totalUnits
      };
    } catch { return null; }
  }
}
