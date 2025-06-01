"use client"
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";


export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold md:text-2xl">Financial Dashboard</h1>
      <div className="ml-auto flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
    </header>
  );
}
