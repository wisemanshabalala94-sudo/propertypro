import { StaffDashboard } from "@/components/staff-dashboard";

export const metadata = {
  title: "Staff Dashboard - PropertyPro",
  description: "Track your salary, payslips, and leave requests"
};

export const dynamic = "force-dynamic";

export default function StaffDashboardPage() {
  return <StaffDashboard />;
}
