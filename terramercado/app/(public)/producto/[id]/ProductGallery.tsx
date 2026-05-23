"use client";

import { useState } from "react";
import { Package } from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="space-y-3">
        <div className="aspect-square rounded-[12px] bg-[#eff6ff] dark:bg-[#1a3a6a] border border-[#dbeafe] dark:border-[#1e4d8c] flex items-center justify-center">
          <Package className="h-24 w-24 text-[#93c5fd]" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-[8px] bg-[#eff6ff] dark:bg-[#1a3a6a] border border-[#dbeafe] dark:border-[#1e4d8c] flex items-center justify-center"
            >
              <Package className="h-6 w-6 text-[#dbeafe]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square rounded-[12px] overflow-hidden bg-[#eff6ff] dark:bg-[#1a3a6a] border border-[#dbeafe] dark:border-[#1e4d8c] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIndex]?.url}
          alt={images[activeIndex]?.alt ?? productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`aspect-square rounded-[8px] overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-[#60a5f5]"
                  : "border-[#dbeafe] dark:border-[#1e4d8c] hover:border-[#93c5fd]"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
