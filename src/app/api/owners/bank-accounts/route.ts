import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createPaystackTransferRecipient } from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      ownerProfileId?: string;
      accountName: string;
      accountNumber?: string;
      accountNumberMasked: string;
      bankProvider: string;
      bankCode?: string;
      isPayoutTarget?: boolean;
    };

    if (!body.organizationId || !body.accountName || !body.accountNumberMasked || !body.bankProvider) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();
    let paystackRecipientCode: string | null = null;

    if (body.accountNumber && body.bankCode) {
      const recipient = await createPaystackTransferRecipient({
        name: body.accountName,
        account_number: body.accountNumber,
        bank_code: body.bankCode
      });

      paystackRecipientCode = recipient.data?.recipient_code ?? null;
    }

    if (body.isPayoutTarget) {
      await supabase
        .from("bank_accounts")
        .update({ is_payout_target: false })
        .eq("organization_id", body.organizationId)
        .eq("owner_profile_id", body.ownerProfileId ?? null);
    }

    const { data, error } = await supabase
      .from("bank_accounts")
      .insert({
        organization_id: body.organizationId,
        owner_profile_id: body.ownerProfileId ?? null,
        account_name: body.accountName,
        account_number_masked: body.accountNumberMasked,
        bank_provider: body.bankProvider,
        bank_code: body.bankCode ?? null,
        paystack_recipient_code: paystackRecipientCode,
        is_payout_target: body.isPayoutTarget ?? false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ bankAccount: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save owner bank account" },
      { status: 500 }
    );
  }
}
