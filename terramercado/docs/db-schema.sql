-- ══════════════════════════════════════════════════════════════
-- TerraMercado — Inventario de esquema de base de datos
-- ══════════════════════════════════════════════════════════════
--
-- El esquema completo (DDL, RLS, triggers, índices) se encuentra en:
--   supabase/migrations/20260523_001_initial_schema.sql
--
-- Este archivo es un inventario de referencia rápida.
-- ══════════════════════════════════════════════════════════════

-- ── MÓDULO: IDENTIDAD ──────────────────────────────────────────
-- profiles             → Perfil extendido del usuario (rol, TerraScore, cultivo, ubicación)
-- organizations        → Organizaciones o cooperativas agropecuarias
-- organization_members → Relación usuario–organización con rol dentro de la org

-- ── MÓDULO: CATÁLOGO ───────────────────────────────────────────
-- categories           → Árbol de categorías (insumos, ganadería, semillas, etc.)
-- stores               → Tiendas de vendedores con TerraScore y verificación
-- products             → Productos con datos técnicos agronómicos (principio activo, dosis, carencia)
-- product_variants     → Variantes de producto (presentación, tamaño, SKU)
-- product_images       → Galería de imágenes por producto (Storage URL)

-- ── MÓDULO: COMERCIO ───────────────────────────────────────────
-- carts                → Carrito de compras, uno por usuario
-- cart_items           → Ítems del carrito con precio unitario capturado
-- orders               → Pedidos con estado y moneda (USD/VES)
-- order_items          → Líneas de pedido con precio histórico
-- escrow_accounts      → Cuentas de escrow vinculadas 1:1 a pedidos
-- escrow_events        → Historial de eventos de escrow (depósitos, liberaciones, disputas)
-- disputes             → Disputas abiertas o resueltas por pedido
-- shipments            → Envíos con tracking y evidencia de entrega

-- ── MÓDULO: CONFIANZA Y COMUNIDAD ─────────────────────────────
-- reviews              → Reseñas verificadas de productos (rating 1–5)
-- review_votes         → Votos de utilidad en reseñas
-- seller_reputation    → KPIs de reputación del vendedor (entregas, calidad, disputas)
-- messages             → Mensajería directa entre comprador y vendedor

-- ── MÓDULO: FINANZAS ──────────────────────────────────────────
-- wallets              → Billeteras con saldo USD y VES por usuario
-- wallet_transactions  → Movimientos de billetera (depósito, retiro, crédito, escrow)
-- financing_offers     → Ofertas de crédito publicadas por entidades financieras
-- financing_agreements → Acuerdos de financiamiento firmados (con cronograma JSONB)

-- ── MÓDULO: IA Y OPERACIÓN ────────────────────────────────────
-- ai_conversations     → Historial de conversaciones con agentes IA (mensajes JSONB)
-- ai_diagnoses         → Diagnósticos de Terra-Lens con imagen, cultivo y recomendaciones
-- notifications        → Notificaciones push/in-app por usuario y tipo
-- wishlists            → Listas de deseos del usuario
-- wishlist_items       → Productos en listas de deseos
-- audit_log            → Registro inmutable de acciones administrativas y cambios sensibles

-- ══════════════════════════════════════════════════════════════
-- Total: 26 tablas
-- Todas las tablas tienen RLS habilitado.
-- ══════════════════════════════════════════════════════════════
