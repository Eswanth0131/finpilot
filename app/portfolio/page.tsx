import Link from "next/link"
import { ArrowLeft, PieChart, ShieldAlert } from "lucide-react"
import { holdings, metrics } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PortfolioPage() {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0)
  const techExposure = holdings
    .filter((holding) => holding.sector === "Technology")
    .reduce((sum, holding) => sum + holding.allocation, 0)

  const simulatedDrawdown = totalValue * (techExposure / 100) * 0.08

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <Button asChild variant="ghost" className="mb-2 px-0">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Portfolio Risk Simulator</h1>
          <p className="mt-2 text-muted-foreground">
            Analyze concentration risk, sector exposure, and downside scenarios.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(totalValue)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Technology Exposure</p>
              <p className="mt-2 text-3xl font-semibold">{techExposure}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="mt-2 text-3xl font-semibold">{metrics.portfolioRiskScore}/100</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Holdings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {holdings.map((holding) => (
                <div key={holding.ticker} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{holding.ticker}</p>
                      <p className="text-sm text-muted-foreground">{holding.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{holding.allocation}%</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(holding.value)}
                      </p>
                    </div>
                  </div>
                  <Progress value={holding.allocation} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Risk Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary">Educational simulation</Badge>
              <p className="text-sm text-muted-foreground">
                If the technology sector drops 8%, this portfolio could decline by approximately:
              </p>
              <p className="text-3xl font-semibold text-red-500">
                -{formatCurrency(simulatedDrawdown)}
              </p>
              <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                FinPilot flags elevated technology concentration. This is risk analysis, not
                investment advice.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}