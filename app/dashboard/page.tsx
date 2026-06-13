import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Flame,
  LineChart,
  Wallet,
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function DashboardPage() {
  const organization = await prisma.organization.findFirst({
    include: {
      accounts: true,
      transactions: {
        orderBy: {
          date: "desc",
        },
        include: {
          vendor: true,
        },
      },
      alerts: {
        orderBy: {
          createdAt: "desc",
        },
      },
      forecasts: true,
      portfolios: {
        include: {
          holdings: true,
        },
      },
    },
  })

  if (!organization) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No demo data found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Seed the database before viewing the dashboard.
            </p>
            <code className="block rounded-lg bg-muted p-3 text-sm">
              npx prisma db seed
            </code>
          </CardContent>
        </Card>
      </main>
    )
  }

  const operatingAccount = organization.accounts[0]
  const baseForecast =
    organization.forecasts.find((forecast) => forecast.scenario === "base") ??
    organization.forecasts[0]

  const revenueThisMonth = organization.transactions
    .filter((transaction) => transaction.direction === "inflow")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const monthlyBurn = Math.abs(
    organization.transactions
      .filter((transaction) => transaction.direction === "outflow")
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  )

  const anomalyAlerts = organization.transactions.filter(
    (transaction) => transaction.anomalyScore > 50
  ).length

  const portfolio = organization.portfolios[0]
  const holdings = portfolio?.holdings ?? []

  const techExposure = holdings
    .filter((holding) => holding.sector === "Technology")
    .reduce((sum, holding) => sum + holding.allocationPercent, 0)

  const portfolioRiskScore = Math.min(100, Math.round(techExposure * 1.6))

  const topAlerts = organization.transactions
    .filter((transaction) => transaction.anomalyScore > 50)
    .sort((a, b) => b.anomalyScore - a.anomalyScore)

  const burnData = [
    { month: "Jan", burn: 16200 },
    { month: "Feb", burn: 17100 },
    { month: "Mar", burn: 18400 },
    { month: "Apr", burn: 19600 },
    { month: "May", burn: 20500 },
    { month: "Jun", burn: monthlyBurn },
  ]

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-muted-foreground">{organization.name}</p>
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
            value={formatCurrency(operatingAccount?.balance ?? 0)}
            icon={<Wallet />}
          />
          <MetricCard
            title="Monthly Burn"
            value={formatCurrency(monthlyBurn)}
            icon={<Flame />}
          />
          <MetricCard
            title="Runway"
            value={`${baseForecast?.projectedRunwayMonths ?? 0} months`}
            icon={<LineChart />}
          />
          <MetricCard
            title="Revenue"
            value={formatCurrency(revenueThisMonth)}
            icon={<Banknote />}
          />
          <MetricCard
            title="Alerts"
            value={String(anomalyAlerts)}
            icon={<AlertTriangle />}
          />
          <MetricCard
            title="Risk Score"
            value={`${portfolioRiskScore}/100`}
            icon={<LineChart />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Burn Trend</CardTitle>
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
                <div key={alert.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {alert.vendor?.name ?? alert.description}
                    </p>
                    <span className="text-sm text-red-500">
                      {alert.anomalyScore}/100
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
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
  )
}