const {
  BedrockRuntimeClient,
  InvokeModelCommand
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

/**
 * Ask Bedrock to advise weight adjustments
 * AI MUST return JSON only
 */
async function askBedrock(context) {
  const prompt = `
You are an AI advisor for a traffic routing system.

Rules:
- Do NOT invent backends
- Do NOT route to isolated backends
- Do NOT exceed +/-10% weight change per backend
- Total weight must remain 100

Return ONLY valid JSON in this format:

{
  "adjustments": [
    { "backendId": "id", "delta": 5 },
    { "backendId": "id", "delta": -5 }
  ]
}

Context:
${JSON.stringify(context, null, 2)}
`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-v2",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt,
      max_tokens_to_sample: 300,
      temperature: 0.2
    })
  });

  const response = await client.send(command);
  const decoded = new TextDecoder().decode(response.body);
  const body = JSON.parse(decoded);

  return JSON.parse(body.completion.trim());
}

module.exports = { askBedrock };
