
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EXPENSE_DB_ID = process.env.EXPENSE_DB_ID;
const INCOME_DB_ID = process.env.INCOME_DB_ID;
const INVESTMENT_TRANS_DB_ID = process.env.INVESTMENT_TRANS_DB_ID;
const NOTION_BANK_ACCOUNTS_DB_ID = process.env.NOTION_BANK_ACCOUNTS_DB_ID;

const months = [
    { name: "Jan", index: 0 }, { name: "Feb", index: 1 }, { name: "Mar", index: 2 },
    { name: "Apr", index: 3 }, { name: "May", index: 4 }, { name: "Jun", index: 5 },
    { name: "Jul", index: 6 }, { name: "Aug", index: 7 }, { name: "Sep", index: 8 },
    { name: "Oct", index: 9 }, { name: "Nov", index: 10 }, { name: "Dec", index: 11 },
];

/**
 * Fetches the total amount from a specific Notion database for a given month and year.
 */
async function getMonthlyTotal(databaseId: string | undefined, dateProperty: string, amountProperty: string, year: number, monthIndex: number): Promise<number> {
    if (!databaseId) {
        return 0; // Silently fail if DB ID is not provided
    }
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0); // Last day of the month

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: dateProperty,
                        date: {
                            on_or_after: startDate.toISOString().split('T')[0],
                        },
                    },
                    {
                        property: dateProperty,
                        date: {
                            on_or_before: endDate.toISOString().split('T')[0],
                        },
                    },
                ],
            },
        });

        const total = response.results.reduce((sum, page: any) => {
            const amount = page.properties[amountProperty]?.number ?? 0;
            return sum + amount;
        }, 0);

        return total;
    } catch (error) {
        console.error(`Error fetching total for DB ${databaseId} for month ${monthIndex + 1}/${year}:`, error);
        return 0; // Return 0 on error to not fail the entire request
    }
}

/**
 * Fetches the sum of all bank account balances from Notion.
 */
async function fetchTotalBankBalance() {
  if (!NOTION_BANK_ACCOUNTS_DB_ID) {
    console.warn("NOTION_BANK_ACCOUNTS_DB_ID is not set in environment variables.");
    return 0;
  }
  try {
    const response = await notion.databases.query({
      database_id: NOTION_BANK_ACCOUNTS_DB_ID,
    });
    const totalBalance = response.results.reduce((sum, page) => {
      const balanceProperty = (page as any).properties?.['Current Balance']?.["formula"];
      const balance = balanceProperty?.number || 0;
      return sum + balance;
    }, 0);
    return totalBalance;
  } catch (error) {
    console.error("Error fetching total bank balance from Notion:", error);
    return 0;
  }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const yearParam = searchParams.get('year');
        
        if (!process.env.NOTION_API_KEY) {
          return NextResponse.json({ error: "Notion API key is not configured." }, { status: 500 });
        }
        if (!yearParam) {
            return NextResponse.json({ error: "Year is a required query parameter." }, { status: 400 });
        }
        const year = parseInt(yearParam, 10);

        // Fetch all monthly totals in parallel
        const summaryDataPromises = months.map(async (month) => {
            const [expense, income, investment] = await Promise.all([
                getMonthlyTotal(EXPENSE_DB_ID, 'Date', 'Amount', year, month.index),
                getMonthlyTotal(INCOME_DB_ID, 'Date', 'Amount', year, month.index),
                getMonthlyTotal(INVESTMENT_TRANS_DB_ID, 'Investment Date', 'Invested Amount', year, month.index),
            ]);
            return {
                month: month.name,
                expense,
                income,
                investment,
            };
        });

        const [summaryData, totalBankBalance] = await Promise.all([
            Promise.all(summaryDataPromises),
            fetchTotalBankBalance()
        ]);

        return NextResponse.json({
            summaryData,
            totalBankBalance,
        });

    } catch (error) {
        console.error("Error in /api/yearly-summary:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
