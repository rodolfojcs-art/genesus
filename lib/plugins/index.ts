import type { Tool, ToolResultBlockParam } from '@anthropic-ai/sdk/resources'

export type PluginId = 'calculator' | 'datetime' | 'unit_converter' | 'text_analyzer' | 'web_search'

export interface Plugin {
  id: PluginId
  name: string
  description: string
  icon: string
  requiresApiKey?: string
  tool: Tool
}

export const PLUGINS: Plugin[] = [
  {
    id: 'calculator',
    name: 'Calculadora',
    description: 'Evaluación de expresiones matemáticas y financieras',
    icon: '🧮',
    tool: {
      name: 'calculator',
      description: 'Evaluate mathematical expressions. Supports arithmetic, percentages, powers, and financial calculations.',
      input_schema: {
        type: 'object' as const,
        properties: {
          expression: { type: 'string', description: 'The mathematical expression to evaluate, e.g. "1500 * 0.15 + 200"' },
        },
        required: ['expression'],
      },
    },
  },
  {
    id: 'datetime',
    name: 'Fecha y Hora',
    description: 'Fecha, hora actual y cálculos de tiempo',
    icon: '🕐',
    tool: {
      name: 'datetime',
      description: 'Get current date and time, or calculate date differences and deadlines.',
      input_schema: {
        type: 'object' as const,
        properties: {
          timezone: { type: 'string', description: 'IANA timezone name, e.g. "America/Caracas". Defaults to UTC.' },
          operation: {
            type: 'string',
            enum: ['now', 'add_days', 'diff'],
            description: 'Operation: "now" for current time, "add_days" to add days to today, "diff" for days between dates',
          },
          date1: { type: 'string', description: 'ISO date string for add_days base or diff start' },
          date2: { type: 'string', description: 'ISO date string for diff end' },
          days: { type: 'number', description: 'Number of days to add (for add_days operation)' },
        },
        required: ['operation'],
      },
    },
  },
  {
    id: 'unit_converter',
    name: 'Conversión de Unidades',
    description: 'Convierte longitud, peso, temperatura, área, volumen',
    icon: '📐',
    tool: {
      name: 'unit_converter',
      description: 'Convert between units of measurement: length, weight, temperature, area, volume, and more.',
      input_schema: {
        type: 'object' as const,
        properties: {
          value: { type: 'number', description: 'The numeric value to convert' },
          from: { type: 'string', description: 'Source unit (e.g. "kg", "miles", "celsius", "hectares")' },
          to: { type: 'string', description: 'Target unit (e.g. "lb", "km", "fahrenheit", "acres")' },
        },
        required: ['value', 'from', 'to'],
      },
    },
  },
  {
    id: 'text_analyzer',
    name: 'Analizador de Texto',
    description: 'Cuenta palabras, tiempo de lectura, estadísticas de texto',
    icon: '📊',
    tool: {
      name: 'text_analyzer',
      description: 'Analyze text to get word count, reading time, sentence count, and key statistics.',
      input_schema: {
        type: 'object' as const,
        properties: {
          text: { type: 'string', description: 'The text to analyze' },
        },
        required: ['text'],
      },
    },
  },
  {
    id: 'web_search',
    name: 'Búsqueda Web',
    description: 'Busca información actualizada en internet (requiere TAVILY_API_KEY)',
    icon: '🌐',
    requiresApiKey: 'TAVILY_API_KEY',
    tool: {
      name: 'web_search',
      description: 'Search the web for current information, news, prices, and real-time data.',
      input_schema: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'The search query' },
          max_results: { type: 'number', description: 'Maximum number of results (1-5, default 3)' },
        },
        required: ['query'],
      },
    },
  },
]

// ── Executor ─────────────────────────────────────────────────────────────────

type ToolInput = Record<string, unknown>

function execCalculator(input: ToolInput): string {
  const expr = String(input.expression || '')
  try {
    // Safe eval: only allow numbers and math operators
    const sanitized = expr.replace(/[^0-9+\-*/().%^ ]/g, '')
    if (!sanitized) return 'Error: expresión inválida'
    // Use Function to evaluate safely (no globals)
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${sanitized})`)()
    if (typeof result !== 'number' || !isFinite(result)) return 'Error: resultado no numérico'
    return `Resultado: ${result.toLocaleString('es', { maximumFractionDigits: 10 })}`
  } catch {
    return `Error calculando: ${expr}`
  }
}

function execDatetime(input: ToolInput): string {
  const tz = String(input.timezone || 'UTC')
  const op = String(input.operation || 'now')
  try {
    if (op === 'now') {
      const now = new Date()
      const fmt = new Intl.DateTimeFormat('es', {
        timeZone: tz, dateStyle: 'full', timeStyle: 'long',
      })
      return fmt.format(now)
    }
    if (op === 'add_days') {
      const base = input.date1 ? new Date(String(input.date1)) : new Date()
      const days = Number(input.days || 0)
      base.setDate(base.getDate() + days)
      return base.toISOString().split('T')[0]
    }
    if (op === 'diff') {
      const d1 = new Date(String(input.date1))
      const d2 = new Date(String(input.date2))
      const diff = Math.round((d2.getTime() - d1.getTime()) / 86400000)
      return `${diff} días entre ${input.date1} y ${input.date2}`
    }
    return 'Operación no reconocida'
  } catch {
    return 'Error procesando fecha'
  }
}

const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  // to base unit (meters for length, kg for weight, etc.)
  m: { m: 1, km: 1000, cm: 0.01, mm: 0.001, miles: 1609.344, yards: 0.9144, feet: 0.3048, inches: 0.0254 },
  kg: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
  l: { l: 1, ml: 0.001, m3: 1000, gal: 3.78541, fl_oz: 0.0295735 },
  m2: { m2: 1, km2: 1e6, hectares: 10000, acres: 4046.86, ft2: 0.092903 },
}

const UNIT_GROUPS: Record<string, string> = {}
for (const [base, variants] of Object.entries(UNIT_CONVERSIONS)) {
  for (const unit of Object.keys(variants)) {
    UNIT_GROUPS[unit] = base
  }
}

function execUnitConverter(input: ToolInput): string {
  const value = Number(input.value)
  const from = String(input.from).toLowerCase()
  const to = String(input.to).toLowerCase()

  // Temperature special case
  if (['celsius', 'c', '°c'].includes(from) && ['fahrenheit', 'f', '°f'].includes(to)) {
    return `${value}°C = ${(value * 9 / 5 + 32).toFixed(2)}°F`
  }
  if (['fahrenheit', 'f', '°f'].includes(from) && ['celsius', 'c', '°c'].includes(to)) {
    return `${value}°F = ${((value - 32) * 5 / 9).toFixed(2)}°C`
  }
  if (['celsius', 'c'].includes(from) && ['kelvin', 'k'].includes(to)) {
    return `${value}°C = ${(value + 273.15).toFixed(2)}K`
  }

  const fromBase = UNIT_GROUPS[from]
  const toBase = UNIT_GROUPS[to]
  if (!fromBase || !toBase || fromBase !== toBase) {
    return `No se puede convertir de "${from}" a "${to}" — unidades incompatibles`
  }
  const baseValue = value * UNIT_CONVERSIONS[fromBase][from]
  const result = baseValue / UNIT_CONVERSIONS[fromBase][to]
  return `${value} ${from} = ${result.toLocaleString('es', { maximumFractionDigits: 6 })} ${to}`
}

function execTextAnalyzer(input: ToolInput): string {
  const text = String(input.text || '')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const chars = text.length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length
  const readingMinutes = Math.ceil(words / 200)
  return JSON.stringify({ words, characters: chars, sentences, paragraphs, estimated_reading_time: `${readingMinutes} min` }, null, 2)
}

async function execWebSearch(input: ToolInput): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return 'Búsqueda web no disponible: configura TAVILY_API_KEY en el entorno.'
  const query = String(input.query || '')
  const maxResults = Math.min(Number(input.max_results || 3), 5)
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, max_results: maxResults, search_depth: 'basic' }),
    })
    const data = await res.json()
    if (!data.results?.length) return 'Sin resultados.'
    return data.results.map((r: { title: string; url: string; content: string }) =>
      `**${r.title}**\n${r.url}\n${r.content}`
    ).join('\n\n---\n\n')
  } catch {
    return 'Error al realizar la búsqueda.'
  }
}

export async function executeTool(name: string, input: ToolInput): Promise<ToolResultBlockParam> {
  let content: string
  try {
    switch (name) {
      case 'calculator':    content = execCalculator(input); break
      case 'datetime':      content = execDatetime(input); break
      case 'unit_converter': content = execUnitConverter(input); break
      case 'text_analyzer': content = execTextAnalyzer(input); break
      case 'web_search':    content = await execWebSearch(input); break
      default:              content = `Tool "${name}" not found`
    }
  } catch (e) {
    content = `Error executing tool: ${e instanceof Error ? e.message : String(e)}`
  }
  return { type: 'tool_result', tool_use_id: '', content }
}

export function getEnabledTools(pluginIds: PluginId[]): Tool[] {
  return PLUGINS
    .filter(p => pluginIds.includes(p.id))
    .map(p => p.tool)
}
