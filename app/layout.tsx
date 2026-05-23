import type { Metadata, Viewport } from 'next'
import './globals.css'
import StoreProvider from '@/components/providers/StoreProvider'

export const metadata: Metadata = {
  title: 'GENESUS — Superinteligencia Empresarial',
  description: 'Tu asistente de IA empresarial con 306+ agentes y 1,500+ subagentes especializados',
  manifest: '/manifest.json',
  metadataBase: new URL('https://genesustech.com'),
  alternates: { canonical: 'https://genesustech.com' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'GENESUS' },
  openGraph: {
    title: 'GENESUS — Superinteligencia Empresarial',
    description: 'Red de 306+ agentes de IA para decisiones empresariales',
    url: 'https://genesustech.com',
    siteName: 'GENESUS',
    locale: 'es_MX',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="grid-bg">
        <StoreProvider>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
