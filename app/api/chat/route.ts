import { anthropic, selectModel } from '@/lib/anthropic'
import { buildSystemPrompt } from '@/lib/agents/genesus'
import { getEnabledTools, executeTool, type PluginId } from '@/lib/plugins'
import type { MessageParam, ToolUseBlock } from '@anthropic-ai/sdk/resources'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { messages, userName, dynamicAgents, enabledPlugins = [] } = await req.json()

    const lastMessage = messages[messages.length - 1]?.content || ''
    const model = selectModel(lastMessage)
    const systemPrompt = buildSystemPrompt(userName || 'Usuario', dynamicAgents || [])
    const tools = getEnabledTools(enabledPlugins as PluginId[])

    const history: MessageParam[] = messages.slice(-14).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const send = (data: object) =>
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

          let currentMessages = [...history]

          // Agentic loop — keeps running while Claude wants to use tools
          while (true) {
            const params: Parameters<typeof anthropic.messages.stream>[0] = {
              model,
              max_tokens: 2048,
              system: systemPrompt,
              messages: currentMessages,
            }
            if (tools.length > 0) params.tools = tools

            const stream = anthropic.messages.stream(params)
            let fullText = ''
            const toolUseBlocks: ToolUseBlock[] = []

            for await (const chunk of stream) {
              if (chunk.type === 'content_block_start' && chunk.content_block.type === 'tool_use') {
                // Signal that a tool call is starting
                send({ tool_call: { name: chunk.content_block.name, id: chunk.content_block.id } })
              }
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                fullText += chunk.delta.text
                send({ text: chunk.delta.text, model })
              }
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'input_json_delta') {
                // Tool input streaming — collected by final message
              }
            }

            const finalMsg = await stream.finalMessage()

            // Collect tool use blocks from the final message
            for (const block of finalMsg.content) {
              if (block.type === 'tool_use') toolUseBlocks.push(block)
            }

            // If no tool calls, we're done
            if (toolUseBlocks.length === 0 || finalMsg.stop_reason !== 'tool_use') {
              send({ done: true })
              break
            }

            // Execute tools and continue the loop
            currentMessages = [
              ...currentMessages,
              { role: 'assistant', content: finalMsg.content },
            ]

            const toolResults = await Promise.all(
              toolUseBlocks.map(async (tb) => {
                const result = await executeTool(tb.name, tb.input as Record<string, unknown>)
                send({
                  tool_result: {
                    name: tb.name,
                    result: typeof result.content === 'string' ? result.content : JSON.stringify(result.content),
                  },
                })
                return { ...result, tool_use_id: tb.id }
              })
            )

            currentMessages.push({
              role: 'user',
              content: toolResults,
            })
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (e) {
          controller.error(e)
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
