import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

const demoAccounts = {
  owner: {
    email: "owner.demo@propertypro.app",
    password: "DemoOwner@123",
    fullName: "Demo Building Owner",
    role: "owner" as const
  },
  admin: {
    email: "admin.demo@propertypro.app",
    password: "DemoAdmin@123",
    fullName: "Demo Property Admin",
    role: "admin" as const
  },
  tenant: {
    email: "tenant.demo@propertypro.app",
    password: "DemoTenant@123",
    fullName: "Demo Tenant",
    role: "tenant" as const
  }
};

async function ensureUser(params: {
  email: string;
  password: string;
  fullName: string;
  role: "owner" | "admin" | "tenant";
  organizationId: string;
}) {
  const supabase = createServiceClient();
  const existing = await supabase.auth.admin.listUsers();
  const found = existing.data.users.find((user) => user.email?.toLowerCase() === params.email.toLowerCase());

  let userId = found?.id;

  if (!userId) {
    const created = await supabase.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true,
      user_metadata: {
        organization_id: params.organizationId,
        role: params.role
      }
    });

    if (created.error || !created.data.user) {
      throw created.error ?? new Error(`Unable to create ${params.role} demo user`);
    }

    userId = created.data.user.id;
  }

  const updatePayload: Record<string, unknown> = {
    full_name: params.fullName,
    is_verified: true,
    organization_id: params.organizationId,
    role: params.role
  };

  if (params.role === "tenant") {
    updatePayload.tenant_reference_code = `PPR-${userId.replaceAll("-", "").slice(0, 4).toUpperCase()}-${userId.replaceAll("-", "").slice(4, 8).toUpperCase()}`;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email: params.email,
      ...updatePayload
    });

  if (profileError) {
    throw profileError;
  }

  return userId;
}

export async function POST() {
  try {
    const supabase = createServiceClient();
    let { data: organization } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("name", "PropertyPro Demo Estate")
      .maybeSingle();

    if (!organization) {
      const createdOrganization = await supabase
        .from("organizations")
        .insert({
          name: "PropertyPro Demo Estate",
          subscription_status: "active",
          base_currency: "ZAR"
        })
        .select()
        .single();

      if (createdOrganization.error || !createdOrganization.data) {
        throw createdOrganization.error ?? new Error("Unable to create demo organization");
      }

      organization = createdOrganization.data;
    }

    if (!organization) {
      throw new Error("Demo organization could not be resolved");
    }

    const ownerId = await ensureUser({ ...demoAccounts.owner, organizationId: organization.id });
    const adminId = await ensureUser({ ...demoAccounts.admin, organizationId: organization.id });
    const tenantId = await ensureUser({ ...demoAccounts.tenant, organizationId: organization.id });
    let { data: property } = await supabase
      .from("properties")
      .select("id, name")
      .eq("organization_id", organization.id)
      .eq("name", "Wise Heights")
      .maybeSingle();

    if (!property) {
      const createdProperty = await supabase
        .from("properties")
        .insert({
          organization_id: organization.id,
          name: "Wise Heights",
          address: "14 Signal Road, Johannesburg"
        })
        .select()
        .single();

      if (createdProperty.error || !createdProperty.data) {
        throw createdProperty.error ?? new Error("Unable to create demo property");
      }

      property = createdProperty.data;
    }

    if (!property) {
      throw new Error("Demo property could not be resolved");
    }

    let { data: unit } = await supabase
      .from("units")
      .select("id")
      .eq("property_id", property.id)
      .eq("unit_number", "A-12")
      .maybeSingle();

    if (!unit) {
      const createdUnit = await supabase
        .from("units")
        .insert({
          organization_id: organization.id,
          property_id: property.id,
          unit_number: "A-12",
          status: "occupied"
        })
        .select()
        .single();

      if (createdUnit.error || !createdUnit.data) {
        throw createdUnit.error ?? new Error("Unable to create demo unit");
      }

      unit = createdUnit.data;
    } else {
      await supabase.from("units").update({ status: "occupied" }).eq("id", unit.id);
    }

    if (!unit) {
      throw new Error("Demo unit could not be resolved");
    }

    await supabase
      .from("property_directory_settings")
      .upsert({
        organization_id: organization.id,
        property_id: property.id,
        slug: "wise-heights",
        signup_notes: "Choose Wise Heights to join the demo building environment.",
        is_public_signup_enabled: true
      }, { onConflict: "property_id" });

    await supabase
      .from("owner_subscriptions")
      .upsert({
        organization_id: organization.id,
        owner_profile_id: ownerId,
        monthly_fee: 1170,
        currency: "ZAR",
        status: "active",
        next_billing_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10)
      }, { onConflict: "organization_id" });

    const today = new Date().toISOString().slice(0, 10);
    let { data: lease } = await supabase
      .from("leases")
      .select("id")
      .eq("unit_id", unit.id)
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .maybeSingle();

    if (!lease) {
      const createdLease = await supabase
        .from("leases")
        .insert({
          organization_id: organization.id,
          unit_id: unit.id,
          tenant_id: tenantId,
          start_date: today,
          monthly_rent_amount: 7500,
          currency: "ZAR",
          status: "active"
        })
        .select()
        .single();

      if (createdLease.error || !createdLease.data) {
        throw createdLease.error ?? new Error("Unable to create demo lease");
      }

      lease = createdLease.data;
    }

    if (!lease) {
      throw new Error("Demo lease could not be resolved");
    }

    await supabase
      .from("invoices")
      .upsert({
        organization_id: organization.id,
        lease_id: lease.id,
        tenant_id: tenantId,
        invoice_number: "INV-DEMO-APR-2026",
        payment_reference_code: `PPR-${tenantId.replaceAll("-", "").slice(0, 4).toUpperCase()}-${tenantId.replaceAll("-", "").slice(4, 8).toUpperCase()}`,
        amount_due: 7500,
        amount_paid: 0,
        currency: "ZAR",
        due_date: new Date().toISOString().slice(0, 10),
        payment_method: "bank_transfer",
        status: "unpaid"
      }, { onConflict: "invoice_number" });

    const { data: approvalRequest } = await supabase
      .from("transaction_approval_requests")
      .select("id")
      .eq("organization_id", organization.id)
      .eq("purpose", "Caretaker payout")
      .maybeSingle();

    if (!approvalRequest) {
      await supabase
        .from("transaction_approval_requests")
        .insert({
          organization_id: organization.id,
          requested_by_user_id: adminId,
          amount: 3200,
          currency: "ZAR",
          purpose: "Caretaker payout",
          source_account: "Income account",
          destination_account: "Caretaker account",
          status: "pending"
        });
    }

    const { data: workerPayout } = await supabase
      .from("worker_payouts")
      .select("id")
      .eq("organization_id", organization.id)
      .eq("worker_name", "Demo Caretaker")
      .maybeSingle();

    if (!workerPayout) {
      await supabase
        .from("worker_payouts")
        .insert({
          organization_id: organization.id,
          requested_by_profile_id: adminId,
          worker_name: "Demo Caretaker",
          worker_email: "caretaker.demo@propertypro.app",
          role_label: "Caretaker",
          amount: 3200,
          payout_cycle: "monthly",
          status: "pending_approval"
        });
    }

    const { data: teamInvitation } = await supabase
      .from("team_invitations")
      .select("id")
      .eq("organization_id", organization.id)
      .eq("invited_email", demoAccounts.admin.email)
      .maybeSingle();

    if (!teamInvitation) {
      await supabase
        .from("team_invitations")
        .insert({
          organization_id: organization.id,
          invited_by_profile_id: ownerId,
          invited_email: demoAccounts.admin.email,
          full_name: demoAccounts.admin.fullName,
          role: "admin",
          access_scope: {
            onboarding: true,
            leases: true,
            communications: true,
            salaries: true,
            payoutsRequireOwnerApproval: true
          },
          status: "accepted"
        });
    }

    return NextResponse.json({
      organization: {
        id: organization.id,
        name: organization.name
      },
      property: {
        id: property.id,
        name: property.name
      },
      credentials: {
        owner: demoAccounts.owner,
        admin: demoAccounts.admin,
        tenant: demoAccounts.tenant
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to build demo workspace" },
      { status: 500 }
    );
  }
}
