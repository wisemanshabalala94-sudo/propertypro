export type UserRole = 'admin' | 'owner' | 'staff' | 'tenant' | 'guest';

export type InvoiceStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type StaffShiftStatus = 'clocked_in' | 'completed' | 'flagged' | 'approved';
export type OnboardingDocumentType = 'government_id' | 'bank_statement';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  organizationId: string | null;
  isApproved: boolean;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  payoutBankAccountName: string | null;
  payoutBankAccountNumber: string | null;
  payoutBankCode: string | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  tenantId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: InvoiceStatus;
  paymentReference: string | null;
  paystackReference: string | null;
  createdAt: string;
}

export interface StaffShift {
  id: string;
  staffId: string;
  startTime: string;
  endTime: string | null;
  tasksCompleted: string[];
  totalHours: number;
  isValidShift: boolean;
  status: StaffShiftStatus;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  tableAffected: string;
  recordId: string;
  details: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface OnboardingDocument {
  type: OnboardingDocumentType;
  name: string;
  uploadedAt: string;
  sizeInBytes: number;
}

export interface TenantOnboardingPayload {
  fullName: string;
  email: string;
  building: string;
  phone: string;
  idNumber: string;
  governmentIdDocumentName?: string;
  bankStatementDocumentNames?: string[];
}

export interface OwnerSignupPayload {
  companyName: string;
  regNumber: string;
  taxId: string;
  plan: string;
}

export interface SignInPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthSession {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
}

export interface UserSession {
  id: string;
  role: UserRole;
  fullName: string;
  email?: string;
  organizationId?: string;
  subscriptionPlan?: string;
  roomNumber?: string;
  isApproved: boolean;
  onboardingComplete: boolean;
  auth: AuthSession;
  profile?: Profile;
}

export interface AuthResponse {
  session: UserSession;
  requiresApproval: boolean;
  redirectPath: string;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
}

export interface SupabaseAuthRequest {
  email: string;
  password: string;
  options?: {
    data?: Record<string, string | boolean | number | null>;
  };
}

export interface SupabaseAuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}

export interface SupabaseAuthApiResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: SupabaseAuthUser;
}