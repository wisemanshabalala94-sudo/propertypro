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

export function SalaryChart({ payslips }: { payslips: Payslip[] }) {
  if (payslips.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-slate-600">No data available for chart</p>
      </div>
    );
  }

  // Get last 6 payslips for chart
  const chartData = payslips.slice(0, 6).reverse();
  const maxAmount = Math.max(...chartData.map(p => p.net_amount));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatMonthYear = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      month: "short",
      year: "2-digit"
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Net Pay Trend</h3>

      <div className="space-y-8">
        {/* Chart Bars */}
        <div className="space-y-4">
          {chartData.map((payslip) => (
            <div key={payslip.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">
                  {formatMonthYear(payslip.pay_period_start)}
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {formatCurrency(payslip.net_amount)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${(payslip.net_amount / maxAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Average</p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(
                chartData.reduce((sum, p) => sum + p.net_amount, 0) / chartData.length
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Highest</p>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(Math.max(...chartData.map(p => p.net_amount)))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Lowest</p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(Math.min(...chartData.map(p => p.net_amount)))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
