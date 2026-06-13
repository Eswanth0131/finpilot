import Link from "next/link"
import { ArrowLeft, Bot, Database, Sparkles } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { AgentClient } from "@/app/agent/agent-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function AgentPage() {
  const latestAgentRun = await prisma.agentRun.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  })

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

        <AgentClient initialAnswer={latestAgentRun?.answer} />
      </div>
    </main>
  )
}