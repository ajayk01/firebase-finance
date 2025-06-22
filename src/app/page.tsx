
"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ExpenseBreakdownTable } from "@/components/dashboard/expense-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { MonthlySummaryChart } from "@/components/dashboard/monthly-summary-chart";
import { MonthlyMoneyTable, type FinancialSnapshotItem } from "@/components/dashboard/monthly-money-table";
import { AlertCircle } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from 'react';

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
  logo: string;
}

interface SummaryDataItem {
    month: string;
    expense: number;
    income: number;
    investment: number;
}

const parseCurrency = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace('₹', '').replace(/,/g, ''));
};

const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2022; y--) {
        years.push({ value: y, label: y.toString() });
    }
    return years;
};

export default function DashboardPage() {
  const dataCache = useRef<Record<string, any>>({});
  const now = new Date();
  const currentMonthValue = monthOptions[now.getMonth()].value;
  const currentYear = now.getFullYear();

  // --- State Declarations ---
  // Bank Details State
  const [apiBankAccounts, setApiBankAccounts] = useState<BankAccount[]>([]);
  const [isBankDetailsLoading, setIsBankDetailsLoading] = useState<boolean>(true);
  const [bankDetailsError, setBankDetailsError] = useState<string | null>(null);

  // Credit Card Details State
  const [apiCreditCards, setApiCreditCards] = useState<CreditCardAccount[]>([]);
  const [isCreditCardDetailsLoading, setIsCreditCardDetailsLoading] = useState<boolean>(true);
  const [creditCardDetailsError, setCreditCardDetailsError] = useState<string | null>(null);
  
  // Expenses State
  const [apiMonthlyExpenses, setApiMonthlyExpenses] = useState<ExpenseItem[]>([]);
  const [isExpensesLoading, setIsExpensesLoading] = useState<boolean>(true);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [selectedExpenseMonth, setSelectedExpenseMonth] = useState<string>(currentMonthValue);
  const [selectedExpenseYear, setSelectedExpenseYear] = useState<number>(currentYear);

  // Income State
  const [apiMonthlyIncome, setApiMonthlyIncome] = useState<ExpenseItem[]>([]);
  const [isIncomeLoading, setIsIncomeLoading] = useState<boolean>(true);
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [selectedIncomeMonth, setSelectedIncomeMonth] = useState<string>(currentMonthValue);
  const [selectedIncomeYear, setSelectedIncomeYear] = useState<number>(currentYear);

  // Investments State
  const [apiMonthlyInvestments, setApiMonthlyInvestments] = useState<ExpenseItem[]>([]);
  const [isInvestmentsLoading, setIsInvestmentsLoading] = useState<boolean>(true);
  const [investmentsError, setInvestmentsError] = useState<string | null>(null);
  const [selectedInvestmentMonth, setSelectedInvestmentMonth] = useState<string>(currentMonthValue);
  const [selectedInvestmentYear, setSelectedInvestmentYear] = useState<number>(currentYear);

  // Summary Chart & Netflow State
  const [apiSummaryData, setApiSummaryData] = useState<SummaryDataItem[]>([]);
  const [totalBankBalance, setTotalBankBalance] = useState<number>(0);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [selectedSummaryYear, setSelectedSummaryYear] = useState<number>(currentYear);
  const [selectedSummaryDetailMonth, setSelectedSummaryDetailMonth] = useState<string>(currentMonthValue);
  
  const availableYears = useMemo(() => getAvailableYears(), []);

  // --- Data Fetching Effects ---
  useEffect(() => {
    async function fetchBankDetails() {
      setIsBankDetailsLoading(true); setBankDetailsError(null);
      try {
        const res = await fetch('/api/bank-details');
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch');
        const data = await res.json();
        setApiBankAccounts(data.bankAccounts || []);
      } catch (error) {
        setBankDetailsError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsBankDetailsLoading(false);
      }
    }
    fetchBankDetails();
  }, []);

  useEffect(() => {
    async function fetchCreditCardDetails() {
        setIsCreditCardDetailsLoading(true); setCreditCardDetailsError(null);
        try {
            const res = await fetch('/api/credit-card-details');
            if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch');
            const data = await res.json();
            setApiCreditCards(data.creditCardDetails || []);
        } catch (error) {
            setCreditCardDetailsError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsCreditCardDetailsLoading(false);
        }
    }
    fetchCreditCardDetails();
  }, []);
  
  useEffect(() => {
    async function fetchExpenses() {
      const cacheKey = `expenses-${selectedExpenseYear}-${selectedExpenseMonth}`;
      if (dataCache.current[cacheKey]) {
        setApiMonthlyExpenses(dataCache.current[cacheKey]);
        return;
      }
      setIsExpensesLoading(true); setExpensesError(null);
      try {
        const res = await fetch(`/api/monthly-expenses?month=${selectedExpenseMonth}&year=${selectedExpenseYear}`);
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch');
        const data = await res.json();
        const expenses = data.monthlyExpenses || [];
        setApiMonthlyExpenses(expenses);
        dataCache.current[cacheKey] = expenses;
      } catch (error) {
        setExpensesError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsExpensesLoading(false);
      }
    }
    fetchExpenses();
  }, [selectedExpenseMonth, selectedExpenseYear]);

  useEffect(() => {
    async function fetchIncome() {
      const cacheKey = `income-${selectedIncomeYear}-${selectedIncomeMonth}`;
      if (dataCache.current[cacheKey]) {
        setApiMonthlyIncome(dataCache.current[cacheKey]);
        return;
      }
      setIsIncomeLoading(true); setIncomeError(null);
      try {
        const res = await fetch(`/api/monthly-income?month=${selectedIncomeMonth}&year=${selectedIncomeYear}`);
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch');
        const data = await res.json();
        const income = data.monthlyIncome || [];
        setApiMonthlyIncome(income);
        dataCache.current[cacheKey] = income;
      } catch (error) {
        setIncomeError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsIncomeLoading(false);
      }
    }
    fetchIncome();
  }, [selectedIncomeMonth, selectedIncomeYear]);

  useEffect(() => {
    async function fetchInvestments() {
      const cacheKey = `investments-${selectedInvestmentYear}-${selectedInvestmentMonth}`;
      if (dataCache.current[cacheKey]) {
        setApiMonthlyInvestments(dataCache.current[cacheKey]);
        return;
      }
      setIsInvestmentsLoading(true); setInvestmentsError(null);
      try {
        const res = await fetch(`/api/monthly-investments?month=${selectedInvestmentMonth}&year=${selectedInvestmentYear}`);
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch');
        const data = await res.json();
        const investments = data.monthlyInvestments || [];
        setApiMonthlyInvestments(investments);
        dataCache.current[cacheKey] = investments;
      } catch (error) {
        setInvestmentsError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsInvestmentsLoading(false);
      }
    }
    fetchInvestments();
  }, [selectedInvestmentMonth, selectedInvestmentYear]);

  useEffect(() => {
    async function fetchSummaryData() {
      const cacheKey = `summary-${selectedSummaryYear}`;
      if (dataCache.current[cacheKey]) {
        setApiSummaryData(dataCache.current[cacheKey].summaryData);
        setTotalBankBalance(dataCache.current[cacheKey].totalBankBalance);
        return;
      }
      setIsSummaryLoading(true); setSummaryError(null);
      try {
        const res = await fetch(`/api/yearly-summary?year=${selectedSummaryYear}`);
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch');
        const data = await res.json();
        const summary = {
          summaryData: data.summaryData || [],
          totalBankBalance: data.totalBankBalance || 0
        };
        setApiSummaryData(summary.summaryData);
        setTotalBankBalance(summary.totalBankBalance);
        dataCache.current[cacheKey] = summary;
      } catch (error) {
        setSummaryError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsSummaryLoading(false);
      }
    }
    fetchSummaryData();
  }, [selectedSummaryYear]);


  // --- Memoized Data Transformations ---
  const currentMonthExpensePieData = useMemo(() => {
    const aggregated: { [key: string]: number } = {};
    apiMonthlyExpenses.forEach(item => {
      const value = parseCurrency(item.expense);
      if (aggregated[item.category]) {
        aggregated[item.category] += value;
      } else {
        aggregated[item.category] = value;
      }
    });
    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }, [apiMonthlyExpenses]);

  const currentMonthIncomePieData = useMemo(() => {
    const aggregated: { [key: string]: number } = {};
    apiMonthlyIncome.forEach(item => {
      const value = parseCurrency(item.expense);
      if (aggregated[item.category]) {
        aggregated[item.category] += value;
      } else {
        aggregated[item.category] = value;
      }
    });
    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }, [apiMonthlyIncome]);

  const currentMonthInvestmentPieData = useMemo(() => {
    const aggregated: { [key: string]: number } = {};
    apiMonthlyInvestments.forEach(item => {
      const value = parseCurrency(item.expense);
      if (aggregated[item.category]) {
        aggregated[item.category] += value;
      } else {
        aggregated[item.category] = value;
      }
    });
    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }, [apiMonthlyInvestments]);
  
  const financialSnapshotTableData = useMemo(() => {
    const monthIndex = monthOptions.findIndex(m => m.value === selectedSummaryDetailMonth);
    const summaryForMonth = apiSummaryData[monthIndex];

    const expenseForSelectedMonth = summaryForMonth?.expense || 0;
    const incomeForSelectedMonth = summaryForMonth?.income || 0;
    const investmentForSelectedMonth = summaryForMonth?.investment || 0;

    const netFlows = incomeForSelectedMonth - expenseForSelectedMonth - investmentForSelectedMonth;
    
    let netFlowsColorClass = "text-foreground";
    if (netFlows > 0) netFlowsColorClass = "text-green-600";
    else if (netFlows < 0) netFlowsColorClass = "text-red-600";

    return [
      { category: "Total Expense", amount: expenseForSelectedMonth, colorClassName: "text-red-600 font-medium" },
      { category: "Total Income", amount: incomeForSelectedMonth, colorClassName: "text-green-600 font-medium" },
      { category: "Total Investment", amount: investmentForSelectedMonth, colorClassName: "text-primary font-medium" },
      { category: "Total Bank Balance", amount: totalBankBalance, colorClassName: "text-foreground font-medium" },
      { category: "Total Netflows", amount: netFlows, colorClassName: `${netFlowsColorClass} font-medium` },
    ] as FinancialSnapshotItem[];
  }, [selectedSummaryDetailMonth, apiSummaryData, totalBankBalance]);

  const renderError = (error: string | null, type: string) => {
    if (!error) return null;
    return (
        <div className="text-red-600 flex items-center justify-center p-4 bg-red-50 rounded-md my-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error loading {type}: {error}
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Bank Details</h2>
            <div className="bg-muted p-4 rounded-lg shadow-md">
              {isBankDetailsLoading && <p className="text-center text-muted-foreground">Loading bank details...</p>}
              {renderError(bankDetailsError, "bank details")}
              {!isBankDetailsLoading && !bankDetailsError && apiBankAccounts.length === 0 && <p className="text-center text-muted-foreground">No bank accounts found.</p>}
              {!isBankDetailsLoading && !bankDetailsError && apiBankAccounts.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {apiBankAccounts.slice().sort((a, b) => b.balance - a.balance).map((account) => (
                    <StatCard key={account.id} logo={account.logo} bankName={account.name} currentBalanceText={`Current Balance : ${account.balance.toLocaleString('en-IN')}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Credit card details</h2>
            <div className="bg-muted p-4 rounded-lg shadow-md">
              {isCreditCardDetailsLoading && <p className="text-center text-muted-foreground">Loading credit card details...</p>}
              {renderError(creditCardDetailsError, "credit card details")}
              {!isCreditCardDetailsLoading && !creditCardDetailsError && apiCreditCards.length === 0 && <p className="text-center text-muted-foreground">No credit cards found.</p>}
              {!isCreditCardDetailsLoading && !creditCardDetailsError && apiCreditCards.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {apiCreditCards.map((card) => (
                    <StatCard key={card.id} creditCardLogoIcon={card.logo} creditCardName={card.name} usedAmountText={`Used : ${card.usedAmount.toLocaleString('en-IN')}`} totalLimitText={`Total Limit : ${card.totalLimit.toLocaleString('en-IN')}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Monthly Expenses Overview</h2>
          {isExpensesLoading && <p className="text-muted-foreground py-4">Loading expense data...</p>}
          {renderError(expensesError, "expense data")}
          {!isExpensesLoading && !expensesError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ExpenseBreakdownTable title="Expense Breakdown" selectedMonth={selectedExpenseMonth} onMonthChange={setSelectedExpenseMonth} months={monthOptions} selectedYear={selectedExpenseYear} onYearChange={setSelectedExpenseYear} years={availableYears} data={apiMonthlyExpenses} />
              </div>
              <div>
                <ExpensePieChart data={currentMonthExpensePieData} chartTitle="Selected Month Expense" chartDescription="Breakdown By Category" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Monthly Income Overview</h2>
          {isIncomeLoading && <p className="text-muted-foreground py-4">Loading income data...</p>}
          {renderError(incomeError, "income data")}
          {!isIncomeLoading && !incomeError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ExpenseBreakdownTable title="Income Breakdown" selectedMonth={selectedIncomeMonth} onMonthChange={setSelectedIncomeMonth} months={monthOptions} selectedYear={selectedIncomeYear} onYearChange={setSelectedIncomeYear} years={availableYears} data={apiMonthlyIncome} amountColumnHeaderText="Income" amountColumnItemTextColorClassName="text-green-600 font-medium" categoryTotalTextColorClassName="text-green-700 font-semibold" grandTotalTextColorClassName="text-green-700" />
              </div>
              <div>
                <ExpensePieChart data={currentMonthIncomePieData} chartTitle="Selected Month Income" chartDescription="Breakdown By Category" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
           {isInvestmentsLoading && <p className="text-muted-foreground py-4">Loading investment data...</p>}
           {renderError(investmentsError, "investment data")}
           {!isInvestmentsLoading && !investmentsError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ExpenseBreakdownTable title="Investment Breakdown" selectedMonth={selectedInvestmentMonth} onMonthChange={setSelectedInvestmentMonth} months={monthOptions} selectedYear={selectedInvestmentYear} onYearChange={setSelectedInvestmentYear} years={availableYears} data={apiMonthlyInvestments} amountColumnHeaderText="Investment" amountColumnItemTextColorClassName="text-primary font-medium" categoryTotalTextColorClassName="text-primary font-semibold" grandTotalTextColorClassName="text-primary" showSubCategoryColumn={false} showCategoryTotalRow={false} />
              </div>
              <div>
                <ExpensePieChart data={currentMonthInvestmentPieData} chartTitle="Selected Month Investments" chartDescription="Breakdown By Category" />
              </div>
            </div>
           )}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold mb-4">Monthly Financial Summary Chart</h2>
            {isSummaryLoading && <p className="text-muted-foreground py-4">Loading summary data...</p>}
            {renderError(summaryError, "summary data")}
            {!isSummaryLoading && !summaryError && (
              <MonthlySummaryChart data={apiSummaryData} selectedYear={selectedSummaryYear} onYearChange={setSelectedSummaryYear} years={availableYears} />
            )}
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Month Netflow</h2>
            {isSummaryLoading && <p className="text-muted-foreground py-4">Loading netflow data...</p>}
            {renderError(summaryError, "netflow data")}
            {!isSummaryLoading && !summaryError && (
              <MonthlyMoneyTable data={financialSnapshotTableData} selectedMonth={selectedSummaryDetailMonth} onMonthChange={setSelectedSummaryDetailMonth} months={monthOptions} selectedYear={selectedSummaryYear} onYearChange={setSelectedSummaryYear} years={availableYears} />
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
