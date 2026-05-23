import Link from "next/link";
import { CheckCircle2, Store } from "lucide-react";
import { TerraScoreBadge } from "./TerraScoreBadge";

interface StoreCardProps {
  id: string;
  slug: string;
  nombre: string;
  terraScore: number;
  verificada: boolean;
  ubicacion?: string | null;
  logoUrl?: string | null;
}

export function StoreCard({
  slug,
  nombre,
  terraScore,
  verificada,
  ubicacion,
  logoUrl,
}: StoreCardProps) {
  return (
    <Link
      href={`/tienda/${slug}`}
      className="flex items-center gap-3 p-3 rounded-[12px] border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] bg-white dark:bg-[#1a3a6a] hover:border-[#60a5f5] hover:shadow-sm transition-all"
    >
      {/* Logo */}
      <div className="h-12 w-12 rounded-lg bg-[#eff6ff] dark:bg-[#0d2240] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={nombre} className="h-full w-full object-cover" />
        ) : (
          <Store className="h-6 w-6 text-[#60a5f5]" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-[#1e293b] dark:text-[#eff6ff] truncate">
            {nombre}
          </span>
          {verificada && (
            <CheckCircle2 className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5] flex-shrink-0" aria-label="Tienda verificada" />
          )}
        </div>
        {ubicacion && (
          <p className="text-xs text-[#94a3b8] truncate">{ubicacion}</p>
        )}
        <div className="mt-1">
          <TerraScoreBadge score={terraScore} size="sm" />
        </div>
      </div>
    </Link>
  );
}
