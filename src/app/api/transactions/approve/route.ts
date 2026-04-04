import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { approvalRequestId, action, reviewerUserId, notes } = await request.json();

    if (!approvalRequestId || !["approved", "declined"].includes(action)) {
      return NextResponse.json({ error: "approvalRequestId and valid action are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("transaction_approval_requests")
      .update({
        status: action,
        reviewed_by_user_id: reviewerUserId ?? null,
        reviewed_at: new Date().toISOString(),
        review_notes: notes ?? null
      })
      .eq("id", approvalRequestId)
      .eq("status", "pending")
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      approval: data,
      fundsAvailable: action === "approved"
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process approval request" },
      { status: 500 }
    );
  }
}

