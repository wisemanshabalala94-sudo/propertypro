import { AdminStaffManager } from "@/components/admin-staff-manager";

export const metadata = {
  title: "Staff Management - Admin",
  description: "Manage staff members and payslips"
};

export const dynamic = "force-dynamic";

export default function AdminStaffPage() {
  return <AdminStaffManager />;
}
