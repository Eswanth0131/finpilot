export const metrics = {
  cashBalance: 184200,
  monthlyBurn: 22400,
  runwayMonths: 8.2,
  revenueThisMonth: 18700,
  anomalyAlerts: 4,
  portfolioRiskScore: 72,
}

export const transactions = [
  {
    date: "2026-06-01",
    vendor: "AWS",
    category: "Cloud Infrastructure",
    amount: -1240,
    anomalyScore: 64,
    explanation: "AWS spend is 38% higher than last month.",
  },
  {
    date: "2026-06-02",
    vendor: "Vercel",
    category: "Infrastructure",
    amount: -80,
    anomalyScore: 12,
    explanation: "Normal recurring infrastructure charge.",
  },
  {
    date: "2026-06-03",
    vendor: "Stripe",
    category: "Revenue",
    amount: 8500,
    anomalyScore: 0,
    explanation: "Revenue deposit from customer payments.",
  },
  {
    date: "2026-06-04",
    vendor: "Google Ads",
    category: "Marketing",
    amount: -2100,
    anomalyScore: 81,
    explanation: "Marketing spend increased 52% month over month.",
  },
  {
    date: "2026-06-05",
    vendor: "Unknown Vendor",
    category: "Miscellaneous",
    amount: -3950,
    anomalyScore: 93,
    explanation: "New vendor with unusually large transaction amount.",
  },
]

export const vendors = [
  {
    name: "AWS",
    category: "Cloud",
    monthlySpend: 1240,
    change: "+38%",
    risk: "Medium",
    action: "Review EC2 and database usage.",
  },
  {
    name: "Google Ads",
    category: "Marketing",
    monthlySpend: 2100,
    change: "+52%",
    risk: "High",
    action: "Review campaign ROI before next billing cycle.",
  },
  {
    name: "Vercel",
    category: "Infrastructure",
    monthlySpend: 80,
    change: "+0%",
    risk: "Low",
    action: "No action needed.",
  },
  {
    name: "Unknown Vendor",
    category: "Miscellaneous",
    monthlySpend: 3950,
    change: "New",
    risk: "High",
    action: "Investigate vendor and validate charge.",
  },
]

export const holdings = [
  { ticker: "VOO", sector: "Broad Market", allocation: 45, value: 45000 },
  { ticker: "QQQ", sector: "Technology", allocation: 25, value: 25000 },
  { ticker: "AAPL", sector: "Technology", allocation: 10, value: 10000 },
  { ticker: "MSFT", sector: "Technology", allocation: 10, value: 10000 },
  { ticker: "CASH", sector: "Cash", allocation: 10, value: 10000 },
]

export const burnData = [
  { month: "Jan", burn: 16200, revenue: 12000 },
  { month: "Feb", burn: 17100, revenue: 13500 },
  { month: "Mar", burn: 18400, revenue: 14200 },
  { month: "Apr", burn: 19600, revenue: 15900 },
  { month: "May", burn: 20500, revenue: 17100 },
  { month: "Jun", burn: 22400, revenue: 18700 },
]