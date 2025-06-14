
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react"; // Keep ArrowUp/Down for general stats case
import { cn } from "@/lib/utils";

interface StatCardProps {
  title?: string;
  value?: string;
  percentageChange?: number;
  Icon?: LucideIcon;
  isPrimary?: boolean;
  dataAiHint?: string;
  logoIcon?: LucideIcon;
  bankName?: string;
  accountNumber?: string;
  currentBalanceText?: string;
}

export function StatCard({
  title,
  value,
  percentageChange,
  Icon,
  isPrimary = false,
  logoIcon: LogoIconComponent,
  bankName,
  accountNumber,
  currentBalanceText,
}: StatCardProps) {
  const showBankDetails = !!(LogoIconComponent || bankName || accountNumber || currentBalanceText);
  const showGeneralStats = !showBankDetails && !!(title || value || Icon || percentageChange !== undefined);

  return (
    <Card className={cn(
      "shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl min-h-[8rem]",
      "flex flex-col",
      // isPrimary && !showBankDetails ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground", // Removed primary background for bank details
      "bg-card text-card-foreground", // Default background for all cards now
      showBankDetails || showGeneralStats ? "p-4" : ""
    )}>
      {showBankDetails ? (
        <>
          <div className="flex items-center justify-start gap-3 mb-2">
            {LogoIconComponent && <LogoIconComponent className="h-8 w-8 text-primary" />}
            {bankName && <h3 className="text-lg font-semibold">{bankName}</h3>}
          </div>
          {currentBalanceText ? (
            <p className="text-xl font-semibold mt-1 text-foreground">₹{currentBalanceText}</p>
          ) : accountNumber ? (
            <p className="text-2xl font-bold tracking-wider">{accountNumber}</p>
          ) : null}
        </>
      ) : showGeneralStats ? (
        <>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 !p-0">
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
          <CardContent className="!p-0 pt-2">
            {value && (
                <div className={cn("text-3xl font-bold", isPrimary ? "text-primary-foreground" : "text-foreground")}>{value}</div>
            )}
            {percentageChange !== undefined && (
              <p className={cn("text-xs flex items-center mt-1",
                isPrimary
                  ? (percentageChange >= 0 ? "text-green-300" : "text-red-300")
                  : (percentageChange >= 0 ? "text-green-500" : "text-red-500")
              )}>
                {percentageChange >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>
                  {Math.abs(percentageChange)}%
                </span>
                <span className="ml-1 text-muted-foreground">This month</span>
              </p>
            )}
          </CardContent>
        </>
      ) : (
        null
      )}
    </Card>
  );
}
