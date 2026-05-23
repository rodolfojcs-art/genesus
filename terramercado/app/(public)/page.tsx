import Link from "next/link";
import {
  Leaf,
  Beef,
  Wheat,
  Coffee,
  Droplets,
  Tractor,
  Dna,
  Package,
  Shield,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ── Seed data (replaced by DB in Sprint 2) ───────────────────── */

const categories = [
  { label: "Insumos Agrícolas", icon: Leaf, href: "/catalogo?cat=insumos", color: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300" },
  { label: "Ganadería", icon: Beef, href: "/catalogo?cat=ganaderia", color: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300" },
  { label: "Cereales", icon: Wheat, href: "/catalogo?cat=cereales", color: "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300" },
  { label: "Café y Cacao", icon: Coffee, href: "/catalogo?cat=cafe", color: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300" },
  { label: "Riego", icon: Droplets, href: "/catalogo?cat=riego", color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300" },
  { label: "Maquinaria", icon: Tractor, href: "/catalogo?cat=maquinaria", color: "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300" },
  { label: "Genética", icon: Dna, href: "/catalogo?cat=genetica", color: "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300" },
  { label: "Empaques", icon: Package, href: "/catalogo?cat=empaques", color: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300" },
];

const featuredProducts = [
  {
    id: "1",
    nombre: "Fertilizante NPK 15-15-15 — Saco 50 kg",
    precio: 42.5,
    moneda: "USD",
    vendedor: "AgroDistribuciones Aragua",
    terraScore: 891,
    rating: 4.8,
    reviews: 124,
    badge: "Más vendido",
    cultivo: "Caña de azúcar",
  },
  {
    id: "2",
    nombre: "Herbicida Glifosato 48% — Tambor 20 L",
    precio: 68.0,
    moneda: "USD",
    vendedor: "Insumos del Llano C.A.",
    terraScore: 756,
    rating: 4.5,
    reviews: 87,
    badge: "Oferta zafra",
    cultivo: "Maíz / Soja",
  },
  {
    id: "3",
    nombre: "Semen Bovino — Raza Brahman F1 (10 dosis)",
    precio: 180.0,
    moneda: "USD",
    vendedor: "Casa de Monta El Palmar",
    terraScore: 923,
    rating: 5.0,
    reviews: 43,
    badge: "Verificado",
    cultivo: "Ganadería",
  },
  {
    id: "4",
    nombre: "Semilla de Maíz P3862 — Bolsa 20 kg",
    precio: 56.0,
    moneda: "USD",
    vendedor: "Semillas Venezolanas SECA",
    terraScore: 812,
    rating: 4.7,
    reviews: 202,
    badge: null,
    cultivo: "Maíz",
  },
];

/* ── Components ───────────────────────────────────────────────── */

function TerraScoreBadge({ score }: { score: number }) {
  return (
    <span className="terra-score text-xs bg-[#fde68a] dark:bg-[#92400e] text-[#92400e] dark:text-[#fde68a] px-1.5 py-0.5 rounded">
      TS {score}
    </span>
  );
}

function BtnPrimary({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-sm bg-[#f59e0b] hover:bg-[#d97706] text-white transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}

function BtnOutline({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 font-semibold text-sm border-[#60a5f5] text-[#93c5fd] hover:bg-[#1a3a6a] hover:text-white transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}

function ProductCard({ product }: { product: (typeof featuredProducts)[0] }) {
  return (
    <Card className="group overflow-hidden border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] hover:border-[#60a5f5] dark:hover:border-[#60a5f5] transition-all hover:shadow-md rounded-[12px] h-full">
      <Link href={`/producto/${product.id}`} className="block h-full">
        {/* Product image */}
        <div className="aspect-square bg-[#eff6ff] dark:bg-[#1a3a6a] relative flex items-center justify-center">
          <Package className="h-16 w-16 text-[#93c5fd]" />
          {product.badge && (
            <Badge className="absolute top-2 left-2 text-[10px] font-semibold bg-[#1e4d8c] text-white border-0">
              {product.badge}
            </Badge>
          )}
        </div>

        <CardContent className="p-3 space-y-1.5">
          <Badge variant="outline" className="text-[10px] border-[#60a5f5] text-[#2563b0] dark:text-[#93c5fd] rounded-full px-2 py-0">
            {product.cultivo}
          </Badge>
          <h3 className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff] leading-snug line-clamp-2 group-hover:text-[#1e4d8c] dark:group-hover:text-[#60a5f5] transition-colors">
            {product.nombre}
          </h3>
          <p className="font-heading font-bold text-lg text-[#1e4d8c] dark:text-[#60a5f5]">
            {product.moneda === "USD" ? "$" : "Bs."}{product.precio.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
              <span className="text-xs text-[#94a3b8]">{product.rating} ({product.reviews})</span>
            </div>
            <TerraScoreBadge score={product.terraScore} />
          </div>
          <p className="text-[11px] text-[#94a3b8] truncate">{product.vendedor}</p>
        </CardContent>
      </Link>
    </Card>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="bg-[#eff6ff] dark:bg-[#0d2240] min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#0d2240] via-[#1a3a6a] to-[#1e4d8c] text-white py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <Badge className="bg-[#f59e0b]/20 text-[#fde68a] border-[#f59e0b]/30 text-xs rounded-full">
                Venezuela · Latinoamérica
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                El mercado agropecuario{" "}
                <span className="text-[#f59e0b] italic">con confianza real</span>
              </h1>
              <p className="text-[#93c5fd] text-base leading-relaxed">
                Insumos, maquinaria, genética y financiación con escrow obligatorio.
                Si algo sale mal, tu dinero regresa. Sin excusas.
              </p>
              <div className="flex flex-wrap gap-3">
                <BtnPrimary href="/catalogo">
                  Explorar catálogo <ArrowRight className="h-4 w-4" />
                </BtnPrimary>
                <BtnOutline href="/registro">
                  Crear cuenta
                </BtnOutline>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: Shield, text: "Escrow obligatorio" },
                  { icon: Zap, text: "Copiloto IA agrícola" },
                  { icon: Star, text: "TerraScore verificado" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5 text-sm text-[#93c5fd]">
                    <item.icon className="h-4 w-4 text-[#f59e0b]" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Demo user card */}
            <div className="hidden md:block">
              <Card className="bg-[#1a3a6a]/80 border-[#60a5f5]/30 text-white rounded-[12px]">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#1e4d8c] flex items-center justify-center text-2xl font-heading font-bold text-[#60a5f5]">
                      C
                    </div>
                    <div>
                      <p className="font-semibold">Carlos Martínez</p>
                      <p className="text-xs text-[#93c5fd]">Aragua, Venezuela · Cañicultor</p>
                    </div>
                    <TerraScoreBadge score={742} />
                  </div>
                  <div className="border-t border-[#60a5f5]/20 pt-4 space-y-2">
                    <p className="text-xs text-[#93c5fd] uppercase tracking-wider font-semibold">Ciclo activo</p>
                    <p className="text-sm">Caña de azúcar — 2do corte</p>
                    <p className="text-xs text-[#93c5fd]">Variedad CC 8475 · 45 ha</p>
                  </div>
                  <div className="bg-[#0d2240]/50 rounded-lg p-3">
                    <p className="text-xs text-[#f59e0b] font-semibold mb-1">Copiloto IA sugiere:</p>
                    <p className="text-xs text-[#93c5fd]">
                      Aplicación de urea fraccionada recomendada para el 2do corte CC 8475 en Aragua. Ver dosis óptima.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category grid ── */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <h2 className="font-heading text-xl font-bold text-[#0d2240] dark:text-[#eff6ff] mb-5">
          Explorar por categoría
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`flex flex-col items-center gap-2 p-3 rounded-[12px] border border-transparent hover:border-[#60a5f5] ${cat.color} transition-all`}
            >
              <cat.icon className="h-7 w-7" />
              <span className="text-[11px] font-medium text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
            Más vendidos esta semana
          </h2>
          <Link href="/catalogo" className="text-sm text-[#2563b0] dark:text-[#60a5f5] hover:underline flex items-center gap-1">
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── TerraPlus promo ── */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-gradient-to-r from-[#1e4d8c] to-[#0d2240] rounded-[12px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-[#f59e0b] text-white border-0 text-xs rounded-full">
              TerraPlus
            </Badge>
            <h3 className="font-heading text-xl font-bold">
              Envío preferencial + Crédito por ciclo + Asesoría experta
            </h3>
            <p className="text-[#93c5fd] text-sm">
              La suscripción que entiende tu cosecha, no tu tarjeta de crédito.
            </p>
          </div>
          <BtnPrimary href="/terraplus" className="shrink-0">
            Conocer TerraPlus
          </BtnPrimary>
        </div>
      </section>

      {/* ── Insumos del ciclo ── */}
      <section className="container mx-auto px-4 py-6 pb-12 max-w-6xl">
        <h2 className="font-heading text-xl font-bold text-[#0d2240] dark:text-[#eff6ff] mb-2">
          Insumos del mismo ciclo productivo
        </h2>
        <p className="text-sm text-[#94a3b8] mb-5">
          Productores de caña de azúcar en Aragua también compraron
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.map((p) => (
            <ProductCard key={`cycle-${p.id}`} product={{ ...p, id: `c${p.id}` }} />
          ))}
        </div>
      </section>
    </div>
  );
}
