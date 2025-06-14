
"use client"

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseItem {
  year: number;
  month: string;
  category: string;
  subCategory: string;
  expense: string; 
}

interface MonthOption {
  value: string;
  label: string;
}

interface YearOption {
  value: number;
  label: string;
}

interface ExpenseBreakdownTableProps {
  title: string;
  selectedMonth?: string;
  onMonthChange?: (value: string) => void;
  months?: MonthOption[];
  selectedYear?: number;
  onYearChange?: (value: number) => void;
  years?: YearOption[];
  data: ExpenseItem[];
}

interface CategorizedExpenseGroup {
  categoryName: string;
  items: ExpenseItem[];
  categoryTotal: number;
}

const parseCurrency = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace('₹', '').replace(/,/g, ''));
};

export function ExpenseBreakdownTable({ 
  title, 
  selectedMonth, 
  onMonthChange, 
  months, 
  selectedYear,
  onYearChange,
  years,
  data 
}: ExpenseBreakdownTableProps) {

  const { categorizedData, grandTotal } = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { categorizedData: [], grandTotal: 0 };
    }

    const categoriesMap = new Map<string, { items: ExpenseItem[], total: number }>();
    let calculatedGrandTotal = 0;

    data.forEach(item => {
      const expenseValue = parseCurrency(item.expense);
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, { items: [], total: 0 });
      }
      const categoryGroup = categoriesMap.get(item.category)!;
      categoryGroup.items.push(item);
      categoryGroup.total += expenseValue;
      calculatedGrandTotal += expenseValue;
    });

    const sortedCategorizedData = Array.from(categoriesMap.entries()).map(([categoryName, groupData]) => ({
      categoryName,
      items: groupData.items,
      categoryTotal: groupData.total,
    })).sort((a, b) => a.categoryName.localeCompare(b.categoryName));

    return { categorizedData: sortedCategorizedData, grandTotal: calculatedGrandTotal };
  }, [data]);

  const showSelectors = selectedMonth && onMonthChange && months && selectedYear !== undefined && onYearChange && years;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-x-2 pb-4">
        <CardTitle className="text-xl font-semibold whitespace-nowrap">{title}</CardTitle>
        {showSelectors && (
          <div className="flex space-x-2 min-w-[180px] flex-shrink-0">
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
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => onYearChange(parseInt(value, 10))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value.toString()}>
                    {year.label}
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
            {categorizedData.length > 0 ? (
              categorizedData.map((group) => (
                <React.Fragment key={group.categoryName}>
                  {group.items.map((item, itemIndex) => (
                    <TableRow key={`${item.year}-${item.month}-${item.category}-${item.subCategory}-${itemIndex}`}>
                      <TableCell className="font-medium py-3 px-4">{item.category}</TableCell>
                      <TableCell className="py-3 px-4">{item.subCategory}</TableCell>
                      <TableCell className="text-right py-3 px-4 text-red-600 font-medium">
                        ₹{parseCurrency(item.expense).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="py-2 px-4 font-semibold"></TableCell>
                    <TableCell className="py-2 px-4 font-semibold text-right">{group.categoryName} Total</TableCell>
                    <TableCell className="text-right py-2 px-4 text-red-700 font-semibold">
                      ₹{group.categoryTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                  No expenses recorded for the selected month and year.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {categorizedData.length > 0 && (
            <TableFooter>
              <TableRow className="bg-card font-bold text-base">
                <TableCell colSpan={2} className="text-right py-3 px-4">Grand Total</TableCell>
                <TableCell className="text-right py-3 px-4 text-red-700">
                  ₹{grandTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
