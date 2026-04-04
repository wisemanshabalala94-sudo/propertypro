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
      .from("tenant_screening_checks")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ screenings: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load screening queue" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      applicantProfileId?: string;
      reviewedByProfileId?: string;
      provider?: string;
      status?: "pending" | "in_review" | "approved" | "declined" | "needs_more_info";
      affordabilityScore?: number;
      riskBand?: "low" | "moderate" | "high";
      employmentVerified?: boolean;
      identityVerified?: boolean;
      aiSummary?: string;
      rawPayload?: Record<string, unknown>;
    };

    if (!body.organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("tenant_screening_checks")
      .insert({
        organization_id: body.organizationId,
        applicant_profile_id: body.applicantProfileId ?? null,
        reviewed_by_profile_id: body.reviewedByProfileId ?? null,
        provider: body.provider ?? "manual_review",
        status: body.status ?? "pending",
        affordability_score: body.affordabilityScore ?? null,
        risk_band: body.riskBand ?? null,
        employment_verified: body.employmentVerified ?? false,
        identity_verified: body.identityVerified ?? false,
        ai_summary: body.aiSummary ?? null,
        raw_payload: body.rawPayload ?? {}
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ screening: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create screening check" },
      { status: 500 }
    );
  }
}
