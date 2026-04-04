import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      profileId: string;
      receiptEmailEnabled?: boolean;
      receiptSmsEnabled?: boolean;
      paymentAlertsEnabled?: boolean;
    };

    if (!body.organizationId || !body.profileId) {
      return NextResponse.json({ error: "organizationId and profileId are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert({
        organization_id: body.organizationId,
        profile_id: body.profileId,
        receipt_email_enabled: body.receiptEmailEnabled ?? true,
        receipt_sms_enabled: body.receiptSmsEnabled ?? false,
        payment_alerts_enabled: body.paymentAlertsEnabled ?? true
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ preferences: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save notification preferences" },
      { status: 500 }
    );
  }
}
