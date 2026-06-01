'use client'
import { useGenesusStore } from '@/stores/genesus-store'
import { PLUGINS } from '@/lib/plugins'
import { clsx } from 'clsx'

export default function PluginsPage() {
  const { enabledPlugins, togglePlugin } = useGenesusStore()

  const enabledCount = enabledPlugins.length

  return (
    <div className="flex flex-col h-full p-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔌</span>
          <h1 className="text-2xl font-black text-white">Plugins</h1>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Activa herramientas que GENESUS puede usar durante el chat para ampliar sus capacidades.
          Los plugins habilitados están disponibles en el modo Chat Directo.
        </p>
        {enabledCount > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--acc4)]/10 border border-[var(--acc4)]/30 text-[var(--acc4)] text-xs font-mono">
            ✓ {enabledCount} plugin{enabledCount > 1 ? 's' : ''} activo{enabledCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Plugin grid */}
      <div className="grid grid-cols-1 gap-4">
        {PLUGINS.map(plugin => {
          const enabled = enabledPlugins.includes(plugin.id)
          return (
            <div
              key={plugin.id}
              className={clsx(
                'flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group',
                enabled
                  ? 'border-[var(--accent)]/50 bg-[var(--accent)]/5'
                  : 'border-[var(--border)] bg-[var(--surface2)] hover:border-[var(--accent)]/30'
              )}
              onClick={() => togglePlugin(plugin.id)}
            >
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all',
                enabled ? 'bg-[var(--accent)]/20' : 'bg-[var(--surface)]'
              )}>
                {plugin.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-white text-sm">{plugin.name}</span>
                  {plugin.requiresApiKey && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">
                      API KEY
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted)]">{plugin.description}</p>
                {plugin.requiresApiKey && (
                  <p className="text-[10px] text-yellow-500/70 mt-1 font-mono">
                    Requiere: {plugin.requiresApiKey}
                  </p>
                )}
              </div>

              {/* Toggle */}
              <div
                className={clsx(
                  'relative w-10 h-5 rounded-full border transition-all flex-shrink-0',
                  enabled ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--surface)] border-[var(--border)]'
                )}
              >
                <div className={clsx(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow',
                  enabled ? 'left-5' : 'left-0.5'
                )} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Usage hint */}
      <div className="mt-8 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface2)]">
        <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-2">Cómo usar</div>
        <ul className="text-xs text-[var(--muted)] space-y-1.5">
          <li>1. Activa uno o más plugins desde esta página o desde el botón 🔌 en la consola.</li>
          <li>2. GENESUS usará las herramientas automáticamente cuando las necesite al responder.</li>
          <li>3. En el chat verás un indicador de qué herramienta fue usada y el resultado obtenido.</li>
          <li>4. Los plugins solo funcionan en modo <strong className="text-white">⚡ Chat directo</strong>.</li>
        </ul>
      </div>
    </div>
  )
}
