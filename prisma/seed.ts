import "dotenv/config"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  await prisma.agentRun.deleteMany()
  await prisma.alert.deleteMany()
  await prisma.holding.deleteMany()
  await prisma.portfolio.deleteMany()
  await prisma.forecast.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.account.deleteMany()
  await prisma.organization.deleteMany()

  const organization = await prisma.organization.create({
    data: {
      name: "Atlas Fintech Demo",
      industry: "Fintech",
    },
  })

  const operatingAccount = await prisma.account.create({
    data: {
      organizationId: organization.id,
      name: "Operating Account",
      type: "checking",
      balance: 184200,
    },
  })

  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        organizationId: organization.id,
        name: "AWS",
        category: "Cloud Infrastructure",
        riskLevel: "medium",
        recurring: true,
      },
    }),
    prisma.vendor.create({
      data: {
        organizationId: organization.id,
        name: "Vercel",
        category: "Infrastructure",
        riskLevel: "low",
        recurring: true,
      },
    }),
    prisma.vendor.create({
      data: {
        organizationId: organization.id,
        name: "Stripe",
        category: "Revenue",
        riskLevel: "low",
        recurring: true,
      },
    }),
    prisma.vendor.create({
      data: {
        organizationId: organization.id,
        name: "Google Ads",
        category: "Marketing",
        riskLevel: "high",
        recurring: true,
      },
    }),
    prisma.vendor.create({
      data: {
        organizationId: organization.id,
        name: "Unknown Vendor",
        category: "Miscellaneous",
        riskLevel: "high",
        recurring: false,
      },
    }),
  ])

  const vendorByName = Object.fromEntries(vendors.map((vendor) => [vendor.name, vendor]))

  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        organizationId: organization.id,
        accountId: operatingAccount.id,
        vendorId: vendorByName["AWS"].id,
        date: new Date("2026-06-01"),
        description: "AWS cloud infrastructure usage",
        category: "Cloud Infrastructure",
        amount: -1240,
        direction: "outflow",
        anomalyScore: 64,
      },
    }),
    prisma.transaction.create({
      data: {
        organizationId: organization.id,
        accountId: operatingAccount.id,
        vendorId: vendorByName["Vercel"].id,
        date: new Date("2026-06-02"),
        description: "Vercel platform subscription",
        category: "Infrastructure",
        amount: -80,
        direction: "outflow",
        anomalyScore: 12,
      },
    }),
    prisma.transaction.create({
      data: {
        organizationId: organization.id,
        accountId: operatingAccount.id,
        vendorId: vendorByName["Stripe"].id,
        date: new Date("2026-06-03"),
        description: "Stripe customer revenue deposit",
        category: "Revenue",
        amount: 8500,
        direction: "inflow",
        anomalyScore: 0,
      },
    }),
    prisma.transaction.create({
      data: {
        organizationId: organization.id,
        accountId: operatingAccount.id,
        vendorId: vendorByName["Google Ads"].id,
        date: new Date("2026-06-04"),
        description: "Google Ads campaign spend",
        category: "Marketing",
        amount: -2100,
        direction: "outflow",
        anomalyScore: 81,
      },
    }),
    prisma.transaction.create({
      data: {
        organizationId: organization.id,
        accountId: operatingAccount.id,
        vendorId: vendorByName["Unknown Vendor"].id,
        date: new Date("2026-06-05"),
        description: "Unclassified vendor charge",
        category: "Miscellaneous",
        amount: -3950,
        direction: "outflow",
        anomalyScore: 93,
      },
    }),
  ])

  const highRiskTransaction = transactions.find(
    (transaction) => transaction.description === "Unclassified vendor charge"
  )

  await prisma.alert.createMany({
    data: [
      {
        organizationId: organization.id,
        transactionId: highRiskTransaction?.id,
        alertType: "transaction_anomaly",
        severity: "high",
        title: "Unknown vendor charge detected",
        explanation:
          "A new vendor created a $3,950 charge with a high anomaly score. Validate the vendor before approval.",
      },
      {
        organizationId: organization.id,
        alertType: "vendor_spike",
        severity: "high",
        title: "Google Ads spend increased",
        explanation:
          "Marketing spend increased 52% month over month. Review campaign ROI before the next billing cycle.",
      },
      {
        organizationId: organization.id,
        alertType: "cloud_spike",
        severity: "medium",
        title: "AWS spend increased",
        explanation:
          "AWS spend is 38% higher than last month. Audit unused compute, database, and storage resources.",
      },
    ],
  })

  await prisma.forecast.createMany({
    data: [
      {
        organizationId: organization.id,
        scenario: "base",
        monthlyBurn: 22400,
        revenueGrowth: 0.08,
        projectedRunwayMonths: 8.2,
      },
      {
        organizationId: organization.id,
        scenario: "downside",
        monthlyBurn: 24800,
        revenueGrowth: -0.15,
        projectedRunwayMonths: 6.4,
      },
      {
        organizationId: organization.id,
        scenario: "optimized",
        monthlyBurn: 19800,
        revenueGrowth: 0.12,
        projectedRunwayMonths: 9.6,
      },
    ],
  })

  const portfolio = await prisma.portfolio.create({
    data: {
      organizationId: organization.id,
      name: "Demo Growth Portfolio",
    },
  })

  await prisma.holding.createMany({
    data: [
      {
        portfolioId: portfolio.id,
        ticker: "VOO",
        assetType: "ETF",
        sector: "Broad Market",
        allocationPercent: 45,
        currentValue: 45000,
      },
      {
        portfolioId: portfolio.id,
        ticker: "QQQ",
        assetType: "ETF",
        sector: "Technology",
        allocationPercent: 25,
        currentValue: 25000,
      },
      {
        portfolioId: portfolio.id,
        ticker: "AAPL",
        assetType: "Equity",
        sector: "Technology",
        allocationPercent: 10,
        currentValue: 10000,
      },
      {
        portfolioId: portfolio.id,
        ticker: "MSFT",
        assetType: "Equity",
        sector: "Technology",
        allocationPercent: 10,
        currentValue: 10000,
      },
      {
        portfolioId: portfolio.id,
        ticker: "CASH",
        assetType: "Cash",
        sector: "Cash",
        allocationPercent: 10,
        currentValue: 10000,
      },
    ],
  })

  await prisma.agentRun.create({
    data: {
      organizationId: organization.id,
      userQuery: "Why did burn increase this month?",
      answer:
        "Burn increased primarily because Google Ads rose 52%, AWS rose 38%, and one new vendor created a $3,950 charge. These three items explain most of the month-over-month increase in operating spend.",
      confidence: 0.91,
      recordsUsed: {
        tables: ["transactions", "vendors", "alerts", "forecasts"],
      },
    },
  })

  console.log("Seeded FinPilot demo data.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })