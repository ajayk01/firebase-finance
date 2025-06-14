
"use client"
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { Landmark, CreditCard } from "lucide-react";
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const months = [
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "mar", label: "March" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
  { value: "jun", label: "June" },
  { value: "jul", label: "July" },
  { value: "aug", label: "August" },
  { value: "sep", label: "September" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
];

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("jul");

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
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : 60,0000"
                    />
                    <StatCard
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : 60,0000"
                    />
                    <StatCard
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : 60,0000"
                    />
                    <StatCard
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : 60,0000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Credit card details</h2>
                <div className="bg-muted p-4 rounded-lg shadow-md">
                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                      creditCardLogoIcon={CreditCard}
                      creditCardName="Visa Platinum"
                      usedAmountText="Used : 15,000"
                      totalLimitText="Total Limit : 75,000"
                    />
                    <StatCard
                      creditCardLogoIcon={CreditCard}
                      creditCardName="Mastercard Gold"
                      usedAmountText="Used : 22,500"
                      totalLimitText="Total Limit : 1,00,000"
                    />
                    <StatCard
                      creditCardLogoIcon={CreditCard}
                      creditCardName="Amex Rewards"
                      usedAmountText="Used : 8,200"
                      totalLimitText="Total Limit : 50,000"
                    />
                    <StatCard
                      creditCardLogoIcon={CreditCard}
                      creditCardName="Discover It"
                      usedAmountText="Used : 31,000"
                      totalLimitText="Total Limit : 1,20,000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div> {/* Expenses Section Wrapper */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Expenses - {months.find(m => m.value === selectedMonth)?.label || 'Select Month'}
                </h2>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ExpenseBreakdownTable title="Breakdown" />
                </div>
                <div>
                  <ExpensePieChart />
                </div>
              </div>
            </div>

            <div>
              <ExpenseBreakdownTable title="Credit card details" />
            </div>

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
