import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { isValidPaystackSignature, verifyPaystackTransaction } from "@/lib/paystack";
import { calculateSavingsContribution } from "@/lib/money";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isValidPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
      };
    };

    if (payload.event !== "charge.success" && payload.event !== "transaction.success") {
      return NextResponse.json({ received: true });
    }

    const reference = payload.data?.reference;
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const verified = await verifyPaystackTransaction(reference);
    if (!verified.status || verified.data?.status !== "success") {
      return NextResponse.json({ error: "Paystack verification failed" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("payment_reference_code", reference)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found for reference" }, { status: 404 });
    }

    const settledAmount = Number(verified.data.amount) / 100;
    const nextAmountPaid = Number(invoice.amount_paid) + settledAmount;
    const nextStatus = nextAmountPaid >= Number(invoice.amount_due) ? "paid" : "partial";

    await supabase
      .from("invoices")
      .update({
        amount_paid: nextAmountPaid,
        status: nextStatus,
        payment_method: "paystack_checkout",
        paid_at: new Date().toISOString()
      })
      .eq("id", invoice.id);

    await supabase.from("payment_events").insert({
      organization_id: invoice.organization_id,
      invoice_id: invoice.id,
      gateway: "paystack",
      gateway_reference: reference,
      amount: settledAmount,
      payload: verified
    });

    const savingsContribution = calculateSavingsContribution(settledAmount);
    if (savingsContribution > 0) {
      await supabase.from("savings_allocations").insert({
        organization_id: invoice.organization_id,
        invoice_id: invoice.id,
        tenant_id: invoice.tenant_id,
        amount: savingsContribution,
        status: "reserved",
        beneficiary: "Wiseworx Team"
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 }
    );
  }
}
