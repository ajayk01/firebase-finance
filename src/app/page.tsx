
"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { MonthlySummaryChart } from "@/components/dashboard/monthly-summary-chart";
import { MonthlyMoneyTable, type FinancialSnapshotItem } from "@/components/dashboard/monthly-money-table";
import { AlertCircle } from "lucide-react";
import { useState, useMemo, useEffect } from 'react';

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

interface ExpenseItem {
  year: number;
  month: string;
  category: string;
  subCategory: string;
  expense: string;
}

// Master source of income data (remains hardcoded for now)
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

// Master source of investment data (remains hardcoded for now)
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

interface BankAccount {
  id: string;
  name: string;
  balance: number;
  logoUrl?: string;
}

interface CreditCardAccount {
  id: string;
  name: string;
  usedAmount: number;
  totalLimit: number;
  logo : string;
}

const parseCurrency = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace('₹', '').replace(/,/g, ''));
};

const getAvailableYears = (data: Array<{year: number, month: string, category: string, subCategory?: string, expense: string }>) => {
  if (!data || data.length === 0) return [{ value: new Date().getFullYear(), label: new Date().getFullYear().toString() }];
  const uniqueYears = Array.from(new Set(data.map(item => item.year)))
    .sort((a, b) => b - a);
  if (uniqueYears.length === 0) return [{ value: new Date().getFullYear(), label: new Date().getFullYear().toString() }];
  return uniqueYears.map(year => ({ value: year, label: year.toString() }));
};

export default function DashboardPage() {
  // API Data States
  const [apiBankAccounts, setApiBankAccounts] = useState<BankAccount[]>([]);
  const [apiCreditCards, setApiCreditCards] = useState<CreditCardAccount[]>([]);
  const [apiMonthlyExpenses, setApiMonthlyExpenses] = useState<ExpenseItem[]>([]);
  const [isFinancialDetailsLoading, setIsFinancialDetailsLoading] = useState<boolean>(true);
  const [financialDetailsError, setFinancialDetailsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFinancialDetails() {
      setIsFinancialDetailsLoading(true);
      setFinancialDetailsError(null);
      try {
        const response = await fetch('/api/financial-details');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty object
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || response.statusText}`);
        }
        const data = await response.json();
        setApiBankAccounts(data.bankAccounts || []);
        setApiCreditCards(data.creditCards || []);
        setApiMonthlyExpenses(data.monthlyExpenses || []);
      } catch (error) {
        console.error("Failed to fetch financial details:", error);
        setFinancialDetailsError(error instanceof Error ? error.message : "An unknown error occurred");
        setApiBankAccounts([]);
        setApiCreditCards([]);
        setApiMonthlyExpenses([]);
      } finally {
        setIsFinancialDetailsLoading(false);
      }
    }
    fetchFinancialDetails();
  }, []);


  // Expense States
  const availableExpenseYears = useMemo(() => getAvailableYears(apiMonthlyExpenses), [apiMonthlyExpenses]);
  const [selectedExpenseMonth, setSelectedExpenseMonth] = useState<string>("jul");
  const [selectedExpenseYear, setSelectedExpenseYear] = useState<number>(availableExpenseYears[0]?.value || new Date().getFullYear());
  
  useEffect(() => {
    if (availableExpenseYears.length > 0 && !availableExpenseYears.find(y => y.value === selectedExpenseYear)) {
      setSelectedExpenseYear(availableExpenseYears[0].value);
    } else if (availableExpenseYears.length === 0) {
      setSelectedExpenseYear(new Date().getFullYear());
    }
  }, [availableExpenseYears, selectedExpenseYear]);


  // Income States
  const availableIncomeYears = useMemo(() => getAvailableYears(masterIncomeData), []);
  const [selectedIncomeMonth, setSelectedIncomeMonth] = useState<string>("jul");
  const [selectedIncomeYear, setSelectedIncomeYear] = useState<number>(availableIncomeYears[0]?.value || new Date().getFullYear());

  // Investment States
  const availableInvestmentYears = useMemo(() => getAvailableYears(masterInvestmentData), []);
  const [selectedInvestmentMonth, setSelectedInvestmentMonth] = useState<string>("jul");
  const [selectedInvestmentYear, setSelectedInvestmentYear] = useState<number>(availableInvestmentYears[0]?.value || new Date().getFullYear());

  // Summary Chart & Table States
  const allYearsFromAllData = useMemo(() => {
    const years = new Set([
      ...apiMonthlyExpenses.map(d => d.year),
      ...masterIncomeData.map(d => d.year),
      ...masterInvestmentData.map(d => d.year),
    ]);
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return sortedYears.length > 0 ? sortedYears : [new Date().getFullYear()];
  }, [apiMonthlyExpenses, masterIncomeData, masterInvestmentData]);

  const availableSummaryYears = useMemo(() => allYearsFromAllData.map(year => ({ value: year, label: year.toString() })), [allYearsFromAllData]);
  const [selectedSummaryYear, setSelectedSummaryYear] = useState<number>(availableSummaryYears[0]?.value || new Date().getFullYear());
  const [selectedSummaryDetailMonth, setSelectedSummaryDetailMonth] = useState<string>("jul");

  useEffect(() => {
    if (availableSummaryYears.length > 0 && !availableSummaryYears.find(y => y.value === selectedSummaryYear)) {
      setSelectedSummaryYear(availableSummaryYears[0].value);
    } else if (availableSummaryYears.length === 0) {
      setSelectedSummaryYear(new Date().getFullYear());
    }
  }, [availableSummaryYears, selectedSummaryYear]);


  // Expense Data Processing
  const currentMonthExpenseTableData = useMemo(() => {
    return apiMonthlyExpenses.filter(item => item.month === selectedExpenseMonth && item.year === selectedExpenseYear);
  }, [selectedExpenseMonth, selectedExpenseYear, apiMonthlyExpenses]);

  const currentMonthExpensePieData = useMemo(() => {
    const monthlyExpenses = apiMonthlyExpenses.filter(item => item.month === selectedExpenseMonth && item.year === selectedExpenseYear);
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
  }, [selectedExpenseMonth, selectedExpenseYear, apiMonthlyExpenses]);

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

      const totalExpense = apiMonthlyExpenses
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
  }, [selectedSummaryYear, apiMonthlyExpenses]);


  // Data for Selected Month Financial Snapshot Table
  const financialSnapshotTableData = useMemo(() => {
    const expenseForSelectedMonth = apiMonthlyExpenses
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const incomeForSelectedMonth = masterIncomeData
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const investmentForSelectedMonth = masterInvestmentData
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const totalBankBalance = apiBankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

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
  }, [selectedSummaryDetailMonth, selectedSummaryYear, apiBankAccounts, apiMonthlyExpenses]);


  return (
    <div className="flex flex-col min-h-screen w-full">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Bank Details</h2>
            <div className="bg-muted p-4 rounded-lg shadow-md">
              {isFinancialDetailsLoading && <p className="text-center text-muted-foreground">Loading bank details...</p>}
              {financialDetailsError && (
                <div className="text-red-600 flex items-center justify-center p-4">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Error loading bank details: {financialDetailsError.includes("NOTION_BANK_ACCOUNTS_DB_ID") ? "Bank Accounts DB ID not configured." : financialDetailsError}
                </div>
              )}
              {!isFinancialDetailsLoading && !financialDetailsError && apiBankAccounts.length === 0 && (
                <p className="text-center text-muted-foreground">No bank accounts found.</p>
              )}
              {!isFinancialDetailsLoading && !financialDetailsError && apiBankAccounts.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {apiBankAccounts
                      .slice()
                      .sort((a, b) => b.balance - a.balance) // sort descending by balance
                      .map((account) => (
                        <StatCard
                          key={account.id}
                          bankLogoUrl={account.logoUrl}
                          bankName={account.name}
                          currentBalanceText={`Current Balance : ${account.balance.toLocaleString('en-IN')}`}
                        />
                    ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Credit card details</h2>
            <div className="bg-muted p-4 rounded-lg shadow-md">
              {isFinancialDetailsLoading && <p className="text-center text-muted-foreground">Loading credit card details...</p>}
              {financialDetailsError && (
                 <div className="text-red-600 flex items-center justify-center p-4">
                   <AlertCircle className="h-5 w-5 mr-2" />
                   Error loading credit card details: {financialDetailsError.includes("NOTION_CREDIT_CARDS_DB_ID") ? "Credit Cards DB ID not configured." : financialDetailsError}
                 </div>
              )}
              {!isFinancialDetailsLoading && !financialDetailsError && apiCreditCards.length === 0 && (
                 <p className="text-center text-muted-foreground">No credit cards found.</p>
              )}
              {!isFinancialDetailsLoading && !financialDetailsError && apiCreditCards.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {apiCreditCards.map((card) => (
                    <StatCard
                      key={card.id}
                      creditCardLogoIcon={card.logo} 
                      creditCardName={card.name}
                      usedAmountText={`Used : ${card.usedAmount.toLocaleString('en-IN')}`}
                      totalLimitText={`Total Limit : ${card.totalLimit.toLocaleString('en-IN')}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Monthly Expenses Overview
          </h2>
          {isFinancialDetailsLoading && <p className="text-center text-muted-foreground py-4">Loading expense data...</p>}
          {financialDetailsError && !isFinancialDetailsLoading && (
            <div className="text-red-600 flex items-center justify-center p-4 bg-red-50 rounded-md">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error loading expense data: {financialDetailsError.includes("NOTION_MONTHLY_EXPENSES_DB_ID") ? "Monthly Expenses DB ID not configured." : financialDetailsError}
            </div>
          )}
          {!isFinancialDetailsLoading && !financialDetailsError && (
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
          )}
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
