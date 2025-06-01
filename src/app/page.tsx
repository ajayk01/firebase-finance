
"use client"
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { Landmark } from "lucide-react";

export default function DashboardPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" variant="sidebar" side="left">
          <DashboardSidebarContent />
        </Sidebar>
        <SidebarInset className="flex flex-col !p-0">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Bank Details</h2>
                <div className="bg-muted p-4 rounded-lg shadow-md">
                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                      isPrimary={true}
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : 60,0000"
                    />
                    <StatCard />
                    <StatCard />
                    <StatCard />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Credit card details</h2>
                <div className="bg-muted p-4 rounded-lg shadow-md">
                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard />
                    <StatCard />
                    <StatCard />
                    <StatCard />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-6 lg:col-span-2">
                <ExpenseBreakdownTable title="Bank Details" />
                <ExpenseBreakdownTable title="Credit card details" />
              </div>
              <div className="lg:col-span-1">
                <ExpensePieChart />
              </div>
            </div>

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
