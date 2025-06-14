
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // In a real application, you would fetch this data from a database or Notion API.
  // For now, we return mock data.

  const mockBankAccounts = [
    { id: 'bank1', name: "Global Trust Bank (Savings)", balance: 600000 },
    { id: 'bank2', name: "Global Trust Bank (Current)", balance: 125000 },
    { id: 'bank3', name: "City Commercial Bank", balance: 350000 },
    { id: 'bank4', name: "National Cooperative", balance: 85000 },
  ];

  const mockCreditCards = [
    { id: 'cc1', name: "Visa Platinum", usedAmount: 15000, totalLimit: 75000 },
    { id: 'cc2', name: "Mastercard Gold", usedAmount: 22500, totalLimit: 100000 },
    { id: 'cc3', name: "Amex Rewards", usedAmount: 8200, totalLimit: 50000 },
    { id: 'cc4', name: "Discover It", usedAmount: 31000, totalLimit: 120000 },
  ];

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  return NextResponse.json({
    bankAccounts: mockBankAccounts,
    creditCards: mockCreditCards,
  });
}
