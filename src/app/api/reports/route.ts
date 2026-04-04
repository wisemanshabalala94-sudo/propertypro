import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    const reportType = searchParams.get("reportType");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    let query = supabase
      .from("report_snapshots")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (reportType) {
      query = query.eq("report_type", reportType);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return NextResponse.json({ reports: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      ownerProfileId?: string;
      reportType: "collections" | "occupancy" | "maintenance" | "screening" | "cash_integrity";
      periodLabel: string;
      metrics: Record<string, unknown>;
    };

    if (!body.organizationId || !body.reportType || !body.periodLabel) {
      return NextResponse.json({ error: "organizationId, reportType, and periodLabel are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("report_snapshots")
      .insert({
        organization_id: body.organizationId,
        owner_profile_id: body.ownerProfileId ?? null,
        report_type: body.reportType,
        period_label: body.periodLabel,
        metrics: body.metrics ?? {}
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ report: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save report snapshot" },
      { status: 500 }
    );
  }
}
