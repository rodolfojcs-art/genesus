import Anthropic from '@anthropic-ai/sdk'
import type { Model } from '@/types'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const MODELS: Record<string, Model> = {
  opus: 'claude-opus-4-6',
  sonnet: 'claude-sonnet-4-6',
  haiku: 'claude-haiku-4-5-20251001',
}

export function selectModel(text: string): Model {
  const t = text.toLowerCase()
  const words = t.split(/\s+/).length

  const opusKw = ['estrategia', 'análisis profundo', 'modelo financiero', 'plan de negocio',
    'inversión', 'valoración', 'due diligence', 'estructura corporativa', 'geopolítica',
    'infraestructura', 'plan operacional', 'presupuesto anual']
  if (opusKw.some(k => t.includes(k)) || words > 120) return MODELS.opus

  const haikuKw = ['hola', 'gracias', 'ok', 'sí', 'no', 'bien', 'perfecto',
    'entendido', 'claro', 'qué hora', 'qué día', 'define', 'qué es']
  if ((haikuKw.some(k => t.includes(k)) && words < 15) || words < 6) return MODELS.haiku

  return MODELS.sonnet
}

export function modelLabel(model: string): string {
  if (model.includes('haiku')) return 'HAIKU'
  if (model.includes('opus')) return 'OPUS'
  return 'SONNET'
}
