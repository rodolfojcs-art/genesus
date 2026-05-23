import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "./ProductForm";
import type { Category } from "@/types";

export default async function NuevoProductoPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("orden");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/tienda-mia/productos"
          className="flex items-center gap-1 text-sm text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#eff6ff] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Mis productos
        </Link>
      </div>

      <h1 className="font-heading text-xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
        Nuevo producto
      </h1>

      <ProductForm categories={(categories as Category[]) ?? []} />
    </div>
  );
}
