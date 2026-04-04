import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    const status = searchParams.get("status");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    let query = supabase
      .from("maintenance_requests")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return NextResponse.json({ requests: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load maintenance requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      propertyId?: string;
      unitId?: string;
      tenantId?: string;
      assignedOwnerId?: string;
      category: "plumbing" | "electrical" | "security" | "cleaning" | "structural" | "other";
      priority?: "low" | "standard" | "high" | "critical";
      title: string;
      description: string;
      aiTriageSummary?: string;
      aiTradeRequired?: string;
      aiEstimatedCost?: number;
    };

    if (!body.organizationId || !body.category || !body.title || !body.description) {
      return NextResponse.json({ error: "organizationId, category, title, and description are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("maintenance_requests")
      .insert({
        organization_id: body.organizationId,
        property_id: body.propertyId ?? null,
        unit_id: body.unitId ?? null,
        tenant_id: body.tenantId ?? null,
        assigned_owner_id: body.assignedOwnerId ?? null,
        category: body.category,
        priority: body.priority ?? "standard",
        title: body.title,
        description: body.description,
        ai_triage_summary: body.aiTriageSummary ?? null,
        ai_trade_required: body.aiTradeRequired ?? null,
        ai_estimated_cost: body.aiEstimatedCost ?? null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    await supabase.from("maintenance_updates").insert({
      maintenance_request_id: data.id,
      organization_id: body.organizationId,
      author_profile_id: body.tenantId ?? body.assignedOwnerId ?? null,
      update_type: "comment",
      message: "Request created and queued for triage."
    });

    return NextResponse.json({ request: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create maintenance request" },
      { status: 500 }
    );
  }
}
