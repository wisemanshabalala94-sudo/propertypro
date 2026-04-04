import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      email: string;
      fullName: string;
      password: string;
      affordabilityScore?: number;
      aiSummary?: string;
    };

    if (!body.organizationId || !body.email || !body.fullName || !body.password) {
      return NextResponse.json({ error: "organizationId, email, fullName, and password are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        organization_id: body.organizationId,
        role: "tenant"
      }
    });

    if (authError || !authUser.user) {
      throw authError ?? new Error("Tenant auth record was not created");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: body.fullName,
        is_verified: true,
        tenant_reference_code: `PPR-${authUser.user.id.replaceAll("-", "").slice(0, 4).toUpperCase()}-${authUser.user.id.replaceAll("-", "").slice(4, 8).toUpperCase()}`
      })
      .eq("id", authUser.user.id)
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    const { data: screening, error: screeningError } = await supabase
      .from("tenant_screening_checks")
      .insert({
        organization_id: body.organizationId,
        applicant_profile_id: authUser.user.id,
        provider: "internal_screening",
        status: "in_review",
        affordability_score: body.affordabilityScore ?? null,
        ai_summary: body.aiSummary ?? null,
        identity_verified: true
      })
      .select()
      .single();

    if (screeningError) {
      throw screeningError;
    }

    return NextResponse.json({ tenant: profile, screening }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create tenant" },
      { status: 500 }
    );
  }
}
