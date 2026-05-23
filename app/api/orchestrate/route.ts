import { anthropic } from '@/lib/anthropic'
import {
  buildOrchestratorPrompt,
  buildEngineerPrompt,
  buildSynthesizerPrompt,
  ORCHESTRATION_MODELS,
} from '@/lib/agents/genesus'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const { query, context } = await req.json()

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        const send = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        }

        try {
          // Phase 1 — Opus: Strategic Architecture
          send({ phase: 1, status: 'thinking', model: ORCHESTRATION_MODELS[0].model })
          const opusMsg = await anthropic.messages.create({
            model: ORCHESTRATION_MODELS[0].model,
            max_tokens: 800,
            messages: [{ role: 'user', content: buildOrchestratorPrompt(query, context) }],
          })
          const opusOut = opusMsg.content[0].type === 'text' ? opusMsg.content[0].text : ''
          send({ phase: 1, status: 'complete', output: opusOut })

          // Phase 2 — Sonnet: Technical Engineering
          send({ phase: 2, status: 'thinking', model: ORCHESTRATION_MODELS[1].model })
          const sonnetMsg = await anthropic.messages.create({
            model: ORCHESTRATION_MODELS[1].model,
            max_tokens: 900,
            messages: [{ role: 'user', content: buildEngineerPrompt(query, opusOut) }],
          })
          const sonnetOut = sonnetMsg.content[0].type === 'text' ? sonnetMsg.content[0].text : ''
          send({ phase: 2, status: 'complete', output: sonnetOut })

          // Phase 3 — Haiku: Final Synthesis
          send({ phase: 3, status: 'thinking', model: ORCHESTRATION_MODELS[2].model })
          const haikuMsg = await anthropic.messages.create({
            model: ORCHESTRATION_MODELS[2].model,
            max_tokens: 1500,
            messages: [{ role: 'user', content: buildSynthesizerPrompt(query, opusOut, sonnetOut) }],
          })
          const haikuOut = haikuMsg.content[0].type === 'text' ? haikuMsg.content[0].text : ''
          send({ phase: 3, status: 'complete', output: haikuOut })

          send({ done: true, finalOutput: haikuOut })
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (e) {
          send({ error: e instanceof Error ? e.message : 'Error en orquestación' })
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
