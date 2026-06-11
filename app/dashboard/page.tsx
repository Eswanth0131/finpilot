import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Flame,
  LineChart,
  Wallet,
} from "lucide-react";
import { metrics, burnData, transactions } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const topAlerts = transactions
    .filter((transaction) => transaction.anomalyScore > 50)
    .sort((a, b) => b.anomalyScore - a.anomalyScore);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-muted-foreground">Atlas Fintech Demo</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Finance Command Center
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/transactions">Transactions</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/vendors">Vendors</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/portfolio">Portfolio</Link>
            </Button>
            <Button asChild>
              <Link href="/agent">
                Ask FinPilot Agent <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard
            title="Cash Balance"
            value={formatCurrency(metrics.cashBalance)}
            icon={<Wallet />}
          />
          <MetricCard
            title="Monthly Burn"
            value={formatCurrency(metrics.monthlyBurn)}
            icon={<Flame />}
          />
          <MetricCard
            title="Runway"
            value={`${metrics.runwayMonths} months`}
            icon={<LineChart />}
          />
          <MetricCard
            title="Revenue"
            value={formatCurrency(metrics.revenueThisMonth)}
            icon={<Banknote />}
          />
          <MetricCard
            title="Alerts"
            value={String(metrics.anomalyAlerts)}
            icon={<AlertTriangle />}
          />
          <MetricCard
            title="Risk Score"
            value={`${metrics.portfolioRiskScore}/100`}
            icon={<LineChart />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Burn vs Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {burnData.map((item) => (
                  <div
                    key={item.month}
                    className="grid grid-cols-[48px_1fr_80px] items-center gap-3"
                  >
                    <div className="text-sm text-muted-foreground">
                      {item.month}
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min((item.burn / 25000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-right text-sm">
                      {formatCurrency(item.burn)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Financial Risks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topAlerts.map((alert) => (
                <div key={alert.vendor} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.vendor}</p>
                    <span className="text-sm text-red-500">
                      {alert.anomalyScore}/100
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {alert.explanation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
