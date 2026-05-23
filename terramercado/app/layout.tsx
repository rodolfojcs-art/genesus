import type { Metadata, Viewport } from "next";
import { Sora, Fraunces, DM_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d2240",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.terramercado.com"
  ),
  title: {
    default: "TerraMercado — Comercio agropecuario con confianza",
    template: "%s · TerraMercado",
  },
  description:
    "Plataforma B2B para el sector agrícola y pecuario de Latinoamérica. Insumos, maquinaria, genética y financiación con escrow real y respaldo en moneda real.",
  keywords: [
    "agro",
    "pecuario",
    "insumos agrícolas",
    "fertilizantes",
    "ganadería",
    "Venezuela",
    "Latinoamérica",
    "marketplace agro",
    "TerraMercado",
    "agricultura digital",
  ],
  authors: [{ name: "Cadet Holdings Corp." }],
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://www.terramercado.com",
    siteName: "TerraMercado",
    title: "TerraMercado — Comercio agropecuario con confianza",
    description:
      "Insumos, maquinaria, genética y financiación con escrow real. La categoría que Amazon no puede atender.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TerraMercado" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TerraMercado",
    description: "Comercio agropecuario con confianza.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${sora.variable} ${fraunces.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
