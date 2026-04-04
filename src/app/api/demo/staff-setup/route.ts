import { getServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabaseClient();

    // Get current user (admin must be logged in)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const orgId = profile.organization_id;

    // Create demo staff members
    const staffIds: string[] = [];
    const staffNames = [
      { name: "John Mthembu", title: "Property Manager", dept: "Management" },
      { name: "Sarah Williams", title: "Accountant", dept: "Finance" },
      { name: "Michael Chen", title: "Maintenance Supervisor", dept: "Operations" },
      { name: "Amara Okafor", title: "Tenant Relations Officer", dept: "Customer Service" },
      { name: "David Petersen", title: "Security Chief", dept: "Security" }
    ];

    for (const staffInfo of staffNames) {
      // Create auth user
      const { data: authData } = await supabase.auth.admin.createUser({
        email: `${staffInfo.name.toLowerCase().replace(/\s/g, ".")}@propertypro.test`,
        password: "DemoStaff123!@#",
        email_confirm: true
      });

      if (!authData.user) continue;

      // Create profile
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          organization_id: orgId,
          full_name: staffInfo.name,
          email: `${staffInfo.name.toLowerCase().replace(/\s/g, ".")}@propertypro.test`,
          role: "vendor",
          is_verified: true
        })
        .select()
        .single();

      // Create staff member
      const { data: staffMember } = await supabase
        .from("staff_members")
        .insert({
          organization_id: orgId,
          profile_id: authData.user.id,
          job_title: staffInfo.title,
          department: staffInfo.dept,
          salary_amount: 15000 + Math.random() * 10000,
          currency: "ZAR",
          salary_frequency: "monthly",
          employment_status: "active",
          start_date: "2024-01-01"
        })
        .select()
        .single();

      if (staffMember) {
        staffIds.push(staffMember.id);
      }
    }

    // Create demo payslips for each staff member
    const now = new Date();
    const months = [3, 2, 1, 0]; // Last 4 months

    for (const staffId of staffIds) {
      for (const monthOffset of months) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 0);
        const paymentDate = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 5);

        const grossAmount = 15000 + Math.random() * 10000;
        const totalDeductions = grossAmount * 0.2;
        const netAmount = grossAmount - totalDeductions;

        const { data: payslip } = await supabase
          .from("payslips")
          .insert({
            organization_id: orgId,
            staff_member_id: staffId,
            payslip_number: `PSL-${staffId.substring(0, 8)}-${startDate.getTime()}`,
            pay_period_start: startDate.toISOString().split("T")[0],
            pay_period_end: endDate.toISOString().split("T")[0],
            payment_date: paymentDate.toISOString().split("T")[0],
            gross_amount: grossAmount,
            total_deductions: totalDeductions,
            net_amount: netAmount,
            currency: "ZAR",
            status: monthOffset === 0 ? "pending" : "paid"
          })
          .select()
          .single();

        // Create line items
        if (payslip) {
          await supabase
            .from("payslip_line_items")
            .insert([
              {
                payslip_id: payslip.id,
                description: "Basic Salary",
                amount: grossAmount,
                item_type: "earnings"
              },
              {
                payslip_id: payslip.id,
                description: "Income Tax",
                amount: totalDeductions * 0.6,
                item_type: "deduction"
              },
              {
                payslip_id: payslip.id,
                description: "Medical Insurance",
                amount: totalDeductions * 0.3,
                item_type: "deduction"
              },
              {
                payslip_id: payslip.id,
                description: "Pension Fund",
                amount: totalDeductions * 0.1,
                item_type: "deduction"
              }
            ]);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${staffIds.length} demo staff members with payslips`,
      staffCount: staffIds.length,
      payslipsPerStaff: months.length
    });
  } catch (error) {
    console.error("Error generating demo data:", error);
    return NextResponse.json(
      { error: "Failed to generate demo data", details: String(error) },
      { status: 500 }
    );
  }
}
