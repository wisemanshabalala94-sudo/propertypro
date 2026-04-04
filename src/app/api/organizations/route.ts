import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name: string; baseCurrency?: string; subscriptionStatus?: string };

    if (!body.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("organizations")
      .insert({
        name: body.name,
        base_currency: body.baseCurrency ?? "ZAR",
        subscription_status: body.subscriptionStatus ?? "trial"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ organization: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create organization" },
      { status: 500 }
    );
  }
}

