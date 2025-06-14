
"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect } from 'react';

const pieChartRawData = [
  // January
  { month: "jan", name: "Housing Jan", value: 75000 },
  { month: "jan", name: "Food Jan", value: 22000 },
  { month: "jan", name: "Transport Jan", value: 12000 },
  { month: "jan", name: "Savings Jan", value: 10000 },
  // February
  { month: "feb", name: "Utilities Feb", value: 18000 },
  { month: "feb", name: "Entertainment Feb", value: 10000 },
  { month: "feb", name: "Subscriptions Feb", value: 5000 },
  // March
  { month: "mar", name: "Shopping Mar", value: 30000 },
  { month: "mar", name: "Healthcare Mar", value: 15000 },
  { month: "mar", name: "Gifts Mar", value: 8000 },
  // April
  { month: "apr", name: "Rent Apr", value: 90000 },
  { month: "apr", name: "Groceries Apr", value: 28000 },
  // May
  { month: "may", name: "Travel May", value: 40000 },
  { month: "may", name: "Dining Out May", value: 12000 },
  // June
  { month: "jun", name: "Home Improvement Jun", value: 25000 },
  { month: "jun", name: "Education Jun", value: 18000 },
  // July
  { month: "jul", name: "House & Utilities", value: 84000 },
  { month: "jul", name: "Groceries", value: 25000 },
  { month: "jul", name: "Children/Dependants", value: 20000 },
  { month: "jul", name: "Finance & Insurance", value: 17300 },
  { month: "jul", name: "Personal & Medical", value: 15000 },
  { month: "jul", name: "Transportation", value: 13000 },
  { month: "jul", name: "Other", value: 9300 },
  // Add more sample data for other months as needed
  { month: "aug", name: "Vacation Aug", value: 100000 },
  { month: "aug", name: "Souvenirs Aug", value: 5000 },
];


const COLORS = ['#3B82F6', '#8B5CF6', '#A78BFA', '#F59E0B', '#EF4444', '#B91C1C', '#DC2626', '#10B981', '#6366F1', '#F97316'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, value, name, fill }: any) => {
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);

  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 20;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const labelColor = fill;

  let formattedValue = `₹${(value / 1000).toFixed(1)}K`;
  if (value === 0) formattedValue = '₹0K';
  if (value % 1000 === 0 && value !== 0) {
    formattedValue = `₹${(value / 1000).toFixed(0)}K`;
  }

  if (percent < 0.05) return null; // Hide label if slice is too small

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={labelColor} fill="none" strokeWidth={1.5} />
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" dominantBaseline="central">
        <tspan x={ex + (cos >= 0 ? 1 : -1) * 8} dy="-0.5em" className="font-semibold text-sm">
          {formattedValue}
        </tspan>
        <tspan x={ex + (cos >= 0 ? 1 : -1) * 8} dy="1.1em" className="text-xs text-muted-foreground">
          {name}
        </tspan>
      </text>
    </g>
  );
};

interface ExpensePieChartProps {
  selectedMonth: string;
}

export function ExpensePieChart({ selectedMonth }: ExpensePieChartProps) {
  const chartData = pieChartRawData.filter(item => item.month === selectedMonth);
  const totalAmount = chartData.reduce((sum, entry) => sum + entry.value, 0);

  // useEffect(() => {
  //   console.log("Pie chart selected month:", selectedMonth, "Chart Data:", chartData);
  // }, [selectedMonth, chartData]);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="items-center pb-3">
        <CardTitle className="text-2xl font-bold">Selected Month expense</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Breakdown By Category</CardDescription>
      </CardHeader>
      <CardContent className="h-[380px] relative">
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  innerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={1}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl font-bold text-foreground">
                ₹{(totalAmount / 1000).toFixed(1)}K
              </p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg text-muted-foreground">
              No expense data for the selected month.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
