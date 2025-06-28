
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EXPENSE_DB_ID = process.env.EXPENSE_DB_ID;

interface Transaction {
    id: string;
    date: string | null;
    description: string;
    amount: number;
    type: 'Expense';
}

const monthMap: Record<string, number> = 
{
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};
function getFromToDates(month: string, year: number) {
  const monthIndex = monthMap[month.toLowerCase()];

    if (monthIndex === undefined) {
        throw new Error("Invalid month provided.");
    }

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);

    return { startDate, endDate };
}

async function fetchFromDatabase(
    databaseId: string | undefined, 
    creditCardId: string, 
    from: string, 
    to: string
): Promise<Transaction[]> {
    if (!databaseId) {
        console.error("EXPENSE_DB_ID is not set in environment variables.");
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        // IMPORTANT: Assumes your Notion 'Expenses' database has a relation property named "Credit Card"
                        // that links to your "Credit Cards" database.
                        property: "Credit Card",
                        relation: {
                            contains: creditCardId,
                        },
                    },
                    {
                        property: "Date",
                        date: {
                            on_or_after: from,
                        },
                    },
                    {
                        property: "Date",
                        date: {
                            on_or_before: to,
                        },
                    }
                ],
            },
        });

        // Map Notion pages to Transaction objects
        return response.results.map((page: any): Transaction => {
            const properties = page.properties;
            const descriptionProp = properties['Expense']['title'][0]['plain_text'];
            const amountProp = properties['Amount']['number'];
            const dateProp = properties['Date']['date']?.['start'] || null;

            return {
                id: page.id,
                date: dateProp,
                description: descriptionProp,
                amount: amountProp,
                type: 'Expense',
            };
        });
    } catch (error) {
        console.log(`Error fetching Expense transactions for credit card from Notion (DB ID: ${databaseId}):`, error);
        return []; // Return empty array on error to not fail the entire request
    }
}


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const creditCardId = searchParams.get('creditCardId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        if (!process.env.NOTION_API_KEY) {
            return NextResponse.json({ error: "Notion API key is not configured." }, { status: 500 });
        }
        if (!creditCardId || !month || !year) {
            return NextResponse.json({ error: "creditCardId, month, and year are required query parameters." }, { status: 400 });
        }

        const { startDate, endDate } = getFromToDates(month, parseInt(year, 10));
        const from = startDate.toISOString().split('T')[0];
        const to = endDate.toISOString().split('T')[0];

        const transactions = await fetchFromDatabase(EXPENSE_DB_ID, creditCardId, from, to);
        
        transactions.sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return NextResponse.json({ transactions });

    } catch (error) {
        console.error("Error in /api/credit-card-transactions:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching transactions.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
