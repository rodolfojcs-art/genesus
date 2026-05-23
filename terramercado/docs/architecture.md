# TerraMercado — Arquitectura

> Versión 1.0 · Sprint 7 · 2026-05-23

---

## Diagrama de alto nivel

```
[Frontend Next.js 16 → Vercel]
         ↕ Server Actions / API Routes
[Supabase PostgreSQL + Auth + Storage + Realtime]
         ↕ HMAC-signed webhooks
[n8n Agent Network → Hetzner VPS]
         ↕ Anthropic API
[Claude claude-opus-4-7 / claude-sonnet-4-6 / claude-haiku-4-5-20251001]
```

---

## Capas

### Frontend (Vercel)

- **Next.js 16** App Router, React Server Components (RSC), Partial Prerendering
- **Tailwind CSS 4** + **shadcn/ui** (preset: base-nova, primitivos @base-ui/react)
- **Zustand** para estado del cliente (carrito, UI modal)
- **TanStack Query** para cache del lado servidor en componentes client
- **PWA**: service worker (`/public/sw.js`) con estrategia network-first para `/api/` y cache-first para estáticos
- Fuentes: Sora (cuerpo), Fraunces (headings), DM Mono (números/TerraScore)

### Backend (Supabase)

- **PostgreSQL** con Row-Level Security en **todas las 26 tablas**
- **Triggers**: recálculo de TerraScore de vendedor, bootstrap de perfil al signup, timestamps `updated_at`
- **Storage buckets**: `products/` (imágenes de productos), `reviews/` (fotos de reseñas), `disputes/` (evidencias)
- **Auth**: email + password, magic link; 2FA opcional vía TOTP
- **Realtime**: subscripciones para notificaciones y mensajes en tiempo real

### Red de agentes IA (Hetzner VPS)

- **n8n** como orquestador multi-agente jerárquico
- **5 agentes**:
  1. **Terra-Lens** — diagnóstico agronómico visual (Claude Opus, multimodal)
  2. **Copiloto Agronómico** — asistente conversacional agro (Claude Sonnet)
  3. **Agente Financiero** — evaluación crediticia y cronogramas (Claude Haiku)
  4. **TerraScore** — recálculo de score por evento (interno, sin LLM)
  5. **Árbitro** — resolución asistida de disputas (Claude Sonnet)
- Contratos estables documentados en [`docs/ai-contracts.md`](./ai-contracts.md)

### Seguridad

- **RLS**: cada usuario solo accede a sus propios datos; admin y vendedor tienen políticas especializadas
- **HMAC-SHA256**: firma de cada webhook saliente hacia n8n (`X-Terra-Signature: sha256=<hex>`)
- **Secrets**: nunca expuestos al cliente; variables `SUPABASE_SERVICE_ROLE_KEY` y `N8N_WEBHOOK_SECRET` marcadas Sensitive en Vercel
- **Rate limiting**: implementado en `proxy.ts` por IP usando headers `x-forwarded-for`
- **Audit log**: tabla `audit_log` registra todas las acciones administrativas y cambios de estado sensibles

---

## Flujo de un pedido con escrow

```
1. Comprador → crea orden (status: creado)
2. Comprador → paga (status: pagado_en_escrow, escrow: fondos_recibidos)
3. Vendedor  → confirma preparación (status: en_preparacion)
4. Transportista → recoge (status: en_transito)
5a. Entrega OK  → comprador confirma (status: entregado → liberado, escrow: liberado)
5b. Disputa     → comprador abre disputa (status: en_disputa, escrow: en_disputa)
   → Admin resuelve → reembolsado | liberado
```

---

## Variables de entorno requeridas

| Variable | Descripción | Entorno |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Cliente + Servidor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública | Cliente + Servidor |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (nunca al cliente) | Servidor |
| `N8N_BASE_URL` | URL base del servidor n8n | Servidor |
| `N8N_WEBHOOK_TERRA_LENS` | Ruta del webhook Terra-Lens | Servidor |
| `N8N_WEBHOOK_COPILOTO` | Ruta del webhook Copiloto | Servidor |
| `N8N_WEBHOOK_FINANCIERO` | Ruta del webhook Agente Financiero | Servidor |
| `N8N_WEBHOOK_SECRET` | Secreto HMAC compartido con n8n | Servidor (Sensitive) |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app | Cliente + Servidor |

---

## Estructura de directorios relevante

```
app/
  (public)/        → páginas sin autenticación (landing, catálogo)
  (auth)/          → login, registro, recuperación
  (app)/           → área autenticada (billetera, pedidos, etc.)
  (admin)/         → panel admin (RLS + rol admin)
  api/             → route handlers (IA, webhooks, proxy)
components/
  ui/              → componentes shadcn/ui (base-nova)
  layout/          → Header, Footer, Logo, ServiceWorkerRegistration
  catalog/         → ProductCard, StoreCard, AgroSheet, etc.
lib/
  supabase/        → server.ts, client.ts, middleware.ts
  utils/           → catalog.ts (formatPrice, terraScoreColor), utils.ts (cn)
  ai/              → clientes n8n, validación HMAC
  escrow/          → lógica de escrow
types/
  index.ts         → tipos TypeScript globales
supabase/
  migrations/      → schema SQL versionado
  seed.sql         → datos de prueba
docs/
  ai-contracts.md  → contratos de agentes IA
  architecture.md  → este documento
  db-schema.sql    → inventario de tablas
public/
  sw.js            → service worker PWA
  manifest.json    → manifiesto PWA
```
