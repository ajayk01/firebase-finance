
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const NOTION_BANK_ACCOUNTS_DB_ID = process.env.NOTION_BANK_ACCOUNTS_DB_ID;
const NOTION_CREDIT_CARDS_DB_ID = process.env.NOTION_CREDIT_CARDS_DB_ID;
const EXP_SUB_CATEGORY_DB_ID = process.env.EXP_SUB_CATEGORY_DB_ID;

interface NotionPage {
  id: string;
  properties: any;
  icon: any;
}

interface ExpenseItem {
  year: number;
  month: string;
  category: string;
  subCategory: string;
  expense: string;
}

async function fetchBankAccountsFromNotion() 
{
  if (!NOTION_BANK_ACCOUNTS_DB_ID) {
    throw new Error("NOTION_BANK_ACCOUNTS_DB_ID is not set in environment variables.");
  }
  try {
    const response = await notion.databases.query({
      database_id: NOTION_BANK_ACCOUNTS_DB_ID,
    });
    return response.results.map((page) => {
      // Adjust these property names if your Notion database uses different names
      const accountNameProperty = (page as any).properties?.['Account']["title"][0]["plain_text"] // Assumes 'Account Name' is a Title property
      const balanceProperty = (page as any).properties?.['Current Balance']["formula"] // Assumes 'Balance' is a Number property
      const type = (page as any)['icon']['type']
      const logo = (page as any)['icon'][type]["url"];
      return {
        id: (page as any).id,
        name: accountNameProperty || "Unnamed Account",
        balance: balanceProperty?.number || 0,
        logo : logo || "",
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

    return response.results.map((page) => {
      // Adjust these property names if your Notion database uses different names
      const cardNameProperty = (page as any).properties?.['Name']["title"][0]["plain_text"]; // Assumes 'Card Name' is a Title property
      const usedAmountProperty = (page as any).properties?.['Total Used']["formula"]; // Assumes 'Used Amount' is a Number property
      const totalLimitProperty = (page as any).properties?.['Total Limit']["formula"]; // Assumes 'Total Limit' is a Number property
      const type = (page as any)['icon']['type']
      const logo = (page as any)['icon'][type]["url"];
      return {
        id: (page as any).id,
        name: cardNameProperty  || "Unnamed Card",
        usedAmount: usedAmountProperty?.number || 0,
        totalLimit: totalLimitProperty?.number || 0,
        logo: logo || "",
      };
    });
  } catch (error) {
    console.error("Error fetching credit cards from Notion:", error);
    throw new Error("Failed to fetch credit cards from Notion.");
  }
}

async function fetchMonthlyExpensesFromNotion(): Promise<ExpenseItem[]> {
  if (!EXP_SUB_CATEGORY_DB_ID) {
    throw new Error("EXP_SUB_CATEGORY_DB_ID is not set in environment variables.");
  }
  try {
    const response = await notion.databases.query({
      database_id: EXP_SUB_CATEGORY_DB_ID,
      // Add sorts here if needed, e.g., by Year then Month
    });

      const items = await Promise.all(response.results.map(async (page) => {
      const prop = (page as any).properties;
      const expense = prop["This Month Expense"]["formula"]["number"];
      if(expense == 0)
      {
        return null; 
      }
      const subCategoryName = prop["Sub Category"]["title"][0]["plain_text"];
      let categoryName = "";

      // Await the category page fetch
      if (prop["Category Name"]?.relation?.[0]?.id) {
        const categoryPage = await notion.pages.retrieve({ page_id: prop["Category Name"].relation[0].id });
        categoryName = (categoryPage as any)["properties"]["Category"]["title"][0]["plain_text"];
      }

      return {
        year: 2025,
        month: 'jun', // Or get from your data
        category: categoryName,
        subCategory: subCategoryName || "",
        expense: `₹${expense}`,
      };
    }));

    return items.filter(item => item !== null) as ExpenseItem[];
  } catch (error) {
    console.error("Error fetching monthly expenses from Notion:", error);
    throw new Error("Failed to fetch monthly expenses from Notion.");
  }
}


export async function GET(request: NextRequest) {
  try {
    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json({ error: "Notion API key is not configured." }, { status: 500 });
    }
    // Check for all required DB IDs
    const requiredDbIds = [
      { name: "NOTION_BANK_ACCOUNTS_DB_ID", value: NOTION_BANK_ACCOUNTS_DB_ID },
      { name: "NOTION_CREDIT_CARDS_DB_ID", value: NOTION_CREDIT_CARDS_DB_ID },
      { name: "EXP_SUB_CATEGORY_DB_ID", value: EXP_SUB_CATEGORY_DB_ID },
    ];

    for (const dbId of requiredDbIds) {
      if (!dbId.value) {
        return NextResponse.json({ error: `${dbId.name} is not configured in environment variables.` }, { status: 500 });
      }
    }
    
    const [bankAccounts, creditCards, monthlyExpenses] = await Promise.all([
      fetchBankAccountsFromNotion(),
      fetchCreditCardsFromNotion(),
      fetchMonthlyExpensesFromNotion(),
    ]);

    return NextResponse.json({
      bankAccounts,
      creditCards,
      monthlyExpenses,
    });
  } catch (error) {
    console.error("Error in /api/financial-details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching financial details.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
