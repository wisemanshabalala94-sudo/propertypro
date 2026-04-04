import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { initiatePaystackTransfer } from "@/lib/paystack";
import { toSubunit } from "@/lib/money";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      approvalRequestId: string;
      bankAccountId: string;
    };

    if (!body.approvalRequestId || !body.bankAccountId) {
      return NextResponse.json({ error: "approvalRequestId and bankAccountId are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: approval, error: approvalError } = await supabase
      .from("transaction_approval_requests")
      .select("*")
      .eq("id", body.approvalRequestId)
      .eq("status", "approved")
      .single();

    if (approvalError || !approval) {
      return NextResponse.json({ error: "Approved payout request not found" }, { status: 404 });
    }

    const { data: bankAccount, error: bankError } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("id", body.bankAccountId)
      .single();

    if (bankError || !bankAccount?.paystack_recipient_code) {
      return NextResponse.json({ error: "Bank account is missing a Paystack recipient code" }, { status: 400 });
    }

    const transfer = await initiatePaystackTransfer({
      amount: toSubunit(Number(approval.amount)),
      recipient: bankAccount.paystack_recipient_code,
      reason: approval.purpose
    });

    await supabase.from("bank_transactions").insert({
      organization_id: approval.organization_id,
      bank_account_id: bankAccount.id,
      transaction_date: new Date().toISOString().slice(0, 10),
      amount: approval.amount,
      description: `Owner disbursement: ${approval.purpose}`,
      reference_code: transfer.data?.reference ?? null,
      direction: "debit",
      channel: "paystack_transfer",
      is_reconciled: true
    });

    return NextResponse.json({ transfer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to disburse payout" },
      { status: 500 }
    );
  }
}
