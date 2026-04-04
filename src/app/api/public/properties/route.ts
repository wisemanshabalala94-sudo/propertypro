import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("property_directory_settings")
      .select("slug, signup_notes, properties:property_id(name, address)")
      .eq("is_public_signup_enabled", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ properties: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load public properties" },
      { status: 500 }
    );
  }
}

