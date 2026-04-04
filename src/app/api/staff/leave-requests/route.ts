import { getServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabaseClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get staff member
    const { data: staffMember } = await supabase
      .from("staff_members")
      .select("id, organization_id")
      .eq("profile_id", user.id)
      .single();

    if (!staffMember) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { leaveType, startDate, endDate, reason } = body;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Create leave request
    const { data: leaveRequest, error } = await supabase
      .from("staff_leave_requests")
      .insert({
        organization_id: staffMember.organization_id,
        staff_member_id: staffMember.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        num_days: numDays,
        reason,
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating leave request:", error);
      return NextResponse.json(
        { error: "Failed to submit leave request" },
        { status: 500 }
      );
    }

    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (error) {
    console.error("Error in leave request endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = getServerSupabaseClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get staff member
    const { data: staffMember } = await supabase
      .from("staff_members")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!staffMember) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Get leave requests
    const { data: leaveRequests, error } = await supabase
      .from("staff_leave_requests")
      .select("*")
      .eq("staff_member_id", staffMember.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leave requests:", error);
      return NextResponse.json(
        { error: "Failed to fetch leave requests" },
        { status: 500 }
      );
    }

    return NextResponse.json(leaveRequests || []);
  } catch (error) {
    console.error("Error in leave request endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
