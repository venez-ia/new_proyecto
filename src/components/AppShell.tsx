import type { ReactNode } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ReportNav from "@/components/ReportNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <DashboardHeader />
      <ReportNav />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
