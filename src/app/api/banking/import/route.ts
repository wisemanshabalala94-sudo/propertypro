import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { runReconciliation } from "@/lib/reconciliation";

interface BankRow {
  transaction_date: string;
  amount: number;
  description?: string;
  reference_code?: string;
  direction?: "credit" | "debit";
  channel?: string;
}

export async function POST(request: Request) {
  try {
    const { organizationId, bankAccountId, rows } = (await request.json()) as {
      organizationId: string;
      bankAccountId?: string;
      rows: BankRow[];
    };

    if (!organizationId || !rows?.length) {
      return NextResponse.json({ error: "organizationId and rows are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const payload = rows.map((row) => ({
      organization_id: organizationId,
      bank_account_id: bankAccountId ?? null,
      transaction_date: row.transaction_date,
      amount: row.amount,
      description: row.description ?? null,
      reference_code: row.reference_code ?? null,
      is_reconciled: false,
      direction: row.direction ?? "credit",
      channel: row.channel ?? "manual_import"
    }));

    const { data, error } = await supabase.from("bank_transactions").insert(payload).select();
    if (error) {
      throw error;
    }

    const reconciliationResult = await runReconciliation(organizationId);

    return NextResponse.json({
      imported: data.length,
      reconciliationResult
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import bank transactions" },
      { status: 500 }
    );
  }
}

