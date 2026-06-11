import Link from "next/link"
import { ArrowLeft, Building2, TrendingUp } from "lucide-react"
import { vendors } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function riskVariant(risk: string) {
  if (risk === "High") return "destructive"
  if (risk === "Medium") return "secondary"
  return "outline"
}

export default function VendorsPage() {
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
          <h1 className="text-3xl font-semibold tracking-tight">Vendor Intelligence</h1>
          <p className="mt-2 text-muted-foreground">
            Identify vendor spikes, recurring spend, concentration risk, and recommended actions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {vendors.map((vendor) => (
            <Card key={vendor.name}>
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
                    <p className="mt-1 font-semibold">{formatCurrency(vendor.monthlySpend)}</p>
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
                    <Badge className="mt-1" variant={riskVariant(vendor.risk)}>
                      {vendor.risk}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Recommended action</p>
                  <p className="mt-1 text-sm text-muted-foreground">{vendor.action}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}