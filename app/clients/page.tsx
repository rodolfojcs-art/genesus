'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { useGenesusStore } from '@/stores/genesus-store'
import type { Client } from '@/types'
import { clsx } from 'clsx'

const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  active: { label: 'ACTIVO', color: 'var(--acc4)' },
  prospect: { label: 'PROSPECTO', color: 'var(--gold)' },
  inactive: { label: 'INACTIVO', color: 'var(--muted)' },
}

export default function ClientsPage() {
  const { clients, addClient, updateClient } = useGenesusStore()
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)
  const [form, setForm] = useState({ name: '', company: '', industry: '', email: '', phone: '', notes: '' })

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(search.toLowerCase())
  )

  function handleNew(e: React.FormEvent) {
    e.preventDefault()
    addClient({
      id: crypto.randomUUID(),
      name: form.name,
      company: form.company,
      industry: form.industry,
      contact: { email: form.email, phone: form.phone },
      status: 'prospect',
      notes: form.notes,
    })
    setForm({ name: '', company: '', industry: '', email: '', phone: '', notes: '' })
    setShowNew(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden flex">
          {/* Client list */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar clientes..."
                className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors font-mono"
              />
              <button onClick={() => setShowNew(true)} className="flex-shrink-0 text-sm font-mono px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-700 text-white hover:shadow-lg transition-all">
                + Nuevo Cliente
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(['active', 'prospect', 'inactive'] as const).map(s => (
                <div key={s} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: STATUS_STYLE[s].color }}>{STATUS_STYLE[s].label}</div>
                  <div className="text-xl font-black" style={{ color: STATUS_STYLE[s].color }}>
                    {clients.filter(c => c.status === s).length}
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_1fr_100px_80px] gap-0 border-b border-[var(--border)] px-4 py-2.5">
                {['Cliente', 'Empresa', 'Industria', 'Estado', 'Acción'].map(h => (
                  <div key={h} className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">{h}</div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-[var(--muted)]">
                  <div className="text-3xl mb-2">👥</div>
                  <div>{search ? 'Sin resultados' : 'No hay clientes. Agrega el primero.'}</div>
                </div>
              )}
              {filtered.map(client => (
                <div key={client.id} className="grid grid-cols-[1fr_1fr_1fr_100px_80px] gap-0 px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--surface2)] transition-colors items-center">
                  <div>
                    <div className="text-sm font-semibold text-white">{client.name}</div>
                    {client.contact.email && <div className="text-[10px] font-mono text-[var(--muted)]">{client.contact.email}</div>}
                  </div>
                  <div className="text-sm text-[var(--muted)]">{client.company || '—'}</div>
                  <div className="text-sm text-[var(--muted)]">{client.industry || '—'}</div>
                  <div>
                    <select
                      value={client.status}
                      onChange={e => updateClient(client.id, { status: e.target.value as Client['status'] })}
                      className="text-[10px] font-mono bg-transparent border-none outline-none cursor-pointer font-bold"
                      style={{ color: STATUS_STYLE[client.status].color }}
                    >
                      <option value="active">ACTIVO</option>
                      <option value="prospect">PROSPECTO</option>
                      <option value="inactive">INACTIVO</option>
                    </select>
                  </div>
                  <div>
                    <button onClick={() => setSelected(client)} className="text-[10px] font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Ver →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 flex-shrink-0 border-l border-[var(--border)] bg-[var(--surface)] p-5 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-black text-white text-base">{selected.name}</div>
                  {selected.company && <div className="text-xs text-[var(--muted)] font-mono">{selected.company}</div>}
                </div>
                <button onClick={() => setSelected(null)} className="text-[var(--muted)] hover:text-white text-lg leading-none">✕</button>
              </div>
              <div className="space-y-3">
                {selected.industry && (
                  <div><div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-1">Industria</div><div className="text-sm text-white">{selected.industry}</div></div>
                )}
                {selected.contact.email && (
                  <div><div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-1">Email</div><div className="text-sm text-[var(--acc2)] break-all">{selected.contact.email}</div></div>
                )}
                {selected.contact.phone && (
                  <div><div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-1">Teléfono</div><div className="text-sm text-white">{selected.contact.phone}</div></div>
                )}
                {selected.notes && (
                  <div><div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-1">Notas</div><div className="text-xs text-[var(--muted)] leading-relaxed">{selected.notes}</div></div>
                )}
                <div>
                  <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-1">Estado</div>
                  <span className="text-xs font-mono font-bold" style={{ color: STATUS_STYLE[selected.status].color }}>{STATUS_STYLE[selected.status].label}</span>
                </div>
              </div>
            </div>
          )}

          {/* New Client Modal */}
          {showNew && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-black text-white mb-4">Nuevo Cliente</h3>
                <form onSubmit={handleNew} className="space-y-3">
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nombre completo *" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} placeholder="Empresa" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input value={form.industry} onChange={e => setForm(f => ({...f, industry: e.target.value}))} placeholder="Industria" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="Email" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="Teléfono" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Notas" rows={2} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] resize-none" />
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted)] text-sm font-mono hover:text-white transition-colors">Cancelar</button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-700 text-white text-sm font-bold">Guardar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
