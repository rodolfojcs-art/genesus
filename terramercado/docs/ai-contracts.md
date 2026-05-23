# TerraMercado — AI Agent Contracts

> Versión 1.0 · Sprint 7 · 2026-05-23

Todos los agentes IA de TerraMercado se orquestan a través de **n8n** en una VPS Hetzner. La autenticación entre Next.js y n8n usa firma **HMAC-SHA256** en el header `X-Terra-Signature`. El payload se firma con el secreto `N8N_WEBHOOK_SECRET` almacenado en Vercel (marcado Sensitive).

---

## 1. Terra-Lens (Diagnóstico Agronómico Visual)

**Endpoint:** `POST /api/ia/agro-lens`  
**n8n webhook:** `{N8N_BASE_URL}{N8N_WEBHOOK_TERRA_LENS}`  
**Auth:** HMAC-SHA256 en header `X-Terra-Signature`  
**Modelo:** `claude-opus-4-7` (visión multimodal)

### Input schema

```json
{
  "userId": "uuid",
  "imagenBase64": "string (base64 — máx 5 MB)",
  "mimeType": "image/jpeg | image/png | image/webp",
  "cultivoActivo": "string (opcional) — e.g. 'Caña de azúcar'",
  "ubicacion": "string (opcional) — e.g. 'Aragua, Venezuela'",
  "ciclo": "string (opcional) — e.g. 'crecimiento vegetativo'"
}
```

### Output schema

```json
{
  "identificacion": "string — nombre de la enfermedad/plaga/deficiencia identificada",
  "probabilidad": 0.95,
  "diagnostico": "string — descripción técnica del problema detectado",
  "recomendaciones": [
    {
      "producto_id": "uuid | null",
      "descripcion": "string — acción recomendada o producto a aplicar"
    }
  ],
  "alertas": ["string — advertencias de seguridad o urgencia"]
}
```

### Error schema

```json
{
  "error": "string",
  "code": "INVALID_IMAGE | UNSUPPORTED_CROP | AI_TIMEOUT | SIGNATURE_INVALID"
}
```

### Curl example

```bash
curl -X POST https://www.terramercado.com/api/ia/agro-lens \
  -H "Authorization: Bearer <supabase-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "imagenBase64": "<base64-string>",
    "mimeType": "image/jpeg",
    "cultivoActivo": "Caña de azúcar",
    "ubicacion": "Aragua, Venezuela",
    "ciclo": "crecimiento vegetativo"
  }'
```

### Notas de implementación

- El endpoint almacena el diagnóstico en `ai_diagnoses` antes de devolver la respuesta.
- Si `userId` tiene una sesión activa de conversación con Terra-Lens, el contexto histórico se adjunta al prompt.
- El tiempo máximo de respuesta es 30 s; pasado ese límite se devuelve `AI_TIMEOUT`.

---

## 2. Copiloto Agronómico

**Endpoint:** `POST /api/ia/copiloto`  
**n8n webhook:** `{N8N_BASE_URL}{N8N_WEBHOOK_COPILOTO}`  
**Auth:** HMAC-SHA256 en header `X-Terra-Signature`  
**Modelo:** `claude-sonnet-4-6` (conversacional)

### Input schema

```json
{
  "userId": "uuid",
  "conversationId": "uuid | null — null para nueva conversación",
  "mensaje": "string — mensaje del usuario",
  "contexto": {
    "cultivoPrincipal": "string (opcional)",
    "cicloActivo": "string (opcional)",
    "ubicacion": "string (opcional)",
    "terraScore": 742
  }
}
```

### Output schema

```json
{
  "conversationId": "uuid",
  "respuesta": "string — respuesta del copiloto en texto plano o Markdown",
  "productos_sugeridos": [
    {
      "product_id": "uuid",
      "nombre": "string",
      "razon": "string"
    }
  ],
  "acciones": [
    {
      "tipo": "ver_producto | abrir_terra_lens | solicitar_credito",
      "payload": {}
    }
  ]
}
```

### Error schema

```json
{
  "error": "string",
  "code": "CONVERSATION_NOT_FOUND | AI_TIMEOUT | SIGNATURE_INVALID | RATE_LIMITED"
}
```

### Curl example

```bash
curl -X POST https://www.terramercado.com/api/ia/copiloto \
  -H "Authorization: Bearer <supabase-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "bbbbbbbb-0000-0000-0000-000000000001",
    "conversationId": null,
    "mensaje": "¿Qué fertilizante le recomiendan para caña en etapa de macollamiento?",
    "contexto": {
      "cultivoPrincipal": "Caña de azúcar",
      "cicloActivo": "macollamiento",
      "ubicacion": "Aragua, Venezuela",
      "terraScore": 742
    }
  }'
```

### Notas de implementación

- Las conversaciones se persisten en `ai_conversations` (campo `mensajes: jsonb`).
- El historial se trunca a los últimos 20 turnos para controlar el tamaño del contexto.
- El copiloto tiene acceso al catálogo de productos vía embeddings (tabla `product_embeddings`, si disponible) para hacer recomendaciones relevantes.
- Rate limit: 20 mensajes/usuario/hora.

---

## 3. Agente Financiero (TerraFinancia)

**Endpoint:** `POST /api/ia/financiero`  
**n8n webhook:** `{N8N_BASE_URL}{N8N_WEBHOOK_FINANCIERO}`  
**Auth:** HMAC-SHA256 en header `X-Terra-Signature`  
**Modelo:** `claude-haiku-4-5-20251001` (análisis rápido)

### Input schema

```json
{
  "userId": "uuid",
  "solicitud": "analisis_credito | simulacion_pago | recomendacion_oferta",
  "monto": 5000.00,
  "plazo_dias": 180,
  "terra_score": 742,
  "historial_pagos": [
    {
      "fecha": "2026-01-15",
      "monto": 1200.00,
      "estado": "pagado | atrasado | pendiente"
    }
  ],
  "offer_id": "uuid | null"
}
```

### Output schema

```json
{
  "aprobado": true,
  "score_evaluacion": 0.87,
  "tasa_sugerida": 12.5,
  "monto_aprobado": 5000.00,
  "plazo_recomendado": 180,
  "cronograma": [
    {
      "cuota": 1,
      "fecha_vencimiento": "2026-07-23",
      "monto_capital": 833.33,
      "monto_interes": 52.08,
      "total_cuota": 885.41
    }
  ],
  "alertas": ["string"],
  "razon_denegacion": "string | null"
}
```

### Error schema

```json
{
  "error": "string",
  "code": "INSUFFICIENT_SCORE | AMOUNT_OUT_OF_RANGE | AI_TIMEOUT | SIGNATURE_INVALID"
}
```

### Curl example

```bash
curl -X POST https://www.terramercado.com/api/ia/financiero \
  -H "Authorization: Bearer <supabase-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "bbbbbbbb-0000-0000-0000-000000000001",
    "solicitud": "simulacion_pago",
    "monto": 5000.00,
    "plazo_dias": 180,
    "terra_score": 742,
    "historial_pagos": [],
    "offer_id": null
  }'
```

### Notas de implementación

- El agente usa el TerraScore actual del usuario y su historial de `financing_agreements` para calibrar la evaluación.
- Los cronogramas de pago generados se almacenan en `financing_agreements.cronograma` como JSONB.
- Para `analisis_credito`, el agente consume la API de TerraScore (agente interno) para obtener el score más reciente.
- Rate limit: 5 solicitudes/usuario/hora para `analisis_credito`; ilimitado para `simulacion_pago`.

---

## Seguridad de webhooks

Todos los webhooks n8n usan el mismo mecanismo de firma:

```ts
// lib/ai/hmac.ts
import crypto from "crypto";

export function signPayload(body: string): string {
  return crypto
    .createHmac("sha256", process.env.N8N_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
}

export function verifySignature(body: string, signature: string): boolean {
  const expected = signPayload(body);
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex")
  );
}
```

El header se envía como `X-Terra-Signature: sha256=<hex>`.
