import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review & {
    reviewer: {
      nombre: string;
      apellido: string;
      avatar_url?: string | null;
    };
  };
}

function Initials({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e4d8c] text-sm font-semibold text-white">
      {initials}
    </span>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const reviewer = review.reviewer;
  const fullName = `${reviewer.nombre} ${reviewer.apellido}`;

  return (
    <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] rounded-xl">
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {reviewer.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reviewer.avatar_url}
              alt={fullName}
              className="h-9 w-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <Initials nombre={reviewer.nombre} apellido={reviewer.apellido} />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff] truncate">
                {fullName}
              </span>
              {review.compra_verificada && (
                <Badge className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-[#dcfce7] dark:bg-[#14532d] text-[#15803d] dark:text-[#4ade80] border-0 rounded-full">
                  <ShieldCheck className="h-3 w-3" />
                  Compra verificada
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-[11px] text-[#94a3b8]">
                {format(new Date(review.created_at), "d MMM yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {review.titulo && (
          <p className="font-semibold text-sm text-[#1e293b] dark:text-[#eff6ff]">
            {review.titulo}
          </p>
        )}
        {review.contenido && (
          <p className="text-sm text-[#475569] dark:text-[#94a3b8] leading-relaxed whitespace-pre-wrap">
            {review.contenido}
          </p>
        )}

        {/* Photos */}
        {review.fotos && review.fotos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {review.fotos.map((foto, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={idx}
                src={foto}
                alt={`Foto ${idx + 1}`}
                className="h-16 w-16 rounded-lg object-cover border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)]"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
