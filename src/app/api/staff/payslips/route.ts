import { getServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = getServerSupabaseClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get staff member ID
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

    // Get payslips sorted by payment date (newest first)
    const { data: payslips, error } = await supabase
      .from("payslips")
      .select(
        `
        id,
        payslip_number,
        pay_period_start,
        pay_period_end,
        payment_date,
        gross_amount,
        total_deductions,
        net_amount,
        currency,
        status,
        created_at
      `
      )
      .eq("staff_member_id", staffMember.id)
      .order("payment_date", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching payslips:", error);
      return NextResponse.json(
        { error: "Failed to fetch payslips" },
        { status: 500 }
      );
    }

    return NextResponse.json(payslips || []);
  } catch (error) {
    console.error("Error in payslips endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
