-- TerraMercado — Seed data
-- Crea: 1 admin, 1 demo (Carlos Martínez), 3 vendedores, categorías raíz

-- ── Categorías ──────────────────────────────────────────────────
INSERT INTO categories (id, nombre, slug, descripcion, orden) VALUES
  ('cat-insumos-00000-0000-0000-000000000001', 'Insumos Agrícolas',   'insumos',    'Fertilizantes, agroquímicos, herbicidas', 1),
  ('cat-ganaderia-0000-0000-0000-000000000002', 'Ganadería',          'ganaderia',  'Sanidad animal, nutrición, equipamiento', 2),
  ('cat-cereales-00000-0000-0000-000000000003', 'Cereales y Granos',  'cereales',   'Maíz, sorgo, soja, arroz',                3),
  ('cat-genetica-00000-0000-0000-000000000004', 'Genética',           'genetica',   'Semen bovino, embriones, pie de cría',    4),
  ('cat-riego-000000-0000-0000-000000000005', 'Riego y Agua',         'riego',      'Sistemas de riego, bombas, accesorios',   5),
  ('cat-maquinaria-000-0000-0000-000000000006', 'Maquinaria',         'maquinaria', 'Tractores, implementos, equipos',         6),
  ('cat-cafe-000000000-0000-0000-000000000007', 'Café y Cacao',       'cafe',       'Insumos especializados para café/cacao',  7),
  ('cat-empaques-0000-0000-0000-000000000008', 'Empaques',            'empaques',   'Sacos, pallets, embalaje agroindustrial', 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (nombre, slug, descripcion, parent_id, orden) VALUES
  ('Fertilizantes', 'fertilizantes', 'NPK, urea, fosfatos', 'cat-insumos-00000-0000-0000-000000000001', 1),
  ('Herbicidas',    'herbicidas',    'Control de malezas',  'cat-insumos-00000-0000-0000-000000000001', 2),
  ('Fungicidas',    'fungicidas',    'Control de hongos',   'cat-insumos-00000-0000-0000-000000000001', 3),
  ('Insecticidas',  'insecticidas',  'Control de plagas',   'cat-insumos-00000-0000-0000-000000000001', 4),
  ('Semen bovino',  'semen-bovino',  'Razas certificadas',  'cat-genetica-00000-0000-0000-000000000004', 1)
ON CONFLICT (slug) DO NOTHING;

-- Note: auth.users records must be created via Supabase Auth API.
-- This seed assumes profiles are created after auth signup via trigger.
-- Run via Supabase dashboard or migration scripts that call auth.admin.createUser().

-- Placeholder comment: after creating auth users, insert profiles with the returned UUIDs.
-- Example structure (use real UUIDs from auth.admin.createUser):
--
-- INSERT INTO profiles (id, email, nombre, apellido, rol, ubicacion, cultivo_principal, terra_score)
-- VALUES
--   ('<admin-uuid>',    'admin@terramercado.com',   'Admin', 'Terra',      'admin',   'Caracas, Venezuela', null, 900),
--   ('<carlos-uuid>',   'carlos@terramercado.com',  'Carlos', 'Martínez', 'comprador', 'Aragua, Venezuela', 'Caña de azúcar', 742),
--   ('<vendedor1-uuid>', 'agrodist@terramercado.com', 'AgroDist', 'Aragua', 'vendedor', 'Aragua, Venezuela', null, 891),
--   ('<vendedor2-uuid>', 'insumosllano@terramercado.com', 'Insumos', 'del Llano', 'vendedor', 'Barinas, Venezuela', null, 756),
--   ('<vendedor3-uuid>', 'casamoto@terramercado.com', 'Casa de Monta', 'El Palmar', 'vendedor', 'Apure, Venezuela', null, 923);
