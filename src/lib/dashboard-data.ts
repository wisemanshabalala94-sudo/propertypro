import { createServiceClient } from "@/lib/supabase-server";

function currency(value: number | null | undefined) {
  return `R${(value ?? 0).toLocaleString("en-ZA")}`;
}

export async function getTenantDashboardData() {
  const supabase = createServiceClient();

  const { data: tenant } = await supabase
    .from("profiles")
    .select("id, organization_id, full_name, email")
    .eq("role", "tenant")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!tenant) {
    return null;
  }

  const [{ data: invoices }, { data: maintenance }, { data: applications }, { data: documents }] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, invoice_number, amount_due, due_date, status, payment_method, payment_reference_code")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("maintenance_requests")
      .select("id, title, priority, status, ai_triage_summary")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("onboarding_applications")
      .select("id")
      .eq("profile_id", tenant.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("onboarding_documents")
      .select("id, document_type, ai_status, file_url")
      .eq("organization_id", tenant.organization_id)
      .order("created_at", { ascending: false })
  ]);

  const latestApplicationId = applications?.[0]?.id ?? null;
  const filteredDocuments = documents ?? [];

  const unpaidInvoice = (invoices ?? []).find((invoice) => invoice.status !== "paid") ?? invoices?.[0] ?? null;

  return {
    tenant,
    summary: {
      currentDue: unpaidInvoice ? currency(Number(unpaidInvoice.amount_due)) : "R0",
      reference: unpaidInvoice?.payment_reference_code ?? "Not assigned yet",
      openRepairs: maintenance?.filter((item) => item.status !== "resolved" && item.status !== "cancelled").length ?? 0,
      documentsComplete: latestApplicationId
        ? `${filteredDocuments.filter((item) => item.ai_status === "accepted").length}/${filteredDocuments.length || 0}`
        : `${filteredDocuments.filter((item) => item.ai_status === "accepted").length}/${filteredDocuments.length || 0}`
    },
    invoices:
      invoices?.map((invoice) => ({
        id: invoice.id,
        period: invoice.invoice_number,
        amount: currency(Number(invoice.amount_due)),
        due: invoice.due_date,
        status: invoice.status,
        method: invoice.payment_method ?? "Not selected",
        reference: invoice.payment_reference_code,
        autopay: invoice.payment_method === "card_debit" ? "Autopay active" : "Manual action required"
      })) ?? [],
    maintenance:
      maintenance?.map((item) => ({
        title: item.title,
        priority: item.priority,
        status: item.status,
        update: item.ai_triage_summary ?? "Awaiting triage."
      })) ?? [],
    uploads:
      filteredDocuments.map((document) => ({
        name: document.document_type.replaceAll("_", " "),
        state: document.ai_status
      })) ?? []
  };
}

export async function getOwnerDashboardData() {
  const supabase = createServiceClient();

  const { data: owner } = await supabase
    .from("profiles")
    .select("id, organization_id, full_name")
    .eq("role", "owner")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!owner) {
    return null;
  }

  const [
    { data: invoices },
    { data: approvals },
    { data: properties },
    { data: teamMembers },
    { data: reports },
    { data: maintenance }
  ] = await Promise.all([
    supabase.from("invoices").select("amount_due, amount_paid, status").eq("organization_id", owner.organization_id),
    supabase
      .from("transaction_approval_requests")
      .select("id, amount, purpose, status, source_account")
      .eq("organization_id", owner.organization_id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("properties").select("id, name"),
    supabase
      .from("team_member_access")
      .select("team_member_profile_id, access_role, can_manage_tenants, can_manage_collections, can_manage_payouts, can_manage_team_access")
      .eq("organization_id", owner.organization_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("report_snapshots")
      .select("report_type, metrics, period_label")
      .eq("organization_id", owner.organization_id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("maintenance_requests")
      .select("property_id, status")
      .eq("organization_id", owner.organization_id)
  ]);

  const collected = (invoices ?? []).reduce((sum, invoice) => sum + Number(invoice.amount_paid ?? 0), 0);
  const outstanding = (invoices ?? []).reduce((sum, invoice) => sum + Math.max(0, Number(invoice.amount_due ?? 0) - Number(invoice.amount_paid ?? 0)), 0);

  return {
    owner,
    summary: {
      collected: currency(collected),
      outstanding: currency(outstanding),
      pendingApprovals: approvals?.filter((item) => item.status === "pending").length ?? 0,
      teamMembers: teamMembers?.length ?? 0
    },
    approvals:
      approvals?.map((item) => ({
        title: item.purpose,
        amount: currency(Number(item.amount)),
        reason: item.purpose,
        state: item.status,
        source: item.source_account ?? "Income account"
      })) ?? [],
    portfolio:
      (properties ?? []).map((property) => {
        const propertyMaintenance = (maintenance ?? []).filter((item) => item.property_id === property.id && item.status !== "resolved").length;
        return {
          name: property.name,
          units: 0,
          occupancy: "Live",
          collected: currency(collected),
          outstanding: currency(outstanding),
          maintenance: `${propertyMaintenance} open`
        };
      }) ?? [],
    reportCards:
      reports?.slice(0, 3).map((report) => ({
        title: report.report_type,
        value: typeof report.metrics?.headline === "string" ? String(report.metrics.headline) : report.period_label,
        detail: `Latest ${report.report_type} snapshot`
      })) ?? []
  };
}

export async function getAdminDashboardData() {
  const supabase = createServiceClient();

  const [
    { count: organizationsCount },
    { count: ownersCount },
    { count: tenantsCount },
    { count: buildingsCount },
    { data: screenings },
    { data: properties }
  ] = await Promise.all([
    supabase.from("organizations").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "owner"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "tenant"),
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("tenant_screening_checks")
      .select("id, affordability_score, status, ai_summary")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("properties").select("name").order("created_at", { ascending: false }).limit(5)
  ]);

  return {
    metrics: {
      owners: ownersCount ?? 0,
      tenants: tenantsCount ?? 0,
      buildings: buildingsCount ?? 0,
      organizations: organizationsCount ?? 0
    },
    screenings:
      screenings?.map((screening, index) => ({
        applicant: `Applicant ${index + 1}`,
        score: screening.affordability_score ?? 0,
        status: screening.status,
        note: screening.ai_summary ?? "Awaiting review."
      })) ?? [],
    propertySetup:
      properties?.map((property, index) => ({
        step: property.name,
        state: index === 0 ? "In progress" : "Done"
      })) ?? []
  };
}
