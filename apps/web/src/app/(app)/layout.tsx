import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <AppSidebar />
      <div className="pl-64">
        <AppTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
