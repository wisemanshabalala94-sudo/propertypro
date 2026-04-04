"use client";

type Payslip = {
  id: string;
  payslip_number: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_amount: number;
  total_deductions: number;
  net_amount: number;
  status: string;
  created_at: string;
};

export function RecentPayments({ payslips }: { payslips: Payslip[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR"
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      month: "short",
      day: "numeric"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return "✓";
      case "processed":
        return "⏳";
      case "pending":
        return "◯";
      default:
        return "✕";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-emerald-600";
      case "processed":
        return "text-blue-600";
      case "pending":
        return "text-amber-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 h-fit">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Payments</h3>

      <div className="space-y-4">
        {payslips.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No payments yet</p>
        ) : (
          payslips.map((payslip) => (
            <div
              key={payslip.id}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-blue-50 hover:to-emerald-50 transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl ${getStatusColor(payslip.status)}`}>
                    {getStatusIcon(payslip.status)}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {payslip.payslip_number}
                    </p>
                    <p className="text-xs text-slate-600">
                      {formatDate(payslip.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600">
                  {formatCurrency(payslip.net_amount)}
                </p>
                <p className="text-xs text-slate-600 capitalize">
                  {payslip.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <button className="w-full py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-all">
          View All Payments
        </button>
      </div>
    </div>
  );
}
