"use client";

import { useEffect, useState } from "react";

type StaffMember = {
  id: string;
  profiles: { full_name: string; email: string };
  job_title: string;
  salary_amount: number;
  employment_status: string;
};

type Payslip = {
  id: string;
  payslip_number: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_amount: number;
  net_amount: number;
  status: string;
};

export function AdminStaffManager() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewStaffForm, setShowNewStaffForm] = useState(false);
  const [showPayslipForm, setShowPayslipForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
    salaryAmount: "",
    department: ""
  });
  const [payslipData, setPayslipData] = useState({
    staffMemberId: "",
    payPeriodStart: "",
    payPeriodEnd: "",
    paymentDate: "",
    grossAmount: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const staffResponse = await fetch("/api/admin/staff");
        const payslipsResponse = await fetch("/api/admin/payslips");

        if (staffResponse.ok) {
          const staff = await staffResponse.json();
          setStaffMembers(staff);
        }
        if (payslipsResponse.ok) {
          const slips = await payslipsResponse.json();
          setPayslips(slips);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff)
      });

      if (response.ok) {
        const staff = await response.json();
        setStaffMembers([...staffMembers, staff]);
        setNewStaff({
          fullName: "",
          email: "",
          jobTitle: "",
          salaryAmount: "",
          department: ""
        });
        setShowNewStaffForm(false);
        alert("Staff member added successfully!");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff member");
    }
  };

  const handleCreatePayslip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/payslips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payslipData)
      });

      if (response.ok) {
        const payslip = await response.json();
        setPayslips([payslip, ...payslips]);
        setPayslipData({
          staffMemberId: "",
          payPeriodStart: "",
          payPeriodEnd: "",
          paymentDate: "",
          grossAmount: ""
        });
        setShowPayslipForm(false);
        alert("Payslip created successfully!");
      }
    } catch (error) {
      console.error("Error creating payslip:", error);
      alert("Failed to create payslip");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-slate-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Staff Management</h1>
          <p className="text-slate-600">Manage staff, salaries, and payslips</p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => setShowNewStaffForm(!showNewStaffForm)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            + Add Staff Member
          </button>
          <button
            onClick={() => setShowPayslipForm(!showPayslipForm)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            + Create Payslip
          </button>
        </div>

        {/* Forms */}
        {showNewStaffForm && (
          <form onSubmit={handleAddStaff} className="bg-white rounded-2xl p-8 mb-12 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Staff Member</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Full Name"
                value={newStaff.fullName}
                onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Job Title"
                value={newStaff.jobTitle}
                onChange={(e) => setNewStaff({ ...newStaff, jobTitle: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={newStaff.department}
                onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
              />
              <input
                type="number"
                placeholder="Monthly Salary"
                value={newStaff.salaryAmount}
                onChange={(e) => setNewStaff({ ...newStaff, salaryAmount: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Add Staff
              </button>
              <button
                type="button"
                onClick={() => setShowNewStaffForm(false)}
                className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {showPayslipForm && (
          <form onSubmit={handleCreatePayslip} className="bg-white rounded-2xl p-8 mb-12 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Payslip</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <select
                value={payslipData.staffMemberId}
                onChange={(e) => setPayslipData({ ...payslipData, staffMemberId: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              >
                <option value="">Select Staff Member</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.profiles?.full_name} - {staff.job_title}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={payslipData.payPeriodStart}
                onChange={(e) => setPayslipData({ ...payslipData, payPeriodStart: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
              <input
                type="date"
                value={payslipData.payPeriodEnd}
                onChange={(e) => setPayslipData({ ...payslipData, payPeriodEnd: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
              <input
                type="date"
                value={payslipData.paymentDate}
                onChange={(e) => setPayslipData({ ...payslipData, paymentDate: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
              <input
                type="number"
                placeholder="Gross Amount"
                value={payslipData.grossAmount}
                onChange={(e) => setPayslipData({ ...payslipData, grossAmount: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-900"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Create Payslip
              </button>
              <button
                type="button"
                onClick={() => setShowPayslipForm(false)}
                className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Staff Members List */}
        <div className="bg-white rounded-2xl p-8 mb-12 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Staff Members ({staffMembers.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Name</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Position</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Department</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Salary</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="border-b border-slate-200 hover:bg-blue-50">
                    <td className="py-4 px-4 text-slate-900">{staff.profiles?.full_name}</td>
                    <td className="py-4 px-4 text-slate-700">{staff.job_title}</td>
                    <td className="py-4 px-4 text-slate-700">-</td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">ZAR {staff.salary_amount.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        staff.employment_status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {staff.employment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payslips List */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Payslips ({payslips.length})</h2>
          <div className="space-y-4">
            {payslips.length === 0 ? (
              <p className="text-slate-600 py-8">No payslips created yet</p>
            ) : (
              payslips.map((payslip) => (
                <div key={payslip.id} className="p-4 rounded-lg border border-slate-200 hover:border-blue-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{payslip.payslip_number}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(payslip.pay_period_start).toLocaleDateString()} - {new Date(payslip.pay_period_end).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">ZAR {payslip.gross_amount.toFixed(2)}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        payslip.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {payslip.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
