import Link from "next/link"
import { ArrowRight, BarChart3, Brain, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border px-4 py-2 text-sm text-muted-foreground">
          Built with Vercel, AWS Aurora PostgreSQL, and Amazon Bedrock
        </div>

        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          AI finance operations for modern teams.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          FinPilot turns transactions, vendors, cash flow, and portfolio exposure
          into explainable financial decisions.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Try demo company <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/architecture">View architecture</Link>
          </Button>
        </div>

        <div className="mt-16 grid w-full gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-left">
              <BarChart3 className="mb-4 h-6 w-6" />
              <h3 className="font-semibold">Spend intelligence</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Detect vendor spikes, duplicate charges, and abnormal cash outflows.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-left">
              <Brain className="mb-4 h-6 w-6" />
              <h3 className="font-semibold">AI finance agent</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask questions about burn, runway, vendors, and financial risks.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-left">
              <ShieldCheck className="mb-4 h-6 w-6" />
              <h3 className="font-semibold">Audit-ready</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every recommendation is backed by records and saved to the database.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}