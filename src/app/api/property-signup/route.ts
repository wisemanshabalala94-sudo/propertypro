import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      propertyId: string;
      applicantName: string;
      applicantEmail: string;
      applicantPhone?: string;
      requestedRole: "tenant" | "owner";
    };

    if (!body.propertyId || !body.applicantName || !body.applicantEmail || !body.requestedRole) {
      return NextResponse.json({ error: "propertyId, applicantName, applicantEmail, and requestedRole are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, organization_id")
      .eq("id", body.propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("property_signup_requests")
      .insert({
        organization_id: property.organization_id,
        property_id: body.propertyId,
        requested_role: body.requestedRole,
        applicant_name: body.applicantName,
        applicant_email: body.applicantEmail,
        applicant_phone: body.applicantPhone ?? null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ signupRequest: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create signup request" },
      { status: 500 }
    );
  }
}

