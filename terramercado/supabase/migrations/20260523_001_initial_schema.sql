-- TerraMercado — Sprint 1 — Esquema inicial completo
-- Reversible: cada CREATE tiene su DROP en la sección down al final

-- ── Extensiones ────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- búsqueda textual fuzzy

-- ── Enums ──────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM (
  'comprador', 'vendedor', 'transportista', 'financiera', 'inversionista', 'admin'
);

CREATE TYPE order_status AS ENUM (
  'creado', 'pagado_en_escrow', 'en_preparacion', 'en_transito',
  'entregado', 'liberado', 'en_disputa', 'reembolsado'
);

CREATE TYPE escrow_status AS ENUM (
  'pendiente', 'fondos_recibidos', 'liberacion_parcial', 'liberado',
  'en_disputa', 'reembolsado'
);

CREATE TYPE currency AS ENUM ('USD', 'VES');

CREATE TYPE notification_type AS ENUM (
  'precio', 'stock', 'disputa', 'ciclo', 'pedido', 'mensaje'
);

-- ── Helper: updated_at trigger ─────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  IDENTIDAD                                                    ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE TABLE profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT NOW(),
  updated_at     timestamptz NOT NULL DEFAULT NOW(),
  email          text UNIQUE NOT NULL,
  nombre         text NOT NULL,
  apellido       text NOT NULL DEFAULT '',
  telefono       text,
  avatar_url     text,
  rol            user_role NOT NULL DEFAULT 'comprador',
  estado         text,
  municipio      text,
  ubicacion      text,
  ciclo_productivo_activo text,
  cultivo_principal       text,
  terra_score    integer NOT NULL DEFAULT 500,
  terra_plus     boolean NOT NULL DEFAULT false
);
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TABLE organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  created_by  uuid REFERENCES profiles(id),
  nombre      text NOT NULL,
  rif         text,
  tipo        text,
  descripcion text,
  logo_url    text,
  verificada  boolean NOT NULL DEFAULT false
);
CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organizations_select_all" ON organizations FOR SELECT USING (true);
CREATE POLICY "organizations_manage_own" ON organizations FOR ALL USING (auth.uid() = created_by);

CREATE TABLE organization_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT NOW(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rol             text NOT NULL DEFAULT 'miembro',
  UNIQUE (organization_id, user_id)
);
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_members_select" ON organization_members FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = organization_members.organization_id AND om.user_id = auth.uid())
);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  CATÁLOGO                                                     ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  nombre      text NOT NULL,
  slug        text UNIQUE NOT NULL,
  descripcion text,
  imagen_url  text,
  parent_id   uuid REFERENCES categories(id),
  orden       integer NOT NULL DEFAULT 0
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_manage" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

CREATE TABLE stores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  created_by  uuid NOT NULL REFERENCES profiles(id),
  slug        text UNIQUE NOT NULL,
  nombre      text NOT NULL,
  descripcion text,
  logo_url    text,
  banner_url  text,
  ubicacion   text,
  terra_score integer NOT NULL DEFAULT 500,
  verificada  boolean NOT NULL DEFAULT false,
  activa      boolean NOT NULL DEFAULT true
);
CREATE TRIGGER trg_stores_updated_at
  BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stores_select_active" ON stores FOR SELECT USING (activa = true);
CREATE POLICY "stores_manage_own" ON stores FOR ALL USING (auth.uid() = created_by);

CREATE TABLE products (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT NOW(),
  updated_at          timestamptz NOT NULL DEFAULT NOW(),
  created_by          uuid REFERENCES profiles(id),
  store_id            uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id         uuid REFERENCES categories(id),
  nombre              text NOT NULL,
  slug                text NOT NULL,
  descripcion         text,
  precio_base         numeric(12,2) NOT NULL,
  moneda              currency NOT NULL DEFAULT 'USD',
  stock               integer NOT NULL DEFAULT 0,
  unidad              text NOT NULL DEFAULT 'unidad',
  cultivo_objetivo    text[],
  especie_objetivo    text[],
  ciclo               text[],
  principio_activo    text,
  dosis_recomendada   text,
  periodo_carencia    text,
  contraindicaciones  text,
  certificaciones     text[],
  activo              boolean NOT NULL DEFAULT true,
  UNIQUE (store_id, slug)
);
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_nombre_trgm ON products USING GIN (nombre gin_trgm_ops);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_active" ON products FOR SELECT USING (activo = true);
CREATE POLICY "products_manage_own_store" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.created_by = auth.uid())
);

CREATE TABLE product_variants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  nombre      text NOT NULL,
  sku         text,
  precio      numeric(12,2) NOT NULL,
  stock       integer NOT NULL DEFAULT 0,
  activo      boolean NOT NULL DEFAULT true
);
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants_select_all" ON product_variants FOR SELECT USING (true);
CREATE POLICY "variants_manage_via_store" ON product_variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products p JOIN stores s ON s.id = p.store_id
    WHERE p.id = product_variants.product_id AND s.created_by = auth.uid()
  )
);

CREATE TABLE product_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         text NOT NULL,
  alt         text,
  orden       integer NOT NULL DEFAULT 0
);
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "images_select_all" ON product_images FOR SELECT USING (true);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  COMERCIO                                                     ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE TABLE carts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  user_id     uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE
);
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "carts_own" ON carts FOR ALL USING (auth.uid() = user_id);

CREATE TABLE cart_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT NOW(),
  cart_id         uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id      uuid NOT NULL REFERENCES products(id),
  variant_id      uuid REFERENCES product_variants(id),
  cantidad        integer NOT NULL DEFAULT 1,
  precio_unitario numeric(12,2) NOT NULL,
  UNIQUE (cart_id, product_id, variant_id)
);
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cart_items_own" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

CREATE TABLE orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz NOT NULL DEFAULT NOW(),
  updated_at        timestamptz NOT NULL DEFAULT NOW(),
  comprador_id      uuid NOT NULL REFERENCES profiles(id),
  vendedor_id       uuid NOT NULL REFERENCES profiles(id),
  store_id          uuid NOT NULL REFERENCES stores(id),
  status            order_status NOT NULL DEFAULT 'creado',
  total             numeric(12,2) NOT NULL,
  moneda            currency NOT NULL DEFAULT 'USD',
  direccion_entrega text,
  notas             text
);
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_orders_comprador ON orders(comprador_id);
CREATE INDEX idx_orders_vendedor ON orders(vendedor_id);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_comprador_select" ON orders FOR SELECT USING (auth.uid() = comprador_id);
CREATE POLICY "orders_vendedor_select" ON orders FOR SELECT USING (auth.uid() = vendedor_id);
CREATE POLICY "orders_comprador_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = comprador_id);

CREATE TABLE order_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT NOW(),
  order_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      uuid NOT NULL REFERENCES products(id),
  variant_id      uuid REFERENCES product_variants(id),
  cantidad        integer NOT NULL,
  precio_unitario numeric(12,2) NOT NULL
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_parties" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (orders.comprador_id = auth.uid() OR orders.vendedor_id = auth.uid())
  )
);

CREATE TABLE escrow_accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  order_id    uuid UNIQUE NOT NULL REFERENCES orders(id),
  monto       numeric(12,2) NOT NULL,
  moneda      currency NOT NULL DEFAULT 'USD',
  status      escrow_status NOT NULL DEFAULT 'pendiente',
  liberado_at timestamptz,
  notas       text
);
CREATE TRIGGER trg_escrow_updated_at
  BEFORE UPDATE ON escrow_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "escrow_parties" ON escrow_accounts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = escrow_accounts.order_id
    AND (orders.comprador_id = auth.uid() OR orders.vendedor_id = auth.uid())
  )
);

CREATE TABLE escrow_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  escrow_id   uuid NOT NULL REFERENCES escrow_accounts(id),
  tipo        text NOT NULL,
  monto       numeric(12,2),
  actor_id    uuid REFERENCES profiles(id),
  descripcion text
);
ALTER TABLE escrow_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "escrow_events_parties" ON escrow_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM escrow_accounts ea JOIN orders o ON o.id = ea.order_id
    WHERE ea.id = escrow_events.escrow_id
    AND (o.comprador_id = auth.uid() OR o.vendedor_id = auth.uid())
  )
);

CREATE TABLE disputes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL DEFAULT NOW(),
  updated_at   timestamptz NOT NULL DEFAULT NOW(),
  order_id     uuid NOT NULL REFERENCES orders(id),
  iniciado_por uuid NOT NULL REFERENCES profiles(id),
  motivo       text NOT NULL,
  descripcion  text,
  evidencias   text[],
  resolucion   text,
  resuelto_por uuid REFERENCES profiles(id),
  resuelto_at  timestamptz
);
CREATE TRIGGER trg_disputes_updated_at
  BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "disputes_parties" ON disputes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = disputes.order_id
    AND (orders.comprador_id = auth.uid() OR orders.vendedor_id = auth.uid())
  )
);

CREATE TABLE shipments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  order_id    uuid NOT NULL REFERENCES orders(id),
  transportista_id uuid REFERENCES profiles(id),
  estado      text NOT NULL DEFAULT 'pendiente',
  tracking_url text,
  evidencia_entrega text[],
  costo       numeric(12,2),
  notas       text
);
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shipments_parties" ON shipments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = shipments.order_id
    AND (orders.comprador_id = auth.uid() OR orders.vendedor_id = auth.uid())
  )
);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  CONFIANZA Y COMUNIDAD                                        ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE TABLE reviews (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz NOT NULL DEFAULT NOW(),
  product_id        uuid NOT NULL REFERENCES products(id),
  order_id          uuid NOT NULL REFERENCES orders(id),
  reviewer_id       uuid NOT NULL REFERENCES profiles(id),
  rating            smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  titulo            text,
  contenido         text,
  fotos             text[],
  compra_verificada boolean NOT NULL DEFAULT true,
  UNIQUE (order_id, reviewer_id)
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE TABLE review_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  review_id   uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  voter_id    uuid NOT NULL REFERENCES profiles(id),
  util        boolean NOT NULL,
  UNIQUE (review_id, voter_id)
);
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "review_votes_all" ON review_votes FOR ALL USING (auth.uid() = voter_id);

CREATE TABLE seller_reputation (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_at      timestamptz NOT NULL DEFAULT NOW(),
  store_id        uuid UNIQUE NOT NULL REFERENCES stores(id),
  terra_score     integer NOT NULL DEFAULT 500,
  entregas_a_tiempo numeric(5,2) NOT NULL DEFAULT 100,
  calidad_promedio  numeric(3,2) NOT NULL DEFAULT 5.0,
  tasa_disputa      numeric(5,2) NOT NULL DEFAULT 0,
  total_ventas      integer NOT NULL DEFAULT 0
);
ALTER TABLE seller_reputation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reputation_select_all" ON seller_reputation FOR SELECT USING (true);

CREATE TABLE messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  sender_id   uuid NOT NULL REFERENCES profiles(id),
  receiver_id uuid NOT NULL REFERENCES profiles(id),
  order_id    uuid REFERENCES orders(id),
  product_id  uuid REFERENCES products(id),
  contenido   text NOT NULL,
  leido       boolean NOT NULL DEFAULT false
);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_parties" ON messages FOR ALL USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  FINANZAS                                                     ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE TABLE wallets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  user_id     uuid UNIQUE NOT NULL REFERENCES profiles(id),
  saldo_usd   numeric(14,2) NOT NULL DEFAULT 0,
  saldo_ves   numeric(18,2) NOT NULL DEFAULT 0
);
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallets_own" ON wallets FOR ALL USING (auth.uid() = user_id);

CREATE TABLE wallet_transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  wallet_id   uuid NOT NULL REFERENCES wallets(id),
  tipo        text NOT NULL,
  monto       numeric(14,2) NOT NULL,
  moneda      currency NOT NULL DEFAULT 'USD',
  referencia  text,
  descripcion text
);
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallet_tx_own" ON wallet_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM wallets WHERE wallets.id = wallet_transactions.wallet_id AND wallets.user_id = auth.uid())
);

CREATE TABLE financing_offers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT NOW(),
  financiera_id   uuid NOT NULL REFERENCES profiles(id),
  nombre          text NOT NULL,
  descripcion     text,
  tasa_interes    numeric(5,2) NOT NULL,
  plazo_dias      integer NOT NULL,
  monto_min       numeric(12,2) NOT NULL,
  monto_max       numeric(12,2) NOT NULL,
  terra_score_min integer NOT NULL DEFAULT 400,
  activa          boolean NOT NULL DEFAULT true
);
ALTER TABLE financing_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "financing_offers_select" ON financing_offers FOR SELECT USING (activa = true);

CREATE TABLE financing_agreements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT NOW(),
  updated_at      timestamptz NOT NULL DEFAULT NOW(),
  offer_id        uuid NOT NULL REFERENCES financing_offers(id),
  comprador_id    uuid NOT NULL REFERENCES profiles(id),
  monto           numeric(12,2) NOT NULL,
  tasa_acordada   numeric(5,2) NOT NULL,
  cronograma      jsonb NOT NULL DEFAULT '[]',
  status          text NOT NULL DEFAULT 'pendiente'
);
ALTER TABLE financing_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agreements_own" ON financing_agreements FOR ALL USING (auth.uid() = comprador_id);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  IA Y OPERACIÓN                                               ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE TABLE ai_conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  user_id     uuid NOT NULL REFERENCES profiles(id),
  agente      text NOT NULL,
  mensajes    jsonb NOT NULL DEFAULT '[]'
);
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_conv_own" ON ai_conversations FOR ALL USING (auth.uid() = user_id);

CREATE TABLE ai_diagnoses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT NOW(),
  user_id         uuid NOT NULL REFERENCES profiles(id),
  imagen_url      text NOT NULL,
  cultivo         text,
  diagnostico     text,
  confianza       numeric(5,4),
  recomendaciones jsonb DEFAULT '[]',
  alertas         jsonb DEFAULT '[]'
);
ALTER TABLE ai_diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diagnoses_own" ON ai_diagnoses FOR ALL USING (auth.uid() = user_id);

CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  user_id     uuid NOT NULL REFERENCES profiles(id),
  tipo        notification_type NOT NULL,
  titulo      text NOT NULL,
  contenido   text NOT NULL,
  leida       boolean NOT NULL DEFAULT false,
  url         text
);
CREATE INDEX idx_notifications_user ON notifications(user_id, leida);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);

CREATE TABLE wishlists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  user_id     uuid NOT NULL REFERENCES profiles(id),
  nombre      text NOT NULL DEFAULT 'Mi lista',
  descripcion text
);
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlists_own" ON wishlists FOR ALL USING (auth.uid() = user_id);

CREATE TABLE wishlist_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  wishlist_id uuid NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES products(id),
  cantidad    integer NOT NULL DEFAULT 1,
  notas       text,
  UNIQUE (wishlist_id, product_id)
);
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist_items_own" ON wishlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
);

CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  actor_id    uuid REFERENCES profiles(id),
  accion      text NOT NULL,
  tabla       text NOT NULL,
  registro_id uuid,
  datos_previos jsonb,
  datos_nuevos  jsonb,
  ip_address  inet
);
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_log_admin" ON audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  TRIGGER: TerraScore del vendedor                             ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION recalculate_terra_score()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_store_id uuid;
  v_avg_rating numeric;
  v_dispute_rate numeric;
  v_on_time_rate numeric;
  v_total_orders integer;
  v_new_score integer;
BEGIN
  -- Identify the store from the order
  SELECT store_id INTO v_store_id FROM orders WHERE id = NEW.order_id;
  IF v_store_id IS NULL THEN RETURN NEW; END IF;

  SELECT
    COUNT(*) FILTER (WHERE o.status = 'entregado' OR o.status = 'liberado'),
    COUNT(*) FILTER (WHERE o.status = 'en_disputa' OR o.status = 'reembolsado'),
    COUNT(*)
  INTO v_total_orders, v_dispute_rate, v_total_orders
  FROM orders o WHERE o.store_id = v_store_id;

  SELECT COALESCE(AVG(r.rating), 5.0) INTO v_avg_rating
  FROM reviews r
  JOIN order_items oi ON oi.order_id = r.order_id
  JOIN products p ON p.id = oi.product_id
  WHERE p.store_id = v_store_id;

  -- Simple scoring: 600 base + avg_rating*40 + (1 - dispute_rate)*100
  v_dispute_rate := CASE WHEN v_total_orders > 0
    THEN (v_dispute_rate::numeric / v_total_orders) ELSE 0 END;
  v_new_score := GREATEST(0, LEAST(1000,
    ROUND(
      600 +
      (v_avg_rating - 1) * 40 +
      (1 - v_dispute_rate) * 100
    )
  ));

  INSERT INTO seller_reputation (store_id, terra_score, calidad_promedio, tasa_disputa, total_ventas)
  VALUES (v_store_id, v_new_score, v_avg_rating, v_dispute_rate, v_total_orders)
  ON CONFLICT (store_id) DO UPDATE SET
    terra_score     = v_new_score,
    calidad_promedio = v_avg_rating,
    tasa_disputa    = v_dispute_rate,
    total_ventas    = v_total_orders,
    updated_at      = NOW();

  UPDATE stores SET terra_score = v_new_score WHERE id = v_store_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_recalculate_score_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION recalculate_terra_score();

-- ── Trigger: auto-create wallet + cart on profile insert ───────
CREATE OR REPLACE FUNCTION bootstrap_user_resources()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO carts (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO wishlists (user_id, nombre) VALUES (NEW.id, 'Lista de ciclo') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bootstrap_user
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION bootstrap_user_resources();


-- ══════════════════════════════════════════════════════════════
-- DOWN (reversión) — ejecutar en orden inverso
-- ══════════════════════════════════════════════════════════════
-- DROP TRIGGER IF EXISTS trg_bootstrap_user ON profiles;
-- DROP FUNCTION IF EXISTS bootstrap_user_resources;
-- DROP TRIGGER IF EXISTS trg_recalculate_score_on_review ON reviews;
-- DROP FUNCTION IF EXISTS recalculate_terra_score;
-- DROP TABLE IF EXISTS audit_log, wishlist_items, wishlists, notifications, ai_diagnoses, ai_conversations,
--   financing_agreements, financing_offers, wallet_transactions, wallets, messages, seller_reputation,
--   review_votes, reviews, shipments, disputes, escrow_events, escrow_accounts, order_items, orders,
--   cart_items, carts, product_images, product_variants, products, stores, categories,
--   organization_members, organizations, profiles CASCADE;
-- DROP TYPE IF EXISTS notification_type, currency, escrow_status, order_status, user_role;
-- DROP FUNCTION IF EXISTS set_updated_at;
-- DROP EXTENSION IF EXISTS pg_trgm;
