import { notFound } from "next/navigation";
import Link from "next/link";
import { Bot, MapPin, Shield, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { TerraScoreBadge } from "@/components/catalog/TerraScoreBadge";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/catalog";
import { ProductGallery } from "./ProductGallery";
import { AddToCart } from "./AddToCart";
import { ProductTabs } from "./ProductTabs";
import type { Review } from "@/types";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

interface ProductVariant {
  id: string;
  nombre: string;
  precio: number;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  orden: number;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product with store and category
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      stores(id, slug, nombre, terra_score, verificada, ubicacion, logo_url),
      categories(id, nombre, slug)
    `
    )
    .eq("id", id)
    .eq("activo", true)
    .single();

  if (!product) {
    notFound();
  }

  const store = product.stores as {
    id: string;
    slug: string;
    nombre: string;
    terra_score: number;
    verificada: boolean;
    ubicacion?: string;
    logo_url?: string;
  } | null;

  const category = product.categories as {
    id: string;
    nombre: string;
    slug: string;
  } | null;

  // Fetch variants
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, nombre, precio")
    .eq("product_id", id)
    .order("nombre");

  // Fetch images
  const { data: images } = await supabase
    .from("product_images")
    .select("id, url, alt, orden")
    .eq("product_id", id)
    .order("orden");

  // Fetch top 5 reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`*, reviewer:profiles(nombre, apellido)`)
    .eq("product_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const galleryImages = (images as ProductImage[] | null)?.map((img) => ({
    url: img.url,
    alt: img.alt,
  })) ?? [];

  const productVariants = (variants as ProductVariant[] | null) ?? [];

  const reviewsData = (reviews as Review[] | null) ?? [];

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    ...(category ? [{ label: category.nombre, href: `/catalogo?cat=${category.slug}` }] : []),
    { label: product.nombre },
  ];

  return (
    <div className="bg-[#eff6ff] dark:bg-[#0d2240] min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-5">
        {/* Breadcrumb */}
        <div className="mb-5">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Main product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Gallery — 60% */}
          <div className="lg:col-span-3">
            <ProductGallery images={galleryImages} productName={product.nombre} />
          </div>

          {/* Info panel — 40% */}
          <div className="lg:col-span-2 space-y-4">
            {/* Category + name */}
            {category && (
              <Link href={`/catalogo?cat=${category.slug}`}>
                <Badge className="text-xs bg-[#dbeafe] dark:bg-[#1a3a6a] text-[#1e4d8c] dark:text-[#60a5f5] border-0 hover:bg-[#bfdbfe] cursor-pointer">
                  {category.nombre}
                </Badge>
              </Link>
            )}

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#0d2240] dark:text-[#eff6ff] leading-snug">
              {product.nombre}
            </h1>

            {/* Store info */}
            {store && (
              <div className="flex items-center gap-2 flex-wrap">
                <TerraScoreBadge score={store.terra_score} size="md" />
                <Link
                  href={`/tienda/${store.slug}`}
                  className="text-sm text-[#1e4d8c] dark:text-[#60a5f5] hover:underline font-medium"
                >
                  {store.nombre}
                </Link>
                {store.ubicacion && (
                  <span className="flex items-center gap-1 text-xs text-[#94a3b8]">
                    <MapPin className="h-3 w-3" />
                    {store.ubicacion}
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <p className="font-heading text-3xl font-bold text-[#1e4d8c] dark:text-[#60a5f5]">
              {formatPrice(product.precio_base, product.moneda)}
            </p>

            {/* Cultivo pills */}
            {product.cultivo_objetivo && product.cultivo_objetivo.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.cultivo_objetivo.map((cultivo: string) => (
                  <Badge
                    key={cultivo}
                    variant="outline"
                    className="text-xs border-[#60a5f5] text-[#2563b0] dark:text-[#93c5fd] rounded-full"
                  >
                    {cultivo}
                  </Badge>
                ))}
              </div>
            )}

            {/* Add to cart */}
            <AddToCart
              productId={product.id}
              variants={productVariants}
              precio={product.precio_base}
              moneda={product.moneda}
            />

            {/* Trust signals */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-[#1e4d8c] dark:text-[#60a5f5] bg-[#dbeafe] dark:bg-[#1a3a6a] rounded-[8px] px-3 py-2">
                <Shield className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                <span>Tu pago está protegido por escrow TerraMercado</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#94a3b8] rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] px-3 py-2">
                <Truck className="h-4 w-4 flex-shrink-0" />
                <span>Consultar envío con el vendedor</span>
              </div>
              <Link
                href="/herramientas/copiloto"
                className="flex items-center gap-2 text-xs text-[#f59e0b] hover:text-[#d97706] font-medium"
              >
                <Bot className="h-4 w-4 flex-shrink-0" />
                Preguntar al copiloto IA
              </Link>
            </div>
          </div>
        </div>

        {/* Below the fold: tabs */}
        <ProductTabs
          descripcion={product.descripcion ?? ""}
          agroSheet={{
            principioActivo: product.principio_activo,
            dosisRecomendada: product.dosis_recomendada,
            periodoCarencia: product.periodo_carencia,
            contraindicaciones: product.contraindicaciones,
            certificaciones: product.certificaciones,
            cultivoObjetivo: product.cultivo_objetivo,
            especieObjetivo: product.especie_objetivo,
            ciclo: product.ciclo,
          }}
          reviews={reviewsData}
        />
      </div>
    </div>
  );
}
