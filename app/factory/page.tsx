'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { useGenesusStore } from '@/stores/genesus-store'
import type { FactoryOrder, Product } from '@/types'
import { clsx } from 'clsx'

const STATUS_COLORS: Record<string, string> = {
  draft: '#6b6b8a',
  quoted: '#f59e0b',
  approved: '#00e5ff',
  production: '#7c5cfc',
  delivered: '#39ff14',
  design: '#6b6b8a',
  prototype: '#00e5ff',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador', quoted: 'Cotizado', approved: 'Aprobado',
  production: 'En Producción', delivered: 'Entregado',
  design: 'Diseño', prototype: 'Prototipo',
}

export default function FactoryPage() {
  const { orders, products, addOrder, addProduct, updateOrder } = useGenesusStore()
  const [tab, setTab] = useState<'orders' | 'products'>('orders')
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [showNewProduct, setShowNewProduct] = useState(false)
  const [form, setForm] = useState({ clientName: '', productName: '', quantity: '1', specs: '' })
  const [prodForm, setProdForm] = useState({ name: '', description: '', category: '' })

  function handleNewOrder(e: React.FormEvent) {
    e.preventDefault()
    const order: FactoryOrder = {
      id: crypto.randomUUID(),
      clientName: form.clientName,
      productName: form.productName,
      quantity: parseInt(form.quantity) || 1,
      status: 'draft',
      specifications: form.specs ? { notas: form.specs } : {},
      timeline: {},
      createdAt: Date.now(),
    }
    addOrder(order)
    setForm({ clientName: '', productName: '', quantity: '1', specs: '' })
    setShowNewOrder(false)
  }

  function handleNewProduct(e: React.FormEvent) {
    e.preventDefault()
    const prod: Product = {
      id: crypto.randomUUID(),
      name: prodForm.name,
      description: prodForm.description,
      category: prodForm.category,
      specifications: {},
      status: 'design',
      createdAt: Date.now(),
    }
    addProduct(prod)
    setProdForm({ name: '', description: '', category: '' })
    setShowNewProduct(false)
  }

  const statusFlow: FactoryOrder['status'][] = ['draft', 'quoted', 'approved', 'production', 'delivered']

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Órdenes Totales', value: orders.length, color: 'var(--accent)' },
              { label: 'En Producción', value: orders.filter(o => o.status === 'production').length, color: 'var(--acc2)' },
              { label: 'Entregadas', value: orders.filter(o => o.status === 'delivered').length, color: 'var(--acc4)' },
              { label: 'Productos', value: products.length, color: 'var(--gold)' },
            ].map(s => (
              <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider mb-1">{s.label}</div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4">
            {(['orders', 'products'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={clsx('text-sm font-mono px-4 py-2 rounded-xl border transition-all',
                  tab === t ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white' : 'border-[var(--border)] text-[var(--muted)] hover:text-white'
                )}
              >
                {t === 'orders' ? '📋 Órdenes' : '📦 Productos'}
              </button>
            ))}
            <div className="ml-auto">
              {tab === 'orders' ? (
                <button onClick={() => setShowNewOrder(true)} className="text-sm font-mono px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-700 text-white hover:shadow-lg transition-all">
                  + Nueva Orden
                </button>
              ) : (
                <button onClick={() => setShowNewProduct(true)} className="text-sm font-mono px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-orange-600 text-black font-bold hover:shadow-lg transition-all">
                  + Nuevo Producto
                </button>
              )}
            </div>
          </div>

          {/* Orders */}
          {tab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 && (
                <div className="text-center py-16 text-[var(--muted)]">
                  <div className="text-4xl mb-3">🏭</div>
                  <div>No hay órdenes aún. Crea la primera.</div>
                </div>
              )}
              {orders.map(order => (
                <div key={order.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="font-bold text-white">{order.productName}</div>
                      <div className="text-xs text-[var(--muted)] font-mono mt-0.5">{order.clientName} · Qty: {order.quantity}</div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full" style={{ color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '20' }}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex gap-1 mb-3">
                    {statusFlow.map(s => (
                      <div key={s} className="flex-1 h-1 rounded-full transition-all duration-500" style={{
                        background: statusFlow.indexOf(s) <= statusFlow.indexOf(order.status)
                          ? STATUS_COLORS[order.status]
                          : 'var(--border)'
                      }} />
                    ))}
                  </div>

                  {/* Advance button */}
                  {order.status !== 'delivered' && (
                    <button
                      onClick={() => {
                        const next = statusFlow[statusFlow.indexOf(order.status) + 1]
                        if (next) updateOrder(order.id, { status: next })
                      }}
                      className="text-[11px] font-mono text-[var(--muted)] hover:text-white border border-[var(--border)] hover:border-[var(--accent)] px-3 py-1.5 rounded-lg transition-all"
                    >
                      Avanzar → {STATUS_LABELS[statusFlow[statusFlow.indexOf(order.status) + 1]] || ''}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {tab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {products.length === 0 && (
                <div className="col-span-3 text-center py-16 text-[var(--muted)]">
                  <div className="text-4xl mb-3">📦</div>
                  <div>No hay productos. Agrega el primero.</div>
                </div>
              )}
              {products.map(prod => (
                <div key={prod.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-bold text-sm text-white">{prod.name}</div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: STATUS_COLORS[prod.status], background: STATUS_COLORS[prod.status] + '20' }}>
                      {STATUS_LABELS[prod.status]}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mb-2">{prod.description}</div>
                  {prod.category && (
                    <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--surface2)] px-2 py-0.5 rounded border border-[var(--border)]">{prod.category}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Order Modal */}
          {showNewOrder && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewOrder(false)}>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-black text-white mb-4">Nueva Orden de Fábrica</h3>
                <form onSubmit={handleNewOrder} className="space-y-3">
                  <input required value={form.clientName} onChange={e => setForm(f => ({...f, clientName: e.target.value}))} placeholder="Nombre del cliente *" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input required value={form.productName} onChange={e => setForm(f => ({...f, productName: e.target.value}))} placeholder="Producto o servicio *" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} placeholder="Cantidad" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <textarea value={form.specs} onChange={e => setForm(f => ({...f, specs: e.target.value}))} placeholder="Especificaciones (opcional)" rows={2} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] resize-none" />
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowNewOrder(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted)] text-sm font-mono hover:text-white transition-colors">Cancelar</button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-700 text-white text-sm font-bold">Crear Orden</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Product Modal */}
          {showNewProduct && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewProduct(false)}>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-black text-white mb-4">Nuevo Producto</h3>
                <form onSubmit={handleNewProduct} className="space-y-3">
                  <input required value={prodForm.name} onChange={e => setProdForm(f => ({...f, name: e.target.value}))} placeholder="Nombre del producto *" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <input value={prodForm.category} onChange={e => setProdForm(f => ({...f, category: e.target.value}))} placeholder="Categoría" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]" />
                  <textarea value={prodForm.description} onChange={e => setProdForm(f => ({...f, description: e.target.value}))} placeholder="Descripción" rows={2} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] resize-none" />
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowNewProduct(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted)] text-sm font-mono hover:text-white transition-colors">Cancelar</button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gold)] to-orange-600 text-black text-sm font-bold">Agregar</button>
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
