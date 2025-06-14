
"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { MonthlySummaryChart } from "@/components/dashboard/monthly-summary-chart";
import { MonthlyMoneyTable, type FinancialSnapshotItem } from "@/components/dashboard/monthly-money-table";
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

const masterIncomeData = [
  // July 2024 Income
  { year: 2024, month: "jul", category: "Client Project Alpha", subCategory: "Milestone 1 Payment", expense: "₹12000.00" },
  { year: 2024, month: "jul", category: "Consulting Services", subCategory: "Hourly Rate - Client X", expense: "₹7500.00" },
  { year: 2024, month: "jul", category: "Product Sales", subCategory: "Software License", expense: "₹3000.00" },
  { year: 2024, month: "jul", category: "Client Project Alpha", subCategory: "Milestone 2 Payment", expense: "₹15000.00" },
  // June 2024 Income
  { year: 2024, month: "jun", category: "Consulting Services", subCategory: "Retainer - Client Y", expense: "₹10000.00" },
  { year: 2024, month: "jun", category: "Product Sales", subCategory: "Ebook Sales", expense: "₹500.00" },
  { year: 2024, month: "jun", category: "Client Project Beta", subCategory: "Initial Payment", expense: "₹18000.00" },
  // May 2024 Income
  { year: 2024, month: "may", category: "Client Project Gamma", subCategory: "Phase 1", expense: "₹22000.00" },
  // August 2024
  { year: 2024, month: "aug", category: "Product Sales", subCategory: "Online Course", expense: "₹4500.00" },
  // January 2023 Income
  { year: 2023, month: "jan", category: "Old Project Delta", subCategory: "Phase 1", expense: "₹5000.00" },
  // July 2023 Income
  { year: 2023, month: "jul", category: "Old Project Omega", subCategory: "Final Settlement", expense: "₹8000.00" },
  { year: 2023, month: "jul", category: "Consulting Services", subCategory: "Old Client Z", expense: "₹6000.00" },
];

const masterInvestmentData = [
  // July 2024 Investments
  { year: 2024, month: "jul", category: "Stocks", subCategory: "Tech Stocks ETF", expense: "₹5000.00" },
  { year: 2024, month: "jul", category: "Mutual Funds", subCategory: "Balanced Fund", expense: "₹3000.00" },
  { year: 2024, month: "jul", category: "Real Estate", subCategory: "REIT Investment", expense: "₹10000.00" },
  // June 2024 Investments
  { year: 2024, month: "jun", category: "Stocks", subCategory: "Blue Chip Stocks", expense: "₹7000.00" },
  { year: 2024, month: "jun", category: "Bonds", subCategory: "Government Bonds", expense: "₹4000.00" },
  // August 2024
  { year: 2024, month: "aug", category: "Crypto", subCategory: "Ethereum", expense: "₹2500.00" },
  // January 2023 Investments
  { year: 2023, month: "jan", category: "Gold", subCategory: "SGB", expense: "₹1000.00" },
  // July 2023 Investments
  { year: 2023, month: "jul", category: "Mutual Funds", subCategory: "Index Fund", expense: "₹2500.00" },
  { year: 2023, month: "jul", category: "Stocks", subCategory: "Pharma Stock", expense: "₹6000.00" },
  // August 2023
  { year: 2023, month: "aug", category: "Crypto", subCategory: "Bitcoin", expense: "₹1500.00" },
];

const bankAccountDetails = [
  { id: 'bank1', name: "Global Trust Bank (Savings)", balance: 600000, icon: Landmark },
  { id: 'bank2', name: "Global Trust Bank (Current)", balance: 125000, icon: Landmark },
  { id: 'bank3', name: "City Commercial Bank", balance: 350000, icon: Landmark },
  { id: 'bank4', name: "National Cooperative", balance: 85000, icon: Landmark },
];


const parseCurrency = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace('₹', '').replace(/,/g, ''));
};

const getAvailableYears = (data: Array<{year: number, month: string, category: string, subCategory?: string, expense: string }>) => {
  const uniqueYears = Array.from(new Set(data.map(item => item.year)))
    .sort((a, b) => b - a);
  return uniqueYears.map(year => ({ value: year, label: year.toString() }));
};

export default function DashboardPage() {
  // Expense States
  const availableExpenseYears = useMemo(() => getAvailableYears(masterExpenseData), []);
  const [selectedExpenseMonth, setSelectedExpenseMonth] = useState<string>("jul");
  const [selectedExpenseYear, setSelectedExpenseYear] = useState<number>(availableExpenseYears[0]?.value || new Date().getFullYear());

  // Income States
  const availableIncomeYears = useMemo(() => getAvailableYears(masterIncomeData), []);
  const [selectedIncomeMonth, setSelectedIncomeMonth] = useState<string>("jul");
  const [selectedIncomeYear, setSelectedIncomeYear] = useState<number>(availableIncomeYears[0]?.value || new Date().getFullYear());

  // Investment States
  const availableInvestmentYears = useMemo(() => getAvailableYears(masterInvestmentData), []);
  const [selectedInvestmentMonth, setSelectedInvestmentMonth] = useState<string>("jul");
  const [selectedInvestmentYear, setSelectedInvestmentYear] = useState<number>(availableInvestmentYears[0]?.value || new Date().getFullYear());

  // Summary Chart & Table States
  const allYearsFromAllData = useMemo(() => [
    ...new Set([
      ...masterExpenseData.map(d => d.year),
      ...masterIncomeData.map(d => d.year),
      ...masterInvestmentData.map(d => d.year),
    ])
  ].sort((a,b) => b - a), []);
  const availableSummaryYears = useMemo(() => allYearsFromAllData.map(year => ({ value: year, label: year.toString() })), [allYearsFromAllData]);
  const [selectedSummaryYear, setSelectedSummaryYear] = useState<number>(availableSummaryYears[0]?.value || new Date().getFullYear());
  const [selectedSummaryDetailMonth, setSelectedSummaryDetailMonth] = useState<string>("jul");


  // Expense Data Processing
  const currentMonthExpenseTableData = useMemo(() => {
    return masterExpenseData.filter(item => item.month === selectedExpenseMonth && item.year === selectedExpenseYear);
  }, [selectedExpenseMonth, selectedExpenseYear]);

  const currentMonthExpensePieData = useMemo(() => {
    const monthlyExpenses = masterExpenseData.filter(item => item.month === selectedExpenseMonth && item.year === selectedExpenseYear);
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
  }, [selectedExpenseMonth, selectedExpenseYear]);

  // Income Data Processing
  const currentMonthIncomeTableData = useMemo(() => {
    return masterIncomeData.filter(item => item.month === selectedIncomeMonth && item.year === selectedIncomeYear);
  }, [selectedIncomeMonth, selectedIncomeYear]);

  const currentMonthIncomePieData = useMemo(() => {
    const monthlyIncome = masterIncomeData.filter(item => item.month === selectedIncomeMonth && item.year === selectedIncomeYear);
    const aggregated: { [key: string]: number } = {};
    monthlyIncome.forEach(item => {
      const value = parseCurrency(item.expense);
      if (aggregated[item.category]) {
        aggregated[item.category] += value;
      } else {
        aggregated[item.category] = value;
      }
    });
    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }, [selectedIncomeMonth, selectedIncomeYear]);

  // Investment Data Processing
  const currentMonthInvestmentTableData = useMemo(() => {
    return masterInvestmentData.filter(item => item.month === selectedInvestmentMonth && item.year === selectedInvestmentYear);
  }, [selectedInvestmentMonth, selectedInvestmentYear]);

  const currentMonthInvestmentPieData = useMemo(() => {
    const monthlyInvestment = masterInvestmentData.filter(item => item.month === selectedInvestmentMonth && item.year === selectedInvestmentYear);
    const aggregated: { [key: string]: number } = {};
    monthlyInvestment.forEach(item => {
      const value = parseCurrency(item.expense);
      if (aggregated[item.category]) {
        aggregated[item.category] += value;
      } else {
        aggregated[item.category] = value;
      }
    });
    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }, [selectedInvestmentMonth, selectedInvestmentYear]);

  // Data for Monthly Summary Chart (12 months)
  const monthlySummaryChartData = useMemo(() => {
    return monthOptions.map(monthObj => {
      const month = monthObj.value;

      const totalExpense = masterExpenseData
        .filter(item => item.month === month && item.year === selectedSummaryYear)
        .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

      const totalIncome = masterIncomeData
        .filter(item => item.month === month && item.year === selectedSummaryYear)
        .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

      const totalInvestment = masterInvestmentData
        .filter(item => item.month === month && item.year === selectedSummaryYear)
        .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

      return {
        month: monthObj.label.substring(0, 3), // Short month name for chart
        expense: totalExpense,
        income: totalIncome,
        investment: totalInvestment,
      };
    });
  }, [selectedSummaryYear]);


  // Data for Selected Month Financial Snapshot Table
  const financialSnapshotTableData = useMemo(() => {
    const expenseForSelectedMonth = masterExpenseData
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const incomeForSelectedMonth = masterIncomeData
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const investmentForSelectedMonth = masterInvestmentData
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const totalBankBalance = bankAccountDetails.reduce((sum, acc) => sum + acc.balance, 0);

    const netFlows = incomeForSelectedMonth - expenseForSelectedMonth - investmentForSelectedMonth;
    
    let netFlowsColorClass = "text-foreground"; // Default
    if (netFlows > 0) {
      netFlowsColorClass = "text-green-600";
    } else if (netFlows < 0) {
      netFlowsColorClass = "text-red-600";
    }

    return [
      { category: "Total Expense", amount: expenseForSelectedMonth, colorClassName: "text-red-600 font-medium" },
      { category: "Total Income", amount: incomeForSelectedMonth, colorClassName: "text-green-600 font-medium" },
      { category: "Total Investment", amount: investmentForSelectedMonth, colorClassName: "text-primary font-medium" },
      { category: "Total Bank Balance", amount: totalBankBalance, colorClassName: "text-foreground font-medium" },
      { category: "Total Netflows", amount: netFlows, colorClassName: `${netFlowsColorClass} font-medium` },
    ] as FinancialSnapshotItem[];
  }, [selectedSummaryDetailMonth, selectedSummaryYear]);


  return (
    <div className="flex flex-col min-h-screen w-full">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Bank Details</h2>
            <div className="bg-muted p-4 rounded-lg shadow-md">
              <div className="grid gap-4 md:grid-cols-2">
                {bankAccountDetails.map((account) => (
                  <StatCard
                    key={account.id}
                    logoIcon={account.icon}
                    bankName={account.name}
                    currentBalanceText={`Current Balance : ${account.balance.toLocaleString('en-IN')}`}
                  />
                ))}
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
                selectedMonth={selectedExpenseMonth}
                onMonthChange={setSelectedExpenseMonth}
                months={monthOptions}
                selectedYear={selectedExpenseYear}
                onYearChange={setSelectedExpenseYear}
                years={availableExpenseYears}
                data={currentMonthExpenseTableData}
              />
            </div>
            <div>
              <ExpensePieChart
                data={currentMonthExpensePieData}
                chartTitle="Selected Month Expense"
                chartDescription="Breakdown By Category"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Income Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ExpenseBreakdownTable
                title="Income Breakdown"
                selectedMonth={selectedIncomeMonth}
                onMonthChange={setSelectedIncomeMonth}
                months={monthOptions}
                selectedYear={selectedIncomeYear}
                onYearChange={setSelectedIncomeYear}
                years={availableIncomeYears}
                data={currentMonthIncomeTableData}
                amountColumnHeaderText="Income"
                amountColumnItemTextColorClassName="text-green-600 font-medium"
                categoryTotalTextColorClassName="text-green-700 font-semibold"
                grandTotalTextColorClassName="text-green-700"
              />
            </div>
            <div>
              <ExpensePieChart
                data={currentMonthIncomePieData}
                chartTitle="Selected Month Income"
                chartDescription="Breakdown By Category"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Investment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ExpenseBreakdownTable
                title="Investment Breakdown"
                selectedMonth={selectedInvestmentMonth}
                onMonthChange={setSelectedInvestmentMonth}
                months={monthOptions}
                selectedYear={selectedInvestmentYear}
                onYearChange={setSelectedInvestmentYear}
                years={availableInvestmentYears}
                data={currentMonthInvestmentTableData}
                amountColumnHeaderText="Investment"
                amountColumnItemTextColorClassName="text-primary font-medium"
                categoryTotalTextColorClassName="text-primary font-semibold"
                grandTotalTextColorClassName="text-primary"
                showSubCategoryColumn={false}
                showCategoryTotalRow={false}
              />
            </div>
            <div>
              <ExpensePieChart
                data={currentMonthInvestmentPieData}
                chartTitle="Selected Month Investments"
                chartDescription="Breakdown By Category"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Financial Summary Chart
            </h2>
            <MonthlySummaryChart
              data={monthlySummaryChartData}
              selectedYear={selectedSummaryYear}
              onYearChange={setSelectedSummaryYear}
              years={availableSummaryYears}
            />
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">
              Month Netflow
            </h2>
            <MonthlyMoneyTable
              data={financialSnapshotTableData}
              selectedMonth={selectedSummaryDetailMonth}
              onMonthChange={setSelectedSummaryDetailMonth}
              months={monthOptions}
              selectedYear={selectedSummaryYear}
              onYearChange={setSelectedSummaryYear}
              years={availableSummaryYears}
            />
          </div>
        </div>

      </main>
    </div>
  );
}

