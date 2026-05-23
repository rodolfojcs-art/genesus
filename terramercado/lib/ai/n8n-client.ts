import crypto from "crypto";

const N8N_BASE_URL = process.env.N8N_BASE_URL!;
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET!;
const N8N_TIMEOUT_MS = Number(process.env.N8N_TIMEOUT_MS ?? 30000);

function signPayload(payload: string): string {
  return crypto
    .createHmac("sha256", N8N_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
}

async function callN8nWebhook<TInput, TOutput>(
  webhookPath: string,
  input: TInput
): Promise<TOutput> {
  const body = JSON.stringify(input);
  const signature = signPayload(body);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

  try {
    const response = await fetch(`${N8N_BASE_URL}${webhookPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Terra-Signature": signature,
      },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as TOutput;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const n8n = {
  terraLens: <TInput, TOutput>(input: TInput) =>
    callN8nWebhook<TInput, TOutput>(
      process.env.N8N_WEBHOOK_TERRA_LENS ?? "/webhook/terra-lens",
      input
    ),
  copiloto: <TInput, TOutput>(input: TInput) =>
    callN8nWebhook<TInput, TOutput>(
      process.env.N8N_WEBHOOK_COPILOTO ?? "/webhook/copiloto-agronomico",
      input
    ),
  financiero: <TInput, TOutput>(input: TInput) =>
    callN8nWebhook<TInput, TOutput>(
      process.env.N8N_WEBHOOK_FINANCIERO ?? "/webhook/agente-financiero",
      input
    ),
  reputacion: <TInput, TOutput>(input: TInput) =>
    callN8nWebhook<TInput, TOutput>(
      process.env.N8N_WEBHOOK_REPUTACION ?? "/webhook/calculo-terrascore",
      input
    ),
  disputa: <TInput, TOutput>(input: TInput) =>
    callN8nWebhook<TInput, TOutput>(
      process.env.N8N_WEBHOOK_DISPUTA ?? "/webhook/arbitraje-disputa",
      input
    ),
};
