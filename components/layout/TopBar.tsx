'use client'
import { useGenesusStore } from '@/stores/genesus-store'
import { usePathname } from 'next/navigation'

const TITLES: Record<string, { title: string; sub: string }> = {
  '/console': { title: 'Consola GENESUS', sub: 'Superinteligencia empresarial en tiempo real' },
  '/agents': { title: 'Red de Agentes', sub: 'Visualización de la arquitectura neural' },
  '/departments': { title: '23 Divisiones', sub: 'Directorio de departamentos y agentes' },
  '/factory': { title: 'Control de Fábrica', sub: 'Gestión de producción y órdenes' },
  '/suppliers': { title: 'Red de Proveedores', sub: 'Supply chain y búsqueda de suppliers' },
  '/clients': { title: 'CRM de Clientes', sub: 'Gestión de clientes y prospectos' },
}

export default function TopBar() {
  const pathname = usePathname()
  const info = TITLES[pathname] ?? { title: 'GENESUS', sub: 'Sistema de IA empresarial' }
  const { metrics } = useGenesusStore()

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-20">
      <div>
        <h1 className="text-base font-black text-white">{info.title}</h1>
        <p className="text-[11px] text-[var(--muted)] font-mono">{info.sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface2)] border border-[var(--border)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--acc4)] animate-pulse" />
          <span className="text-[10px] font-mono text-[var(--acc4)] font-bold uppercase tracking-widest">ONLINE</span>
        </div>

        {/* Metrics pill */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[var(--surface2)] border border-[var(--border)]">
          <span className="text-[10px] font-mono text-[var(--muted)]">
            <span className="text-[var(--accent)] font-bold">{metrics.totalMessages}</span> msgs
          </span>
          <span className="w-px h-3 bg-[var(--border)]" />
          <span className="text-[10px] font-mono text-[var(--muted)]">
            <span className="text-[var(--acc2)] font-bold">{metrics.agentsActivated}</span> agentes usados
          </span>
        </div>
      </div>
    </header>
  )
}
