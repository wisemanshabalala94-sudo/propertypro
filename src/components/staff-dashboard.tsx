"use client";

import { useEffect, useState } from "react";
import { SalaryOverviewCard } from "./salary-overview-card";
import { PayslipList } from "./payslip-list";
import { SalaryChart } from "./salary-chart";
import { LeaveManagement } from "./leave-management";
import { RecentPayments } from "./recent-payments";

type StaffData = {
  id: string;
  full_name: string;
  job_title: string;
  salary_amount: number;
  currency: string;
  employment_status: string;
};

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

export function StaffDashboard() {
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStaffData() {
      try {
        const response = await fetch("/api/staff/me");
        if (!response.ok) throw new Error("Failed to load staff data");
        
        const data = await response.json();
        setStaffData(data);

        // Load payslips
        const payslipsResponse = await fetch("/api/staff/payslips");
        if (payslipsResponse.ok) {
          const payslipsData = await payslipsResponse.json();
          setPayslips(payslipsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadStaffData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl bg-white p-8 border border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Staff Portal</h1>
          <p className="text-blue-100 text-lg">
            Welcome back, {staffData?.full_name || "Staff Member"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Top Section - Salary Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <SalaryOverviewCard staffData={staffData} />
          <RecentPayments payslips={payslips.slice(0, 3)} />
        </div>

        {/* Middle Section - Charts and Leave */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <SalaryChart payslips={payslips} />
          </div>
          <LeaveManagement />
        </div>

        {/* Bottom Section - Payslips */}
        <PayslipList payslips={payslips} />
      </div>
    </div>
  );
}
