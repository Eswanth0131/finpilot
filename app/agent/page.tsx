import Link from "next/link"
import { ArrowLeft, Bot, Database, Sparkles } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { AgentClient } from "@/app/agent/agent-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function AgentPage() {
  const latestAgentRun = await prisma.agentRun.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  })

  const recentAgentRuns = await prisma.agentRun.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  const initialAudit = latestAgentRun
    ? {
        model: process.env.BEDROCK_MODEL_ID ?? "us.amazon.nova-pro-v1:0",
        database: "PostgreSQL / Aurora-compatible",
        confidence: latestAgentRun.confidence,
        recordsUsed: latestAgentRun.recordsUsed as {
          tables?: string[]
          highRiskTransactionCount?: number
        },
        createdAt: latestAgentRun.createdAt.toISOString(),
      }
    : undefined

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Button asChild variant="ghost" className="mb-2 px-0">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">
            FinPilot AI Agent
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ask finance questions grounded in transactions, vendors, forecasts,
            and portfolio data.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <Bot className="mb-3 h-5 w-5" />
              <p className="font-medium">Amazon Bedrock</p>
              <p className="mt-1 text-sm text-muted-foreground">
                LLM reasoning layer for explanations and memos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Database className="mb-3 h-5 w-5" />
              <p className="font-medium">Aurora PostgreSQL</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Structured financial records and audit logs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Sparkles className="mb-3 h-5 w-5" />
              <p className="font-medium">Explainable outputs</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Answers cite metrics, vendors, and records used.
              </p>
            </CardContent>
          </Card>
        </div>

        <AgentClient
          initialAnswer={latestAgentRun?.answer}
          initialAudit={initialAudit}
        />

        <Card>
          <CardHeader>
            <CardTitle>Recent Agent Runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAgentRuns.length > 0 ? (
              recentAgentRuns.map((run) => (
                <div key={run.id} className="rounded-lg border p-4">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <p className="font-medium">{run.userQuery}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {run.answer.slice(0, 160)}
                        {run.answer.length > 160 ? "..." : ""}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(run.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No agent runs yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}