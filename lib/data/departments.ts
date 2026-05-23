import type { Division, Department } from '@/types'

export const DIVISIONS: Division[] = [
  {
    id: 1, name: 'C-SUITE', code: 'DIV-01', color: '#ffc800', icon: '👑',
    agentCount: 15, subAgentCount: 75,
    departments: [
      { id: 'd001', name: 'CEO Office', divisionId: 1, divisionName: 'C-SUITE', description: 'Oficina ejecutiva central de GENESUS', agentCount: 1, keywords: ['ceo', 'estrategia', 'visión'] },
      { id: 'd002', name: 'CFO — Finanzas Corp.', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección financiera corporativa', agentCount: 1, keywords: ['cfo', 'finanzas corporativas'] },
      { id: 'd003', name: 'CTO — Tecnología', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección tecnológica y sistemas', agentCount: 1, keywords: ['cto', 'tecnología', 'sistemas'] },
      { id: 'd004', name: 'COO — Operaciones', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección de operaciones globales', agentCount: 1, keywords: ['coo', 'operaciones'] },
      { id: 'd005', name: 'CMO — Marketing', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección de marketing y marca', agentCount: 1, keywords: ['cmo', 'marketing'] },
      { id: 'd006', name: 'CPO — Producto', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección de producto e innovación', agentCount: 1, keywords: ['cpo', 'producto'] },
      { id: 'd007', name: 'CISO — Seguridad', divisionId: 1, divisionName: 'C-SUITE', description: 'Seguridad de la información', agentCount: 1, keywords: ['ciso', 'seguridad', 'ciberseguridad'] },
      { id: 'd008', name: 'CLO — Legal', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección legal corporativa', agentCount: 1, keywords: ['clo', 'legal corporativo'] },
      { id: 'd009', name: 'CHRO — RRHH', divisionId: 1, divisionName: 'C-SUITE', description: 'Recursos humanos estratégico', agentCount: 1, keywords: ['chro', 'talento', 'recursos humanos'] },
      { id: 'd010', name: 'CDO — Datos', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección de datos y analytics', agentCount: 1, keywords: ['cdo', 'datos', 'analytics'] },
      { id: 'd011', name: 'CRO — Revenue', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección de ingresos y crecimiento', agentCount: 1, keywords: ['cro', 'revenue', 'crecimiento'] },
      { id: 'd012', name: 'CSO — Sostenibilidad', divisionId: 1, divisionName: 'C-SUITE', description: 'Dirección de sostenibilidad', agentCount: 1, keywords: ['cso', 'sostenibilidad'] },
      { id: 'd013', name: 'CAO — Administración', divisionId: 1, divisionName: 'C-SUITE', description: 'Administración corporativa', agentCount: 1, keywords: ['cao', 'administración'] },
      { id: 'd014', name: 'CXO — Experiencia', divisionId: 1, divisionName: 'C-SUITE', description: 'Experiencia del cliente y usuario', agentCount: 1, keywords: ['cxo', 'experiencia'] },
      { id: 'd015', name: 'Junta Directiva', divisionId: 1, divisionName: 'C-SUITE', description: 'Gobierno corporativo y junta', agentCount: 1, keywords: ['junta', 'gobierno corporativo'] },
    ]
  },
  {
    id: 2, name: 'FINANZAS', code: 'DIV-02', color: '#39ff14', icon: '💰',
    agentCount: 28, subAgentCount: 140,
    departments: [
      { id: 'd016', name: 'Análisis Financiero', divisionId: 2, divisionName: 'FINANZAS', description: 'Análisis y modelado financiero', agentCount: 2, keywords: ['finanzas', 'análisis financiero', 'modelo financiero'] },
      { id: 'd017', name: 'FP&A', divisionId: 2, divisionName: 'FINANZAS', description: 'Planificación financiera y análisis', agentCount: 2, keywords: ['fp&a', 'planificación financiera', 'presupuesto'] },
      { id: 'd018', name: 'Trading & Mercados', divisionId: 2, divisionName: 'FINANZAS', description: 'Trading algorítmico y mercados', agentCount: 2, keywords: ['trading', 'mercados', 'bolsa'] },
      { id: 'd019', name: 'Criptoactivos', divisionId: 2, divisionName: 'FINANZAS', description: 'Bitcoin, DeFi y criptomonedas', agentCount: 2, keywords: ['cripto', 'bitcoin', 'defi', 'blockchain finanzas'] },
      { id: 'd020', name: 'Contabilidad', divisionId: 2, divisionName: 'FINANZAS', description: 'Contabilidad y reportes financieros', agentCount: 2, keywords: ['contabilidad', 'balances', 'estados financieros'] },
      { id: 'd021', name: 'Impuestos', divisionId: 2, divisionName: 'FINANZAS', description: 'Planificación y cumplimiento fiscal', agentCount: 2, keywords: ['impuestos', 'fiscal', 'tributario'] },
      { id: 'd022', name: 'Auditoría', divisionId: 2, divisionName: 'FINANZAS', description: 'Auditoría interna y control', agentCount: 2, keywords: ['auditoría', 'control interno'] },
      { id: 'd023', name: 'Tesorería', divisionId: 2, divisionName: 'FINANZAS', description: 'Gestión de liquidez y tesorería', agentCount: 2, keywords: ['tesorería', 'liquidez', 'flujo de caja'] },
      { id: 'd024', name: 'Seguros', divisionId: 2, divisionName: 'FINANZAS', description: 'Gestión de seguros corporativos', agentCount: 2, keywords: ['seguros', 'riesgos financieros'] },
      { id: 'd025', name: 'Fintech', divisionId: 2, divisionName: 'FINANZAS', description: 'Innovación financiera y tecnología', agentCount: 2, keywords: ['fintech', 'innovación financiera'] },
      { id: 'd026', name: 'Economía Global', divisionId: 2, divisionName: 'FINANZAS', description: 'Macroeconomía y tendencias globales', agentCount: 2, keywords: ['economía', 'macroeconomía'] },
      { id: 'd027', name: 'Gestión de Riesgos', divisionId: 2, divisionName: 'FINANZAS', description: 'Risk management financiero', agentCount: 2, keywords: ['riesgo', 'risk management'] },
      { id: 'd028', name: 'M&A Finanzas', divisionId: 2, divisionName: 'FINANZAS', description: 'Fusiones y adquisiciones financiero', agentCount: 2, keywords: ['m&a', 'fusiones', 'adquisiciones'] },
      { id: 'd029', name: 'Deuda & Capital', divisionId: 2, divisionName: 'FINANZAS', description: 'Estructura de capital y deuda', agentCount: 2, keywords: ['deuda', 'capital', 'equity'] },
    ]
  },
  {
    id: 3, name: 'TECNOLOGÍA', code: 'DIV-03', color: '#00e5ff', icon: '⚡',
    agentCount: 32, subAgentCount: 160,
    departments: [
      { id: 'd030', name: 'Ingeniería Full-Stack', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Desarrollo web full-stack', agentCount: 3, keywords: ['código', 'desarrollo', 'software', 'web'] },
      { id: 'd031', name: 'Mobile Development', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Apps iOS y Android', agentCount: 2, keywords: ['mobile', 'app', 'ios', 'android'] },
      { id: 'd032', name: 'AI & Machine Learning', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Inteligencia artificial y ML', agentCount: 3, keywords: ['ia', 'ml', 'machine learning', 'ai'] },
      { id: 'd033', name: 'Cloud & DevOps', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Infraestructura cloud y CI/CD', agentCount: 2, keywords: ['cloud', 'devops', 'aws', 'kubernetes'] },
      { id: 'd034', name: 'Ciberseguridad', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Seguridad informática y pentesting', agentCount: 2, keywords: ['ciberseguridad', 'hacking', 'seguridad informática'] },
      { id: 'd035', name: 'Base de Datos', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Diseño y optimización de BD', agentCount: 2, keywords: ['database', 'sql', 'postgresql', 'mongodb'] },
      { id: 'd036', name: 'Blockchain & Web3', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Tecnología blockchain y web3', agentCount: 2, keywords: ['blockchain', 'web3', 'smart contracts', 'nft'] },
      { id: 'd037', name: 'IoT & Hardware', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Internet de las cosas y hardware', agentCount: 2, keywords: ['iot', 'hardware', 'arduino', 'raspberry'] },
      { id: 'd038', name: 'APIs & Integraciones', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Diseño e integración de APIs', agentCount: 2, keywords: ['api', 'integración', 'webhooks'] },
      { id: 'd039', name: 'QA & Testing', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Calidad y pruebas de software', agentCount: 2, keywords: ['qa', 'testing', 'calidad', 'pruebas'] },
      { id: 'd040', name: 'Arquitectura de Software', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Diseño de sistemas escalables', agentCount: 2, keywords: ['arquitectura', 'sistemas distribuidos'] },
      { id: 'd041', name: 'Automatización RPA', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Automatización de procesos', agentCount: 2, keywords: ['automatización', 'rpa', 'robots'] },
      { id: 'd042', name: 'Computación Cuántica', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Investigación cuántica aplicada', agentCount: 2, keywords: ['cuántico', 'quantum computing'] },
      { id: 'd043', name: 'Realidad Virtual/AR', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'VR, AR y metaverso tecnológico', agentCount: 2, keywords: ['vr', 'ar', 'metaverso', 'realidad virtual'] },
      { id: 'd044', name: 'Robótica', divisionId: 3, divisionName: 'TECNOLOGÍA', description: 'Robótica industrial y autónoma', agentCount: 2, keywords: ['robótica', 'robots', 'automatización industrial'] },
    ]
  },
  {
    id: 4, name: 'CIENCIAS', code: 'DIV-04', color: '#a855f7', icon: '🔬',
    agentCount: 20, subAgentCount: 100,
    departments: [
      { id: 'd045', name: 'Física Teórica', divisionId: 4, divisionName: 'CIENCIAS', description: 'Física fundamental y teoría cuántica', agentCount: 2, keywords: ['física', 'cuántica', 'relatividad'] },
      { id: 'd046', name: 'Química Avanzada', divisionId: 4, divisionName: 'CIENCIAS', description: 'Química orgánica e inorgánica', agentCount: 2, keywords: ['química', 'compuestos', 'reacciones'] },
      { id: 'd047', name: 'Biología Molecular', divisionId: 4, divisionName: 'CIENCIAS', description: 'Biología celular y genómica', agentCount: 2, keywords: ['biología', 'adn', 'genética', 'células'] },
      { id: 'd048', name: 'Matemática Pura', divisionId: 4, divisionName: 'CIENCIAS', description: 'Álgebra, topología y análisis', agentCount: 2, keywords: ['matemáticas', 'cálculo', 'álgebra', 'ecuaciones'] },
      { id: 'd049', name: 'Neurociencia', divisionId: 4, divisionName: 'CIENCIAS', description: 'Cerebro, cognición y neurotecnología', agentCount: 2, keywords: ['neurociencia', 'cerebro', 'cognitivo'] },
      { id: 'd050', name: 'Biotecnología', divisionId: 4, divisionName: 'CIENCIAS', description: 'Biotecnología e ingeniería biológica', agentCount: 2, keywords: ['biotecnología', 'crispr', 'bioprocesos'] },
      { id: 'd051', name: 'Nanotecnología', divisionId: 4, divisionName: 'CIENCIAS', description: 'Nanomateriales y nanoingeniería', agentCount: 2, keywords: ['nanotecnología', 'nanomateriales', 'nanoescala'] },
      { id: 'd052', name: 'Estadística Avanzada', divisionId: 4, divisionName: 'CIENCIAS', description: 'Estadística bayesiana y probabilidad', agentCount: 2, keywords: ['estadística', 'probabilidad', 'bayesian'] },
      { id: 'd053', name: 'Electromagnetismo', divisionId: 4, divisionName: 'CIENCIAS', description: 'Electromagnetismo y electrodinámica', agentCount: 2, keywords: ['electromagnetismo', 'electromagnético', 'ondas'] },
      { id: 'd054', name: 'Termodinámica', divisionId: 4, divisionName: 'CIENCIAS', description: 'Termodinámica y mecánica estadística', agentCount: 2, keywords: ['termodinámica', 'calor', 'entropía'] },
    ]
  },
  {
    id: 5, name: 'AGRO', code: 'DIV-05', color: '#4ade80', icon: '🌾',
    agentCount: 18, subAgentCount: 90,
    departments: [
      { id: 'd055', name: 'Agronomía', divisionId: 5, divisionName: 'AGRO', description: 'Ciencia y tecnología agronómica', agentCount: 2, keywords: ['agronomía', 'cultivos', 'suelos'] },
      { id: 'd056', name: 'Caña de Azúcar', divisionId: 5, divisionName: 'AGRO', description: 'Producción y procesamiento de caña', agentCount: 2, keywords: ['caña', 'azúcar', 'ingenio', 'caña de azúcar'] },
      { id: 'd057', name: 'Precision Farming', divisionId: 5, divisionName: 'AGRO', description: 'Agricultura de precisión con datos', agentCount: 2, keywords: ['precision farming', 'agricultura inteligente'] },
      { id: 'd058', name: 'Commodities Agro', divisionId: 5, divisionName: 'AGRO', description: 'Mercados de commodities agrícolas', agentCount: 2, keywords: ['commodities', 'granos', 'futuros agro'] },
      { id: 'd059', name: 'Riego & Agua', divisionId: 5, divisionName: 'AGRO', description: 'Sistemas de irrigación y gestión hídrica', agentCount: 2, keywords: ['riego', 'irrigación', 'agua agro'] },
      { id: 'd060', name: 'Agrofinanzas', divisionId: 5, divisionName: 'AGRO', description: 'Financiamiento agropecuario', agentCount: 2, keywords: ['agrofinanzas', 'crédito agro', 'financiamiento agrícola'] },
      { id: 'd061', name: 'Ganadería', divisionId: 5, divisionName: 'AGRO', description: 'Producción pecuaria y ganadera', agentCount: 2, keywords: ['ganadería', 'bovino', 'porcino', 'avicultura'] },
      { id: 'd062', name: 'Agroquímica', divisionId: 5, divisionName: 'AGRO', description: 'Fertilizantes, pesticidas y agroquímicos', agentCount: 2, keywords: ['agroquímica', 'fertilizantes', 'pesticidas'] },
      { id: 'd063', name: 'Postcosecha', divisionId: 5, divisionName: 'AGRO', description: 'Almacenamiento y postcosecha', agentCount: 2, keywords: ['postcosecha', 'silos', 'almacenamiento agro'] },
    ]
  },
  {
    id: 6, name: 'NEGOCIOS', code: 'DIV-06', color: '#f59e0b', icon: '📊',
    agentCount: 25, subAgentCount: 125,
    departments: [
      { id: 'd064', name: 'Estrategia Corporativa', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Planificación estratégica empresarial', agentCount: 3, keywords: ['estrategia', 'plan de negocio', 'planificación'] },
      { id: 'd065', name: 'Marketing Digital', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Marketing digital y growth hacking', agentCount: 2, keywords: ['marketing', 'digital', 'seo', 'sem', 'publicidad'] },
      { id: 'd066', name: 'Ventas B2B', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Estrategia y cierre de ventas B2B', agentCount: 2, keywords: ['ventas', 'b2b', 'comercial', 'clientes'] },
      { id: 'd067', name: 'Operaciones', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Optimización de operaciones', agentCount: 2, keywords: ['operaciones', 'procesos', 'eficiencia'] },
      { id: 'd068', name: 'Supply Chain', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Cadena de suministro integral', agentCount: 2, keywords: ['supply chain', 'cadena de suministro', 'proveedores'] },
      { id: 'd069', name: 'E-Commerce', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Comercio electrónico y marketplaces', agentCount: 2, keywords: ['ecommerce', 'marketplace', 'tienda online'] },
      { id: 'd070', name: 'Startups & Emprendimiento', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Ecosistema startup y emprendimiento', agentCount: 2, keywords: ['startup', 'emprendimiento', 'venture'] },
      { id: 'd071', name: 'Customer Success', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Éxito y retención de clientes', agentCount: 2, keywords: ['customer success', 'retención', 'nps'] },
      { id: 'd072', name: 'Branding', divisionId: 6, divisionName: 'NEGOCIOS', description: 'Marca, identidad y posicionamiento', agentCount: 2, keywords: ['marca', 'branding', 'identidad corporativa'] },
    ]
  },
  {
    id: 7, name: 'LEGAL', code: 'DIV-07', color: '#ef4444', icon: '⚖️',
    agentCount: 12, subAgentCount: 60,
    departments: [
      { id: 'd073', name: 'Derecho Corporativo', divisionId: 7, divisionName: 'LEGAL', description: 'Estructura y asesoría corporativa', agentCount: 2, keywords: ['legal', 'derecho corporativo', 'asesoría legal'] },
      { id: 'd074', name: 'Contratos', divisionId: 7, divisionName: 'LEGAL', description: 'Redacción y revisión de contratos', agentCount: 2, keywords: ['contratos', 'acuerdos', 'terms'] },
      { id: 'd075', name: 'Compliance', divisionId: 7, divisionName: 'LEGAL', description: 'Cumplimiento normativo y regulatorio', agentCount: 2, keywords: ['compliance', 'regulación', 'normativa'] },
      { id: 'd076', name: 'Propiedad Intelectual', divisionId: 7, divisionName: 'LEGAL', description: 'Patentes, marcas y PI', agentCount: 2, keywords: ['propiedad intelectual', 'patentes', 'marcas'] },
      { id: 'd077', name: 'Derecho Laboral', divisionId: 7, divisionName: 'LEGAL', description: 'Asesoría laboral y empleo', agentCount: 2, keywords: ['laboral', 'empleo', 'contratación'] },
      { id: 'd078', name: 'Regulatorio Internacional', divisionId: 7, divisionName: 'LEGAL', description: 'Marco regulatorio internacional', agentCount: 2, keywords: ['regulatorio internacional', 'normativa global'] },
    ]
  },
  {
    id: 8, name: 'SALUD', code: 'DIV-08', color: '#ec4899', icon: '🏥',
    agentCount: 15, subAgentCount: 75,
    departments: [
      { id: 'd079', name: 'Medicina Clínica', divisionId: 8, divisionName: 'SALUD', description: 'Asesoría médica clínica', agentCount: 2, keywords: ['medicina', 'salud', 'clínica', 'diagnóstico'] },
      { id: 'd080', name: 'Bienestar & Fitness', divisionId: 8, divisionName: 'SALUD', description: 'Fitness, deporte y bienestar', agentCount: 2, keywords: ['fitness', 'ejercicio', 'bienestar', 'deporte'] },
      { id: 'd081', name: 'Nutrición', divisionId: 8, divisionName: 'SALUD', description: 'Nutrición clínica y deportiva', agentCount: 2, keywords: ['nutrición', 'dieta', 'alimentación'] },
      { id: 'd082', name: 'Salud Mental', divisionId: 8, divisionName: 'SALUD', description: 'Psicología y salud mental', agentCount: 2, keywords: ['salud mental', 'psicología', 'estrés', 'ansiedad'] },
      { id: 'd083', name: 'Farmacología', divisionId: 8, divisionName: 'SALUD', description: 'Medicamentos y farmacología', agentCount: 2, keywords: ['fármacos', 'medicamentos', 'farmacología'] },
      { id: 'd084', name: 'MedTech', divisionId: 8, divisionName: 'SALUD', description: 'Tecnología médica e innovación', agentCount: 2, keywords: ['medtech', 'tecnología médica', 'telemedicina'] },
      { id: 'd085', name: 'Epidemiología', divisionId: 8, divisionName: 'SALUD', description: 'Salud pública y epidemiología', agentCount: 2, keywords: ['epidemiología', 'salud pública', 'pandemias'] },
    ]
  },
  {
    id: 9, name: 'INVERSIONES', code: 'DIV-09', color: '#06b6d4', icon: '🏦',
    agentCount: 18, subAgentCount: 90,
    departments: [
      { id: 'd086', name: 'Real Estate', divisionId: 9, divisionName: 'INVERSIONES', description: 'Bienes raíces e inversión inmobiliaria', agentCount: 3, keywords: ['inmueble', 'real estate', 'bienes raíces', 'propiedades'] },
      { id: 'd087', name: 'Private Equity', divisionId: 9, divisionName: 'INVERSIONES', description: 'Capital privado y buyouts', agentCount: 2, keywords: ['private equity', 'capital privado', 'buyout'] },
      { id: 'd088', name: 'Venture Capital', divisionId: 9, divisionName: 'INVERSIONES', description: 'Inversión en startups y VC', agentCount: 2, keywords: ['venture capital', 'vc', 'startups inversión'] },
      { id: 'd089', name: 'Family Office', divisionId: 9, divisionName: 'INVERSIONES', description: 'Gestión de patrimonio familiar', agentCount: 2, keywords: ['family office', 'patrimonio', 'wealth management'] },
      { id: 'd090', name: 'Portafolio Diversificado', divisionId: 9, divisionName: 'INVERSIONES', description: 'Gestión de portafolios multi-activo', agentCount: 2, keywords: ['portafolio', 'inversión diversificada'] },
      { id: 'd091', name: 'Deuda Privada', divisionId: 9, divisionName: 'INVERSIONES', description: 'Crédito privado e instrumentos de deuda', agentCount: 2, keywords: ['deuda privada', 'crédito', 'bonos'] },
      { id: 'd092', name: 'Due Diligence', divisionId: 9, divisionName: 'INVERSIONES', description: 'Investigación y análisis de inversiones', agentCount: 2, keywords: ['due diligence', 'valoración', 'análisis inversión'] },
    ]
  },
  {
    id: 10, name: 'COMUNICACIONES', code: 'DIV-10', color: '#f97316', icon: '📡',
    agentCount: 14, subAgentCount: 70,
    departments: [
      { id: 'd093', name: 'Relaciones Públicas', divisionId: 10, divisionName: 'COMUNICACIONES', description: 'PR y gestión de imagen', agentCount: 2, keywords: ['pr', 'relaciones públicas', 'prensa'] },
      { id: 'd094', name: 'Redes Sociales', divisionId: 10, divisionName: 'COMUNICACIONES', description: 'Social media y comunidades', agentCount: 2, keywords: ['redes sociales', 'social media', 'instagram', 'linkedin'] },
      { id: 'd095', name: 'Escritura Profesional', divisionId: 10, divisionName: 'COMUNICACIONES', description: 'Redacción y escritura de negocios', agentCount: 2, keywords: ['escritura', 'redacción', 'contenido', 'copy'] },
      { id: 'd096', name: 'Multilingüe', divisionId: 10, divisionName: 'COMUNICACIONES', description: 'Traducción e interpretación', agentCount: 2, keywords: ['idioma', 'traducción', 'inglés', 'multilingüe'] },
      { id: 'd097', name: 'Medios & Periodismo', divisionId: 10, divisionName: 'COMUNICACIONES', description: 'Medios de comunicación y prensa', agentCount: 2, keywords: ['medios', 'periodismo', 'noticias'] },
      { id: 'd098', name: 'Storytelling', divisionId: 10, divisionName: 'COMUNICACIONES', description: 'Narrativa y comunicación estratégica', agentCount: 2, keywords: ['storytelling', 'narrativa', 'comunicación'] },
    ]
  },
  {
    id: 11, name: 'EDUCACIÓN', code: 'DIV-11', color: '#84cc16', icon: '🎓',
    agentCount: 12, subAgentCount: 60,
    departments: [
      { id: 'd099', name: 'E-Learning', divisionId: 11, divisionName: 'EDUCACIÓN', description: 'Educación en línea y cursos', agentCount: 2, keywords: ['aprendizaje', 'curso', 'e-learning', 'estudiar'] },
      { id: 'd100', name: 'Investigación Académica', divisionId: 11, divisionName: 'EDUCACIÓN', description: 'Research científico y académico', agentCount: 2, keywords: ['investigación', 'research', 'académico', 'papers'] },
      { id: 'd101', name: 'Tutoring Especializado', divisionId: 11, divisionName: 'EDUCACIÓN', description: 'Tutoring en disciplinas específicas', agentCount: 2, keywords: ['tutoring', 'tutor', 'enseñanza'] },
      { id: 'd102', name: 'Desarrollo Personal', divisionId: 11, divisionName: 'EDUCACIÓN', description: 'Crecimiento personal y liderazgo', agentCount: 2, keywords: ['desarrollo personal', 'liderazgo', 'hábitos'] },
      { id: 'd103', name: 'Idiomas', divisionId: 11, divisionName: 'EDUCACIÓN', description: 'Aprendizaje de idiomas', agentCount: 2, keywords: ['idiomas', 'inglés', 'francés', 'mandarín'] },
    ]
  },
  {
    id: 12, name: 'LOGÍSTICA', code: 'DIV-12', color: '#78716c', icon: '🚛',
    agentCount: 10, subAgentCount: 50,
    departments: [
      { id: 'd104', name: 'Transporte Global', divisionId: 12, divisionName: 'LOGÍSTICA', description: 'Logística de transporte internacional', agentCount: 2, keywords: ['transporte', 'logística', 'envío', 'flete'] },
      { id: 'd105', name: 'Almacenamiento', divisionId: 12, divisionName: 'LOGÍSTICA', description: 'Warehousing y gestión de almacenes', agentCount: 2, keywords: ['almacén', 'warehouse', 'bodega'] },
      { id: 'd106', name: 'Importación/Exportación', divisionId: 12, divisionName: 'LOGÍSTICA', description: 'Comercio exterior y aduanas', agentCount: 2, keywords: ['importación', 'exportación', 'aduana', 'comercio exterior'] },
      { id: 'd107', name: 'Última Milla', divisionId: 12, divisionName: 'LOGÍSTICA', description: 'Entrega de última milla', agentCount: 2, keywords: ['última milla', 'delivery', 'entrega'] },
      { id: 'd108', name: 'Gestión de Inventarios', divisionId: 12, divisionName: 'LOGÍSTICA', description: 'Control de inventarios y stocks', agentCount: 2, keywords: ['inventario', 'stock', 'control de inventarios'] },
    ]
  },
  {
    id: 13, name: 'ENERGÍA', code: 'DIV-13', color: '#eab308', icon: '⚡',
    agentCount: 12, subAgentCount: 60,
    departments: [
      { id: 'd109', name: 'Energías Renovables', divisionId: 13, divisionName: 'ENERGÍA', description: 'Solar, eólica y renovables', agentCount: 2, keywords: ['energía', 'solar', 'renovable', 'eólica'] },
      { id: 'd110', name: 'Petróleo & Gas', divisionId: 13, divisionName: 'ENERGÍA', description: 'Sector oil & gas', agentCount: 2, keywords: ['petróleo', 'gas', 'oil', 'refinería'] },
      { id: 'd111', name: 'Eficiencia Energética', divisionId: 13, divisionName: 'ENERGÍA', description: 'Ahorro y eficiencia energética', agentCount: 2, keywords: ['eficiencia energética', 'ahorro energético'] },
      { id: 'd112', name: 'Mercados Energéticos', divisionId: 13, divisionName: 'ENERGÍA', description: 'Trading y mercados de energía', agentCount: 2, keywords: ['mercados energéticos', 'electricidad mercado'] },
      { id: 'd113', name: 'Electromecánica', divisionId: 13, divisionName: 'ENERGÍA', description: 'Sistemas electromecánicos', agentCount: 2, keywords: ['electromecánica', 'motores', 'generadores'] },
      { id: 'd114', name: 'Hidrógeno Verde', divisionId: 13, divisionName: 'ENERGÍA', description: 'Hidrógeno y economía verde', agentCount: 2, keywords: ['hidrógeno', 'economía verde', 'limpia'] },
    ]
  },
  {
    id: 14, name: 'INFRAESTRUCTURA', code: 'DIV-14', color: '#64748b', icon: '🏗️',
    agentCount: 10, subAgentCount: 50,
    departments: [
      { id: 'd115', name: 'Ingeniería Civil', divisionId: 14, divisionName: 'INFRAESTRUCTURA', description: 'Proyectos de ingeniería civil', agentCount: 2, keywords: ['construcción', 'ingeniería civil', 'obra'] },
      { id: 'd116', name: 'BIM & Diseño', divisionId: 14, divisionName: 'INFRAESTRUCTURA', description: 'Modelado BIM y diseño arquitectónico', agentCount: 2, keywords: ['bim', 'diseño arquitectónico', 'planos'] },
      { id: 'd117', name: 'PPP & Concesiones', divisionId: 14, divisionName: 'INFRAESTRUCTURA', description: 'Alianzas público-privadas', agentCount: 2, keywords: ['ppp', 'concesiones', 'infraestructura pública'] },
      { id: 'd118', name: 'Permisos & Regulación', divisionId: 14, divisionName: 'INFRAESTRUCTURA', description: 'Permisos y regulación de construcción', agentCount: 2, keywords: ['permisos', 'regulación construcción'] },
      { id: 'd119', name: 'Urbanismo', divisionId: 14, divisionName: 'INFRAESTRUCTURA', description: 'Planificación urbana y smart cities', agentCount: 2, keywords: ['urbanismo', 'ciudad', 'smart city'] },
    ]
  },
  {
    id: 15, name: 'RRHH', code: 'DIV-15', color: '#fb923c', icon: '👥',
    agentCount: 10, subAgentCount: 50,
    departments: [
      { id: 'd120', name: 'Talent Acquisition', divisionId: 15, divisionName: 'RRHH', description: 'Reclutamiento y headhunting', agentCount: 2, keywords: ['talento', 'reclutamiento', 'headhunting', 'rrhh'] },
      { id: 'd121', name: 'Compensación & Beneficios', divisionId: 15, divisionName: 'RRHH', description: 'Estructura salarial y beneficios', agentCount: 2, keywords: ['compensación', 'salario', 'beneficios'] },
      { id: 'd122', name: 'Cultura Organizacional', divisionId: 15, divisionName: 'RRHH', description: 'Cultura, clima y engagement', agentCount: 2, keywords: ['cultura', 'clima organizacional', 'engagement'] },
      { id: 'd123', name: 'Formación & Desarrollo', divisionId: 15, divisionName: 'RRHH', description: 'Training y desarrollo de talento', agentCount: 2, keywords: ['formación', 'training', 'capacitación'] },
      { id: 'd124', name: 'Liderazgo', divisionId: 15, divisionName: 'RRHH', description: 'Desarrollo de liderazgo ejecutivo', agentCount: 2, keywords: ['liderazgo', 'coaching ejecutivo', 'directivos'] },
    ]
  },
  {
    id: 16, name: 'PRODUCTIVIDAD', code: 'DIV-16', color: '#22d3ee', icon: '⏱️',
    agentCount: 8, subAgentCount: 40,
    departments: [
      { id: 'd125', name: 'GTD & Sistemas', divisionId: 16, divisionName: 'PRODUCTIVIDAD', description: 'Getting Things Done y sistemas de organización', agentCount: 2, keywords: ['productividad', 'gtd', 'organización', 'rutina'] },
      { id: 'd126', name: 'Automatización Personal', divisionId: 16, divisionName: 'PRODUCTIVIDAD', description: 'n8n, Zapier y automatizaciones', agentCount: 2, keywords: ['automatización personal', 'n8n', 'zapier'] },
      { id: 'd127', name: 'OKRs & Metas', divisionId: 16, divisionName: 'PRODUCTIVIDAD', description: 'Objetivos, KPIs y seguimiento de metas', agentCount: 2, keywords: ['okrs', 'kpis', 'metas', 'objetivos'] },
      { id: 'd128', name: 'Hábitos & Biohacking', divisionId: 16, divisionName: 'PRODUCTIVIDAD', description: 'Hábitos de alto rendimiento', agentCount: 2, keywords: ['hábitos', 'biohacking', 'alto rendimiento'] },
    ]
  },
  {
    id: 17, name: 'CREATIVIDAD', code: 'DIV-17', color: '#e879f9', icon: '🎨',
    agentCount: 10, subAgentCount: 50,
    departments: [
      { id: 'd129', name: 'Diseño Gráfico', divisionId: 17, divisionName: 'CREATIVIDAD', description: 'Diseño visual y gráfico', agentCount: 2, keywords: ['diseño', 'gráfico', 'visual', 'figma'] },
      { id: 'd130', name: 'Diseño Industrial', divisionId: 17, divisionName: 'CREATIVIDAD', description: 'Diseño de producto y manufactura', agentCount: 2, keywords: ['diseño industrial', 'producto', 'cad'] },
      { id: 'd131', name: 'Música & Audio', divisionId: 17, divisionName: 'CREATIVIDAD', description: 'Producción musical y audio', agentCount: 2, keywords: ['música', 'audio', 'producción musical'] },
      { id: 'd132', name: 'Escritura Creativa', divisionId: 17, divisionName: 'CREATIVIDAD', description: 'Literatura, guiones y ficción', agentCount: 2, keywords: ['escritura creativa', 'guión', 'narrativa creativa'] },
      { id: 'd133', name: 'UX/UI Design', divisionId: 17, divisionName: 'CREATIVIDAD', description: 'Diseño de experiencia de usuario', agentCount: 2, keywords: ['ux', 'ui', 'experiencia usuario', 'interfaces'] },
    ]
  },
  {
    id: 18, name: 'GEOPOLÍTICA', code: 'DIV-18', color: '#ef4444', icon: '🌍',
    agentCount: 8, subAgentCount: 40,
    departments: [
      { id: 'd134', name: 'Análisis Político', divisionId: 18, divisionName: 'GEOPOLÍTICA', description: 'Análisis político y gobernanza', agentCount: 2, keywords: ['política', 'geopolítica', 'gobierno'] },
      { id: 'd135', name: 'Venezuela & Latam', divisionId: 18, divisionName: 'GEOPOLÍTICA', description: 'Geopolítica venezolana y latinoamericana', agentCount: 2, keywords: ['venezuela', 'latam', 'latinoamérica', 'venezuela política'] },
      { id: 'd136', name: 'Relaciones Internacionales', divisionId: 18, divisionName: 'GEOPOLÍTICA', description: 'Diplomacia e RRII', agentCount: 2, keywords: ['relaciones internacionales', 'diplomacia', 'geopolítica'] },
      { id: 'd137', name: 'Riesgo País', divisionId: 18, divisionName: 'GEOPOLÍTICA', description: 'Análisis de riesgo soberano', agentCount: 2, keywords: ['riesgo país', 'riesgo soberano', 'country risk'] },
    ]
  },
  {
    id: 19, name: 'DATOS & IA', code: 'DIV-19', color: '#818cf8', icon: '🤖',
    agentCount: 15, subAgentCount: 75,
    departments: [
      { id: 'd138', name: 'Data Science', divisionId: 19, divisionName: 'DATOS & IA', description: 'Ciencia de datos y analytics', agentCount: 3, keywords: ['datos', 'data science', 'análisis de datos', 'bi'] },
      { id: 'd139', name: 'Machine Learning Ops', divisionId: 19, divisionName: 'DATOS & IA', description: 'MLOps y producción de modelos', agentCount: 2, keywords: ['mlops', 'machine learning producción'] },
      { id: 'd140', name: 'Agentes IA', divisionId: 19, divisionName: 'DATOS & IA', description: 'Orquestación de agentes de IA', agentCount: 3, keywords: ['agentes ia', 'llm', 'langchain', 'orquestación ia'] },
      { id: 'd141', name: 'Business Intelligence', divisionId: 19, divisionName: 'DATOS & IA', description: 'Dashboards y reportes ejecutivos', agentCount: 2, keywords: ['business intelligence', 'dashboard', 'reporte', 'tableau'] },
      { id: 'd142', name: 'Computer Vision', divisionId: 19, divisionName: 'DATOS & IA', description: 'Visión computacional e imágenes', agentCount: 2, keywords: ['computer vision', 'imágenes ia', 'detección objetos'] },
      { id: 'd143', name: 'NLP & Procesamiento', divisionId: 19, divisionName: 'DATOS & IA', description: 'Procesamiento de lenguaje natural', agentCount: 2, keywords: ['nlp', 'procesamiento lenguaje', 'texto ia'] },
    ]
  },
  {
    id: 20, name: 'ESPACIAL', code: 'DIV-20', color: '#6366f1', icon: '🚀',
    agentCount: 6, subAgentCount: 30,
    departments: [
      { id: 'd144', name: 'Astronomía', divisionId: 20, divisionName: 'ESPACIAL', description: 'Astronomía y astrofísica', agentCount: 2, keywords: ['astronomía', 'astrofísica', 'espacio', 'estrellas'] },
      { id: 'd145', name: 'Exploración Espacial', divisionId: 20, divisionName: 'ESPACIAL', description: 'Cohetes, satélites y exploración', agentCount: 2, keywords: ['espacio', 'cohete', 'nasa', 'spacex', 'satélite'] },
      { id: 'd146', name: 'Geolocalización', divisionId: 20, divisionName: 'ESPACIAL', description: 'GPS, GIS y tecnologías de posicionamiento', agentCount: 2, keywords: ['gps', 'gis', 'geolocalización', 'mapas'] },
    ]
  },
  {
    id: 21, name: 'NUCLEAR & EM', code: 'DIV-21', color: '#f43f5e', icon: '☢️',
    agentCount: 5, subAgentCount: 25,
    departments: [
      { id: 'd147', name: 'Energía Nuclear', divisionId: 21, divisionName: 'NUCLEAR & EM', description: 'Fisión, fusión y energía nuclear', agentCount: 2, keywords: ['nuclear', 'fisión', 'fusión', 'reactor'] },
      { id: 'd148', name: 'Radiación', divisionId: 21, divisionName: 'NUCLEAR & EM', description: 'Protección radiológica y aplicaciones', agentCount: 2, keywords: ['radiación', 'radiológico', 'isótopos'] },
      { id: 'd149', name: 'Física de Partículas', divisionId: 21, divisionName: 'NUCLEAR & EM', description: 'Física de alta energía y partículas', agentCount: 1, keywords: ['partículas', 'acelerador', 'cern', 'bosón'] },
    ]
  },
  {
    id: 22, name: 'SISTEMA', code: 'DIV-22', color: '#94a3b8', icon: '💾',
    agentCount: 3, subAgentCount: 15,
    departments: [
      { id: 'd150', name: 'Gestión de Memoria', divisionId: 22, divisionName: 'SISTEMA', description: 'Memoria persistente de GENESUS', agentCount: 1, keywords: ['memoria', 'almacenamiento', 'backup', 'sistema'] },
      { id: 'd151', name: 'Aprendizaje Continuo', divisionId: 22, divisionName: 'SISTEMA', description: 'Mejora continua del sistema', agentCount: 1, keywords: ['aprendizaje continuo', 'mejora sistema'] },
      { id: 'd152', name: 'Monitoreo & Logs', divisionId: 22, divisionName: 'SISTEMA', description: 'Monitoreo y registros del sistema', agentCount: 1, keywords: ['monitoreo', 'logs', 'genesus sistema'] },
    ]
  },
  {
    id: 23, name: 'EXPANSIÓN DINÁMICA', code: 'DIV-23', color: '#10b981', icon: '✨',
    agentCount: 0, subAgentCount: 0,
    departments: [
      { id: 'd153', name: 'Dominio Dinámico', divisionId: 23, divisionName: 'EXPANSIÓN DINÁMICA', description: 'Nuevos agentes creados automáticamente por uso recurrente', agentCount: 0, keywords: [] },
    ]
  },
]

export function getAllDepartments(): Department[] {
  return DIVISIONS.flatMap(d => d.departments)
}

export function detectDivisions(text: string): Division[] {
  const t = text.toLowerCase()
  return DIVISIONS.filter(div =>
    div.departments.some(dept =>
      dept.keywords.some(k => t.includes(k))
    )
  )
}

export function getDivisionById(id: number): Division | undefined {
  return DIVISIONS.find(d => d.id === id)
}

export const TOTAL_AGENTS = DIVISIONS.reduce((sum, d) => sum + d.agentCount, 0)
export const TOTAL_SUB_AGENTS = DIVISIONS.reduce((sum, d) => sum + d.subAgentCount, 0)
