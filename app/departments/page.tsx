'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { DIVISIONS } from '@/lib/data/departments'
import { clsx } from 'clsx'

export default function DepartmentsPage() {
  const [selectedDiv, setSelectedDiv] = useState(DIVISIONS[0])
  const [search, setSearch] = useState('')

  const filteredDepts = selectedDiv.departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden flex">
          {/* Division list */}
          <div className="w-72 flex-shrink-0 border-r border-[var(--border)] overflow-y-auto bg-[var(--surface)] p-3 space-y-1">
            <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest px-2 mb-3">23 Divisiones</div>
            {DIVISIONS.map(div => (
              <button
                key={div.id}
                onClick={() => { setSelectedDiv(div); setSearch('') }}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left',
                  selectedDiv.id === div.id
                    ? 'border-opacity-50 bg-opacity-10'
                    : 'border-transparent hover:bg-[var(--surface2)]'
                )}
                style={selectedDiv.id === div.id ? { borderColor: div.color + '60', background: div.color + '10' } : {}}
              >
                <span className="text-base flex-shrink-0">{div.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{div.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: div.color }}>
                    {div.agentCount} AGT · {div.subAgentCount} SUB
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Department detail */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: selectedDiv.color + '15', border: `1px solid ${selectedDiv.color}30` }}>
                {selectedDiv.icon}
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: selectedDiv.color }}>{selectedDiv.code}</div>
                <h2 className="text-2xl font-black text-white">{selectedDiv.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono text-[var(--muted)]">{selectedDiv.agentCount} agentes directores</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                  <span className="text-xs font-mono text-[var(--muted)]">{selectedDiv.subAgentCount} subagentes</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar departamento..."
                className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors font-mono"
              />
            </div>

            {/* Departments grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredDepts.map(dept => (
                <div
                  key={dept.id}
                  className="bg-[var(--surface)] border border-[var(--border)] hover:border-opacity-60 rounded-xl p-4 transition-all hover:bg-[var(--surface2)] cursor-default"
                  style={{ '--hover-border': selectedDiv.color } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-bold text-sm text-white leading-tight">{dept.name}</div>
                    <span className="text-[10px] font-mono flex-shrink-0 px-1.5 py-0.5 rounded" style={{ color: selectedDiv.color, background: selectedDiv.color + '15' }}>
                      {dept.agentCount} AGT
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)] leading-relaxed mb-3">{dept.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {dept.keywords.slice(0, 4).map(k => (
                      <span key={k} className="text-[9px] font-mono text-[var(--muted)] px-1.5 py-0.5 bg-[var(--surface2)] rounded border border-[var(--border)]">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredDepts.length === 0 && (
              <div className="text-center py-16 text-[var(--muted)]">
                <div className="text-3xl mb-3">🔍</div>
                <div>No se encontraron departamentos</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
