import Link from "next/link";
import { Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TerraScoreBadge } from "./TerraScoreBadge";
import { formatPrice } from "@/lib/utils/catalog";

interface ProductCardProps {
  id: string;
  nombre: string;
  precio: number;
  moneda: "USD" | "VES";
  vendedor: string;
  terraScore: number;
  rating: number;
  reviews: number;
  badge?: string | null;
  cultivo?: string | null;
  imagenUrl?: string | null;
}

export function ProductCard({
  id,
  nombre,
  precio,
  moneda,
  vendedor,
  terraScore,
  rating,
  reviews,
  badge,
  cultivo,
  imagenUrl,
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] hover:border-[#60a5f5] dark:hover:border-[#60a5f5] transition-all hover:shadow-md rounded-[12px] h-full">
      <Link href={`/producto/${id}`} className="block h-full">
        {/* Product image */}
        <div className="aspect-square bg-[#eff6ff] dark:bg-[#1a3a6a] relative flex items-center justify-center overflow-hidden">
          {imagenUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagenUrl}
              alt={nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-16 w-16 text-[#93c5fd]" />
          )}
          {badge && (
            <Badge className="absolute top-2 left-2 text-[10px] font-semibold bg-[#1e4d8c] text-white border-0">
              {badge}
            </Badge>
          )}
        </div>

        <CardContent className="p-3 space-y-1.5">
          {cultivo && (
            <Badge
              variant="outline"
              className="text-[10px] border-[#60a5f5] text-[#2563b0] dark:text-[#93c5fd] rounded-full px-2 py-0"
            >
              {cultivo}
            </Badge>
          )}
          <h3 className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff] leading-snug line-clamp-2 group-hover:text-[#1e4d8c] dark:group-hover:text-[#60a5f5] transition-colors">
            {nombre}
          </h3>
          <p className="font-heading font-bold text-lg text-[#1e4d8c] dark:text-[#60a5f5]">
            {formatPrice(precio, moneda)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
              <span className="text-xs text-[#94a3b8]">
                {rating.toFixed(1)} ({reviews})
              </span>
            </div>
            <TerraScoreBadge score={terraScore} size="sm" />
          </div>
          <p className="text-[11px] text-[#94a3b8] truncate">{vendedor}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
