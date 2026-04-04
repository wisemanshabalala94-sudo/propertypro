import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      propertyId: string;
      slug: string;
      signupNotes?: string;
      isPublicSignupEnabled?: boolean;
    };

    if (!body.organizationId || !body.propertyId || !body.slug) {
      return NextResponse.json({ error: "organizationId, propertyId, and slug are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("property_directory_settings")
      .upsert({
        organization_id: body.organizationId,
        property_id: body.propertyId,
        slug: body.slug,
        signup_notes: body.signupNotes ?? null,
        is_public_signup_enabled: body.isPublicSignupEnabled ?? true
      }, { onConflict: "property_id" })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ directory: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update property directory settings" },
      { status: 500 }
    );
  }
}
