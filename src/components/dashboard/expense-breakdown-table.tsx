
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const expenseData = [
  // January
  { month: "jan", category: "Office Lease", subCategory: "Monthly Rent", expense: "₹500.00" },
  { month: "jan", category: "Software", subCategory: "Project Management Tool", expense: "₹150.00" },
  // February
  { month: "feb", category: "Utilities", subCategory: "Internet Bill", expense: "₹70.00" },
  { month: "feb", category: "Travel", subCategory: "Client Meeting Commute", expense: "₹120.00" },
  { month: "feb", category: "Marketing", subCategory: "Online Ads Feb", expense: "₹300.00" },
  // March
  { month: "mar", category: "Office Supplies", subCategory: "Printer Ink & Paper", expense: "₹60.00" },
  { month: "mar", category: "Professional Dev", subCategory: "Online Course", expense: "₹200.00" },
  // April
  { month: "apr", category: "Utilities April", subCategory: "Electricity", expense: "₹180.00" },
  // May
  { month: "may", category: "Marketing May", subCategory: "Flyers", expense: "₹100.00" },
  // June
  { month: "jun", category: "Software June", subCategory: "Antivirus", expense: "₹50.00" },
  // July
  { month: "jul", category: "Office Software", subCategory: "CRM Subscription", expense: "₹99.00" },
  { month: "jul", category: "Marketing", subCategory: "Social Media Ads", expense: "₹250.00" },
  { month: "jul", category: "Utilities", subCategory: "Electricity Bill", expense: "₹150.00" },
  { month: "jul", category: "Office Supplies", subCategory: "Stationery & Printing", expense: "₹45.00" },
  { month: "jul", category: "Travel", subCategory: "Client Visit Fuel", expense: "₹80.00" },
  { month: "jul", category: "Utilities", subCategory: "Internet Services", expense: "₹75.00" },
  { month: "jul", category: "Software Tools", subCategory: "Accounting Software", expense: "₹49.00" },
  { month: "jul", category: "Marketing", subCategory: "Content Creation Services", expense: "₹180.00" },
  { month: "jul", category: "Office Supplies", subCategory: "Coffee & Team Snacks", expense: "₹120.00" },
  { month: "jul", category: "Travel", subCategory: "Local Commute Reimbursement", expense: "₹50.00" },
  // August
  { month: "aug", category: "Team Event Aug", subCategory: "Lunch", expense: "₹220.00" },
  // September
  { month: "sep", category: "Hardware Sep", subCategory: "New Mouse", expense: "₹30.00" },
  // October
  { month: "oct", category: "Marketing Oct", subCategory: "SEO Consultation", expense: "₹400.00" },
  // November
  { month: "nov", category: "Utilities Nov", subCategory: "Water Bill", expense: "₹40.00" },
  // December
  { month: "dec", category: "Gifts Dec", subCategory: "Client Gifts", expense: "₹350.00" },
];

interface MonthOption {
  value: string;
  label: string;
}

interface ExpenseBreakdownTableProps {
  title: string;
  selectedMonth?: string;
  onMonthChange?: (value: string) => void;
  months?: MonthOption[];
}

export function ExpenseBreakdownTable({ title, selectedMonth, onMonthChange, months }: ExpenseBreakdownTableProps) {
  const displayedData = selectedMonth
    ? expenseData.filter(item => item.month === selectedMonth)
    : expenseData.filter(item => item.month === "jul"); // Default to July if no month selected (e.g. for credit card table)

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-x-2">
        <CardTitle className="text-xl font-semibold whitespace-nowrap">{title}</CardTitle>
        {selectedMonth && onMonthChange && months && (
          <div className="min-w-[180px] flex-shrink-0">
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-4">Category</TableHead>
              <TableHead className="py-3 px-4">Sub-category</TableHead>
              <TableHead className="text-right py-3 px-4">Expense</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((item, index) => (
                <TableRow key={`${item.month}-${item.category}-${item.subCategory}-${index}`}>
                  <TableCell className="font-medium py-3 px-4">{item.category}</TableCell>
                  <TableCell className="py-3 px-4">{item.subCategory}</TableCell>
                  <TableCell className="text-right py-3 px-4 text-red-600 font-medium">{item.expense}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                  No expenses recorded for the selected month.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
