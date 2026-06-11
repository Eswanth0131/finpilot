import Link from "next/link"
import { ArrowLeft, Bot, Database, Sparkles } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const suggestedPrompts = [
  "Why did burn increase this month?",
  "What vendors should I review?",
  "How much runway do I have?",
  "What is my biggest portfolio risk?",
  "Generate a CFO memo.",
]

export default async function AgentPage() {
  const latestAgentRun = await prisma.agentRun.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      organization: true,
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
          <h1 className="text-3xl font-semibold tracking-tight">FinPilot AI Agent</h1>
          <p className="mt-2 text-muted-foreground">
            Ask finance questions grounded in transactions, vendors, forecasts, and portfolio data.
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

        <Card>
          <CardHeader>
            <CardTitle>Ask FinPilot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ask: Why did burn increase this month?"
              className="min-h-28 resize-none"
            />

            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <Button key={prompt} variant="outline" size="sm">
                  {prompt}
                </Button>
              ))}
            </div>

            <Button>Run financial analysis</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Stored Agent Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6">
            {latestAgentRun ? (
              <>
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    User query
                  </p>
                  <p className="mt-1 font-medium">{latestAgentRun.userQuery}</p>
                </div>

                <p>{latestAgentRun.answer}</p>

                <div className="rounded-lg border p-4">
                  <p className="font-medium">Audit metadata</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>Organization: {latestAgentRun.organization.name}</li>
                    <li>Confidence: {Math.round(latestAgentRun.confidence * 100)}%</li>
                    <li>
                      Created:{" "}
                      {latestAgentRun.createdAt.toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-muted p-4 text-muted-foreground">
                  Records used: {JSON.stringify(latestAgentRun.recordsUsed)}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                No agent runs found. Seed the database or run an analysis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}