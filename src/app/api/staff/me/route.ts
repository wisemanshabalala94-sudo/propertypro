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

    // Get staff member data
    const { data: staffMember, error } = await supabase
      .from("staff_members")
      .select(
        `
        id,
        profile_id,
        job_title,
        department,
        salary_amount,
        currency,
        employment_status,
        profiles(
          id,
          full_name,
          email,
          role
        )
      `
      )
      .eq("profile_id", user.id)
      .single();

    if (error || !staffMember) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    const profile = Array.isArray(staffMember.profiles)
      ? staffMember.profiles[0]
      : staffMember.profiles;

    return NextResponse.json({
      id: staffMember.id,
      full_name: profile?.full_name ?? null,
      email: profile?.email ?? null,
      job_title: staffMember.job_title,
      department: staffMember.department,
      salary_amount: staffMember.salary_amount,
      currency: staffMember.currency,
      employment_status: staffMember.employment_status
    });
  } catch (error) {
    console.error("Error fetching staff data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
