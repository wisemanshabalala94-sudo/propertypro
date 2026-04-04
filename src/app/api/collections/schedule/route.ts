import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      invoiceId: string;
      tenantId: string;
      method: "paystack_checkout" | "bank_transfer" | "atm_deposit" | "card_debit";
      nextAttemptAt?: string;
      notes?: string;
    };

    if (!body.organizationId || !body.invoiceId || !body.tenantId || !body.method) {
      return NextResponse.json({ error: "organizationId, invoiceId, tenantId, and method are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("collection_runs")
      .insert({
        organization_id: body.organizationId,
        invoice_id: body.invoiceId,
        tenant_id: body.tenantId,
        method: body.method,
        status: "scheduled",
        next_attempt_at: body.nextAttemptAt ?? null,
        notes: body.notes ?? null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ collectionRun: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to schedule collection run" },
      { status: 500 }
    );
  }
}
