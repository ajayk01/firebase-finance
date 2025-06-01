
"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Office Software", value: 99.00 },
  { name: "Marketing", value: 430.00 }, // 250 (Ads) + 180 (Content)
  { name: "Utilities", value: 225.00 }, // 150 (Electricity) + 75 (Internet)
  { name: "Office Supplies", value: 165.00 }, // 45 (Stationery) + 120 (Snacks)
  { name: "Travel", value: 130.00 }, // 80 (Client Visit) + 50 (Commute)
  { name: "Software Tools", value: 49.00 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8442FF', '#FF5733'];

export function ExpensePieChart() {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              }}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{paddingTop: '10px'}} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
