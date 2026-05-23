"use client";

import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { AgroSheet } from "@/components/catalog/AgroSheet";
import type { Review } from "@/types";

interface AgroSheetData {
  principioActivo?: string | null;
  dosisRecomendada?: string | null;
  periodoCarencia?: string | null;
  contraindicaciones?: string | null;
  certificaciones?: string[] | null;
  cultivoObjetivo?: string[] | null;
  especieObjetivo?: string[] | null;
  ciclo?: string[] | null;
}

interface ProductTabsProps {
  descripcion: string;
  agroSheet: AgroSheetData;
  reviews: Review[];
}

const TABS = ["Descripción", "Ficha Técnica Agro", "Opiniones"] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ descripcion, agroSheet, reviews }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Descripción");

  return (
    <div className="mt-8">
      {/* Tab headers */}
      <div className="flex border-b border-[#dbeafe] dark:border-[#1e4d8c] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "border-[#1e4d8c] text-[#1e4d8c] dark:text-[#60a5f5] dark:border-[#60a5f5]"
                : "border-transparent text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#eff6ff]"
            }`}
          >
            {tab}
            {tab === "Opiniones" && reviews.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-[#dbeafe] dark:bg-[#1a3a6a] text-[#1e4d8c] dark:text-[#60a5f5] rounded-full px-1.5 py-0.5">
                {reviews.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-5">
        {activeTab === "Descripción" && (
          <div className="prose prose-sm max-w-none text-[#1e293b] dark:text-[#eff6ff] leading-relaxed whitespace-pre-wrap">
            {descripcion || (
              <p className="text-[#94a3b8] italic">Sin descripción disponible.</p>
            )}
          </div>
        )}

        {activeTab === "Ficha Técnica Agro" && (
          <AgroSheet
            principioActivo={agroSheet.principioActivo}
            dosisRecomendada={agroSheet.dosisRecomendada}
            periodoCarencia={agroSheet.periodoCarencia}
            contraindicaciones={agroSheet.contraindicaciones}
            certificaciones={agroSheet.certificaciones}
            cultivoObjetivo={agroSheet.cultivoObjetivo}
            especieObjetivo={agroSheet.especieObjetivo}
            ciclo={agroSheet.ciclo}
          />
        )}

        {activeTab === "Opiniones" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-[#94a3b8] italic text-sm">
                Este producto aún no tiene opiniones. ¡Sé el primero en dejar la tuya!
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-4 rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-[#1e293b] dark:text-[#eff6ff]">
              {review.reviewer?.nombre ?? "Usuario"}
            </p>
            {review.compra_verificada && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#1e4d8c] dark:text-[#60a5f5]">
                <CheckCircle2 className="h-3 w-3" />
                Compra verificada
              </span>
            )}
          </div>
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < review.rating
                    ? "fill-[#f59e0b] text-[#f59e0b]"
                    : "text-[#dbeafe] fill-[#dbeafe]"
                }`}
              />
            ))}
          </div>
        </div>
        <span className="text-xs text-[#94a3b8] flex-shrink-0">
          {new Date(review.created_at).toLocaleDateString("es-VE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {review.titulo && (
        <p className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          {review.titulo}
        </p>
      )}
      {review.contenido && (
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
          {review.contenido}
        </p>
      )}

      {/* Photos placeholder */}
      {review.fotos && review.fotos.length > 0 && (
        <div className="flex gap-2 pt-1">
          {review.fotos.slice(0, 4).map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={photo}
              alt={`Foto ${i + 1}`}
              className="h-14 w-14 rounded-[8px] object-cover border border-[#dbeafe] dark:border-[#1e4d8c]"
            />
          ))}
        </div>
      )}
    </div>
  );
}
