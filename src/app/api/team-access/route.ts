import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      ownerProfileId?: string;
      teamMemberProfileId: string;
      accessRole: "building_manager" | "finance_officer" | "support" | "viewer";
      canManageTenants?: boolean;
      canManageCollections?: boolean;
      canManageReconciliation?: boolean;
      canManagePayouts?: boolean;
      canManageTeamAccess?: boolean;
    };

    if (!body.organizationId || !body.teamMemberProfileId || !body.accessRole) {
      return NextResponse.json({ error: "organizationId, teamMemberProfileId, and accessRole are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("team_member_access")
      .upsert({
        organization_id: body.organizationId,
        owner_profile_id: body.ownerProfileId ?? null,
        team_member_profile_id: body.teamMemberProfileId,
        access_role: body.accessRole,
        can_manage_tenants: body.canManageTenants ?? false,
        can_manage_collections: body.canManageCollections ?? false,
        can_manage_reconciliation: body.canManageReconciliation ?? false,
        can_manage_payouts: body.canManagePayouts ?? false,
        can_manage_team_access: body.canManageTeamAccess ?? false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ access: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save team access" },
      { status: 500 }
    );
  }
}
