"use client";

import { useState } from "react";

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

export function PayslipList({ payslips }: { payslips: Payslip[] }) {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR"
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const downloadPayslip = async (payslip: Payslip) => {
    setDownloading(payslip.id);
    try {
      const response = await fetch(`/api/staff/payslips/${payslip.id}/download`);
      if (!response.ok) throw new Error("Failed to download payslip");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${payslip.payslip_number}-payslip.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download payslip. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "processed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Payslip History</h2>
        <p className="text-slate-600">Download and review your payslips</p>
      </div>

      {/* Payslips Grid */}
      {payslips.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600 text-lg">No payslips available yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payslips.map((payslip) => (
            <div
              key={payslip.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Section - Details */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          {payslip.payslip_number}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payslip.status)}`}>
                          {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        {formatDate(payslip.pay_period_start)} – {formatDate(payslip.pay_period_end)}
                      </p>
                      
                      {/* Salary Breakdown */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Gross</p>
                          <p className="text-xl font-bold text-slate-900">
                            {formatCurrency(payslip.gross_amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Deductions</p>
                          <p className="text-xl font-bold text-red-600">
                            -{formatCurrency(payslip.total_deductions)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Net Pay</p>
                          <p className="text-xl font-bold text-emerald-600">
                            {formatCurrency(payslip.net_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex flex-col gap-2 md:ml-4">
                  <button
                    onClick={() => setSelectedPayslip(payslip)}
                    className="px-6 py-2 rounded-full border border-blue-300 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => downloadPayslip(payslip)}
                    disabled={downloading === payslip.id}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50"
                  >
                    {downloading === payslip.id ? "Downloading..." : "Download PDF"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payslip Detail Modal */}
      {selectedPayslip && (
        <PayslipDetailModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          onDownload={() => downloadPayslip(selectedPayslip)}
        />
      )}
    </div>
  );
}

function PayslipDetailModal({
  payslip,
  onClose,
  onDownload
}: {
  payslip: Payslip;
  onClose: () => void;
  onDownload: () => void;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR"
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">{payslip.payslip_number}</h2>
              <p className="text-blue-100 mt-2">
                {formatDate(payslip.pay_period_start)} to {formatDate(payslip.pay_period_end)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl hover:rotate-90 transition-transform"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 max-h-96 overflow-y-auto">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Gross Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(payslip.gross_amount)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Total Deductions</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(payslip.total_deductions)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Net Pay</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(payslip.net_amount)}
              </p>
            </div>
          </div>

          {/* Deduction Details (Sample) */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Deductions Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Tax Deduction</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(payslip.total_deductions * 0.6)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Insurance</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(payslip.total_deductions * 0.3)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Pension</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(payslip.total_deductions * 0.1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-8 py-6 flex gap-4 justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
