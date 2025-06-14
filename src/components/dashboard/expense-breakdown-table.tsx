
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

interface ExpenseItem {
  month: string;
  category: string;
  subCategory: string;
  expense: string;
}

interface MonthOption {
  value: string;
  label: string;
}

interface ExpenseBreakdownTableProps {
  title: string;
  selectedMonth?: string;
  onMonthChange?: (value: string) => void;
  months?: MonthOption[];
  data: ExpenseItem[]; 
}

export function ExpenseBreakdownTable({ title, selectedMonth, onMonthChange, months, data }: ExpenseBreakdownTableProps) {
  
  const displayedData = [...data].sort((a, b) => a.category.localeCompare(b.category));

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
                  <TableCell className="text-right py-3 px-4 text-red-600 font-medium">₹{item.expense.replace('₹', '')}</TableCell>
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
