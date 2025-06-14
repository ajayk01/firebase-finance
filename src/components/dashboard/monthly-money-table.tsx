
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MonthlyMoneyItem {
  month: string; // Full month name e.g., "January"
  totalExpense: number;
  totalIncome: number;
  totalInvestment: number;
  startingBankBalance: number; // Placeholder value
}

interface YearOption {
  value: number;
  label: string;
}

interface MonthlyMoneyTableProps {
  data: MonthlyMoneyItem[];
  selectedYear: number;
  onYearChange: (value: number) => void;
  years: YearOption[];
}

const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function MonthlyMoneyTable({
  data,
  selectedYear,
  onYearChange,
  years,
}: MonthlyMoneyTableProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-x-2 pb-4">
        <CardTitle className="text-xl font-semibold whitespace-nowrap">
          Monthly Financial Totals
        </CardTitle>
        <div className="flex space-x-2 min-w-[100px] flex-shrink-0">
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-4">Month</TableHead>
              <TableHead className="text-right py-3 px-4">Total Expense</TableHead>
              <TableHead className="text-right py-3 px-4">Total Income</TableHead>
              <TableHead className="text-right py-3 px-4">Total Investment</TableHead>
              <TableHead className="text-right py-3 px-4">Starting Bank Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.month}>
                  <TableCell className="font-medium py-3 px-4">{item.month}</TableCell>
                  <TableCell className={cn("text-right py-3 px-4", item.totalExpense > 0 ? "text-red-600" : "text-foreground")}>
                    {formatCurrency(item.totalExpense)}
                  </TableCell>
                  <TableCell className={cn("text-right py-3 px-4", item.totalIncome > 0 ? "text-green-600" : "text-foreground")}>
                    {formatCurrency(item.totalIncome)}
                  </TableCell>
                  <TableCell className={cn("text-right py-3 px-4", item.totalInvestment > 0 ? "text-primary" : "text-foreground")}>
                    {formatCurrency(item.totalInvestment)}
                  </TableCell>
                  <TableCell className="text-right py-3 px-4 text-muted-foreground">
                    {formatCurrency(item.startingBankBalance)}
                    <span className="text-xs italic ml-1">(placeholder)</span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No data available for the selected year.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
