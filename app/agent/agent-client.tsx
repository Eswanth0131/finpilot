"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
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

export function AgentClient({
  initialAnswer,
}: {
  initialAnswer?: string
}) {
  const [userQuery, setUserQuery] = useState("Why did burn increase this month?")
  const [answer, setAnswer] = useState(initialAnswer ?? "")
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
    </div>
  )
}