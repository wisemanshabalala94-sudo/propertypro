import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("in_app_messages")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      senderProfileId?: string;
      recipientProfileId?: string;
      subject: string;
      body: string;
      messageType?: "general" | "payment" | "maintenance" | "dispute";
    };

    if (!body.organizationId || !body.subject || !body.body) {
      return NextResponse.json({ error: "organizationId, subject, and body are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("in_app_messages")
      .insert({
        organization_id: body.organizationId,
        sender_profile_id: body.senderProfileId ?? null,
        recipient_profile_id: body.recipientProfileId ?? null,
        subject: body.subject,
        body: body.body,
        message_type: body.messageType ?? "general"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send message" },
      { status: 500 }
    );
  }
}
