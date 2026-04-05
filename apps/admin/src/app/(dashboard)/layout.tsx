import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <div className="pl-64">
        <AdminTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
