"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  getTransactions,
  getCampaigns,
  formatCurrency,
  formatDate,
  Transaction,
  Campaign,
} from "@/lib/finance";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  brandPayments: number;
  creatorPayouts: number;
  operatingExpenses: number;
  pendingReceivables: number;
  unmatchedCount: number;
  recentTransactions: Transaction[];
  activeCampaigns: Campaign[];
}

function calculateStats(
  transactions: Transaction[],
  campaigns: Campaign[]
): DashboardStats {
  const credits = transactions.filter((t) => t.type === "credit");
  const debits = transactions.filter((t) => t.type === "debit");

  const totalIncome = credits.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = debits.reduce((sum, t) => sum + t.amount, 0);

  const brandPayments = transactions
    .filter((t) => t.category === "brand_payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const creatorPayouts = transactions
    .filter((t) => t.category === "creator_payout")
    .reduce((sum, t) => sum + t.amount, 0);

  const operatingExpenses = transactions
    .filter((t) => t.category === "operating_expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingReceivables = campaigns
    .filter((c) => c.status === "pending_payment" || c.status === "active")
    .reduce((sum, c) => sum + c.totalBudget, 0);

  const unmatchedCount = transactions.filter(
    (t) => t.category === "uncategorized"
  ).length;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active" || c.status === "pending_payment"
  );

  return {
    totalIncome,
    totalExpenses,
    netCashFlow: totalIncome - totalExpenses,
    brandPayments,
    creatorPayouts,
    operatingExpenses,
    pendingReceivables,
    unmatchedCount,
    recentTransactions,
    activeCampaigns,
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transactions = getTransactions();
    const campaigns = getCampaigns();
    setStats(calculateStats(transactions, campaigns));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!stats) return null;

  const hasData = stats.recentTransactions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your finances and campaigns
        </p>
      </div>

      {/* Alert for unmatched transactions */}
      {stats.unmatchedCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {stats.unmatchedCount} transactions need review
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Categorize them for accurate reporting
            </p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/transactions?filter=uncategorized">
              Review Now
            </Link>
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!hasData && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No transactions yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Import your Chase bank statement to start tracking your finances
              and matching transactions to campaigns.
            </p>
            <Button asChild>
              <Link href="/admin/transactions?import=true">
                Import Chase CSV
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {hasData && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalIncome)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {stats.recentTransactions.filter((t) => t.type === "credit").length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {stats.recentTransactions.filter((t) => t.type === "debit").length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Cash Flow
                </CardTitle>
                {stats.netCashFlow >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    stats.netCashFlow >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {formatCurrency(stats.netCashFlow)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Income minus expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Receivables
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.pendingReceivables)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {stats.activeCampaigns.length} active campaigns
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Income Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Brand Payments</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(stats.brandPayments)}
                  </span>
                </div>
                <Progress
                  value={
                    stats.totalIncome > 0
                      ? (stats.brandPayments / stats.totalIncome) * 100
                      : 0
                  }
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Creator Payouts</span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(stats.creatorPayouts)}
                    </span>
                  </div>
                  <Progress
                    value={
                      stats.totalExpenses > 0
                        ? (stats.creatorPayouts / stats.totalExpenses) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-sm">Operating Expenses</span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(stats.operatingExpenses)}
                    </span>
                  </div>
                  <Progress
                    value={
                      stats.totalExpenses > 0
                        ? (stats.operatingExpenses / stats.totalExpenses) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/transactions">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          txn.type === "credit"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        )}
                      >
                        {txn.type === "credit" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {txn.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-medium",
                          txn.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {txn.type === "credit" ? "+" : "-"}
                        {formatCurrency(txn.amount)}
                      </p>
                      <Badge
                        variant={
                          txn.category === "uncategorized"
                            ? "outline"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {txn.category.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
