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

    // Get all staff in organization
    const { data: staffMembers, error } = await supabase
      .from("staff_members")
      .select(`
        id,
        job_title,
        department,
        salary_amount,
        employment_status,
        profiles(id, full_name, email, role)
      `)
      .eq("organization_id", profile.organization_id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch staff" },
        { status: 500 }
      );
    }

    return NextResponse.json(staffMembers || []);
  } catch (error) {
    console.error("Error fetching staff:", error);
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
    const { fullName, email, jobTitle, salaryAmount, department } = body;

    // Create new user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: Math.random().toString(36),  // Temporary password
      email_confirm: true
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 }
      );
    }

    // Create profile
    const { data: newProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        organization_id: profile.organization_id,
        full_name: fullName,
        email,
        role: "vendor",
        is_verified: true
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    // Create staff member record
    const { data: staffMember, error: staffError } = await supabase
      .from("staff_members")
      .insert({
        organization_id: profile.organization_id,
        profile_id: authData.user.id,
        job_title: jobTitle,
        department,
        salary_amount: parseFloat(salaryAmount),
        currency: "ZAR",
        salary_frequency: "monthly",
        employment_status: "active",
        start_date: new Date().toISOString().split("T")[0]
      })
      .select(`
        id,
        job_title,
        department,
        salary_amount,
        employment_status,
        profiles(id, full_name, email)
      `)
      .single();

    if (staffError) {
      return NextResponse.json(
        { error: "Failed to create staff member" },
        { status: 500 }
      );
    }

    return NextResponse.json(staffMember, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
