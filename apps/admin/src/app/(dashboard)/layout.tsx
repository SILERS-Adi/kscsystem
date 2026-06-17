import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <div className="pl-64">
        <AdminTopbar name={session?.name || session?.email || "Administrator"} role={session?.role ?? ""} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
