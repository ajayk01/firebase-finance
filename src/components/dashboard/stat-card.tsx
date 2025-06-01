
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  percentageChange: number;
  Icon: LucideIcon;
  dataAiHint?: string;
}

export function StatCard({ title, value, percentageChange, Icon }: StatCardProps) {
  const isPositive = percentageChange >= 0;
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {Math.abs(percentageChange)}%
          </span>{" "}
          This month
        </p>
      </CardContent>
    </Card>
  );
}
