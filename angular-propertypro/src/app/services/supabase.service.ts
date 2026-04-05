import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';

// ===== Domain Types matching Supabase Schema =====

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string | null;
  email: string;
  role: 'admin' | 'owner' | 'tenant' | 'vendor';
  is_verified: boolean;
  tenant_reference_code: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  subscription_status: string;
  base_currency: string;
  created_at: string;
}

export interface Property {
  id: string;
  organization_id: string;
  name: string;
  address: string | null;
  created_at: string;
}

export interface Unit {
  id: string;
  organization_id: string;
  property_id: string;
  unit_number: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  created_at: string;
}

export interface Lease {
  id: string;
  organization_id: string;
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string | null;
  monthly_rent_amount: number;
  currency: string;
  status: 'active' | 'terminated' | 'pending';
  created_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  lease_id: string;
  tenant_id: string;
  invoice_number: string;
  payment_reference_code: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  due_date: string;
  paid_at: string | null;
  payment_method: string | null;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'void';
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  organization_id: string;
  property_id: string | null;
  unit_id: string | null;
  tenant_id: string | null;
  assigned_owner_id: string | null;
  category: 'plumbing' | 'electrical' | 'security' | 'cleaning' | 'structural' | 'other';
  priority: 'low' | 'standard' | 'high' | 'critical';
  status: 'submitted' | 'triaged' | 'in_progress' | 'awaiting_vendor' | 'resolved' | 'cancelled';
  title: string;
  description: string;
  ai_triage_summary: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface StaffMember {
  id: string;
  organization_id: string;
  profile_id: string;
  job_title: string;
  department: string | null;
  salary_amount: number;
  currency: string;
  salary_frequency: 'monthly' | 'weekly' | 'biweekly';
  employment_status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
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
  currency: string;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  notes: string | null;
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
  leave_type: 'annual' | 'sick' | 'personal' | 'parental' | 'bereavement' | 'other';
  start_date: string;
  end_date: string;
  num_days: number;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface BankAccount {
  id: string;
  organization_id: string;
  owner_profile_id: string | null;
  account_name: string;
  account_number_masked: string;
  bank_provider: string;
  bank_code: string | null;
  paystack_recipient_code: string | null;
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

export interface CollectionRun {
  id: string;
  organization_id: string;
  invoice_id: string;
  tenant_id: string;
  method: 'paystack_checkout' | 'bank_transfer' | 'atm_deposit' | 'card_debit';
  status: 'scheduled' | 'processing' | 'paid' | 'failed' | 'manual_follow_up';
  next_attempt_at: string | null;
  last_attempt_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface ReportSnapshot {
  id: string;
  organization_id: string;
  owner_profile_id: string | null;
  report_type: 'collections' | 'occupancy' | 'maintenance' | 'screening' | 'cash_integrity';
  period_label: string;
  metrics: Record<string, unknown>;
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
  private get supabaseUrl(): string {
    return environment.supabaseUrl;
  }

  private get supabaseKey(): string {
    return environment.supabaseKey;
  }

  private get isConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseKey);
  }

  // ===== Reactive State =====
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly isLoading = this.loadingSignal;
  readonly error = this.errorSignal;
  readonly hasError = computed(() => this.errorSignal() !== null);

  private buildHeaders(accessToken?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: this.supabaseKey,
      'X-Client-Info': 'propertypro-angular'
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
  }

  private setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  private setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  private async handleResponse<T>(response: Response, operation: string): Promise<T> {
    if (!response.ok) {
      let errorBody: SupabaseErrorResponse | null = null;
      try {
        errorBody = (await response.json()) as SupabaseErrorResponse;
      } catch {
        // Response not JSON
      }
      const message = errorBody?.message ?? `${operation} failed with status ${response.status}`;
      this.setError(message);
      throw new Error(message);
    }
    this.setError(null);
    return (await response.json()) as T;
  }

  // ===== Generic CRUD =====

  async get<T>(table: string, params: Record<string, string> = {}, accessToken?: string): Promise<T[]> {
    if (!this.isConfigured) {
      return [];
    }
    this.setLoading(true);
    try {
      const url = new URL(`${this.supabaseUrl}/rest/v1/${table}`);
      url.searchParams.set('select', params.select ?? '*');
      delete params.select;

      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.buildHeaders(accessToken)
      });
      return this.handleResponse<T[]>(response, `GET ${table}`);
    } finally {
      this.setLoading(false);
    }
  }

  async getById<T>(table: string, id: string, select = '*', accessToken?: string): Promise<T | null> {
    if (!this.isConfigured) {
      return null;
    }
    this.setLoading(true);
    try {
      const url = new URL(`${this.supabaseUrl}/rest/v1/${table}`);
      url.searchParams.set('select', select);
      url.searchParams.set('id', `eq.${id}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.buildHeaders(accessToken)
      });
      const results = await this.handleResponse<T[]>(response, `GET ${table}/${id}`);
      return results[0] ?? null;
    } finally {
      this.setLoading(false);
    }
  }

  async post<T>(table: string, data: Record<string, unknown>, accessToken?: string): Promise<T> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to environment.');
    }
    this.setLoading(true);
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...this.buildHeaders(accessToken), Prefer: 'return=representation' },
        body: JSON.stringify(data)
      });
      const result = await this.handleResponse<T[]>(response, `POST ${table}`);
      return result[0];
    } finally {
      this.setLoading(false);
    }
  }

  async patch<T>(table: string, id: string, data: Record<string, unknown>, accessToken?: string): Promise<T> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not configured.');
    }
    this.setLoading(true);
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { ...this.buildHeaders(accessToken), Prefer: 'return=representation' },
        body: JSON.stringify(data)
      });
      const result = await this.handleResponse<T[]>(response, `PATCH ${table}/${id}`);
      return result[0];
    } finally {
      this.setLoading(false);
    }
  }

  async delete(table: string, id: string, accessToken?: string): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not configured.');
    }
    this.setLoading(true);
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.buildHeaders(accessToken)
      });
      await this.handleResponse<never>(response, `DELETE ${table}/${id}`);
    } finally {
      this.setLoading(false);
    }
  }

  // ===== Profile & Auth =====

  async getProfile(userId: string, accessToken?: string): Promise<Profile | null> {
    return this.getById<Profile>('profiles', userId, '*', accessToken);
  }

  async getProfilesByOrg(orgId: string, accessToken?: string): Promise<Profile[]> {
    return this.get<Profile>('profiles', { organization_id: `eq.${orgId}` }, accessToken);
  }

  async updateProfile(userId: string, data: Partial<Profile>, accessToken?: string): Promise<Profile> {
    return this.patch<Profile>('profiles', userId, data as Record<string, unknown>, accessToken);
  }

  // ===== Organization =====

  async getOrganization(orgId: string, accessToken?: string): Promise<Organization | null> {
    return this.getById<Organization>('organizations', orgId, '*', accessToken);
  }

  // ===== Properties & Units =====

  async getPropertiesByOrg(orgId: string, accessToken?: string): Promise<Property[]> {
    return this.get<Property>('properties', { organization_id: `eq.${orgId}`, order: 'created_at.desc' }, accessToken);
  }

  async getUnitsByProperty(propertyId: string, accessToken?: string): Promise<Unit[]> {
    return this.get<Unit>('units', { property_id: `eq.${propertyId}` }, accessToken);
  }

  async getVacantUnits(orgId: string, accessToken?: string): Promise<Unit[]> {
    return this.get<Unit>('units', { organization_id: `eq.${orgId}`, status: 'eq.vacant' }, accessToken);
  }

  // ===== Leases =====

  async getLeasesByTenant(tenantId: string, accessToken?: string): Promise<Lease[]> {
    return this.get<Lease>('leases', { tenant_id: `eq.${tenantId}`, status: 'eq.active' }, accessToken);
  }

  async getLeasesByOrg(orgId: string, accessToken?: string): Promise<Lease[]> {
    return this.get<Lease>('leases', { organization_id: `eq.${orgId}`, status: 'eq.active' }, accessToken);
  }

  // ===== Invoices =====

  async getInvoicesByTenant(tenantId: string, accessToken?: string): Promise<Invoice[]> {
    return this.get<Invoice>('invoices', { tenant_id: `eq.${tenantId}`, order: 'created_at.desc' }, accessToken);
  }

  async getInvoicesByOrg(orgId: string, status?: string, accessToken?: string): Promise<Invoice[]> {
    const params: Record<string, string> = { organization_id: `eq.${orgId}`, order: 'created_at.desc' };
    if (status) {
      params.status = `eq.${status}`;
    }
    return this.get<Invoice>('invoices', params, accessToken);
  }

  async updateInvoice(id: string, data: Partial<Invoice>, accessToken?: string): Promise<Invoice> {
    return this.patch<Invoice>('invoices', id, data as Record<string, unknown>, accessToken);
  }

  async getUnpaidInvoices(tenantId: string, accessToken?: string): Promise<Invoice[]> {
    return this.get<Invoice>('invoices', { tenant_id: `eq.${tenantId}`, status: 'eq.unpaid' }, accessToken);
  }

  // ===== Maintenance Requests =====

  async getMaintenanceRequests(tenantId?: string, orgId?: string, accessToken?: string): Promise<MaintenanceRequest[]> {
    const params: Record<string, string> = { order: 'created_at.desc' };
    if (tenantId) {
      params.tenant_id = `eq.${tenantId}`;
    } else if (orgId) {
      params.organization_id = `eq.${orgId}`;
    }
    return this.get<MaintenanceRequest>('maintenance_requests', params, accessToken);
  }

  async createMaintenanceRequest(data: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>, accessToken?: string): Promise<MaintenanceRequest> {
    const now = new Date().toISOString();
    return this.post<MaintenanceRequest>('maintenance_requests', {
      ...data,
      created_at: now,
      updated_at: now
    } as Record<string, unknown>, accessToken);
  }

  async updateMaintenanceRequest(id: string, data: Partial<MaintenanceRequest>, accessToken?: string): Promise<MaintenanceRequest> {
    return this.patch<MaintenanceRequest>('maintenance_requests', id, {
      ...data,
      updated_at: new Date().toISOString()
    } as Record<string, unknown>, accessToken);
  }

  // ===== Staff & Payroll =====

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
    return this.post<StaffAttendance>('staff_attendance', {
      ...data,
      created_at: new Date().toISOString()
    } as Record<string, unknown>, accessToken);
  }

  async getStaffLeaveRequests(staffId: string, accessToken?: string): Promise<StaffLeaveRequest[]> {
    return this.get<StaffLeaveRequest>('staff_leave_requests', { staff_member_id: `eq.${staffId}`, order: 'created_at.desc' }, accessToken);
  }

  async createLeaveRequest(data: Omit<StaffLeaveRequest, 'id' | 'created_at' | 'approved_by' | 'approved_at'>, accessToken?: string): Promise<StaffLeaveRequest> {
    return this.post<StaffLeaveRequest>('staff_leave_requests', {
      ...data,
      created_at: new Date().toISOString()
    } as Record<string, unknown>, accessToken);
  }

  // ===== Bank Accounts =====

  async getBankAccounts(orgId: string, accessToken?: string): Promise<BankAccount[]> {
    return this.get<BankAccount>('bank_accounts', { organization_id: `eq.${orgId}` }, accessToken);
  }

  async getPayoutAccount(orgId: string, accessToken?: string): Promise<BankAccount | null> {
    const results = await this.get<BankAccount>('bank_accounts', { organization_id: `eq.${orgId}`, is_payout_target: 'eq.true' }, accessToken);
    return results[0] ?? null;
  }

  // ===== Audit Logs =====

  async getAuditLogs(orgId: string, limit = 100, accessToken?: string): Promise<AuditLog[]> {
    return this.get<AuditLog>('audit_logs', { organization_id: `eq.${orgId}`, order: 'created_at.desc', limit: `${limit}` }, accessToken);
  }

  // ===== Onboarding =====

  async getOnboardingApplications(orgId: string, status?: string, accessToken?: string): Promise<OnboardingApplication[]> {
    const params: Record<string, string> = { organization_id: `eq.${orgId}`, order: 'created_at.desc' };
    if (status) {
      params.status = `eq.${status}`;
    }
    return this.get<OnboardingApplication>('onboarding_applications', params, accessToken);
  }

  // ===== Collections & Reports =====

  async getCollectionRuns(orgId: string, accessToken?: string): Promise<CollectionRun[]> {
    return this.get<CollectionRun>('collection_runs', { organization_id: `eq.${orgId}`, order: 'created_at.desc' }, accessToken);
  }

  async getReportSnapshots(orgId: string, reportType?: string, accessToken?: string): Promise<ReportSnapshot[]> {
    const params: Record<string, string> = { organization_id: `eq.${orgId}`, order: 'created_at.desc' };
    if (reportType) {
      params.report_type = `eq.${reportType}`;
    }
    return this.get<ReportSnapshot>('report_snapshots', params, accessToken);
  }

  // ===== RPC / Custom Functions =====

  async getDashboardMetrics(orgId: string, accessToken?: string): Promise<{
    totalRevenue: number;
    outstandingInvoices: number;
    occupancyRate: number;
    activeTenants: number;
    pendingMaintenance: number;
  } | null> {
    if (!this.isConfigured) {
      return null;
    }
    try {
      const [invoices, leases, maintenance] = await Promise.all([
        this.getInvoicesByOrg(orgId, undefined, accessToken),
        this.getLeasesByOrg(orgId, accessToken),
        this.getMaintenanceRequests(undefined, orgId, accessToken)
      ]);

      const totalRevenue = invoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.amount_due), 0);

      const outstandingInvoices = invoices
        .filter((inv) => inv.status === 'unpaid' || inv.status === 'partial')
        .reduce((sum, inv) => sum + (Number(inv.amount_due) - Number(inv.amount_paid)), 0);

      const totalUnits = leases.length;
      const occupiedUnits = new Set(leases.map((l) => l.tenant_id)).size;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      const pendingMaintenance = maintenance.filter(
        (m) => m.status === 'submitted' || m.status === 'triaged' || m.status === 'in_progress'
      ).length;

      return {
        totalRevenue,
        outstandingInvoices,
        occupancyRate,
        activeTenants: new Set(leases.map((l) => l.tenant_id)).size,
        pendingMaintenance
      };
    } catch {
      return null;
    }
  }
}
