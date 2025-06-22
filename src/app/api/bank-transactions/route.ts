
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const NOTION_TRANSACTIONS_DB_ID = process.env.NOTION_TRANSACTIONS_DB_ID;

interface Transaction {
    id: string;
    date: string | null;
    description: string;
    amount: number;
    type: 'Income' | 'Expense' | 'Transfer' | 'Other';
}

async function fetchTransactionsFromNotion(bankAccountId: string): Promise<Transaction[]> {
    if (!NOTION_TRANSACTIONS_DB_ID) {
        throw new Error("NOTION_TRANSACTIONS_DB_ID is not set in environment variables.");
    }
    try {
        const response = await notion.databases.query({
            database_id: NOTION_TRANSACTIONS_DB_ID,
            filter: {
                property: 'Bank Account', // Assuming this is the name of your relation property
                relation: {
                    contains: bankAccountId,
                },
            },
            sorts: [
                {
                    property: 'Date', // Assuming a 'Date' property for sorting
                    direction: 'descending',
                },
            ],
        });

        return response.results.map((page: any) => {
            const properties = page.properties;
            const descriptionProp = properties?.['Name']?.['title']?.[0]?.['plain_text'] || 'No Description';
            const amountProp = properties?.['Amount']?.['number'] ?? 0;
            const dateProp = properties?.['Date']?.['date']?.['start'] || null;
            const typeProp = properties?.['Type']?.['select']?.['name'] || 'Other';

            return {
                id: page.id,
                date: dateProp,
                description: descriptionProp,
                amount: amountProp,
                type: typeProp,
            };
        });
    } catch (error) {
        console.error("Error fetching transactions from Notion:", error);
        throw new Error("Failed to fetch transactions from Notion.");
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bankAccountId = searchParams.get('bankAccountId');

        if (!process.env.NOTION_API_KEY) {
            return NextResponse.json({ error: "Notion API key is not configured." }, { status: 500 });
        }
        if (!bankAccountId) {
            return NextResponse.json({ error: "bankAccountId is a required query parameter." }, { status: 400 });
        }

        const transactions = await fetchTransactionsFromNotion(bankAccountId);
        return NextResponse.json({ transactions });

    } catch (error) {
        console.error("Error in /api/bank-transactions:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching transactions.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
