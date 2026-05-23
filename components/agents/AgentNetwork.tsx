'use client'
import { useEffect, useState } from 'react'
import { DIVISIONS } from '@/lib/data/departments'
import { useGenesusStore } from '@/stores/genesus-store'
import { clsx } from 'clsx'

interface NodeData {
  id: string
  label: string
  type: 'genesus' | 'supreme' | 'division' | 'agent'
  color: string
  x: number
  y: number
  count?: number
}

export default function AgentNetwork() {
  const { dynamicAgents, metrics } = useGenesusStore()
  const [selected, setSelected] = useState<NodeData | null>(null)
  const [scale] = useState(1)

  const cx = 500
  const cy = 320

  const divisionAngles = DIVISIONS.map((_, i) => (i / DIVISIONS.length) * 2 * Math.PI - Math.PI / 2)

  const genesusNode: NodeData = { id: 'genesus', label: 'GENESUS', type: 'genesus', color: '#7c5cfc', x: cx, y: cy }

  const supremeNodes: NodeData[] = [
    { id: 'sup1', label: 'INVERSIONES', type: 'supreme', color: '#39ff14', x: cx + 130 * Math.cos(-Math.PI / 2 + (0 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (0 * Math.PI / 5)) },
    { id: 'sup2', label: 'RIESGOS', type: 'supreme', color: '#ff0066', x: cx + 130 * Math.cos(-Math.PI / 2 + (2 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (2 * Math.PI / 5)) },
    { id: 'sup3', label: 'TECNOLOGÍA', type: 'supreme', color: '#00e5ff', x: cx + 130 * Math.cos(-Math.PI / 2 + (4 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (4 * Math.PI / 5)) },
    { id: 'sup4', label: 'OPERACIONES', type: 'supreme', color: '#00ffcc', x: cx + 130 * Math.cos(-Math.PI / 2 + (6 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (6 * Math.PI / 5)) },
    { id: 'sup5', label: 'ESTRATEGIA', type: 'supreme', color: '#ffc800', x: cx + 130 * Math.cos(-Math.PI / 2 + (8 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (8 * Math.PI / 5)) },
    { id: 'sup6', label: 'CLIENTES', type: 'supreme', color: '#fb923c', x: cx + 130 * Math.cos(-Math.PI / 2 + (10 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (10 * Math.PI / 5)) },
    { id: 'sup7', label: 'LEGAL', type: 'supreme', color: '#ffaa00', x: cx + 130 * Math.cos(-Math.PI / 2 + (12 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (12 * Math.PI / 5)) },
    { id: 'sup8', label: 'CAPITAL HUM.', type: 'supreme', color: '#ff6eb4', x: cx + 130 * Math.cos(-Math.PI / 2 + (14 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (14 * Math.PI / 5)) },
    { id: 'sup9', label: 'ESG', type: 'supreme', color: '#6ee7b7', x: cx + 130 * Math.cos(-Math.PI / 2 + (16 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (16 * Math.PI / 5)) },
    { id: 'sup10', label: 'EXPANSIÓN', type: 'supreme', color: '#f87171', x: cx + 130 * Math.cos(-Math.PI / 2 + (18 * Math.PI / 5)), y: cy + 130 * Math.sin(-Math.PI / 2 + (18 * Math.PI / 5)) },
  ]

  const divisionNodes: NodeData[] = DIVISIONS.map((div, i) => ({
    id: `div-${div.id}`,
    label: div.code,
    type: 'division',
    color: div.color,
    x: cx + 240 * Math.cos(divisionAngles[i]),
    y: cy + 240 * Math.sin(divisionAngles[i]),
    count: div.agentCount,
  }))

  return (
    <div className="flex h-full">
      {/* Network SVG */}
      <div className="flex-1 relative overflow-hidden bg-[var(--surface)] rounded-xl border border-[var(--border)]">
        <svg
          width="100%"
          viewBox={`0 0 1000 640`}
          className="w-full h-full"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124,92,252,0.05)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="glowAccent" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7c5cfc" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1000" height="640" fill="url(#grid)" />
          <circle cx={cx} cy={cy} r="180" fill="url(#glowAccent)" />

          {/* Edges: GENESUS → Supremos */}
          {supremeNodes.map(s => (
            <line key={s.id}
              x1={cx} y1={cy} x2={s.x} y2={s.y}
              stroke={s.color} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 3"
            />
          ))}

          {/* Edges: Supremos → Divisiones */}
          {divisionNodes.map((d, i) => {
            const sup = supremeNodes[i % supremeNodes.length]
            return (
              <line key={d.id}
                x1={sup.x} y1={sup.y} x2={d.x} y2={d.y}
                stroke={d.color} strokeWidth="0.8" strokeOpacity="0.25"
              />
            )
          })}

          {/* Division nodes */}
          {divisionNodes.map(node => (
            <g key={node.id} onClick={() => setSelected(node)} className="cursor-pointer" transform={`translate(${node.x},${node.y})`}>
              <circle r="22" fill={node.color} fillOpacity="0.1" stroke={node.color} strokeWidth="1" />
              <circle r="14" fill={node.color} fillOpacity="0.2" stroke={node.color} strokeWidth="0.5" />
              <text textAnchor="middle" dominantBaseline="middle" fontSize="7" fontFamily="JetBrains Mono" fill={node.color} fontWeight="600">
                {node.label.replace('DIV-', '')}
              </text>
              {node.count && (
                <text y="28" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={node.color} fillOpacity="0.7">
                  {node.count} AGT
                </text>
              )}
            </g>
          ))}

          {/* Supreme director nodes */}
          {supremeNodes.map(node => (
            <g key={node.id} onClick={() => setSelected(node)} className="cursor-pointer" transform={`translate(${node.x},${node.y})`}>
              <circle r="32" fill={node.color} fillOpacity="0.08" stroke={node.color} strokeWidth="1.5" />
              <circle r="22" fill={node.color} fillOpacity="0.15" stroke={node.color} strokeWidth="1" />
              <text textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="JetBrains Mono" fill={node.color} fontWeight="700">
                {node.label.slice(0, 4)}
              </text>
            </g>
          ))}

          {/* GENESUS central node */}
          <g onClick={() => setSelected(genesusNode)} className="cursor-pointer" transform={`translate(${cx},${cy})`}>
            <circle r="55" fill="url(#glowAccent)" />
            <circle r="42" fill="#09090f" stroke="#7c5cfc" strokeWidth="2" />
            <circle r="35" fill="rgba(124,92,252,0.1)" stroke="#7c5cfc" strokeWidth="0.5" strokeDasharray="3 3">
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="20s" repeatCount="indefinite" />
            </circle>
            <text textAnchor="middle" dominantBaseline="middle" fontSize="18" fontFamily="Syne" fill="#7c5cfc" fontWeight="900">G</text>
            <text y="20" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill="#7c5cfc" fontWeight="600">GENESUS</text>
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {[
            { color: '#7c5cfc', label: 'GENESUS Central' },
            { color: '#ffc800', label: '5 Directores Supremos' },
            { color: '#00e5ff', label: '23 Divisiones' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)]">
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Info panel */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3 ml-4">
        {/* Stats */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-3">Estado del Sistema</div>
          <div className="space-y-2">
            {[
              { label: 'Estado', value: 'ONLINE', color: 'var(--acc4)' },
              { label: 'Divisiones', value: '20', color: 'var(--accent)' },
              { label: 'Departamentos', value: '1,000', color: 'var(--accent)' },
              { label: 'Directores', value: '1,000', color: 'var(--acc2)' },
              { label: 'Sub-agentes', value: '10,000', color: 'var(--gold)' },
              { label: 'Agentes activados hoy', value: metrics.agentsActivated.toString(), color: 'var(--acc4)' },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center">
                <span className="text-xs text-[var(--muted)]">{s.label}</span>
                <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected info */}
        {selected ? (
          <div className="bg-[var(--surface)] border rounded-xl p-4 flex-1" style={{ borderColor: selected.color + '40' }}>
            <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: selected.color }}>
              {selected.type === 'genesus' ? 'NÚCLEO CENTRAL' : selected.type === 'supreme' ? 'DIRECTOR SUPREMO' : 'DIVISIÓN'}
            </div>
            <div className="font-bold text-white mb-2">{selected.label}</div>
            {selected.count !== undefined && (
              <div className="text-xs text-[var(--muted)]">{selected.count} agentes directores</div>
            )}
            {selected.type === 'genesus' && (
              <div className="text-xs text-[var(--muted)] leading-relaxed mt-2">
                CEO y Superinteligencia de GENESUS. Orquesta 10,011 agentes: 10 Directores Supremos, 1,000 Directores de Departamento y 10,000 subagentes especializados. Modelo: Claude Opus 4.
              </div>
            )}
            <button onClick={() => setSelected(null)} className="mt-3 text-[10px] font-mono text-[var(--muted)] hover:text-white transition-colors">
              Cerrar ✕
            </button>
          </div>
        ) : (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex-1">
            <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-2">Divisiones Activas</div>
            <div className="space-y-1.5 overflow-y-auto max-h-80">
              {DIVISIONS.map(div => (
                <div key={div.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: div.color }} />
                  <span className="text-[11px] text-[var(--muted)] truncate">{div.name}</span>
                  <span className="text-[10px] font-mono ml-auto flex-shrink-0" style={{ color: div.color }}>{div.agentCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic agents */}
        {dynamicAgents.length > 0 && (
          <div className="bg-[var(--surface)] border border-[var(--acc4)]/20 rounded-xl p-3">
            <div className="text-[10px] font-mono text-[var(--acc4)] uppercase tracking-widest mb-2">✨ Agentes Dinámicos</div>
            <div className="space-y-1">
              {dynamicAgents.map(a => (
                <div key={a} className="text-[11px] text-[var(--muted)]">• {a}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
