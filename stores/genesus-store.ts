import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, Conversation, GenesusMetrics, OrchestrationStep, Product, Supplier, Client, FactoryOrder } from '@/types'

interface GenesusStore {
  // User
  userName: string
  setUserName: (name: string) => void

  // Conversations
  conversations: Conversation[]
  activeConversationId: string | null
  addConversation: (conv: Conversation) => void
  setActiveConversation: (id: string) => void
  addMessage: (convId: string, msg: Message) => void
  updateMessage: (convId: string, msgId: string, updates: Partial<Message>) => void
  getActiveConversation: () => Conversation | undefined

  // Orchestration
  orchestrationSteps: OrchestrationStep[]
  setOrchestrationSteps: (steps: OrchestrationStep[]) => void
  updateOrchestrationStep: (phase: 1 | 2 | 3, updates: Partial<OrchestrationStep>) => void
  isOrchestrating: boolean
  setIsOrchestrating: (v: boolean) => void

  // Metrics
  metrics: GenesusMetrics
  incrementMetric: (key: keyof GenesusMetrics, by?: number) => void

  // Products
  products: Product[]
  addProduct: (p: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void

  // Suppliers
  suppliers: Supplier[]
  addSupplier: (s: Supplier) => void

  // Clients
  clients: Client[]
  addClient: (c: Client) => void
  updateClient: (id: string, updates: Partial<Client>) => void

  // Orders
  orders: FactoryOrder[]
  addOrder: (o: FactoryOrder) => void
  updateOrder: (id: string, updates: Partial<FactoryOrder>) => void

  // Dynamic agents
  dynamicAgents: string[]
  addDynamicAgent: (name: string) => void

  // UI
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}

export const useGenesusStore = create<GenesusStore>()(
  persist(
    (set, get) => ({
      userName: 'Rodolfo',
      setUserName: (name) => set({ userName: name }),

      conversations: [],
      activeConversationId: null,
      addConversation: (conv) => set(s => ({ conversations: [conv, ...s.conversations] })),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      addMessage: (convId, msg) => set(s => ({
        conversations: s.conversations.map(c =>
          c.id === convId
            ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
            : c
        )
      })),
      updateMessage: (convId, msgId, updates) => set(s => ({
        conversations: s.conversations.map(c =>
          c.id === convId
            ? { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, ...updates } : m) }
            : c
        )
      })),
      getActiveConversation: () => {
        const s = get()
        return s.conversations.find(c => c.id === s.activeConversationId)
      },

      orchestrationSteps: [],
      setOrchestrationSteps: (steps) => set({ orchestrationSteps: steps }),
      updateOrchestrationStep: (phase, updates) => set(s => ({
        orchestrationSteps: s.orchestrationSteps.map(step =>
          step.phase === phase ? { ...step, ...updates } : step
        )
      })),
      isOrchestrating: false,
      setIsOrchestrating: (v) => set({ isOrchestrating: v }),

      metrics: {
        totalConversations: 0,
        totalMessages: 0,
        agentsActivated: 0,
        tasksCompleted: 0,
        tokensUsed: 0,
      },
      incrementMetric: (key, by = 1) => set(s => ({
        metrics: { ...s.metrics, [key]: s.metrics[key] + by }
      })),

      products: [],
      addProduct: (p) => set(s => ({ products: [p, ...s.products] })),
      updateProduct: (id, updates) => set(s => ({
        products: s.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      suppliers: [
        { id: 's1', name: 'AgroTech Venezuela', category: 'Insumos Agrícolas', location: 'Caracas, VE', contact: { email: 'ventas@agrotech.ve' }, capabilities: ['fertilizantes', 'pesticidas', 'semillas'], rating: 4.5, status: 'active' },
        { id: 's2', name: 'Maquinaria Industrial CR', category: 'Maquinaria', location: 'San José, CR', contact: { email: 'info@maquinariaindustrial.cr' }, capabilities: ['tractores', 'cosechadoras', 'riego'], rating: 4.2, status: 'active' },
        { id: 's3', name: 'Suministros Latam', category: 'Materias Primas', location: 'Bogotá, CO', contact: { email: 'compras@suministroslatam.co' }, capabilities: ['acero', 'plásticos', 'empaques'], rating: 4.0, status: 'active' },
      ],
      addSupplier: (s) => set(st => ({ suppliers: [s, ...st.suppliers] })),

      clients: [
        { id: 'c1', name: 'Hacienda Santa Bárbara', company: 'HSB Agro C.A.', industry: 'Agroindustria', contact: { email: 'gerencia@hsb.ve' }, status: 'active' },
        { id: 'c2', name: 'Grupo Industrial Torrealba', company: 'GIT S.A.', industry: 'Manufactura', contact: { email: 'compras@git.com' }, status: 'prospect' },
      ],
      addClient: (c) => set(s => ({ clients: [c, ...s.clients] })),
      updateClient: (id, updates) => set(s => ({
        clients: s.clients.map(c => c.id === id ? { ...c, ...updates } : c)
      })),

      orders: [
        { id: 'o1', clientName: 'Hacienda Santa Bárbara', productName: 'Sistema de Riego Automatizado', quantity: 1, status: 'production', specifications: { area: '500 ha', tipo: 'goteo' }, timeline: { start: '2026-04-01', delivery: '2026-07-01' }, createdAt: Date.now() - 86400000 * 30 },
      ],
      addOrder: (o) => set(s => ({ orders: [o, ...s.orders] })),
      updateOrder: (id, updates) => set(s => ({
        orders: s.orders.map(o => o.id === id ? { ...o, ...updates } : o)
      })),

      dynamicAgents: [],
      addDynamicAgent: (name) => set(s => ({
        dynamicAgents: s.dynamicAgents.includes(name) ? s.dynamicAgents : [...s.dynamicAgents, name]
      })),

      sidebarOpen: true,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
    }),
    {
      name: 'genesus-store-v3',
      partialize: (state) => ({
        userName: state.userName,
        conversations: state.conversations.slice(0, 20),
        metrics: state.metrics,
        products: state.products,
        suppliers: state.suppliers,
        clients: state.clients,
        orders: state.orders,
        dynamicAgents: state.dynamicAgents,
      }),
    }
  )
)
