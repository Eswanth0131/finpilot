import Link from "next/link"
import { ArrowLeft, Brain, Cloud, Database, Globe, Layers, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const layers = [
  {
    title: "Vercel Frontend",
    icon: Globe,
    description: "Next.js app deployed on Vercel with a polished fintech SaaS interface.",
  },
  {
    title: "Next.js API Layer",
    icon: Layers,
    description: "Server routes handle analytics, database access, and agent orchestration.",
  },
  {
    title: "Amazon Aurora PostgreSQL",
    icon: Database,
    description:
      "Relational system of record for organizations, accounts, transactions, vendors, portfolios, forecasts, alerts, and agent runs.",
  },
  {
    title: "Amazon Bedrock",
    icon: Brain,
    description:
      "AI reasoning layer that explains financial changes and generates CFO-style memos from structured context.",
  },
  {
    title: "AWS-Native Deployment",
    icon: Cloud,
    description: "Designed around scalable AWS database infrastructure for real production use.",
  },
  {
    title: "Audit Trail",
    icon: ShieldCheck,
    description:
      "Each AI answer can store the user query, response, confidence, and records used back into Aurora.",
  },
]

export default function ArchitecturePage() {
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
          <h1 className="text-3xl font-semibold tracking-tight">Architecture</h1>
          <p className="mt-2 text-muted-foreground">
            FinPilot is built as a production-style full-stack fintech application using Vercel,
            AWS Aurora PostgreSQL, and Amazon Bedrock.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm md:grid-cols-5">
              {["User", "Vercel Next.js", "API Routes", "Aurora PostgreSQL", "Amazon Bedrock"].map(
                (item, index) => (
                  <div key={item} className="rounded-xl border p-4 text-center">
                    <p className="font-medium">{item}</p>
                    {index < 4 && (
                      <p className="mt-2 text-muted-foreground md:hidden">↓</p>
                    )}
                  </div>
                )
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The AI agent retrieves structured financial data from Aurora PostgreSQL, calculates
              analytics in the backend, sends relevant context to Amazon Bedrock, and stores the
              response with an audit trail.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {layers.map((layer) => {
            const Icon = layer.icon

            return (
              <Card key={layer.title}>
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{layer.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Database Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm md:grid-cols-3">
              {[
                "organizations",
                "accounts",
                "transactions",
                "vendors",
                "portfolios",
                "holdings",
                "forecasts",
                "alerts",
                "agent_runs",
              ].map((table) => (
                <div key={table} className="rounded-lg border p-3 font-mono">
                  {table}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}