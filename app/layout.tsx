import type { Metadata, Viewport } from 'next'
import './globals.css'
import StoreProvider from '@/components/providers/StoreProvider'

export const metadata: Metadata = {
  title: 'GENESUS — Superinteligencia Empresarial',
  description: 'Tu asistente de IA empresarial con 306+ agentes y 1,500+ subagentes especializados',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'GENESUS' },
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
