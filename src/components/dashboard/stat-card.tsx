
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown, Landmark } from "lucide-react"; // Keep ArrowUp/Down for general stats case
import { cn } from "@/lib/utils";

interface StatCardProps {
  title?: string;
  value?: string;
  percentageChange?: number;
  Icon?: LucideIcon; // For general stats (small icon usually top right)
  isPrimary?: boolean;
  dataAiHint?: string;
  logoIcon?: LucideIcon; // For bank logo (larger icon, specific to primary bank card)
  bankName?: string;
  accountNumber?: string;
  // Optional: add a currentBalance prop if needed later
  // currentBalance?: string;
}

export function StatCard({
  title,
  value,
  percentageChange,
  Icon,
  isPrimary = false,
  logoIcon: LogoIconComponent, // Use alias for the component to avoid naming conflict
  bankName,
  accountNumber,
  // currentBalance
}: StatCardProps) {
  // Determine if we should show bank details (only for primary cards with relevant info)
  const showBankDetails = isPrimary && (LogoIconComponent || bankName || accountNumber);
  // Determine if we should show general stats (if not showing bank details and general info is present)
  const showGeneralStats = !showBankDetails && !!(title || value || Icon || percentageChange !== undefined);

  return (
    <Card className={cn(
      "shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl min-h-[8rem]",
      "flex flex-col", // Use flex to structure content within the card
      isPrimary ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
      // Add padding only if there's content to display
      showBankDetails || showGeneralStats ? "p-4" : ""
    )}>
      {showBankDetails ? (
        <>
          <div className="flex items-start justify-between mb-2">
            {bankName && <h3 className="text-xl font-semibold">{bankName}</h3>}
            {LogoIconComponent && <LogoIconComponent className="h-8 w-8 text-primary-foreground/80" />}
          </div>
          {accountNumber && <p className="text-2xl font-bold tracking-wider">{accountNumber}</p>}
          {/* 
          Example for future use if a currentBalance prop is added:
          {currentBalance && (
            <p className="text-sm text-primary-foreground/70 mt-auto pt-2">
              Current Balance: {currentBalance}
            </p>
          )}
          */}
        </>
      ) : showGeneralStats ? (
        // This section renders general statistics if bank details aren't shown.
        // It assumes CardHeader and CardContent handle their own padding, so resets are used.
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
            {Icon && ( // This 'Icon' is for the small general stat icon
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
        // If neither bank details nor general stats are shown, render null.
        // The min-h-[8rem] on the Card itself ensures it's visible as an empty box.
        null
      )}
    </Card>
  );
}
