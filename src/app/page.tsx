
"use client"
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { Landmark, CreditCard } from "lucide-react";
import { useState, useMemo } from 'react';

const monthOptions = [
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
  // January 2024
  { year: 2024, month: "jan", category: "Office Lease", subCategory: "Monthly Rent", expense: "₹500.00" },
  { year: 2024, month: "jan", category: "Software", subCategory: "Project Management Tool", expense: "₹150.00" },
  // February 2024
  { year: 2024, month: "feb", category: "Utilities", subCategory: "Internet Bill", expense: "₹70.00" },
  { year: 2024, month: "feb", category: "Travel", subCategory: "Client Meeting Commute", expense: "₹120.00" },
  { year: 2024, month: "feb", category: "Marketing", subCategory: "Online Ads Feb", expense: "₹300.00" },
  // March 2024
  { year: 2024, month: "mar", category: "Office Supplies", subCategory: "Printer Ink & Paper", expense: "₹60.00" },
  { year: 2024, month: "mar", category: "Professional Dev", subCategory: "Online Course", expense: "₹200.00" },
  // April 2024
  { year: 2024, month: "apr", category: "Utilities", subCategory: "Electricity", expense: "₹180.00" },
  // May 2024
  { year: 2024, month: "may", category: "Marketing", subCategory: "Flyers", expense: "₹100.00" },
  // June 2024
  { year: 2024, month: "jun", category: "Software", subCategory: "Antivirus", expense: "₹50.00" },
  // July 2024
  { year: 2024, month: "jul", category: "Office Software", subCategory: "CRM Subscription", expense: "₹99.00" },
  { year: 2024, month: "jul", category: "Marketing", subCategory: "Social Media Ads", expense: "₹250.00" },
  { year: 2024, month: "jul", category: "Utilities", subCategory: "Electricity Bill", expense: "₹150.00" },
  { year: 2024, month: "jul", category: "Office Supplies", subCategory: "Stationery & Printing", expense: "₹45.00" },
  { year: 2024, month: "jul", category: "Travel", subCategory: "Client Visit Fuel", expense: "₹80.00" },
  { year: 2024, month: "jul", category: "Utilities", subCategory: "Internet Services", expense: "₹75.00" },
  { year: 2024, month: "jul", category: "Software Tools", subCategory: "Accounting Software", expense: "₹49.00" },
  { year: 2024, month: "jul", category: "Marketing", subCategory: "Content Creation Services", expense: "₹180.00" },
  { year: 2024, month: "jul", category: "Office Supplies", subCategory: "Coffee & Team Snacks", expense: "₹120.00" },
  { year: 2024, month: "jul", category: "Travel", subCategory: "Local Commute Reimbursement", expense: "₹50.00" },
  // August 2024
  { year: 2024, month: "aug", category: "Team Event", subCategory: "Lunch", expense: "₹220.00" },
  // September 2024
  { year: 2024, month: "sep", category: "Hardware", subCategory: "New Mouse", expense: "₹30.00" },
  // October 2024
  { year: 2024, month: "oct", category: "Marketing", subCategory: "SEO Consultation", expense: "₹400.00" },
  // November 2024
  { year: 2024, month: "nov", category: "Utilities", subCategory: "Water Bill", expense: "₹40.00" },
  // December 2024
  { year: 2024, month: "dec", category: "Client Gifts", subCategory: "Holiday Gifts", expense: "₹350.00" },

  // July 2023 Data
  { year: 2023, month: "jul", category: "Office Software", subCategory: "CRM Subscription", expense: "₹89.00" },
  { year: 2023, month: "jul", category: "Marketing", subCategory: "Social Media Ads", expense: "₹200.00" },
  { year: 2023, month: "jul", category: "Utilities", subCategory: "Old Electricity Bill", expense: "₹130.00" },
  // August 2023 Data
  { year: 2023, month: "aug", category: "Travel", subCategory: "Old Client Visit", expense: "₹100.00" },
  { year: 2023, month: "aug", category: "Office Supplies", subCategory: "Old Stationery", expense: "₹30.00" },
];

const parseCurrency = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace('₹', '').replace(/,/g, ''));
};

const getAvailableYears = () => {
  const uniqueYears = Array.from(new Set(masterExpenseData.map(item => item.year)))
    .sort((a, b) => b - a); // Sort descending
  return uniqueYears.map(year => ({ value: year, label: year.toString() }));
};

export default function DashboardPage() {
  const availableYears = useMemo(() => getAvailableYears(), []);
  const [selectedMonth, setSelectedMonth] = useState<string>("jul");
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]?.value || new Date().getFullYear());


  const currentMonthTableData = useMemo(() => {
    return masterExpenseData.filter(item => item.month === selectedMonth && item.year === selectedYear);
  }, [selectedMonth, selectedYear]);

  const currentMonthPieData = useMemo(() => {
    const monthlyExpenses = masterExpenseData.filter(item => item.month === selectedMonth && item.year === selectedYear);
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
  }, [selectedMonth, selectedYear]);

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
                    months={monthOptions}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    years={availableYears}
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
                data={masterExpenseData.filter(item => item.month === "jul" && item.year === 2024)} // Default to July 2024 or pass relevant data
              />
            </div>

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
