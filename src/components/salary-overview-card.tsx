"use client";

type StaffData = {
  id: string;
  full_name: string;
  job_title: string;
  salary_amount: number;
  currency: string;
  employment_status: string;
};

export function SalaryOverviewCard({ staffData }: { staffData: StaffData | null }) {
  if (!staffData) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency || "ZAR"
    }).format(amount);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-600 opacity-90" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22><path fill=%22rgba(255,255,255,0.1)%22 d=%22M0,96L120,112C240,128,480,160,720,160C960,160,1200,128,1320,112L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z%22></path></svg>')] bg-cover" />
      
      {/* Content */}
      <div className="relative p-8 md:p-10 text-white">
        {/* Header */}
        <div className="mb-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            Your Salary Information
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{staffData.full_name}</h2>
          <p className="text-blue-100 mt-1">{staffData.job_title}</p>
        </div>

        {/* Salary Display */}
        <div className="mb-8">
          <p className="text-blue-100 text-sm mb-2">Monthly Salary</p>
          <p className="text-5xl md:text-6xl font-bold mb-2">
            {formatCurrency(staffData.salary_amount, staffData.currency)}
          </p>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            staffData.employment_status === 'active' 
              ? 'bg-emerald-400/30 text-emerald-100' 
              : 'bg-red-400/30 text-red-100'
          }`}>
            {staffData.employment_status === 'active' ? '✓ Active' : 'Inactive'}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/20">
          <div>
            <p className="text-blue-100 text-sm mb-1">Annual Salary</p>
            <p className="text-lg font-bold">
              {formatCurrency(staffData.salary_amount * 12, staffData.currency)}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Currency</p>
            <p className="text-lg font-bold">{staffData.currency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
