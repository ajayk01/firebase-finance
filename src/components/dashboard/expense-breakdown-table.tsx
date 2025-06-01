
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
  { category: "Utilities", subCategory: "Electricity", expense: "$150.00" },
  { category: "Utilities", subCategory: "Internet", expense: "$75.00" },
  { category: "Software", subCategory: "CRM Subscription", expense: "$99.00" },
  { category: "Software", subCategory: "Accounting Tool", expense: "$49.00" },
  { category: "Marketing", subCategory: "Social Media Ads", expense: "$250.00" },
  { category: "Marketing", subCategory: "Content Creation", expense: "$180.00" },
  { category: "Office Supplies", subCategory: "Stationery", expense: "$45.00" },
  { category: "Office Supplies", subCategory: "Coffee & Snacks", expense: "$120.00" },
  { category: "Travel", subCategory: "Client Visit Fuel", expense: "$80.00" },
  { category: "Travel", subCategory: "Local Commute", expense: "$50.00" },
];

export function ExpenseBreakdownTable() {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Monthly Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Sub-category</TableHead>
                <TableHead className="text-right">Expense</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.subCategory}</TableCell>
                  <TableCell className="text-right">{item.expense}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
