
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const expenseData = [
  { category: "Office Software", subCategory: "CRM Subscription", expense: "$99.00" },
  { category: "Marketing", subCategory: "Social Media Ads", expense: "$250.00" },
  { category: "Utilities", subCategory: "Electricity Bill", expense: "$150.00" },
  { category: "Office Supplies", subCategory: "Stationery & Printing", expense: "$45.00" },
  { category: "Travel", subCategory: "Client Visit Fuel", expense: "$80.00" },
  { category: "Utilities", subCategory: "Internet Services", expense: "$75.00" },
  { category: "Software Tools", subCategory: "Accounting Software", expense: "$49.00" },
  { category: "Marketing", subCategory: "Content Creation Services", expense: "$180.00" },
  { category: "Office Supplies", subCategory: "Coffee & Team Snacks", expense: "$120.00" },
  { category: "Travel", subCategory: "Local Commute Reimbursement", expense: "$50.00" },
];

export function ExpenseBreakdownTable() {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-3 px-4">Category</TableHead>
                <TableHead className="py-3 px-4">Sub-category</TableHead>
                <TableHead className="text-right py-3 px-4">Expense</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium py-3 px-4">{item.category}</TableCell>
                  <TableCell className="py-3 px-4">{item.subCategory}</TableCell>
                  <TableCell className="text-right py-3 px-4 text-emerald-600 font-medium">{item.expense}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
