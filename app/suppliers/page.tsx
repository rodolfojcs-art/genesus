'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { useGenesusStore } from '@/stores/genesus-store'
import type { Supplier } from '@/types'
import { clsx } from 'clsx'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={clsx('text-xs', i <= Math.round(rating) ? 'text-[var(--gold)]' : 'text-[var(--border)]')}>★</span>
      ))}
      <span className="text-[10px] font-mono text-[var(--muted)] ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function SuppliersPage() {
  const { suppliers, addSupplier } = useGenesusStore()
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', location: '', email: '', capabilities: '' })

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase()) ||
    s.capabilities.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  function handleNew(e: React.FormEvent) {
    e.preventDefault()
    const sup: Supplier = {
      id: crypto.randomUUID(),
      name: form.name,
      category: form.category,
      location: form.location,
      contact: { email: form.email },
      capabilities: form.capabilities.split(',').map(c => c.trim()).filter(Boolean),
      rating: 4.0,
      status: 'active',
    }
    addSupplier(sup)
    setForm({ name: '', category: '', location: '', email: '', capabilities: '' })
    setShowNew(false)
  }

  const categories = Array.from(new Set(suppliers.map(s => s.category)))

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-6">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar proveedores por nombre, categoría, capacidad..."
              className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors font-mono"
            />
            <button onClick={() => setShowNew(true)} className="flex-shrink-0 text-sm font-mono px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-700 text-white hover:shadow-lg transition-all">
              + Nuevo Proveedor
            </button>
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setSearch('')} className={clsx('text-[10px] font-mono px-3 py-1 rounded-full border transition-all', !search ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] text-[var(--muted)] hover:text-white')}>
                Todos ({suppliers.length})
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSearch(cat)} className={clsx('text-[10px] font-mono px-3 py-1 rounded-full border transition-all', search === cat ? 'border-[var(--acc2)] text-[var(--acc2)] bg-[var(--acc2)]/10' : 'border-[var(--border)] text-[var(--muted)] hover:text-white')}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Suppliers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(sup => (
              <div key={sup.id} className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-bold text-sm text-white">{sup.name}</div>
                    <div className="text-[10px] font-mono text-[var(--muted)] mt-0.5">{sup.category}</div>
                  </div>
                  <span className={clsx('text-[9px] font-mono px-1.5 py-0.5 rounded-full border', sup.status === 'active' ? 'text-[var(--acc4)] border-green-800 bg-green-900/20' : 'text-[var(--muted)] border-[var(--border)]')}>
                    {sup.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>

                <Stars rating={sup.rating} />

                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[var(--muted)] font-mono">
                  <span>📍</span> {sup.location}
                </div>

                {sup.contact.email && (
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--muted)] font-mono">
                    <span>✉️</span> {sup.contact.email}
                  </div>
                )}

                {sup.capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {sup.capabilities.map(c => (
                      <span key={c} className="text-[9px] font-mono text-[var(--acc2)] bg-[var(--acc2)]/10 px-1.5 py-0.5 rounded border border-[var(--acc2)]/20">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-[var(--muted)]">
                <div className="text-4xl mb-3">🔗</div>
                <div>{search ? `No se encontraron proveedores para "${search}"` : 'No hay proveedores. Agrega el primero.'}</div>
              </div>
            )}
          </div>

          {/* New Supplier Modal */}
          {showNew && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-black text-white mb-4">Nuevo Proveedor</h3>
                <form onSubmit={handleNew} className="space-y-3">
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nombre del proveedor *" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} placeholder="Categoría" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Ubicación (Ciudad, País)" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="Email de contacto" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input value={form.capabilities} onChange={e => setForm(f => ({...f, capabilities: e.target.value}))} placeholder="Capacidades (separadas por coma)" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted)] text-sm font-mono hover:text-white transition-colors">Cancelar</button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-700 text-white text-sm font-bold">Agregar</button>
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
