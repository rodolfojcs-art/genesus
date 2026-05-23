# Sprint 1 — Foundation

**Semanas:** 1-2  
**Branch:** `claude/serene-lamport-lR9UA`

## Qué se construyó

### Auth completo
- `/login` — formulario email/password con Server Action, manejo de errores Supabase, link a recuperación
- `/registro` — formulario completo: nombre, apellido, email, teléfono, ubicación, rol (comprador/vendedor), contraseña, términos. Validación con zod. Feedback de éxito/error.
- `/recuperar` — flujo de reset por email vía Supabase `resetPasswordForEmail`
- `GET /api/auth/callback` — maneja verificación de email, OAuth, y crea perfil en DB si no existe
- `POST /api/auth/logout` — cierre de sesión

### Modelo de datos
- Migración `20260523_001_initial_schema.sql`: 26 tablas con RLS en todas
- Trigger `trg_bootstrap_user`: crea wallet + carrito + wishlist al crear perfil
- Trigger `trg_recalculate_score_on_review`: recalcula TerraScore del vendedor en cada review
- Extensión `pg_trgm` para búsqueda fuzzy en productos

### Homepage
- Hero con demo user Carlos Martínez (TerraScore 742)
- Grid 8 categorías con íconos
- Grid "Más vendidos esta semana" con ProductCard
- Banner TerraPlus
- Sección "Insumos del mismo ciclo productivo"

### Layout
- Header responsivo con búsqueda doble (desktop/mobile), carrito, nav de categorías
- Footer con trust bar (4 pilares de confianza), links organizados
- Logo con aspect ratio 457×433 preservado, espacio de protección correcto

### API IA (thin proxies)
- `POST /api/ia/agro-lens` — Terra-Lens con visión, persiste en `ai_diagnoses`
- `POST /api/ia/copiloto` — Copiloto agronómico con historial de conversación
- `POST /api/ia/financiero` — Agente financiero con TerraScore del usuario

### Validaciones
- `lib/validations/auth.ts` con schemas zod para login, registro, recuperación, reset

## Decisiones técnicas

- **`useActionState`** (React 19) en vez de `useFormState` para Server Actions
- **`@base-ui/react/button`** es el Button de shadcn en esta versión — no tiene `asChild`, se usan Links con clases directamente para CTAs
- **`proxy.ts`** en vez de `middleware.ts` (Next.js 16 convention)
- Auth layout separado del layout público — el layout de `(app)/` verifica sesión en server component
- Los AI proxies inyectan contexto del perfil (cultivo, ubicación, TerraScore) antes de llamar a n8n

## Pendiente / Sprint 2

- CRUD de productos para vendedor
- Categorías jerárquicas con breadcrumbs
- Página de catálogo con filtros
- Ficha de producto con galería y ficha técnica agronómica
- Búsqueda textual con autocompletar
- Storefront del vendedor

## Checklist Sprint 0 externo (requiere configuración manual)

- [ ] Crear proyecto Supabase y ejecutar migración
- [ ] Configurar `.env.local` con credenciales
- [ ] Crear proyecto Vercel conectado al repo
- [ ] Configurar env vars en Vercel (3 scopes)
- [ ] Conectar dominio `www.terramercado.com`
- [ ] Configurar DNS en el registrador
