"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (n: number) => void;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

export function StarRating({
  rating,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered !== null ? hovered : rating;

  return (
    <div
      className="flex items-center gap-0.5"
      role={interactive ? "group" : undefined}
      aria-label={`Calificación: ${rating} de 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = display >= n;
        const halfFilled = !filled && display >= n - 0.5;

        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(n)}
            onMouseEnter={() => interactive && setHovered(n)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={cn(
              "relative focus-visible:outline-none",
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default pointer-events-none"
            )}
            aria-label={interactive ? `${n} estrellas` : undefined}
          >
            {halfFilled ? (
              <span className="relative inline-block">
                {/* Background (empty) star */}
                <Star
                  className={cn(sizeMap[size], "text-[#d1d5db] dark:text-[#374151]")}
                />
                {/* Foreground (filled) half star */}
                <span className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star
                    className={cn(sizeMap[size], "fill-[#f59e0b] text-[#f59e0b]")}
                  />
                </span>
              </span>
            ) : (
              <Star
                className={cn(
                  sizeMap[size],
                  filled
                    ? "fill-[#f59e0b] text-[#f59e0b]"
                    : "fill-transparent text-[#d1d5db] dark:text-[#374151]"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
