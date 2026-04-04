import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { initializePaystackTransaction } from "@/lib/paystack";
import { toSubunit } from "@/lib/money";

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("id, tenant_id, amount_due, payment_reference_code, currency")
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const { data: tenantProfile, error: tenantError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", invoice.tenant_id)
      .single();

    if (tenantError) {
      throw tenantError;
    }

    const tenantEmail = tenantProfile?.email;
    if (!tenantEmail) {
      return NextResponse.json({ error: "Tenant email not found" }, { status: 400 });
    }

    const paystackResponse = await initializePaystackTransaction({
      email: tenantEmail,
      amount: toSubunit(Number(invoice.amount_due)),
      reference: invoice.payment_reference_code,
      currency: invoice.currency,
      metadata: {
        invoiceId: invoice.id,
        tenantId: invoice.tenant_id
      }
    });

    return NextResponse.json({
      paymentLink: paystackResponse.data.authorization_url,
      accessCode: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initialize payment" },
      { status: 500 }
    );
  }
}
