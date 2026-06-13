import Link from "next/link"
import { ArrowLeft, Building2, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function riskVariant(risk: string) {
  if (risk.toLowerCase() === "high") return "destructive"
  if (risk.toLowerCase() === "medium") return "secondary"
  return "outline"
}

function recommendedAction(vendorName: string, riskLevel: string) {
  if (vendorName === "Google Ads") {
    return "Review campaign ROI before the next billing cycle."
  }

  if (vendorName === "AWS") {
    return "Audit unused compute, database, and storage resources."
  }

  if (vendorName === "Unknown Vendor") {
    return "Investigate vendor and validate charge before approval."
  }

  if (riskLevel.toLowerCase() === "high") {
    return "Review this vendor before the next payment cycle."
  }

  return "No immediate action needed."
}

export default async function VendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      transactions: true,
    },
  })

  const enrichedVendors = vendors.map((vendor) => {
    const monthlySpend = Math.abs(
      vendor.transactions
        .filter((transaction) => transaction.direction === "outflow")
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    )

    const highestAnomalyScore = vendor.transactions.reduce(
      (max, transaction) => Math.max(max, transaction.anomalyScore),
      0
    )

    return {
      ...vendor,
      monthlySpend,
      highestAnomalyScore,
      change:
        vendor.name === "Google Ads"
          ? "+52%"
          : vendor.name === "AWS"
            ? "+38%"
            : vendor.name === "Unknown Vendor"
              ? "New"
              : "+0%",
    }
  })

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
          <h1 className="text-3xl font-semibold tracking-tight">
            Vendor Intelligence
          </h1>
          <p className="mt-2 text-muted-foreground">
            Identify vendor spikes, recurring spend, concentration risk, and recommended actions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {enrichedVendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{vendor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vendor.category}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <Building2 className="h-5 w-5" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Spend</p>
                    <p className="mt-1 font-semibold">
                      {formatCurrency(vendor.monthlySpend)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Change</p>
                    <p className="mt-1 flex items-center gap-1 font-semibold">
                      <TrendingUp className="h-3 w-3" />
                      {vendor.change}
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Risk</p>
                    <Badge className="mt-1" variant={riskVariant(vendor.riskLevel)}>
                      {vendor.riskLevel}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Recommended action</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {recommendedAction(vendor.name, vendor.riskLevel)}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Highest transaction anomaly score: {vendor.highestAnomalyScore}/100
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}