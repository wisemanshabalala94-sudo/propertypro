import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

function buildReference(unitId: string, tenantId: string, dueDate: string) {
  const compactUnit = unitId.replaceAll("-", "").slice(0, 6).toUpperCase();
  const compactTenant = tenantId.replaceAll("-", "").slice(0, 6).toUpperCase();
  const date = dueDate.slice(0, 7).replace("-", "");
  return `PPR-${compactUnit}-${compactTenant}-${date}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      organizationId: string;
      unitId: string;
      tenantId: string;
      startDate: string;
      endDate?: string;
      monthlyRentAmount: number;
      dueDate: string;
    };

    if (!body.organizationId || !body.unitId || !body.tenantId || !body.startDate || !body.monthlyRentAmount || !body.dueDate) {
      return NextResponse.json({ error: "organizationId, unitId, tenantId, startDate, monthlyRentAmount, and dueDate are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: lease, error: leaseError } = await supabase
      .from("leases")
      .insert({
        organization_id: body.organizationId,
        unit_id: body.unitId,
        tenant_id: body.tenantId,
        start_date: body.startDate,
        end_date: body.endDate ?? null,
        monthly_rent_amount: body.monthlyRentAmount,
        currency: "ZAR",
        status: "active"
      })
      .select()
      .single();

    if (leaseError) {
      throw leaseError;
    }

    await supabase.from("units").update({ status: "occupied" }).eq("id", body.unitId);

    const reference = buildReference(body.unitId, body.tenantId, body.dueDate);
    const invoiceNumber = `INV-${body.dueDate.slice(0, 7)}-${body.unitId.slice(0, 4).toUpperCase()}`;
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        organization_id: body.organizationId,
        lease_id: lease.id,
        tenant_id: body.tenantId,
        invoice_number: `${invoiceNumber}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        payment_reference_code: `${reference}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
        amount_due: body.monthlyRentAmount,
        amount_paid: 0,
        currency: "ZAR",
        due_date: body.dueDate,
        status: "unpaid"
      })
      .select()
      .single();

    if (invoiceError) {
      throw invoiceError;
    }

    return NextResponse.json({ lease, invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create lease and invoice" },
      { status: 500 }
    );
  }
}

