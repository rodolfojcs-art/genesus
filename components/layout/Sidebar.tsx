'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGenesusStore } from '@/stores/genesus-store'
import { TOTAL_AGENTS, TOTAL_SUB_AGENTS } from '@/lib/data/departments'
import { clsx } from 'clsx'

const NAV = [
  { href: '/console', label: 'Consola', icon: '🧠', desc: 'Chat con GENESUS' },
  { href: '/agents', label: 'Agentes', icon: '🤖', desc: 'Red neural' },
  { href: '/departments', label: 'Divisiones', icon: '🏛️', desc: '20 divisiones' },
  { href: '/factory', label: 'Fábrica', icon: '🏭', desc: 'Control industrial' },
  { href: '/suppliers', label: 'Proveedores', icon: '🔗', desc: 'Red de supply' },
  { href: '/clients', label: 'Clientes', icon: '👥', desc: 'Gestión CRM' },
  { href: '/plugins', label: 'Plugins', icon: '🔌', desc: 'Herramientas IA' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { userName, metrics, conversations } = useGenesusStore()

  return (
    <aside className="flex flex-col w-64 flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)] h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--acc2)] flex items-center justify-center text-xl font-black shadow-lg shadow-purple-900/40">
            G
          </div>
          <div>
            <div className="font-black text-base tracking-wide text-white">GENESUS</div>
            <div className="text-[10px] text-[var(--muted)] font-mono tracking-widest uppercase">Superinteligencia</div>
          </div>
        </div>
        <div className="mt-3 px-2 py-1.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)]">
          <div className="text-[10px] text-[var(--muted)] font-mono uppercase tracking-widest mb-0.5">Operador</div>
          <div className="text-sm font-bold text-white">{userName}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                active
                  ? 'bg-gradient-to-r from-[var(--accent)]/20 to-[var(--acc2)]/10 border border-[var(--accent)]/30 text-white'
                  : 'text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-white border border-transparent'
              )}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <div className={clsx('text-sm font-semibold', active && 'text-white')}>{item.label}</div>
                <div className="text-[10px] font-mono text-[var(--muted)] group-hover:text-[var(--muted)]">{item.desc}</div>
              </div>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />}
            </Link>
          )
        })}
      </nav>

      {/* Stats */}
      <div className="p-3 border-t border-[var(--border)] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--surface2)] rounded-lg p-2 border border-[var(--border)]">
            <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">Agentes</div>
            <div className="text-sm font-black text-[var(--accent)]">{TOTAL_AGENTS}+</div>
          </div>
          <div className="bg-[var(--surface2)] rounded-lg p-2 border border-[var(--border)]">
            <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">Sub-agt</div>
            <div className="text-sm font-black text-[var(--acc2)]">{TOTAL_SUB_AGENTS}+</div>
          </div>
        </div>
        <div className="bg-[var(--surface2)] rounded-lg p-2 border border-[var(--border)]">
          <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider mb-1">Mensajes totales</div>
          <div className="text-sm font-black text-[var(--gold)]">{metrics.totalMessages.toLocaleString()}</div>
        </div>

        {/* Legacy link */}
        <a
          href="/legacy/index.html"
          className="block text-center text-[10px] font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors py-1"
        >
          ← App móvil clásica
        </a>
      </div>
    </aside>
  )
}
