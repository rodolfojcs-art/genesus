'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useGenesusStore } from '@/stores/genesus-store'
import { detectActiveAgents } from '@/lib/agents/genesus'
import { modelLabel } from '@/lib/models'
import { PLUGINS } from '@/lib/plugins'
import type { Message, OrchestrationStep, ToolCall } from '@/types'
import { clsx } from 'clsx'

function renderContent(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^#{1,3} (.+)$/gm, '<h3>$1</h3>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[^]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n/g, '<br>')
}

const TOOL_ICONS: Record<string, string> = {
  calculator: '🧮',
  datetime: '🕐',
  unit_converter: '📐',
  text_analyzer: '📊',
  web_search: '🌐',
}

function ToolCallChips({ toolCalls }: { toolCalls: ToolCall[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  if (!toolCalls.length) return null
  return (
    <div className="flex flex-col gap-1 mb-2">
      {toolCalls.map(tc => (
        <div key={tc.id}>
          <button
            onClick={() => setExpanded(expanded === tc.id ? null : tc.id)}
            className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-white transition-colors"
          >
            <span>{TOOL_ICONS[tc.name] || '🔧'}</span>
            <span>{tc.name}</span>
            {tc.result && <span className="text-[var(--acc4)]">✓</span>}
            <span className="ml-1 opacity-50">{expanded === tc.id ? '▲' : '▼'}</span>
          </button>
          {expanded === tc.id && tc.result && (
            <div className="mt-1 ml-2 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono text-[var(--muted)] whitespace-pre-wrap max-h-32 overflow-y-auto">
              {tc.result}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function OrchestrationPanel({ steps, isRunning }: { steps: OrchestrationStep[]; isRunning: boolean }) {
  if (!isRunning && steps.length === 0) return null
  return (
    <div className="mx-4 mb-3 p-3 bg-[var(--surface2)] border border-[var(--border)] rounded-xl">
      <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest mb-2">Pipeline Multi-Agente</div>
      <div className="flex gap-2">
        {steps.map((step, i) => {
          const colors = ['text-[var(--gold)]', 'text-[var(--accent)]', 'text-[var(--acc2)]']
          const icons = ['⚡', '⚙️', '🎯']
          const labels = ['OPUS', 'SONNET', 'HAIKU']
          return (
            <div key={step.phase} className="flex-1 flex flex-col gap-1">
              <div className={clsx('flex items-center gap-1.5', colors[i])}>
                <span className="text-sm">{icons[i]}</span>
                <span className="text-[10px] font-mono font-bold">{labels[i]}</span>
                {step.status === 'thinking' && (
                  <div className="flex gap-0.5 ml-auto">
                    {[0,1,2].map(j => (
                      <div key={j} className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                    ))}
                  </div>
                )}
                {step.status === 'complete' && <span className="ml-auto text-[var(--acc4)]">✓</span>}
              </div>
              {step.status !== 'idle' && (
                <div className={clsx(
                  'h-1 rounded-full transition-all duration-500',
                  step.status === 'complete' ? 'bg-[var(--acc4)]' : 'bg-current opacity-50 animate-pulse',
                  colors[i].replace('text-', 'bg-').split('[')[1]?.split(']')[0] || ''
                )} style={{ background: step.status === 'complete' ? 'var(--acc4)' : undefined }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  const label = msg.model ? modelLabel(msg.model) : null
  const time = new Date(msg.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={clsx('flex flex-col gap-1 max-w-[85%] animate-msg-in', isUser ? 'self-end items-end' : 'self-start items-start')}>
      {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
        <ToolCallChips toolCalls={msg.toolCalls} />
      )}
      <div className={clsx(
        'px-4 py-3 rounded-2xl text-sm leading-relaxed',
        isUser
          ? 'bg-gradient-to-br from-[var(--accent)] to-purple-700 text-white rounded-br-sm'
          : 'bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] rounded-bl-sm'
      )}>
        {isUser ? (
          <span className="whitespace-pre-wrap">{msg.content}</span>
        ) : (
          <div
            className="prose-chat"
            dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
          />
        )}
        {msg.isStreaming && (
          <span className="inline-block w-2 h-4 bg-[var(--accent)] animate-pulse ml-1 align-middle rounded-sm" />
        )}
      </div>
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] font-mono text-[var(--muted)]">{time}</span>
        {label && (
          <span className={clsx(
            'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded',
            label === 'OPUS' && 'text-[var(--gold)] bg-yellow-900/20',
            label === 'SONNET' && 'text-[var(--accent)] bg-purple-900/20',
            label === 'HAIKU' && 'text-[var(--acc4)] bg-green-900/20',
          )}>
            ◈ {label}
          </span>
        )}
        {msg.agentsUsed && msg.agentsUsed.length > 0 && (
          <span className="text-[9px] font-mono text-[var(--muted)]">
            [{msg.agentsUsed.join(', ')}]
          </span>
        )}
      </div>
    </div>
  )
}

function PluginsPanel({ onClose }: { onClose: () => void }) {
  const { enabledPlugins, togglePlugin } = useGenesusStore()
  return (
    <div className="mx-4 mb-3 p-3 bg-[var(--surface2)] border border-[var(--accent)]/30 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">Plugins — Herramientas del Agente</div>
        <button onClick={onClose} className="text-[var(--muted)] hover:text-white text-xs">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {PLUGINS.map(plugin => {
          const enabled = enabledPlugins.includes(plugin.id)
          return (
            <button
              key={plugin.id}
              onClick={() => togglePlugin(plugin.id)}
              className={clsx(
                'flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all',
                enabled
                  ? 'border-[var(--accent)]/60 bg-[var(--accent)]/10 text-white'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-white'
              )}
            >
              <span className="text-base flex-shrink-0">{plugin.icon}</span>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold truncate">{plugin.name}</div>
                <div className="text-[9px] font-mono text-[var(--muted)] truncate">{plugin.description}</div>
              </div>
              <div className={clsx(
                'ml-auto w-3 h-3 rounded-full flex-shrink-0 border transition-all',
                enabled ? 'bg-[var(--acc4)] border-[var(--acc4)]' : 'bg-transparent border-[var(--muted)]'
              )} />
            </button>
          )
        })}
      </div>
      {enabledPlugins.length > 0 && (
        <div className="mt-2 text-[9px] font-mono text-[var(--acc4)]">
          {enabledPlugins.length} plugin{enabledPlugins.length > 1 ? 's' : ''} activo{enabledPlugins.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default function ChatConsole() {
  const {
    conversations, activeConversationId, addConversation,
    setActiveConversation, addMessage, updateMessage,
    getActiveConversation, userName, dynamicAgents,
    orchestrationSteps, setOrchestrationSteps, updateOrchestrationStep,
    isOrchestrating, setIsOrchestrating,
    incrementMetric, addDynamicAgent,
    enabledPlugins,
  } = useGenesusStore()

  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [useOrchestration, setUseOrchestration] = useState(false)
  const [showPlugins, setShowPlugins] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeConv = getActiveConversation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages])

  const createNewConversation = useCallback(() => {
    const id = crypto.randomUUID()
    const conv = { id, title: 'Nueva conversación', messages: [], createdAt: Date.now(), updatedAt: Date.now() }
    addConversation(conv)
    setActiveConversation(id)
    incrementMetric('totalConversations')
    return id
  }, [addConversation, setActiveConversation, incrementMetric])

  useEffect(() => {
    if (!activeConversationId && conversations.length === 0) {
      createNewConversation()
    } else if (!activeConversationId && conversations.length > 0) {
      setActiveConversation(conversations[0].id)
    }
  }, [])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isThinking) return
    setInput('')

    let convId = activeConversationId
    if (!convId) convId = createNewConversation()

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() }
    addMessage(convId, userMsg)
    incrementMetric('totalMessages')

    const agents = detectActiveAgents(text)
    if (agents.length > 0) {
      agents.forEach(a => addDynamicAgent(a))
      incrementMetric('agentsActivated', agents.length)
    }

    if (useOrchestration) {
      await runOrchestration(convId, text, agents)
    } else {
      await runChat(convId, text, agents)
    }
  }

  async function runChat(convId: string, text: string, agents: string[]) {
    setIsThinking(true)
    const msgId = crypto.randomUUID()
    const assistantMsg: Message = {
      id: msgId, role: 'assistant', content: '', timestamp: Date.now(),
      isStreaming: true, toolCalls: [],
    }
    addMessage(convId, assistantMsg)

    try {
      const conv = conversations.find(c => c.id === convId)
      const history = (conv?.messages || []).slice(-14).map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: text }],
          userName, dynamicAgents, enabledPlugins,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Error en la respuesta')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let model
      const toolCalls: ToolCall[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const raw = line.slice(6)
          if (raw === '[DONE]') break
          try {
            const data = JSON.parse(raw)
            if (data.text) {
              fullText += data.text
              model = data.model
            }
            if (data.tool_call) {
              toolCalls.push({ id: data.tool_call.id, name: data.tool_call.name })
            }
            if (data.tool_result) {
              const tc = toolCalls.find(t => t.name === data.tool_result.name && !t.result)
              if (tc) tc.result = data.tool_result.result
            }
            updateMessage(convId, msgId, { content: fullText, model, isStreaming: true, agentsUsed: agents, toolCalls: [...toolCalls] })
          } catch { /* skip */ }
        }
      }
      updateMessage(convId, msgId, { isStreaming: false, agentsUsed: agents, toolCalls: [...toolCalls] })
      incrementMetric('totalMessages')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      updateMessage(convId, msgId, { content: `⚠️ ${msg}`, isStreaming: false })
    } finally {
      setIsThinking(false)
    }
  }

  async function runOrchestration(convId: string, text: string, agents: string[]) {
    setIsOrchestrating(true)
    const initSteps: OrchestrationStep[] = [
      { phase: 1, model: 'claude-opus-4-6', modelName: 'Claude Opus 4', status: 'idle', role: 'ARQUITECTO ESTRATÉGICO' },
      { phase: 2, model: 'claude-sonnet-4-6', modelName: 'Claude Sonnet 4', status: 'idle', role: 'INGENIERO TÉCNICO' },
      { phase: 3, model: 'claude-haiku-4-5-20251001', modelName: 'Claude Haiku', status: 'idle', role: 'SINTETIZADOR FINAL' },
    ]
    setOrchestrationSteps(initSteps)

    const msgId = crypto.randomUUID()
    const msg: Message = { id: msgId, role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true, agentsUsed: agents }
    addMessage(convId, msg)

    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      })
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const raw = line.slice(6)
          if (raw === '[DONE]') break
          try {
            const data = JSON.parse(raw)
            if (data.phase) {
              updateOrchestrationStep(data.phase, { status: data.status, output: data.output })
            }
            if (data.done && data.finalOutput) {
              updateMessage(convId, msgId, { content: data.finalOutput, isStreaming: false, model: 'claude-haiku-4-5-20251001' })
            }
            if (data.error) {
              updateMessage(convId, msgId, { content: `⚠️ ${data.error}`, isStreaming: false })
            }
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Error'
      updateMessage(convId, msgId, { content: `⚠️ ${m}`, isStreaming: false })
    } finally {
      setIsOrchestrating(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const messages = activeConv?.messages || []

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]/60">
        <div className="flex-1 flex gap-2 overflow-x-auto pb-1">
          {conversations.slice(0, 8).map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={clsx(
                'flex-shrink-0 text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all',
                conv.id === activeConversationId
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-white'
              )}
            >
              {conv.title.slice(0, 20)}
            </button>
          ))}
        </div>
        <button
          onClick={createNewConversation}
          className="flex-shrink-0 text-[11px] font-mono text-[var(--muted)] hover:text-white px-2 py-1.5 border border-dashed border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-all"
        >
          + Nueva
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12">
            <div className="w-24 h-24 rounded-full border-2 border-[var(--accent)] flex items-center justify-center text-4xl font-black text-[var(--accent)] shadow-[0_0_60px_var(--glow)] animate-[orbPulse_3s_ease-in-out_infinite]">
              G
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-white mb-1">Hola, {userName}</div>
              <div className="text-sm text-[var(--muted)]">10,011 agentes listos. ¿Qué construimos hoy?</div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-md w-full">
              {[
                '¿Cuánto es 1500 hectáreas en acres?',
                'Analiza el mercado de real estate en Venezuela',
                'Crea un plan financiero para Cadet Holdings',
                '¿Qué fecha es en 90 días desde hoy?',
              ].map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus() }}
                  className="text-left text-xs text-[var(--muted)] p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-white hover:bg-[var(--surface2)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {isThinking && !isOrchestrating && (
          <div className="self-start flex items-center gap-2 px-4 py-3 bg-[var(--surface2)] rounded-2xl border border-[var(--border)]">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Orchestration panel */}
      <OrchestrationPanel steps={orchestrationSteps} isRunning={isOrchestrating} />

      {/* Plugins panel */}
      {showPlugins && <PluginsPanel onClose={() => setShowPlugins(false)} />}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] bg-[var(--surface)]/60">
        {/* Mode toggle + plugin button */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setUseOrchestration(false)}
            className={clsx('text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all', !useOrchestration ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] text-[var(--muted)]')}
          >
            ⚡ Chat directo
          </button>
          <button
            onClick={() => setUseOrchestration(true)}
            className={clsx('text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all', useOrchestration ? 'border-[var(--gold)] text-[var(--gold)] bg-yellow-900/10' : 'border-[var(--border)] text-[var(--muted)]')}
          >
            🔱 Pipeline Opus→Sonnet→Haiku
          </button>
          <button
            onClick={() => setShowPlugins(v => !v)}
            className={clsx(
              'ml-auto text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all flex items-center gap-1',
              showPlugins || enabledPlugins.length > 0
                ? 'border-[var(--acc2)] text-[var(--acc2)] bg-[var(--acc2)]/10'
                : 'border-[var(--border)] text-[var(--muted)]'
            )}
          >
            🔌 Plugins{enabledPlugins.length > 0 && <span className="bg-[var(--acc2)] text-black rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">{enabledPlugins.length}</span>}
          </button>
        </div>

        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta a GENESUS... (Enter para enviar, Shift+Enter nueva línea)"
            disabled={isThinking || isOrchestrating}
            rows={1}
            className="flex-1 resize-none bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors font-sans disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ minHeight: '48px' }}
            onInput={e => {
              const t = e.currentTarget
              t.style.height = 'auto'
              t.style.height = Math.min(t.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isThinking || isOrchestrating}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-700 text-white flex items-center justify-center text-lg disabled:opacity-40 hover:shadow-lg hover:shadow-purple-900/50 transition-all flex-shrink-0"
          >
            {isThinking || isOrchestrating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}
