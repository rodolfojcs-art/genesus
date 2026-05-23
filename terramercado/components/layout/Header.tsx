"use client";

import Link from "next/link";
import { Search, ShoppingCart, Menu, Bell } from "lucide-react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a3a6a] bg-[#1e4d8c] dark:bg-[#0d2240]">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center gap-3 py-3">
          <Logo size={36} />

          {/* Desktop search */}
          <div className="flex-1 max-w-2xl hidden sm:flex">
            <Input
              type="search"
              placeholder="Buscar insumos, maquinaria, semillas…"
              className="w-full rounded-r-none border-r-0 bg-white text-[#1e293b] placeholder:text-[#94a3b8] border-0 focus-visible:ring-0 h-10"
            />
            <button
              type="button"
              className="h-10 px-4 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-r-md flex items-center"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              className="p-2 text-white hover:bg-[#1a3a6a] rounded-md sm:hidden"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/login"
              className="hidden sm:flex flex-col gap-0 py-1 px-2 text-white hover:bg-[#1a3a6a] rounded-md"
            >
              <span className="text-[10px] text-[#93c5fd]">Hola, ingresa</span>
              <span className="text-sm font-semibold">Cuenta</span>
            </Link>

            <button
              type="button"
              className="p-2 text-white hover:bg-[#1a3a6a] rounded-md"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5" />
            </button>

            <Link
              href="/carrito"
              className="relative p-2 text-white hover:bg-[#1a3a6a] rounded-md"
              aria-label="Carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[10px] bg-[#f59e0b] text-white rounded-full">
                0
              </span>
            </Link>

            <button
              type="button"
              className="p-2 text-white hover:bg-[#1a3a6a] rounded-md sm:hidden"
              aria-label="Menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex items-center gap-1 py-1 overflow-x-auto -mx-4 px-4" aria-label="Categorías">
          {[
            { label: "Todas las categorías", href: "/catalogo" },
            { label: "Insumos Agrícolas", href: "/catalogo?cat=insumos" },
            { label: "Maquinaria", href: "/catalogo?cat=maquinaria" },
            { label: "Semillas", href: "/catalogo?cat=semillas" },
            { label: "Pecuario", href: "/catalogo?cat=pecuario" },
            { label: "Genética", href: "/catalogo?cat=genetica" },
            { label: "TerraPlus", href: "/terraplus" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#93c5fd] hover:text-white text-sm whitespace-nowrap px-2 py-1 rounded hover:bg-[#1a3a6a] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden border-t border-[#1a3a6a] px-4 py-2">
        <div className="flex">
          <Input
            type="search"
            placeholder="Buscar insumos, maquinaria…"
            className="flex-1 rounded-r-none border-r-0 bg-white text-[#1e293b] h-9 border-0"
          />
          <button
            type="button"
            className="h-9 px-3 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-r-md flex items-center"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
