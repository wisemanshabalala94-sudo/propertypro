import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      name: string;
      address?: string;
      unitCount?: number;
      unitPrefix?: string;
    };

    if (!body.organizationId || !body.name) {
      return NextResponse.json({ error: "organizationId and name are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        organization_id: body.organizationId,
        name: body.name,
        address: body.address ?? null
      })
      .select()
      .single();

    if (propertyError) {
      throw propertyError;
    }

    const unitCount = Math.max(1, body.unitCount ?? 1);
    const units = Array.from({ length: unitCount }, (_, index) => ({
      organization_id: body.organizationId,
      property_id: property.id,
      unit_number: `${body.unitPrefix ?? "U"}-${index + 1}`,
      status: "vacant"
    }));

    const { data: createdUnits, error: unitsError } = await supabase.from("units").insert(units).select();
    if (unitsError) {
      throw unitsError;
    }

    return NextResponse.json({ property, units: createdUnits }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create property" },
      { status: 500 }
    );
  }
}

