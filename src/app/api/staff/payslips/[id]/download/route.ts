import { getServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

// Simple HTML to PDF-like text generation (since we can't use heavy PDF libraries in serverless)
async function generatePayslipPDF(payslipData: any, staffName: string) {
  // Create a styled HTML string that can be converted to PDF on the client
  // For production, you'd use a library like jsPDF or use an external PDF service
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payslip</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
        .container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .header h1 { margin: 0; color: #3b82f6; }
        .header p { margin: 5px 0; color: #666; }
        .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .details div { flex: 1; }
        .details label { font-weight: bold; color: #333; display: block; margin-bottom: 5px; }
        .details span { color: #666; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th { background-color: #f0f0f0; border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold; }
        .table td { border: 1px solid #ddd; padding: 10px; }
        .table tr:nth-child(even) { background-color: #f9f9f9; }
        .total-row { background-color: #e8f5e9; font-weight: bold; }
        .footer { text-align: center; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PAYSLIP</h1>
          <p>PropertyPro Ltd.</p>
        </div>
        
        <div class="details">
          <div>
            <label>Employee Name:</label>
            <span>${staffName}</span>
          </div>
          <div>
            <label>Payslip Number:</label>
            <span>${payslipData.payslip_number}</span>
          </div>
          <div>
            <label>Payment Date:</label>
            <span>${new Date(payslipData.payment_date).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div class="details">
          <div>
            <label>Pay Period Start:</label>
            <span>${new Date(payslipData.pay_period_start).toLocaleDateString()}</span>
          </div>
          <div>
            <label>Pay Period End:</label>
            <span>${new Date(payslipData.pay_period_end).toLocaleDateString()}</span>
          </div>
          <div>
            <label>Currency:</label>
            <span>${payslipData.currency}</span>
          </div>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gross Salary</td>
              <td>${payslipData.currency} ${payslipData.gross_amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total Deductions</td>
              <td>- ${payslipData.currency} ${payslipData.total_deductions.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>NET PAY</td>
              <td>${payslipData.currency} ${payslipData.net_amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>This is an electronically generated payslip. No signature is required.</p>
          <p>For queries, please contact HR Department</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <script>
        window.print();
      </script>
    </body>
    </html>
  `;

  return Buffer.from(html);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      .select(`
        id,
        profiles(full_name)
      `)
      .eq("profile_id", user.id)
      .single();

    if (!staffMember) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Get payslip
    const { data: payslip, error } = await supabase
      .from("payslips")
      .select("*")
      .eq("id", params.id)
      .eq("staff_member_id", staffMember.id)
      .single();

    if (error || !payslip) {
      return NextResponse.json(
        { error: "Payslip not found" },
        { status: 404 }
      );
    }

    const profile = Array.isArray(staffMember.profiles)
      ? staffMember.profiles[0]
      : staffMember.profiles;

    // Generate PDF
    const pdfBuffer = await generatePayslipPDF(payslip, profile?.full_name ?? "Staff Member");

    // Return as HTML file that can be printed
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${payslip.payslip_number}-payslip.html"`
      }
    });
  } catch (error) {
    console.error("Error generating payslip:", error);
    return NextResponse.json(
      { error: "Failed to generate payslip" },
      { status: 500 }
    );
  }
}
