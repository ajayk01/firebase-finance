
"use client"
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { Landmark, CreditCard } from "lucide-react";
import { useState, useMemo } from 'react';

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

// Master source of expense data
const masterExpenseData = [
  // January
  { month: "jan", category: "Office Lease", subCategory: "Monthly Rent", expense: "₹500.00" },
  { month: "jan", category: "Software", subCategory: "Project Management Tool", expense: "₹150.00" },
  // February
  { month: "feb", category: "Utilities", subCategory: "Internet Bill", expense: "₹70.00" },
  { month: "feb", category: "Travel", subCategory: "Client Meeting Commute", expense: "₹120.00" },
  { month: "feb", category: "Marketing", subCategory: "Online Ads Feb", expense: "₹300.00" },
  // March
  { month: "mar", category: "Office Supplies", subCategory: "Printer Ink & Paper", expense: "₹60.00" },
  { month: "mar", category: "Professional Dev", subCategory: "Online Course", expense: "₹200.00" },
  // April
  { month: "apr", category: "Utilities", subCategory: "Electricity", expense: "₹180.00" }, // Changed category
  // May
  { month: "may", category: "Marketing", subCategory: "Flyers", expense: "₹100.00" }, // Changed category
  // June
  { month: "jun", category: "Software", subCategory: "Antivirus", expense: "₹50.00" }, // Changed category
  // July
  { month: "jul", category: "Office Software", subCategory: "CRM Subscription", expense: "₹99.00" },
  { month: "jul", category: "Marketing", subCategory: "Social Media Ads", expense: "₹250.00" },
  { month: "jul", category: "Utilities", subCategory: "Electricity Bill", expense: "₹150.00" },
  { month: "jul", category: "Office Supplies", subCategory: "Stationery & Printing", expense: "₹45.00" },
  { month: "jul", category: "Travel", subCategory: "Client Visit Fuel", expense: "₹80.00" },
  { month: "jul", category: "Utilities", subCategory: "Internet Services", expense: "₹75.00" },
  { month: "jul", category: "Software Tools", subCategory: "Accounting Software", expense: "₹49.00" },
  { month: "jul", category: "Marketing", subCategory: "Content Creation Services", expense: "₹180.00" },
  { month: "jul", category: "Office Supplies", subCategory: "Coffee & Team Snacks", expense: "₹120.00" },
  { month: "jul", category: "Travel", subCategory: "Local Commute Reimbursement", expense: "₹50.00" },
  // August
  { month: "aug", category: "Team Event", subCategory: "Lunch", expense: "₹220.00" }, // Changed category
  // September
  { month: "sep", category: "Hardware", subCategory: "New Mouse", expense: "₹30.00" }, // Changed category
  // October
  { month: "oct", category: "Marketing", subCategory: "SEO Consultation", expense: "₹400.00" }, // Changed category
  // November
  { month: "nov", category: "Utilities", subCategory: "Water Bill", expense: "₹40.00" }, // Changed category
  // December
  { month: "dec", category: "Client Gifts", subCategory: "Holiday Gifts", expense: "₹350.00" }, // Changed category
];

const parseCurrency = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace('₹', '').replace(/,/g, ''));
};

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("jul");

  const currentMonthTableData = useMemo(() => {
    return masterExpenseData.filter(item => item.month === selectedMonth);
  }, [selectedMonth]);

  const currentMonthPieData = useMemo(() => {
    const monthlyExpenses = masterExpenseData.filter(item => item.month === selectedMonth);
    const aggregated: { [key: string]: number } = {};
    monthlyExpenses.forEach(item => {
      const value = parseCurrency(item.expense);
      if (aggregated[item.category]) {
        aggregated[item.category] += value;
      } else {
        aggregated[item.category] = value;
      }
    });
    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }, [selectedMonth]);

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
                      currentBalanceText="Current Balance : ₹60,0000"
                    />
                    <StatCard
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : ₹60,0000"
                    />
                    <StatCard
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : ₹60,0000"
                    />
                    <StatCard
                      logoIcon={Landmark}
                      bankName="Global Trust Bank"
                      currentBalanceText="Current Balance : ₹60,0000"
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

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Monthly Expenses Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ExpenseBreakdownTable
                    title="Expense Breakdown"
                    selectedMonth={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    months={months}
                    data={currentMonthTableData}
                  />
                </div>
                <div>
                  <ExpensePieChart data={currentMonthPieData} />
                </div>
              </div>
            </div>

            <div>
              <ExpenseBreakdownTable title="Credit card transaction details" 
                data={masterExpenseData.filter(item => item.month === "jul")} // Default to July for this table or pass relevant data
              />
            </div>

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
