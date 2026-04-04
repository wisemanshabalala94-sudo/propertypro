export type InvoiceStatus = "unpaid" | "partial" | "paid" | "overdue" | "void";
export type ApprovalStatus = "pending" | "approved" | "declined";
export type MatchMethod = "EXACT_REF" | "FUZZY_AMOUNT_DATE" | "MANUAL";
export type PaymentMethod = "paystack_checkout" | "bank_transfer" | "atm_deposit" | "card_debit";
export type TransactionDirection = "credit" | "debit";

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

