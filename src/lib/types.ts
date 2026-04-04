export type InvoiceStatus = "unpaid" | "partial" | "paid" | "overdue" | "void";
export type ApprovalStatus = "pending" | "approved" | "declined";
export type MatchMethod = "EXACT_REF" | "FUZZY_AMOUNT_DATE" | "MANUAL";
export type PaymentMethod = "paystack_checkout" | "bank_transfer" | "atm_deposit" | "card_debit";
export type TransactionDirection = "credit" | "debit";
export type MaintenanceStatus = "submitted" | "triaged" | "in_progress" | "awaiting_vendor" | "resolved" | "cancelled";
export type ScreeningStatus = "pending" | "in_review" | "approved" | "declined" | "needs_more_info";
export type ReportType = "collections" | "occupancy" | "maintenance" | "screening" | "cash_integrity";

export interface InvoiceRecord {
  id: string;
  organization_id: string;
  lease_id: string;
  tenant_id: string;
  invoice_number: string;
  payment_reference_code: string;
  amount_due: number;
  amount_paid: number;
  due_date: string;
  status: InvoiceStatus;
}

export interface BankTransactionRecord {
  id: string;
  organization_id: string;
  transaction_date: string;
  amount: number;
  description: string | null;
  reference_code: string | null;
  is_reconciled: boolean;
  direction: TransactionDirection;
}

export interface MaintenanceRequestRecord {
  id: string;
  organization_id: string;
  property_id: string | null;
  unit_id: string | null;
  tenant_id: string | null;
  category: "plumbing" | "electrical" | "security" | "cleaning" | "structural" | "other";
  priority: "low" | "standard" | "high" | "critical";
  status: MaintenanceStatus;
  title: string;
  description: string;
  ai_triage_summary: string | null;
  ai_trade_required: string | null;
  ai_estimated_cost: number | null;
  created_at: string;
}

export interface TenantScreeningCheckRecord {
  id: string;
  organization_id: string;
  applicant_profile_id: string | null;
  reviewed_by_profile_id: string | null;
  provider: string;
  status: ScreeningStatus;
  affordability_score: number | null;
  risk_band: "low" | "moderate" | "high" | null;
  employment_verified: boolean;
  identity_verified: boolean;
  ai_summary: string | null;
  created_at: string;
}

export interface ReportSnapshotRecord {
  id: string;
  organization_id: string;
  owner_profile_id: string | null;
  report_type: ReportType;
  period_label: string;
  metrics: Record<string, unknown>;
  created_at: string;
}
