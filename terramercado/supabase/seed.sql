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

-- ══════════════════════════════════════════════════════════════
-- SEED SCRIPT — TerraMercado v1.0
-- ══════════════════════════════════════════════════════════════
--
-- This seed creates:
--   1 admin user         → admin@terramercado.com
--   1 demo user          → carlos@terramercado.com (Carlos Martínez, TerraScore 742)
--   3 vendor users       → agrodist@..., insumosllano@..., casamoto@...
--   3 stores             → agrodistribuciones-aragua, insumos-del-llano, casa-de-monta-el-palmar
--   30 products          → 10 fertilizantes, 8 herbicidas, 6 semillas, 6 genética pecuaria
--   10 orders            → in different statuses (creado, pagado_en_escrow, entregado, en_disputa, etc.)
--
-- USAGE:
--   1. Create auth users via Supabase Dashboard > Auth > Users (or via admin API)
--      Use the emails above with password: TerraMercado2026!
--   2. Copy the returned UUIDs into the variables below
--   3. Run this script in Supabase SQL editor
--
-- VARIABLES (replace with real UUIDs after creating auth users):
\set admin_id  'aaaaaaaa-0000-0000-0000-000000000001'
\set carlos_id 'bbbbbbbb-0000-0000-0000-000000000001'
\set v1_id     'cccccccc-0000-0000-0000-000000000001'
\set v2_id     'dddddddd-0000-0000-0000-000000000001'
\set v3_id     'eeeeeeee-0000-0000-0000-000000000001'

-- ── Perfiles ───────────────────────────────────────────────────
INSERT INTO profiles (id, email, nombre, apellido, rol, ubicacion, estado, municipio, cultivo_principal, terra_score, terra_plus)
VALUES
  (:'admin_id',  'admin@terramercado.com',          'Admin',         'Terra',        'admin',     'Caracas, Venezuela',       'Distrito Capital', 'Libertador',  NULL,               900, true),
  (:'carlos_id', 'carlos@terramercado.com',          'Carlos',        'Martínez',     'comprador', 'Aragua, Venezuela',        'Aragua',           'Girardot',    'Caña de azúcar',   742, false),
  (:'v1_id',     'agrodist@terramercado.com',        'AgroDist',      'Aragua',       'vendedor',  'Maracay, Aragua',          'Aragua',           'Mario Briceño', NULL,              891, true),
  (:'v2_id',     'insumosllano@terramercado.com',    'Insumos',       'del Llano',    'vendedor',  'Barinas, Venezuela',       'Barinas',          'Barinas',     NULL,               756, false),
  (:'v3_id',     'casamoto@terramercado.com',        'Casa de Monta', 'El Palmar',    'vendedor',  'Apure, Venezuela',         'Apure',            'San Fernando', NULL,              923, true)
ON CONFLICT (id) DO NOTHING;

-- ── Tiendas ────────────────────────────────────────────────────
INSERT INTO stores (id, created_by, slug, nombre, descripcion, ubicacion, terra_score, verificada, activa)
VALUES
  ('store-agrodist-000000-0000-000000000001', :'v1_id',
   'agrodistribuciones-aragua',
   'AgroDistribuciones Aragua',
   'Distribuidora de insumos agrícolas con más de 20 años en el mercado aragüeño. Especialistas en fertilizantes, herbicidas y semillas certificadas.',
   'Maracay, Aragua, Venezuela', 891, true, true),

  ('store-insumosllano-000-0000-000000000002', :'v2_id',
   'insumos-del-llano',
   'Insumos del Llano',
   'Proveedor líder de agroquímicos y fungicidas para los llanos venezolanos. Atención personalizada y despacho a todo el estado Barinas.',
   'Barinas, Venezuela', 756, true, true),

  ('store-casamoto-000000-0000-000000000003', :'v3_id',
   'casa-de-monta-el-palmar',
   'Casa de Monta El Palmar',
   'Genética bovina de élite. Ofrecemos semen certificado de razas cebú, brahman, holstein y búfalo con respaldo internacional.',
   'San Fernando, Apure, Venezuela', 923, true, true)
ON CONFLICT (slug) DO NOTHING;

-- ── Productos: 10 Fertilizantes ─────────────────────────────────
DO $$
DECLARE
  cat_fert uuid;
  store1   uuid := 'store-agrodist-000000-0000-000000000001';
  store2   uuid := 'store-insumosllano-000-0000-000000000002';
BEGIN
  SELECT id INTO cat_fert FROM categories WHERE slug = 'fertilizantes';

  INSERT INTO products (store_id, category_id, nombre, slug, descripcion, precio_base, moneda, stock, unidad,
                        cultivo_objetivo, principio_activo, dosis_recomendada, periodo_carencia, activo)
  VALUES
    (store1, cat_fert,
     'NPK 15-15-15 Granulado 50 kg',
     'npk-15-15-15-granulado-50kg',
     'Fertilizante completo de liberación controlada. Fórmula balanceada para cultivos de ciclo corto y largo. Ideal en fase de establecimiento.',
     38.50, 'USD', 500, 'saco 50 kg',
     ARRAY['Maíz','Soja','Sorgo','Caña de azúcar'],
     'Nitrógeno 15% + Fósforo 15% + Potasio 15%',
     '250-300 kg/ha aplicados al momento de la siembra o en banda',
     'Sin periodo de carencia', true),

    (store1, cat_fert,
     'Urea 46% N Granulada 50 kg',
     'urea-46-n-granulada-50kg',
     'Fuente nitrogenada de alta concentración para fertirrigación y aplicación al suelo. Aumenta el rendimiento de proteína en granos.',
     29.00, 'USD', 800, 'saco 50 kg',
     ARRAY['Maíz','Arroz','Pastos','Caña de azúcar'],
     'Nitrógeno 46% (forma ureica)',
     '200-400 kg/ha fraccionado en 2-3 aplicaciones',
     '7 días para pastos cortados', true),

    (store1, cat_fert,
     'DAP (18-46-0) 50 kg',
     'dap-18-46-0-50kg',
     'Fosfato diamónico de alta solubilidad. Excelente estimulador del desarrollo radicular y floración. Recomendado en suelos con deficiencia de fósforo.',
     42.00, 'USD', 350, 'saco 50 kg',
     ARRAY['Soja','Maíz','Arroz','Café'],
     'Nitrógeno 18% + Fósforo 46%',
     '100-200 kg/ha en siembra, aplicado en banda',
     'Sin periodo de carencia', true),

    (store2, cat_fert,
     'KCl (0-0-60) Cloruro de Potasio 50 kg',
     'kcl-0-0-60-cloruro-potasio-50kg',
     'Fuente potásica de alta concentración para corregir deficiencias de K. Mejora la calidad del fruto, resistencia a enfermedades y tolerancia a sequía.',
     35.00, 'USD', 420, 'saco 50 kg',
     ARRAY['Caña de azúcar','Maíz','Plátano','Soja'],
     'Potasio 60% (forma clorurada)',
     '100-250 kg/ha según análisis de suelo',
     'Sin periodo de carencia', true),

    (store2, cat_fert,
     'Nitrato de Amonio 33.5% N 50 kg',
     'nitrato-amonio-33-5-n-50kg',
     'Fertilizante nitrogenado de rápida disponibilidad con fracción nítrica y amoniacal. Ideal para fertirriego y aplicaciones foliares diluidas.',
     33.00, 'USD', 300, 'saco 50 kg',
     ARRAY['Maíz','Sorgo','Pastos','Hortalizas'],
     'Nitrógeno 33.5% (17% nítrico + 16.5% amoniacal)',
     '150-300 kg/ha en cobertura fraccionada',
     'Sin periodo de carencia', true),

    (store1, cat_fert,
     'Sulfato de Zinc 22% 25 kg',
     'sulfato-de-zinc-22-25kg',
     'Corrector de deficiencia de zinc. Elemento esencial en la formación de clorofila y activación enzimática. Presentación granulada para suelo.',
     18.50, 'USD', 200, 'saco 25 kg',
     ARRAY['Maíz','Arroz','Soja','Cítricos'],
     'Zinc 22% + Azufre 11%',
     '5-10 kg/ha aplicado en banda con fertilizante de fondo',
     'Sin periodo de carencia', true),

    (store1, cat_fert,
     'Boro Foliar Solubor 11% B 1 kg',
     'boro-foliar-solubor-11-1kg',
     'Corrector de deficiencia de boro de alta solubilidad para aplicación foliar. Previene malformaciones en frutos y mejora la polinización.',
     12.00, 'USD', 150, 'bolsa 1 kg',
     ARRAY['Soja','Girasol','Café','Cacao','Mango'],
     'Boro 11% (Borato de sodio)',
     '1-2 kg/ha en 200 L agua, en prefloración',
     '7 días', true),

    (store2, cat_fert,
     'Sulfato de Magnesio (Kieserita) 27% MgO 50 kg',
     'sulfato-magnesio-kieserita-27-mgo-50kg',
     'Fuente de magnesio y azufre de liberación gradual. Corrige clorosis intervenal causada por deficiencia de Mg. Compatible con la mayoría de los NPK.',
     22.00, 'USD', 180, 'saco 50 kg',
     ARRAY['Maíz','Caña de azúcar','Soja','Pastos'],
     'Magnesio 27% (MgO) + Azufre 22% (SO3)',
     '50-100 kg/ha incorporado en presiembra',
     'Sin periodo de carencia', true),

    (store2, cat_fert,
     'Humato de Potasio 85% 1 kg',
     'humato-de-potasio-85-1kg',
     'Bioestimulante y mejorador de suelo. Aumenta la CIC, mejora la estructura del suelo y estimula el desarrollo radicular. Compatible con fertirrigación.',
     8.00, 'USD', 300, 'bolsa 1 kg',
     ARRAY['Maíz','Hortalizas','Frutales','Pastos'],
     'Ácidos húmicos 85% + Potasio 12%',
     '2-5 kg/ha vía fertirriego o al suelo',
     'Sin periodo de carencia', true),

    (store1, cat_fert,
     'Fosfato Monoamónico MAP 12-61-0 25 kg',
     'fosfato-monoamonico-map-12-61-0-25kg',
     'Fertilizante fosfatado de alta pureza. Excelente para fertirrigación por su alta solubilidad en agua. Bajo índice de salinidad.',
     31.00, 'USD', 220, 'saco 25 kg',
     ARRAY['Soja','Maíz','Tomate','Pimentón','Arroz'],
     'Nitrógeno 12% + Fósforo 61%',
     '3-6 kg/1000 m² vía fertirriego en etapa vegetativa',
     'Sin periodo de carencia', true);
END $$;

-- ── Productos: 8 Herbicidas/Fungicidas ──────────────────────────
DO $$
DECLARE
  cat_herb uuid;
  cat_fung uuid;
  store1   uuid := 'store-agrodist-000000-0000-000000000001';
  store2   uuid := 'store-insumosllano-000-0000-000000000002';
BEGIN
  SELECT id INTO cat_herb FROM categories WHERE slug = 'herbicidas';
  SELECT id INTO cat_fung FROM categories WHERE slug = 'fungicidas';

  INSERT INTO products (store_id, category_id, nombre, slug, descripcion, precio_base, moneda, stock, unidad,
                        cultivo_objetivo, principio_activo, dosis_recomendada, periodo_carencia, contraindicaciones, activo)
  VALUES
    (store1, cat_herb,
     'Glifosato 48% SL 20 L',
     'glifosato-48-sl-20l',
     'Herbicida sistémico no selectivo de amplio espectro. Controla gramíneas, ciperáceas y malezas de hoja ancha. Uso en presiembra y posemergencia dirigida.',
     45.00, 'USD', 200, 'bidón 20 L',
     ARRAY['Maíz','Soja','Caña de azúcar','Arroz','Pastos'],
     'Glifosato sal isopropilamina 48%',
     '2-4 L/ha en 200-300 L agua; para malezas perennes 4-6 L/ha',
     '7 días', 'No aplicar en condiciones de lluvia inminente. Usar equipo de protección EPP completo.', true),

    (store1, cat_herb,
     '2,4-D Amina 72% SL 20 L',
     '2-4-d-amina-72-sl-20l',
     'Herbicida sistémico selectivo para control de malezas de hoja ancha en gramíneas. Alta eficacia en coquito y verdolaga.',
     38.00, 'USD', 180, 'bidón 20 L',
     ARRAY['Maíz','Sorgo','Arroz','Pastos','Caña de azúcar'],
     '2,4-D (ácido 2,4-diclorofenoxiacético) 72%',
     '1-2 L/ha en posemergencia, 3-5 hojas del cultivo',
     '14 días',
     'No usar en cultivos de hoja ancha. Deriva peligrosa para cultivos adyacentes.', true),

    (store2, cat_herb,
     'Atrazina 80% WG 1 kg',
     'atrazina-80-wg-1kg',
     'Herbicida pre y posemergente selectivo para control de gramíneas y hoja ancha en maíz y sorgo. Residualidad prolongada.',
     14.00, 'USD', 250, 'bolsa 1 kg',
     ARRAY['Maíz','Sorgo','Caña de azúcar'],
     'Atrazina 80%',
     '1.5-3 kg/ha en preemergencia o posemergencia temprana',
     '70 días',
     'No usar en suelos arenosos o con alta permeabilidad. Rotar con cultivos tolerantes.', true),

    (store2, cat_herb,
     'Paraquat 20% SL 5 L',
     'paraquat-20-sl-5l',
     'Herbicida de contacto no selectivo. Acción rápida para desecación de rastrojos y control de malezas en siembra directa.',
     22.00, 'USD', 120, 'bidón 5 L',
     ARRAY['Maíz','Soja','Caña de azúcar','Arroz'],
     'Paraquat dicloruro 20%',
     '2-3 L/ha en 200 L agua; no mezclar con suelo',
     '1 día',
     'EXTREMADAMENTE TÓXICO. Uso restringido. Requiere certificado de aplicador. EPP nivel 4 obligatorio.', true),

    (store1, cat_fung,
     'Mancozeb 80% WP 1 kg',
     'mancozeb-80-wp-1kg',
     'Fungicida protectante de contacto de amplio espectro. Controla tizón tardío, antracnosis y mancha foliar. Alta eficiencia en condiciones de alta humedad.',
     7.50, 'USD', 400, 'bolsa 1 kg',
     ARRAY['Maíz','Soja','Tomate','Papa','Cacao'],
     'Mancozeb 80% (Manganeso + Zinc etilenobisditiocarbamato)',
     '2-3 kg/ha en 400-600 L agua; aplicar preventivamente',
     '7 días',
     'No mezclar con productos alcalinos. Proteger polinizadores.', true),

    (store1, cat_fung,
     'Carbendazim 50% SC 1 L',
     'carbendazim-50-sc-1l',
     'Fungicida sistémico del grupo benzimidazol. Controla Cercospora, Fusarium y Botrytis. Absorción por raíz y follaje con movilidad ascendente.',
     9.00, 'USD', 300, 'botella 1 L',
     ARRAY['Soja','Arroz','Maíz','Café','Cacao'],
     'Carbendazim 50% (metil benzimidazol-2-il carbamato)',
     '0.5-1 L/ha en 200 L agua; aplicar al inicio de síntomas',
     '21 días',
     'Resistencia cruzada con otros benzimidazoles. Rotar mecanismo de acción.', true),

    (store2, cat_fung,
     'Trifloxistrobina + Tebuconazol SC 500 mL',
     'trifloxistrobina-tebuconazol-sc-500ml',
     'Fungicida sistémico combinado (estrobilurina + triazol). Control preventivo y curativo de roya, mancha foliar y añublo. Excelente efecto de "green effect".',
     28.00, 'USD', 150, 'botella 500 mL',
     ARRAY['Soja','Maíz','Trigo','Café'],
     'Trifloxistrobina 15% + Tebuconazol 20%',
     '500 mL/ha en 200 L agua; máx 2 aplicaciones/ciclo',
     '28 días', NULL, true),

    (store2, cat_fung,
     'Azoxistrobina 25% SC 1 L',
     'azoxistrobina-25-sc-1l',
     'Fungicida estrobilurina de amplio espectro. Altamente efectivo contra patógenos de la familia Oomycetes. Mejora la eficiencia fotosintética del cultivo.',
     19.50, 'USD', 200, 'botella 1 L',
     ARRAY['Soja','Arroz','Maíz','Papa','Hortalizas'],
     'Azoxistrobina 25%',
     '0.8-1 L/ha en 200-300 L agua; aplicar preventivamente',
     '14 días',
     'No aplicar en más de 2 ciclos consecutivos para evitar resistencia.', true);
END $$;

-- ── Productos: 6 Semillas ──────────────────────────────────────
DO $$
DECLARE
  cat_cer uuid;
  store1  uuid := 'store-agrodist-000000-0000-000000000001';
  store2  uuid := 'store-insumosllano-000-0000-000000000002';
BEGIN
  SELECT id INTO cat_cer FROM categories WHERE slug = 'cereales';

  INSERT INTO products (store_id, category_id, nombre, slug, descripcion, precio_base, moneda, stock, unidad,
                        cultivo_objetivo, ciclo, certificaciones, activo)
  VALUES
    (store1, cat_cer,
     'Semilla Maíz Amarillo P3862 20 kg',
     'semilla-maiz-p3862-20kg',
     'Híbrido de alto rendimiento de Pioneer. Adaptado a los llanos venezolanos y zonas de Aragua. Excelente tolerancia a sequía y alta densidad de siembra.',
     85.00, 'USD', 120, 'bolsa 20 kg',
     ARRAY['Maíz'], ARRAY['1er ciclo','2do ciclo'],
     ARRAY['INIA','CENARGEN','Pioneer Certified'], true),

    (store2, cat_cer,
     'Semilla Soja S5N (Vargen 5N) 40 kg',
     'semilla-soja-vargen-5n-40kg',
     'Variedad semi-determinada de alto potencial. Grupo de madurez 5, ciclo 120-130 días. Tolerante a roya asiática con buen comportamiento en suelos Franco-Arcillosos.',
     65.00, 'USD', 80, 'bolsa 40 kg',
     ARRAY['Soja'], ARRAY['1er ciclo'],
     ARRAY['INIA','CENARGEN'], true),

    (store1, cat_cer,
     'Semilla Arroz FONAIAP 2000 50 kg',
     'semilla-arroz-fonaiap-2000-50kg',
     'Variedad del programa de mejoramiento nacional FONAIAP. Alta productividad en sistemas de riego y secano favorecido. Excelente calidad molinera.',
     45.00, 'USD', 100, 'saco 50 kg',
     ARRAY['Arroz'], ARRAY['1er ciclo','2do ciclo'],
     ARRAY['INIA','FONAIAP'], true),

    (store2, cat_cer,
     'Semilla Sorgo Granífero AZ-3 25 kg',
     'semilla-sorgo-az3-25kg',
     'Híbrido de sorgo granífero. Ciclo 100-110 días. Alta tolerancia a suelos ácidos de los llanos occidentales. Resistente a pulgón amarillo.',
     42.00, 'USD', 90, 'bolsa 25 kg',
     ARRAY['Sorgo'], ARRAY['1er ciclo','2do ciclo'],
     ARRAY['INIA'], true),

    (store1, cat_cer,
     'Semilla Maíz Blanco Himeca-2 20 kg',
     'semilla-maiz-blanco-himeca-2-20kg',
     'Híbrido de maíz blanco para consumo humano. Excelente para producción de arepas. Ciclo 95-105 días. Adaptado a zonas tropicales.',
     72.00, 'USD', 75, 'bolsa 20 kg',
     ARRAY['Maíz'], ARRAY['1er ciclo','2do ciclo'],
     ARRAY['INIA','CENARGEN'], true),

    (store2, cat_cer,
     'Semilla Ajonjolí DP-1000 10 kg',
     'semilla-ajonjoli-dp-1000-10kg',
     'Variedad mejorada de alto rendimiento de aceite (50-52%). Ciclo 80-90 días. Tolerante a sequía terminal. Adaptado a los estados Portuguesa y Barinas.',
     38.00, 'USD', 60, 'bolsa 10 kg',
     ARRAY['Ajonjolí'], ARRAY['1er ciclo'],
     ARRAY['INIA'], true);
END $$;

-- ── Productos: 6 Genética Pecuaria ────────────────────────────
DO $$
DECLARE
  cat_gen uuid;
  cat_sem uuid;
  store3  uuid := 'store-casamoto-000000-0000-000000000003';
BEGIN
  SELECT id INTO cat_gen FROM categories WHERE slug = 'genetica';
  SELECT id INTO cat_sem FROM categories WHERE slug = 'semen-bovino';

  INSERT INTO products (store_id, category_id, nombre, slug, descripcion, precio_base, moneda, stock, unidad,
                        especie_objetivo, certificaciones, activo)
  VALUES
    (store3, cat_sem,
     'Semen Toro Brahman El Gran Campeón — Pajuela 0.5 mL',
     'semen-brahman-gran-campeon-pajuela',
     'Semen congelado de toro Brahman Americano de élite. EBV: +2.8 kg nacimiento, +45 kg destete, +28 kg 12 meses. Excelente adaptación tropical y alta fertilidad (75% concepción).',
     18.00, 'USD', 500, 'pajuela 0.5 mL',
     ARRAY['Bovinos Cebú'], ARRAY['ASOVEMA','ABS Global','Certified Sire'], true),

    (store3, cat_sem,
     'Semen Toro Holstein Friesland HF-2200 — Pajuela 0.5 mL',
     'semen-holstein-hf2200-pajuela',
     'Semen de toro Holstein de alta producción láctea. EPD: +850 kg leche/lactancia, +32 kg grasa. Recomendado para cruzas de mejoramiento lechero en doble propósito.',
     22.00, 'USD', 350, 'pajuela 0.5 mL',
     ARRAY['Bovinos Lecheros','Doble Propósito'], ARRAY['ALTA Genetics','Certified Sire','Genomic Tested'], true),

    (store3, cat_sem,
     'Semen Toro Búfalo Mediterráneo BF-Nilo — Pajuela 0.5 mL',
     'semen-bufalo-mediterraneo-bf-nilo-pajuela',
     'Semen de búfalo mediterráneo de alta ganancia de peso. EBV: +38 kg destete, excelente conformación carnicera. Ideal para zonas inundables del Apure y Delta.',
     25.00, 'USD', 200, 'pajuela 0.5 mL',
     ARRAY['Búfalo de agua'], ARRAY['ABCB Brasil','Certified Sire'], true),

    (store3, cat_sem,
     'Semen Toro Nelore NelorePuro NG-90 — Pajuela 0.5 mL',
     'semen-nelore-ng90-pajuela',
     'Semen Nelore Mocho de alta musculatura. EBV: +0.5 kg nacimiento (distocia mínima), +42 kg destete. Excelente para cruza industrial con vacas Brahman.',
     16.00, 'USD', 450, 'pajuela 0.5 mL',
     ARRAY['Bovinos Cebú','Cruza Industrial'], ARRAY['ASOVEMA','Asociación Brasilera Nelore'], true),

    (store3, cat_sem,
     'Semen Toro Gyr Lechero GYR-Lactus — Pajuela 0.5 mL',
     'semen-gyr-lechero-gyr-lactus-pajuela',
     'Semen de Gyr Lechero certificado del Brasil. EPD: +620 kg leche ajustada, alta persistencia. Excelente para producción de queso y leche en fincas doble propósito.',
     20.00, 'USD', 280, 'pajuela 0.5 mL',
     ARRAY['Bovinos Lecheros Cebú','Doble Propósito'], ARRAY['ABCGIL Brasil','Certified Sire','Genomic Tested'], true),

    (store3, cat_gen,
     'Semen Toro Simmental SM-Titan — Pajuela 0.5 mL',
     'semen-simmental-sm-titan-pajuela',
     'Semen Simmental Europeo de alta ganancia diaria de peso. EBV: +1.1 kg/día GDP, excelente cobertura muscular. Para cruzas terminales con vacas cebú en sistemas intensivos.',
     24.00, 'USD', 180, 'pajuela 0.5 mL',
     ARRAY['Bovinos Carne','Cruza Terminal'], ARRAY['World Simmental Federation','Certified Sire'], true);
END $$;

-- ── Reputación de tiendas ──────────────────────────────────────
INSERT INTO seller_reputation (store_id, terra_score, entregas_a_tiempo, calidad_promedio, tasa_disputa, total_ventas)
VALUES
  ('store-agrodist-000000-0000-000000000001', 891, 97.50, 4.7, 0.5, 342),
  ('store-insumosllano-000-0000-000000000002', 756, 91.20, 4.3, 1.8, 187),
  ('store-casamoto-000000-0000-000000000003', 923, 99.10, 4.9, 0.2, 521)
ON CONFLICT (store_id) DO NOTHING;

-- ── Billeteras ─────────────────────────────────────────────────
INSERT INTO wallets (user_id, saldo_usd, saldo_ves)
VALUES
  (:'admin_id',  0.00,    0.00),
  (:'carlos_id', 1250.00, 4375000.00),
  (:'v1_id',     8430.00, 29505000.00),
  (:'v2_id',     3120.00, 10920000.00),
  (:'v3_id',     12750.00, 44625000.00)
ON CONFLICT (user_id) DO NOTHING;

-- ── Pedidos (10 pedidos en distintos estados) ──────────────────
DO $$
DECLARE
  store1   uuid := 'store-agrodist-000000-0000-000000000001';
  store2   uuid := 'store-insumosllano-000-0000-000000000002';
  store3   uuid := 'store-casamoto-000000-0000-000000000003';
  carlos   uuid := :'carlos_id';
  v1       uuid := :'v1_id';
  v2       uuid := :'v2_id';
  v3       uuid := :'v3_id';
  o1 uuid; o2 uuid; o3 uuid; o4 uuid; o5 uuid;
  o6 uuid; o7 uuid; o8 uuid; o9 uuid; o10 uuid;
BEGIN
  -- Pedido 1: creado
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega, notas)
  VALUES (carlos, v1, store1, 'creado', 192.50, 'USD', 'Finca El Retorno, Km 14, Vía Turmero, Aragua', 'Entregar antes del viernes')
  RETURNING id INTO o1;

  -- Pedido 2: pagado_en_escrow
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v2, store2, 'pagado_en_escrow', 83.00, 'USD', 'Finca La Esperanza, Barinas')
  RETURNING id INTO o2;

  -- Pedido 3: en_preparacion
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v1, store1, 'en_preparacion', 340.00, 'USD', 'Finca El Retorno, Km 14, Vía Turmero, Aragua')
  RETURNING id INTO o3;

  -- Pedido 4: en_transito
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v3, store3, 'en_transito', 270.00, 'USD', 'Hato Los Cedros, Apure')
  RETURNING id INTO o4;

  -- Pedido 5: entregado
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v1, store1, 'entregado', 154.00, 'USD', 'Finca El Retorno, Km 14, Vía Turmero, Aragua')
  RETURNING id INTO o5;

  -- Pedido 6: liberado
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v2, store2, 'liberado', 67.50, 'USD', 'Finca La Esperanza, Barinas')
  RETURNING id INTO o6;

  -- Pedido 7: en_disputa
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega, notas)
  VALUES (carlos, v2, store2, 'en_disputa', 56.00, 'USD', 'Finca La Esperanza, Barinas', 'Producto llegó con el embalaje dañado')
  RETURNING id INTO o7;

  -- Pedido 8: reembolsado
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v1, store1, 'reembolsado', 45.00, 'USD', 'Finca El Retorno, Km 14, Vía Turmero, Aragua')
  RETURNING id INTO o8;

  -- Pedido 9: liberado (genética)
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v3, store3, 'liberado', 450.00, 'USD', 'Hato Los Cedros, Apure')
  RETURNING id INTO o9;

  -- Pedido 10: pagado_en_escrow (genética)
  INSERT INTO orders (comprador_id, vendedor_id, store_id, status, total, moneda, direccion_entrega)
  VALUES (carlos, v3, store3, 'pagado_en_escrow', 360.00, 'USD', 'Hato Los Cedros, Apure')
  RETURNING id INTO o10;

  -- ── Escrow accounts ──────────────────────────────────────────
  INSERT INTO escrow_accounts (order_id, monto, moneda, status)
  VALUES
    (o1,  192.50, 'USD', 'pendiente'),
    (o2,   83.00, 'USD', 'fondos_recibidos'),
    (o3,  340.00, 'USD', 'fondos_recibidos'),
    (o4,  270.00, 'USD', 'fondos_recibidos'),
    (o5,  154.00, 'USD', 'fondos_recibidos'),
    (o6,   67.50, 'USD', 'liberado'),
    (o7,   56.00, 'USD', 'en_disputa'),
    (o8,   45.00, 'USD', 'reembolsado'),
    (o9,  450.00, 'USD', 'liberado'),
    (o10, 360.00, 'USD', 'fondos_recibidos');

  -- ── Disputa para pedido o7 ────────────────────────────────────
  INSERT INTO disputes (order_id, iniciado_por, motivo, descripcion)
  VALUES (
    o7,
    carlos,
    'Producto dañado en tránsito',
    'Recibí el saco de atrazina con el embalaje completamente roto. El producto estaba humedecido y no es posible usarlo. Solicito reembolso total o reenvío del producto en condiciones adecuadas.'
  );

END $$;
