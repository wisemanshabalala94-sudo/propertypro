import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      profileId?: string;
      role: "tenant" | "owner" | "admin";
      preferredPaymentMethod?: string;
      debitAuthorized?: boolean;
      affordabilityScore?: number;
      aiSummary?: string;
      documents?: Array<{
        documentType: "id_document" | "bank_statement" | "proof_of_address" | "debit_mandate";
        fileUrl: string;
        monthCovered?: string;
        aiStatus?: "pending" | "accepted" | "rejected" | "needs_review";
        aiNotes?: string;
      }>;
    };

    if (!body.organizationId || !body.role) {
      return NextResponse.json({ error: "organizationId and role are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: application, error: applicationError } = await supabase
      .from("onboarding_applications")
      .insert({
        organization_id: body.organizationId,
        profile_id: body.profileId ?? null,
        role: body.role,
        preferred_payment_method: body.preferredPaymentMethod ?? null,
        debit_authorized: body.debitAuthorized ?? false,
        affordability_score: body.affordabilityScore ?? null,
        ai_summary: body.aiSummary ?? null,
        status: "in_review"
      })
      .select()
      .single();

    if (applicationError) {
      throw applicationError;
    }

    if (body.documents?.length) {
      const documents = body.documents.map((document) => ({
        onboarding_application_id: application.id,
        organization_id: body.organizationId,
        document_type: document.documentType,
        file_url: document.fileUrl,
        month_covered: document.monthCovered ?? null,
        ai_status: document.aiStatus ?? "pending",
        ai_notes: document.aiNotes ?? null
      }));

      const { error: documentError } = await supabase.from("onboarding_documents").insert(documents);
      if (documentError) {
        throw documentError;
      }
    }

    return NextResponse.json({ applicationId: application.id, status: application.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit onboarding" },
      { status: 500 }
    );
  }
}
