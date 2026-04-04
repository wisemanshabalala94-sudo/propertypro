import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      invitedByProfileId?: string;
      invitedEmail: string;
      fullName?: string;
      role: "admin" | "owner" | "tenant" | "vendor";
      accessScope?: Record<string, unknown>;
    };

    if (!body.organizationId || !body.invitedEmail || !body.role) {
      return NextResponse.json({ error: "organizationId, invitedEmail, and role are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("team_invitations")
      .insert({
        organization_id: body.organizationId,
        invited_by_profile_id: body.invitedByProfileId ?? null,
        invited_email: body.invitedEmail,
        full_name: body.fullName ?? null,
        role: body.role,
        access_scope: body.accessScope ?? {}
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ invitation: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create team invitation" },
      { status: 500 }
    );
  }
}

