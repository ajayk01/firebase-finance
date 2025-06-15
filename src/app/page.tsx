
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

interface ExpenseItem { // Reused for income and investments as structure is similar
  year: number;
  month: string;
  category: string;
  subCategory: string;
  expense: string; // "expense" key used for amount string (e.g., "₹100.00")
}

interface BankAccount {
  id: string;
  name: string;
  balance: number;
  logo: string; // Optional logo URL
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
  const [apiMonthlyIncome, setApiMonthlyIncome] = useState<ExpenseItem[]>([]);
  const [apiMonthlyInvestments, setApiMonthlyInvestments] = useState<ExpenseItem[]>([]);
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
        setApiMonthlyIncome(data.monthlyIncome || []);
        setApiMonthlyInvestments(data.monthlyInvestments || []);
      } catch (error) {
        console.error("Failed to fetch financial details:", error);
        setFinancialDetailsError(error instanceof Error ? error.message : "An unknown error occurred");
        setApiBankAccounts([]);
        setApiCreditCards([]);
        setApiMonthlyExpenses([]);
        setApiMonthlyIncome([]);
        setApiMonthlyInvestments([]);
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
  const availableIncomeYears = useMemo(() => getAvailableYears(apiMonthlyIncome), [apiMonthlyIncome]);
  const [selectedIncomeMonth, setSelectedIncomeMonth] = useState<string>("jul");
  const [selectedIncomeYear, setSelectedIncomeYear] = useState<number>(availableIncomeYears[0]?.value || new Date().getFullYear());
   useEffect(() => {
    if (availableIncomeYears.length > 0 && !availableIncomeYears.find(y => y.value === selectedIncomeYear)) {
      setSelectedIncomeYear(availableIncomeYears[0].value);
    } else if (availableIncomeYears.length === 0) {
      setSelectedIncomeYear(new Date().getFullYear());
    }
  }, [availableIncomeYears, selectedIncomeYear]);


  // Investment States
  const availableInvestmentYears = useMemo(() => getAvailableYears(apiMonthlyInvestments), [apiMonthlyInvestments]);
  const [selectedInvestmentMonth, setSelectedInvestmentMonth] = useState<string>("jul");
  const [selectedInvestmentYear, setSelectedInvestmentYear] = useState<number>(availableInvestmentYears[0]?.value || new Date().getFullYear());
  useEffect(() => {
    if (availableInvestmentYears.length > 0 && !availableInvestmentYears.find(y => y.value === selectedInvestmentYear)) {
      setSelectedInvestmentYear(availableInvestmentYears[0].value);
    } else if (availableInvestmentYears.length === 0) {
      setSelectedInvestmentYear(new Date().getFullYear());
    }
  }, [availableInvestmentYears, selectedInvestmentYear]);

  // Summary Chart & Table States
  const allYearsFromAllData = useMemo(() => {
    const years = new Set([
      ...apiMonthlyExpenses.map(d => d.year),
      ...apiMonthlyIncome.map(d => d.year),
      ...apiMonthlyInvestments.map(d => d.year),
    ]);
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return sortedYears.length > 0 ? sortedYears : [new Date().getFullYear()];
  }, [apiMonthlyExpenses, apiMonthlyIncome, apiMonthlyInvestments]);

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
    return apiMonthlyIncome.filter(item => item.month === selectedIncomeMonth && item.year === selectedIncomeYear);
  }, [selectedIncomeMonth, selectedIncomeYear, apiMonthlyIncome]);

  const currentMonthIncomePieData = useMemo(() => {
    const monthlyIncome = apiMonthlyIncome.filter(item => item.month === selectedIncomeMonth && item.year === selectedIncomeYear);
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
  }, [selectedIncomeMonth, selectedIncomeYear, apiMonthlyIncome]);

  // Investment Data Processing
  const currentMonthInvestmentTableData = useMemo(() => {
    return apiMonthlyInvestments.filter(item => item.month === selectedInvestmentMonth && item.year === selectedInvestmentYear);
  }, [selectedInvestmentMonth, selectedInvestmentYear, apiMonthlyInvestments]);

  const currentMonthInvestmentPieData = useMemo(() => {
    const monthlyInvestment = apiMonthlyInvestments.filter(item => item.month === selectedInvestmentMonth && item.year === selectedInvestmentYear);
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
  }, [selectedInvestmentMonth, selectedInvestmentYear, apiMonthlyInvestments]);

  // Data for Monthly Summary Chart (12 months)
  const monthlySummaryChartData = useMemo(() => {
    return monthOptions.map(monthObj => {
      const month = monthObj.value;

      const totalExpense = apiMonthlyExpenses
        .filter(item => item.month === month && item.year === selectedSummaryYear)
        .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

      const totalIncome = apiMonthlyIncome
        .filter(item => item.month === month && item.year === selectedSummaryYear)
        .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

      const totalInvestment = apiMonthlyInvestments
        .filter(item => item.month === month && item.year === selectedSummaryYear)
        .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

      return {
        month: monthObj.label.substring(0, 3), // Short month name for chart
        expense: totalExpense,
        income: totalIncome,
        investment: totalInvestment,
      };
    });
  }, [selectedSummaryYear, apiMonthlyExpenses, apiMonthlyIncome, apiMonthlyInvestments]);


  // Data for Selected Month Financial Snapshot Table
  const financialSnapshotTableData = useMemo(() => {
    const expenseForSelectedMonth = apiMonthlyExpenses
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const incomeForSelectedMonth = apiMonthlyIncome
      .filter(item => item.month === selectedSummaryDetailMonth && item.year === selectedSummaryYear)
      .reduce((sum, item) => sum + parseCurrency(item.expense), 0);

    const investmentForSelectedMonth = apiMonthlyInvestments
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
  }, [selectedSummaryDetailMonth, selectedSummaryYear, apiBankAccounts, apiMonthlyExpenses, apiMonthlyIncome, apiMonthlyInvestments]);


  const getLoadingOrErrorMessage = (dataType: string, dbIdName: string) => {
    if (isFinancialDetailsLoading) return <p className="text-center text-muted-foreground py-4">Loading {dataType}...</p>;
    if (financialDetailsError) {
      const isSpecificDbError = financialDetailsError.includes(dbIdName);
      const displayError = isSpecificDbError ? `${dbIdName.replace(/NOTION_|_DB_ID/g, ' ').replace(/_/g, ' ').trim()} DB ID not configured or error fetching.` : financialDetailsError;
      return (
        <div className="text-red-600 flex items-center justify-center p-4 bg-red-50 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2" />
          Error loading {dataType}: {displayError}
        </div>
      );
    }
    return null;
  }

  const expenseError = getLoadingOrErrorMessage("expense data", "NOTION_MONTHLY_EXPENSES_DB_ID");
  const incomeError = getLoadingOrErrorMessage("income data", "NOTION_MONTHLY_INCOME_DB_ID");
  const investmentError = getLoadingOrErrorMessage("investment data", "NOTION_MONTHLY_INVESTMENTS_DB_ID");


  return (
    <div className="flex flex-col min-h-screen w-full">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Bank Details</h2>
            <div className="bg-muted p-4 rounded-lg shadow-md">
              {isFinancialDetailsLoading && <p className="text-center text-muted-foreground">Loading bank details...</p>}
              {financialDetailsError && !isFinancialDetailsLoading && (
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
                      .sort((a, b) => b.balance - a.balance) 
                      .map((account) => (
                        <StatCard
                          key={account.id}
                          logo={account.logo}
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
              {financialDetailsError && !isFinancialDetailsLoading && (
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
          {expenseError ? expenseError : (
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
           {incomeError ? incomeError : (
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
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Investment Details
          </h2>
          {investmentError ? investmentError : (
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
          )}
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
