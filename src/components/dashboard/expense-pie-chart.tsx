
"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { name: "House & Utilities", value: 84000 },
  { name: "Groceries", value: 25000 },
  { name: "Children/Dependants", value: 20000 },
  { name: "Finance & Insurance", value: 17300 },
  { name: "Personal & Medical", value: 15000 },
  { name: "Transportation", value: 13000 },
  { name: "Other", value: 9300 },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#A78BFA', '#F59E0B', '#EF4444', '#B91C1C', '#DC2626'];

const totalAmount = data.reduce((sum, entry) => sum + entry.value, 0);

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

export function ExpensePieChart() {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="items-center pb-3">
        <CardTitle className="text-2xl font-bold">Selected Month expense</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Breakdown By Category</CardDescription>
      </CardHeader>
      <CardContent className="h-[480px] relative"> {/* Increased height for legend */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
            <Pie
              data={data}
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ lineHeight: '24px', paddingTop: '10px' }}
              iconSize={10}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-3xl font-bold text-foreground">
            ₹{(totalAmount / 1000).toFixed(1)}K
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
