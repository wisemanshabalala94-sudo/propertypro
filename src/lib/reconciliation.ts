import { createServiceClient } from "@/lib/supabase-server";
import type { BankTransactionRecord, InvoiceRecord, MatchMethod } from "@/lib/types";
import { calculateSavingsContribution } from "@/lib/money";

function extractReference(input: string | null) {
  if (!input) {
    return null;
  }

  const match = input.match(/([A-Z]{2,8}-[A-Z0-9-]{4,})/i);
  return match?.[1]?.toUpperCase() ?? null;
}

export async function runReconciliation(organizationId: string) {
  const supabase = createServiceClient();

  const { data: transactions, error } = await supabase
    .from("bank_transactions")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_reconciled", false)
    .eq("direction", "credit");

  if (error) {
    throw error;
  }

  const results: Array<{ bankTransactionId: string; matched: boolean; method?: MatchMethod }> = [];

  for (const tx of (transactions ?? []) as BankTransactionRecord[]) {
    const exactReference = extractReference(tx.reference_code ?? tx.description);
    const exactInvoice = exactReference
      ? await findInvoiceByReference(organizationId, exactReference)
      : null;

    if (exactInvoice && Number(exactInvoice.amount_due) === Number(tx.amount)) {
      await reconcileMatch(tx, exactInvoice, "EXACT_REF");
      results.push({ bankTransactionId: tx.id, matched: true, method: "EXACT_REF" });
      continue;
    }

    const fuzzyInvoice = await findInvoiceByAmountAndDate(organizationId, tx.amount, tx.transaction_date);
    if (fuzzyInvoice) {
      await reconcileMatch(tx, fuzzyInvoice, "FUZZY_AMOUNT_DATE");
      results.push({ bankTransactionId: tx.id, matched: true, method: "FUZZY_AMOUNT_DATE" });
      continue;
    }

    results.push({ bankTransactionId: tx.id, matched: false });
  }

  return results;
}

async function findInvoiceByReference(organizationId: string, reference: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("payment_reference_code", reference)
    .in("status", ["unpaid", "partial"])
    .maybeSingle();

  return data as InvoiceRecord | null;
}

async function findInvoiceByAmountAndDate(organizationId: string, amount: number, transactionDate: string) {
  const supabase = createServiceClient();
  const lowerBound = shiftDate(transactionDate, -3);
  const upperBound = shiftDate(transactionDate, 3);

  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("amount_due", amount)
    .gte("due_date", lowerBound)
    .lte("due_date", upperBound)
    .in("status", ["unpaid", "partial"]);

  if (!data || data.length !== 1) {
    return null;
  }

  return data[0] as InvoiceRecord;
}

async function reconcileMatch(
  transaction: BankTransactionRecord,
  invoice: InvoiceRecord,
  method: MatchMethod
) {
  const supabase = createServiceClient();
  const nextPaidAmount = Number(invoice.amount_paid) + Number(transaction.amount);
  const nextStatus = nextPaidAmount >= Number(invoice.amount_due) ? "paid" : "partial";
  const savingsAmount = calculateSavingsContribution(Number(transaction.amount));

  await supabase.from("reconciliations").insert({
    organization_id: invoice.organization_id,
    bank_transaction_id: transaction.id,
    invoice_id: invoice.id,
    matched_amount: transaction.amount,
    match_method: method
  });

  await supabase
    .from("invoices")
    .update({
      amount_paid: nextPaidAmount,
      status: nextStatus,
      paid_at: new Date().toISOString()
    })
    .eq("id", invoice.id);

  await supabase
    .from("bank_transactions")
    .update({
      is_reconciled: true
    })
    .eq("id", transaction.id);

  if (savingsAmount > 0) {
    await supabase.from("savings_allocations").insert({
      organization_id: invoice.organization_id,
      invoice_id: invoice.id,
      tenant_id: invoice.tenant_id,
      amount: savingsAmount,
      status: "reserved",
      beneficiary: "Wiseworx Team"
    });
  }
}

function shiftDate(dateString: string, offsetDays: number) {
  const value = new Date(dateString);
  value.setDate(value.getDate() + offsetDays);
  return value.toISOString().slice(0, 10);
}

