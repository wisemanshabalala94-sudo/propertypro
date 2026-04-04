import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { initializePaystackTransaction } from "@/lib/paystack";
import { toSubunit } from "@/lib/money";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      ownerProfileId: string;
      monthlyFee?: number;
    };

    if (!body.organizationId || !body.ownerProfileId) {
      return NextResponse.json({ error: "organizationId and ownerProfileId are required" }, { status: 400 });
    }

    const monthlyFee = body.monthlyFee ?? 1170;
    const supabase = createServiceClient();

    const { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", body.ownerProfileId)
      .single();

    if (ownerError || !owner?.email) {
      return NextResponse.json({ error: "Owner email not found" }, { status: 404 });
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from("owner_subscriptions")
      .upsert({
        organization_id: body.organizationId,
        owner_profile_id: body.ownerProfileId,
        monthly_fee: monthlyFee,
        currency: "ZAR",
        status: "active",
        next_billing_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10)
      }, { onConflict: "organization_id" })
      .select()
      .single();

    if (subscriptionError) {
      throw subscriptionError;
    }

    const paystack = await initializePaystackTransaction({
      email: owner.email,
      amount: toSubunit(monthlyFee),
      reference: `OWNER-SUB-${body.organizationId.slice(0, 8).toUpperCase()}-${Date.now()}`,
      currency: "ZAR",
      metadata: {
        organizationId: body.organizationId,
        ownerProfileId: body.ownerProfileId,
        subscriptionId: subscription.id,
        chargeType: "owner_subscription"
      },
      channels: ["card", "bank_transfer", "eft"]
    });

    await supabase
      .from("owner_subscriptions")
      .update({ paystack_reference: paystack.data.reference })
      .eq("id", subscription.id);

    return NextResponse.json({
      subscription,
      paymentLink: paystack.data.authorization_url,
      reference: paystack.data.reference
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start owner subscription" },
      { status: 500 }
    );
  }
}

