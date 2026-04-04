import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      requestedByProfileId?: string;
      workerName: string;
      workerEmail?: string;
      roleLabel: string;
      amount: number;
      payoutCycle?: "weekly" | "monthly" | "ad_hoc";
      bankAccountId?: string;
      notes?: string;
    };

    if (!body.organizationId || !body.workerName || !body.roleLabel || !body.amount) {
      return NextResponse.json({ error: "organizationId, workerName, roleLabel, and amount are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("worker_payouts")
      .insert({
        organization_id: body.organizationId,
        requested_by_profile_id: body.requestedByProfileId ?? null,
        worker_name: body.workerName,
        worker_email: body.workerEmail ?? null,
        role_label: body.roleLabel,
        amount: body.amount,
        payout_cycle: body.payoutCycle ?? "ad_hoc",
        bank_account_id: body.bankAccountId ?? null,
        notes: body.notes ?? null,
        status: "pending_approval"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ payout: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create worker payout" },
      { status: 500 }
    );
  }
}

