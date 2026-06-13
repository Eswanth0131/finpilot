import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function runBedrockFinanceAgent({
  userQuery,
  financialContext,
}: {
  userQuery: string
  financialContext: unknown
}) {
  const modelId = process.env.BEDROCK_MODEL_ID ?? "us.amazon.nova-pro-v1:0"

  const prompt = `
You are FinPilot, an AI finance operations analyst for startups and modern finance teams.

You analyze structured financial data from a database. You must be practical, concise, and explain your reasoning using only the provided data.

Rules:
- Do not provide investment advice.
- Do not recommend buying or selling securities.
- You may discuss risk, exposure, cash flow, runway, anomalies, vendors, and operating decisions.
- Cite specific vendors, transactions, alerts, and metrics from the context.
- If data is missing, say what is missing.
- End with 2-3 recommended actions.

User question:
${userQuery}

Financial context:
${JSON.stringify(financialContext, null, 2)}
`

  const body = {
    messages: [
      {
        role: "user",
        content: [
          {
            text: prompt,
          },
        ],
      },
    ],
    inferenceConfig: {
      maxTokens: 900,
      temperature: 0.2,
      topP: 0.9,
    },
  }

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  })

  const response = await bedrock.send(command)
  const responseBody = JSON.parse(new TextDecoder().decode(response.body))

  return (
    responseBody.output?.message?.content?.[0]?.text ??
    responseBody.results?.[0]?.outputText ??
    "No response generated."
  )
}