"use client"

import { useState } from "react"
import { CheckCircle2, Database, Loader2, Server, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const suggestedPrompts = [
  "Why did burn increase this month?",
  "What vendors should I review?",
  "How much runway do I have?",
  "What is my biggest portfolio risk?",
  "Generate a CFO memo.",
]

type AgentAudit = {
  model: string
  database: string
  confidence: number
  recordsUsed: {
    tables?: string[]
    highRiskTransactionCount?: number
  }
  createdAt: string
}

export function AgentClient({
  initialAnswer,
  initialAudit,
}: {
  initialAnswer?: string
  initialAudit?: AgentAudit
}) {
  const [userQuery, setUserQuery] = useState("Why did burn increase this month?")
  const [answer, setAnswer] = useState(initialAnswer ?? "")
  const [audit, setAudit] = useState<AgentAudit | undefined>(initialAudit)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function runAgent(queryOverride?: string) {
    const query = queryOverride ?? userQuery

    if (!query.trim()) {
      setError("Enter a finance question first.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery: query,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to run FinPilot agent.")
      }

      setAnswer(data.answer)
      setAudit(data.audit)
      setUserQuery(query)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ask FinPilot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={userQuery}
            onChange={(event) => setUserQuery(event.target.value)}
            placeholder="Ask: Why did burn increase this month?"
            className="min-h-28 resize-none"
          />

          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => {
                  setUserQuery(prompt)
                  runAgent(prompt)
                }}
              >
                {prompt}
              </Button>
            ))}
          </div>

          <Button onClick={() => runAgent()} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Bedrock analysis...
              </>
            ) : (
              "Run financial analysis"
            )}
          </Button>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent Response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6">
          {answer ? (
            <div className="whitespace-pre-wrap">{answer}</div>
          ) : (
            <p className="text-muted-foreground">
              Run a financial analysis to generate a Bedrock-powered response.
            </p>
          )}
        </CardContent>
      </Card>

      {audit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Agent Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="h-4 w-4" />
                  Model
                </div>
                <p className="break-words text-sm font-medium">{audit.model}</p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  Database
                </div>
                <p className="text-sm font-medium">{audit.database}</p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Confidence
                </div>
                <p className="text-sm font-medium">
                  {Math.round(audit.confidence * 100)}%
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="mb-3 text-sm font-medium">Database tables used</p>
              <div className="flex flex-wrap gap-2">
                {(audit.recordsUsed.tables ?? []).map((table) => (
                  <Badge key={table} variant="secondary">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-muted-foreground">High-risk transactions reviewed</p>
                <p className="mt-1 font-medium">
                  {audit.recordsUsed.highRiskTransactionCount ?? 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-muted-foreground">Saved at</p>
                <p className="mt-1 font-medium">
                  {new Date(audit.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}