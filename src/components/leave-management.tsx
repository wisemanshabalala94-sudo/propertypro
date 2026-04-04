"use client";

import { useState } from "react";

export function LeaveManagement() {
  const [showForm, setShowForm] = useState(false);
  const [leaveData, setLeaveData] = useState({
    leaveType: "annual",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const leaveTypes = [
    { value: "annual", label: "Annual Leave", available: 15 },
    { value: "sick", label: "Sick Leave", available: 10 },
    { value: "personal", label: "Personal Leave", available: 5 },
    { value: "bereavement", label: "Bereavement Leave", available: 5 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/staff/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveData)
      });
      
      if (response.ok) {
        setShowForm(false);
        setLeaveData({ leaveType: "annual", startDate: "", endDate: "", reason: "" });
        alert("Leave request submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request");
    }
  };

  const selectedLeaveType = leaveTypes.find(lt => lt.value === leaveData.leaveType);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 h-fit">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Leave Management</h3>

      {/* Leave Balance */}
      <div className="space-y-3 mb-8">
        {leaveTypes.map((leave) => (
          <div key={leave.value} className="p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">{leave.label}</span>
              <span className="text-sm font-bold text-blue-600">{leave.available} days</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-600"
                style={{ width: `${(leave.available / 20) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Leave Request Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
      >
        {showForm ? "Cancel Request" : "Request Leave"}
      </button>

      {/* Leave Request Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Leave Type
            </label>
            <select
              value={leaveData.leaveType}
              onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {leaveTypes.map((leave) => (
                <option key={leave.value} value={leave.value}>
                  {leave.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                From
              </label>
              <input
                type="date"
                value={leaveData.startDate}
                onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                To
              </label>
              <input
                type="date"
                value={leaveData.endDate}
                onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Reason
            </label>
            <textarea
              value={leaveData.reason}
              onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 resize-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
