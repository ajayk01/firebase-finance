
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EXP_SUB_CATEGORY_DB_ID = process.env.EXP_SUB_CATEGORY_DB_ID;
const INC_SUB_CATEGORY_DB_ID = process.env.INC_SUB_CATEGORY_DB_ID;
const INVESTMENT_DB_ID = process.env.INVESTMENT_DB_ID;

interface ExpenseItem {
  year: number;
  month: string;
  category: string;
  subCategory: string;
  expense: string;
}

async function fetchMonthlyExpensesFromNotion({ month, year }: { month?: string, year?: string }): Promise<ExpenseItem[]> {
  console.log("Month : ", month, "Year : ", year);
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

async function fetchMonthlyIncomesFromNotion(): Promise<ExpenseItem[]> {
  if (!INC_SUB_CATEGORY_DB_ID) {
    throw new Error("EXP_SUB_CATEGORY_DB_ID is not set in environment variables.");
  }
  try {
    const response = await notion.databases.query({
      database_id: INC_SUB_CATEGORY_DB_ID,
      // Add sorts here if needed, e.g., by Year then Month
    });

      const items = await Promise.all(response.results.map(async (page) => {
      const prop = (page as any).properties;
      const expense = prop["Total Incomes"]["formula"]["number"];
      if(expense == 0)
      {
        return null; 
      }
      const subCategoryName = prop["Sub Category"]["title"][0]["plain_text"];
      let categoryName = "";

      // Await the category page fetch
      if (prop["Category"]?.relation?.[0]?.id) {
        const categoryPage = await notion.pages.retrieve({ page_id: prop["Category"].relation[0].id });
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
    console.error("Error fetching monthly income from Notion:", error);
    throw new Error("Failed to fetch monthly income from Notion.");
  }
}

async function fetchMonthlyInvFromNotion(): Promise<ExpenseItem[]> {
  if (!INVESTMENT_DB_ID) {
    throw new Error("EXP_SUB_CATEGORY_DB_ID is not set in environment variables.");
  }
  try {
    const response = await notion.databases.query({
      database_id: INVESTMENT_DB_ID,
      // Add sorts here if needed, e.g., by Year then Month
    });

      const items = await Promise.all(response.results.map(async (page) => {
      const prop = (page as any).properties;
      const expense = prop["This Month Investments"]["formula"]["number"];
      if(expense == 0)
      {
        return null; 
      }
      //prop["Sub Category"]["title"][0]["plain_text"];
      const categoryName = prop["Investment Account"]["title"][0]["plain_text"] || "";
      return {
        year: 2025,
        month: 'jun', // Or get from your data
        category: categoryName,
        subCategory: "",
        expense: `₹${expense}`,
      };
    }));

    return items.filter(item => item !== null) as ExpenseItem[];
  } catch (error) {
    console.error("Error fetching monthly income from Notion:", error);
    throw new Error("Failed to fetch monthly income from Notion.");
  }
}



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json({ error: "Notion API key is not configured." }, { status: 500 });
    }
    // Check for all required DB IDs
    const requiredDbIds = [
      { name: "EXP_SUB_CATEGORY_DB_ID", value: EXP_SUB_CATEGORY_DB_ID },
      { name: "INC_SUB_CATEGORY_DB_ID", value: INC_SUB_CATEGORY_DB_ID },
      { name: "INVESTMENT_DB_ID", value: INVESTMENT_DB_ID },
    ];

    for (const dbId of requiredDbIds) {
      if (!dbId.value && dbId.name !== "EXP_SUB_CATEGORY_DB_ID") { // EXP_SUB_CATEGORY_DB_ID is an old name, check for new ones
         // Allow specific DBs to be optional if desired by commenting out or conditional logic here
        // For now, all are required
        return NextResponse.json({ error: `${dbId.name} is not configured in environment variables.` }, { status: 500 });
      }
    }
    
    const [
      monthlyExpenses,
      monthlyIncome,
      monthlyInvestments
    ] = await Promise.all([
      fetchMonthlyExpensesFromNotion({ month: month ?? undefined, year: year ?? undefined }),
      fetchMonthlyIncomesFromNotion(),
      fetchMonthlyInvFromNotion(),
    ]);

    return NextResponse.json({
      monthlyExpenses,
      monthlyIncome,
      monthlyInvestments,
    });
  } catch (error) {
    console.error("Error in /api/financial-details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching financial details.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
