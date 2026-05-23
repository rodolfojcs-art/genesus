export type AgentType = 'genesus' | 'supreme_director' | 'director' | 'specialist'
export type AgentStatus = 'idle' | 'thinking' | 'active' | 'complete' | 'error'
export type MessageRole = 'user' | 'assistant'
export type TaskStatus = 'pending' | 'processing' | 'complete' | 'failed'
export type OrderStatus = 'draft' | 'quoted' | 'approved' | 'production' | 'delivered'
export type Model = 'claude-opus-4-6' | 'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001'

export interface Division {
  id: number
  name: string
  code: string
  color: string
  icon: string
  agentCount: number
  subAgentCount: number
  departments: Department[]
}

export interface Department {
  id: string
  name: string
  divisionId: number
  divisionName: string
  description: string
  agentCount: number
  keywords: string[]
}

export interface Agent {
  id: string
  name: string
  type: AgentType
  division: string
  department?: string
  model: Model
  status: AgentStatus
  systemPrompt: string
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  model?: Model
  agentsUsed?: string[]
  timestamp: number
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface OrchestrationStep {
  phase: 1 | 2 | 3
  model: Model
  modelName: string
  status: AgentStatus
  output?: string
  role: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignedAgents: string[]
  result?: string
  createdAt: number
  completedAt?: number
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  specifications: Record<string, string>
  status: 'design' | 'prototype' | 'production' | 'delivered'
  createdAt: number
}

export interface Supplier {
  id: string
  name: string
  category: string
  location: string
  contact: { email?: string; phone?: string; web?: string }
  capabilities: string[]
  rating: number
  status: 'active' | 'inactive'
}

export interface Client {
  id: string
  name: string
  company?: string
  industry?: string
  contact: { email?: string; phone?: string }
  status: 'active' | 'prospect' | 'inactive'
  notes?: string
}

export interface FactoryOrder {
  id: string
  clientName: string
  productName: string
  quantity: number
  status: OrderStatus
  specifications: Record<string, string>
  timeline: { start?: string; delivery?: string }
  createdAt: number
}

export interface GenesusMetrics {
  totalConversations: number
  totalMessages: number
  agentsActivated: number
  tasksCompleted: number
  tokensUsed: number
}
