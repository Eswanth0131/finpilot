import Link from "next/link"
import { ArrowLeft, Bot, Database, Sparkles } from "lucide-react"
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

export default function AgentPage() {
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
            <CardTitle>Example Agent Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6">
            <p>
              Burn increased primarily because Google Ads rose 52%, AWS rose 38%, and one new
              vendor created a $3,950 charge. These three items explain most of the
              month-over-month increase in operating spend.
            </p>

            <div className="rounded-lg border p-4">
              <p className="font-medium">Recommended actions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Review Google Ads ROI before the next billing cycle.</li>
                <li>Audit AWS usage for unused compute or database resources.</li>
                <li>Investigate the unknown vendor charge before approval.</li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted p-4 text-muted-foreground">
              Records used: transactions, vendors, burn history, anomaly scores, runway forecast.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}