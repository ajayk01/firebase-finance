
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title?: string;
  value?: string;
  percentageChange?: number;
  Icon?: LucideIcon;
  isPrimary?: boolean;
  dataAiHint?: string;
}

export function StatCard({ title, value, percentageChange, Icon, isPrimary = false }: StatCardProps) {
  const hasContent = !!(title || value || Icon || percentageChange !== undefined);
  const isPositive = percentageChange !== undefined && percentageChange >= 0;

  return (
    <Card className={cn(
      "shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl min-h-[8rem]", // Ensures card has size
      isPrimary ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
    )}>
      {hasContent ? (
        <>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {title && (
              <CardTitle className={cn(
                "text-sm font-medium",
                isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {title}
              </CardTitle>
            )}
            {Icon && (
              isPrimary ? (
                <Icon className="h-5 w-5 text-primary-foreground/80" />
              ) : (
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              )
            )}
          </CardHeader>
          <CardContent>
            {value && (
                <div className={cn("text-3xl font-bold", isPrimary ? "text-primary-foreground" : "text-foreground")}>{value}</div>
            )}
            {percentageChange !== undefined && (
              <p className={cn("text-xs flex items-center",
                isPrimary
                  ? (isPositive ? "text-green-300" : "text-red-300")
                  : "text-muted-foreground"
              )}>
                {isPositive ? (
                  <ArrowUp className={cn("h-4 w-4 mr-1", isPrimary ? "currentColor" : "text-green-500")} />
                ) : (
                  <ArrowDown className={cn("h-4 w-4 mr-1", isPrimary ? "currentColor" : "text-red-500")} />
                )}
                <span className={isPrimary ? "currentColor" : (isPositive ? "text-green-500" : "text-red-500")}>
                  {Math.abs(percentageChange)}%
                </span>
                <span className="ml-1">This month</span>
              </p>
            )}
          </CardContent>
        </>
      ) : null}
    </Card>
  );
}
