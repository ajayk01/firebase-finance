
"use client"
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";

import { Wallet, Receipt, Coins, CreditCard, Activity, Users, DollarSign } from "lucide-react";

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
            {/* Parent container for the two stat card groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* First group of StatCards */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Bank Details</h2>
                <div className="bg-muted p-4 rounded-lg shadow-md">
                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                      title="Total Revenue"
                      value="$689"
                      percentageChange={5}
                      Icon={Wallet}
                      isPrimary={true}
                      dataAiHint="revenue report"
                    />
                    <StatCard
                      title="Total Expenses"
                      value="$460"
                      percentageChange={-5}
                      Icon={Receipt}
                      dataAiHint="expense chart"
                    />
                    <StatCard
                      title="New Profit"
                      value="$840"
                      percentageChange={7}
                      Icon={Coins}
                      dataAiHint="profit graph"
                    />
                    <StatCard
                      title="Cash Balance"
                      value="$568"
                      percentageChange={2}
                      Icon={CreditCard}
                      dataAiHint="bank account"
                    />
                  </div>
                </div>
              </div>

              {/* Second group of StatCards */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Credit card details</h2>
                <div className="bg-muted p-4 rounded-lg shadow-md">
                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                      title="Active Users"
                      value="1,250"
                      percentageChange={12}
                      Icon={Users}
                      dataAiHint="user statistics"
                    />
                    <StatCard
                      title="Pending Orders"
                      value="78"
                      percentageChange={-3}
                      Icon={Activity}
                      dataAiHint="order status"
                    />
                    <StatCard
                      title="Sales Today"
                      value="$1,200"
                      percentageChange={15}
                      Icon={DollarSign}
                      dataAiHint="daily sales"
                    />
                    <StatCard
                      title="New Subscriptions"
                      value="45"
                      percentageChange={8}
                      Icon={CreditCard}
                      dataAiHint="subscription growth"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ExpenseBreakdownTable title="Bank Details" />
                <ExpenseBreakdownTable title="Credit card details" />
              </div>
              <div>
                <ExpensePieChart />
              </div>
            </div>

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
