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

    // Check if user is admin/owner
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all payslips in organization
    const { data: payslips, error } = await supabase
      .from("payslips")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("payment_date", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch payslips" },
        { status: 500 }
      );
    }

    return NextResponse.json(payslips || []);
  } catch (error) {
    console.error("Error fetching payslips:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabaseClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin/owner
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      staffMemberId,
      payPeriodStart,
      payPeriodEnd,
      paymentDate,
      grossAmount
    } = body;

    // Generate payslip number
    const payslipNumber = `PSL-${Date.now()}`;

    // Calculate deductions (sample: 20% total)
    const totalDeductions = grossAmount * 0.2;
    const netAmount = grossAmount - totalDeductions;

    // Create payslip
    const { data: payslip, error: payslipError } = await supabase
      .from("payslips")
      .insert({
        organization_id: profile.organization_id,
        staff_member_id: staffMemberId,
        payslip_number: payslipNumber,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        payment_date: paymentDate,
        gross_amount: parseFloat(grossAmount),
        total_deductions: totalDeductions,
        net_amount: netAmount,
        currency: "ZAR",
        status: "pending"
      })
      .select()
      .single();

    if (payslipError) {
      return NextResponse.json(
        { error: "Failed to create payslip" },
        { status: 500 }
      );
    }

    // Create payslip line items
    await supabase
      .from("payslip_line_items")
      .insert([
        {
          payslip_id: payslip.id,
          description: "Gross Salary",
          amount: parseFloat(grossAmount),
          item_type: "earnings"
        },
        {
          payslip_id: payslip.id,
          description: "Tax Deduction (12%)",
          amount: totalDeductions * 0.6,
          item_type: "deduction"
        },
        {
          payslip_id: payslip.id,
          description: "Insurance (5%)",
          amount: totalDeductions * 0.3,
          item_type: "deduction"
        },
        {
          payslip_id: payslip.id,
          description: "Pension (3%)",
          amount: totalDeductions * 0.1,
          item_type: "deduction"
        }
      ]);

    return NextResponse.json(payslip, { status: 201 });
  } catch (error) {
    console.error("Error creating payslip:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
