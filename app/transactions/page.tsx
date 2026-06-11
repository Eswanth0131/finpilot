import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { transactions } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function riskVariant(score: number) {
  if (score >= 80) return "destructive"
  if (score >= 50) return "secondary"
  return "outline"
}

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-2 px-0">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Transaction Intelligence</h1>
            <p className="mt-2 text-muted-foreground">
              Review cash inflows, outflows, anomaly scores, and explainable risk signals.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Anomaly</TableHead>
                  <TableHead>Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={`${transaction.date}-${transaction.vendor}`}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium">{transaction.vendor}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.amount > 0 ? "text-emerald-600" : ""
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={riskVariant(transaction.anomalyScore)}>
                        {transaction.anomalyScore}/100
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md text-muted-foreground">
                      <div className="flex items-start gap-2">
                        {transaction.anomalyScore >= 80 && (
                          <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500" />
                        )}
                        <span>{transaction.explanation}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}