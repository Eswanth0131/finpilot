import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { runBedrockFinanceAgent } from "@/lib/bedrock"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userQuery = body.userQuery

    if (!userQuery || typeof userQuery !== "string") {
      return NextResponse.json(
        { error: "userQuery is required." },
        { status: 400 }
      )
    }

    const organization = await prisma.organization.findFirst({
      include: {
        accounts: true,
        vendors: {
          include: {
            transactions: true,
          },
        },
        transactions: {
          orderBy: {
            date: "desc",
          },
          include: {
            vendor: true,
          },
        },
        alerts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        forecasts: true,
        portfolios: {
          include: {
            holdings: true,
          },
        },
      },
    })

    if (!organization) {
      return NextResponse.json(
        { error: "No organization found. Seed the database first." },
        { status: 404 }
      )
    }

    const monthlyBurn = Math.abs(
      organization.transactions
        .filter((transaction) => transaction.direction === "outflow")
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    )

    const revenueThisMonth = organization.transactions
      .filter((transaction) => transaction.direction === "inflow")
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    const highRiskTransactions = organization.transactions.filter(
      (transaction) => transaction.anomalyScore >= 50
    )

    const portfolio = organization.portfolios[0]
    const holdings = portfolio?.holdings ?? []

    const techExposure = holdings
      .filter((holding) => holding.sector === "Technology")
      .reduce((sum, holding) => sum + holding.allocationPercent, 0)

    const financialContext = {
      organization: {
        name: organization.name,
        industry: organization.industry,
      },
      metrics: {
        cashBalance: organization.accounts[0]?.balance ?? 0,
        monthlyBurn,
        revenueThisMonth,
        netBurn: monthlyBurn - revenueThisMonth,
        technologyExposurePercent: techExposure,
      },
      accounts: organization.accounts,
      transactions: organization.transactions.map((transaction) => ({
        date: transaction.date,
        vendor: transaction.vendor?.name ?? "Unknown",
        category: transaction.category,
        amount: transaction.amount,
        direction: transaction.direction,
        anomalyScore: transaction.anomalyScore,
        description: transaction.description,
      })),
      vendors: organization.vendors.map((vendor) => ({
        name: vendor.name,
        category: vendor.category,
        riskLevel: vendor.riskLevel,
        recurring: vendor.recurring,
        totalSpend: Math.abs(
          vendor.transactions
            .filter((transaction) => transaction.direction === "outflow")
            .reduce((sum, transaction) => sum + transaction.amount, 0)
        ),
        highestAnomalyScore: vendor.transactions.reduce(
          (max, transaction) => Math.max(max, transaction.anomalyScore),
          0
        ),
      })),
      alerts: organization.alerts.map((alert) => ({
        type: alert.alertType,
        severity: alert.severity,
        title: alert.title,
        explanation: alert.explanation,
      })),
      forecasts: organization.forecasts.map((forecast) => ({
        scenario: forecast.scenario,
        monthlyBurn: forecast.monthlyBurn,
        revenueGrowth: forecast.revenueGrowth,
        projectedRunwayMonths: forecast.projectedRunwayMonths,
      })),
      portfolio: {
        name: portfolio?.name,
        holdings: holdings.map((holding) => ({
          ticker: holding.ticker,
          assetType: holding.assetType,
          sector: holding.sector,
          allocationPercent: holding.allocationPercent,
          currentValue: holding.currentValue,
        })),
      },
      highRiskTransactions: highRiskTransactions.map((transaction) => ({
        vendor: transaction.vendor?.name ?? "Unknown",
        amount: transaction.amount,
        anomalyScore: transaction.anomalyScore,
        description: transaction.description,
      })),
    }

    const answer = await runBedrockFinanceAgent({
      userQuery,
      financialContext,
    })

    const agentRun = await prisma.agentRun.create({
      data: {
        organizationId: organization.id,
        userQuery,
        answer,
        confidence: 0.9,
        recordsUsed: {
          tables: [
            "organizations",
            "accounts",
            "transactions",
            "vendors",
            "alerts",
            "forecasts",
            "portfolios",
            "holdings",
          ],
          highRiskTransactionCount: highRiskTransactions.length,
        },
      },
    })

    return NextResponse.json({
      answer,
      agentRunId: agentRun.id,
    })
  } catch (error) {
  console.error("FinPilot agent error:", error)

  const message =
    error instanceof Error ? error.message : "Unknown server error"

  return NextResponse.json(
    {
      error: message,
    },
    { status: 500 }
  )
}
}