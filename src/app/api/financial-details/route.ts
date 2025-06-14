
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const NOTION_BANK_ACCOUNTS_DB_ID = process.env.NOTION_BANK_ACCOUNTS_DB_ID;
const NOTION_CREDIT_CARDS_DB_ID = process.env.NOTION_CREDIT_CARDS_DB_ID;

interface NotionPage {
  id: string;
  properties: any; // Simplified for brevity, Notion properties are complex
}

async function fetchBankAccountsFromNotion() {
  if (!NOTION_BANK_ACCOUNTS_DB_ID) {
    throw new Error("NOTION_BANK_ACCOUNTS_DB_ID is not set in environment variables.");
  }
  try {
    const response = await notion.databases.query({
      database_id: NOTION_BANK_ACCOUNTS_DB_ID,
    });

    return response.results.map((page: NotionPage) => {
      // Adjust these property names if your Notion database uses different names
      const accountNameProperty = page.properties['Account Name']; // Assumes 'Account Name' is a Title property
      const balanceProperty = page.properties['Balance']; // Assumes 'Balance' is a Number property

      return {
        id: page.id,
        name: accountNameProperty?.title[0]?.plain_text || "Unnamed Account",
        balance: balanceProperty?.number || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching bank accounts from Notion:", error);
    throw new Error("Failed to fetch bank accounts from Notion.");
  }
}

async function fetchCreditCardsFromNotion() {
  if (!NOTION_CREDIT_CARDS_DB_ID) {
    throw new Error("NOTION_CREDIT_CARDS_DB_ID is not set in environment variables.");
  }
  try {
    const response = await notion.databases.query({
      database_id: NOTION_CREDIT_CARDS_DB_ID,
    });

    return response.results.map((page: NotionPage) => {
      // Adjust these property names if your Notion database uses different names
      const cardNameProperty = page.properties['Card Name']; // Assumes 'Card Name' is a Title property
      const usedAmountProperty = page.properties['Used Amount']; // Assumes 'Used Amount' is a Number property
      const totalLimitProperty = page.properties['Total Limit']; // Assumes 'Total Limit' is a Number property
      
      return {
        id: page.id,
        name: cardNameProperty?.title[0]?.plain_text || "Unnamed Card",
        usedAmount: usedAmountProperty?.number || 0,
        totalLimit: totalLimitProperty?.number || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching credit cards from Notion:", error);
    throw new Error("Failed to fetch credit cards from Notion.");
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json({ error: "Notion API key is not configured." }, { status: 500 });
    }
    if (!NOTION_BANK_ACCOUNTS_DB_ID || !NOTION_CREDIT_CARDS_DB_ID) {
      return NextResponse.json({ error: "Notion Database IDs are not configured." }, { status: 500 });
    }

    const [bankAccounts, creditCards] = await Promise.all([
      fetchBankAccountsFromNotion(),
      fetchCreditCardsFromNotion(),
    ]);

    return NextResponse.json({
      bankAccounts,
      creditCards,
    });
  } catch (error) {
    console.error("Error in /api/financial-details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching financial details.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
