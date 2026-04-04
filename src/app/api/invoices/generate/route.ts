import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { organizationId, billingDate } = await request.json();

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const effectiveDate = billingDate ?? new Date().toISOString().slice(0, 10);

    const { data: leases, error: leaseError } = await supabase
      .from("leases")
      .select("id, tenant_id, monthly_rent_amount, unit_id")
      .eq("organization_id", organizationId)
      .eq("status", "active");

    if (leaseError) {
      throw leaseError;
    }

    const invoicesToInsert =
      leases?.map((lease, index) => {
        const invoiceNumber = [
          effectiveDate.replaceAll("-", ""),
          lease.id.slice(0, 6).toUpperCase(),
          String(index + 1).padStart(2, "0")
        ].join("-");
        const reference = `PPR-${organizationId.slice(0, 4).toUpperCase()}-${lease.id.slice(0, 6).toUpperCase()}`;

        return {
          organization_id: organizationId,
          lease_id: lease.id,
          tenant_id: lease.tenant_id,
          invoice_number: invoiceNumber,
          payment_reference_code: reference,
          amount_due: lease.monthly_rent_amount,
          amount_paid: 0,
          due_date: effectiveDate,
          status: "unpaid"
        };
      }) ?? [];

    if (invoicesToInsert.length === 0) {
      return NextResponse.json({ created: 0, message: "No active leases found" });
    }

    const { data, error } = await supabase.from("invoices").insert(invoicesToInsert).select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ created: data.length, invoices: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate invoices" },
      { status: 500 }
    );
  }
}
