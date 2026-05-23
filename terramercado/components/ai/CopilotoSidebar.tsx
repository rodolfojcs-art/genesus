"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, ArrowUp, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductoSugerido {
  product_id: string;
  nombre: string;
  razon: string;
}

interface CopilotoMessage {
  id: string;
  rol: "user" | "copiloto";
  contenido: string;
  productosSugeridos?: ProductoSugerido[];
  advertenciasRegulatorias?: string[];
  requiereExpertoHumano?: boolean;
}

interface CopilotoOutput {
  respuesta: string;
  productosSugeridos: ProductoSugerido[];
  advertenciasRegulatorias: string[];
  requiereExpertoHumano: boolean;
  conversationId?: string;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-[#94a3b8] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function CopilotoSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotoMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setError(null);
    setInput("");

    const userMsg: CopilotoMessage = {
      id: `u-${Date.now()}`,
      rol: "user",
      contenido: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ia/copiloto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: trimmed, conversationId }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      const data = (await res.json()) as CopilotoOutput;

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const copilotoMsg: CopilotoMessage = {
        id: `c-${Date.now()}`,
        rol: "copiloto",
        contenido: data.respuesta,
        productosSugeridos: data.productosSugeridos,
        advertenciasRegulatorias: data.advertenciasRegulatorias,
        requiereExpertoHumano: data.requiereExpertoHumano,
      };
      setMessages((prev) => [...prev, copilotoMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al conectar con el copiloto.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e4d8c] text-white shadow-lg hover:bg-[#1a3a6a] transition-all",
          open && "opacity-0 pointer-events-none"
        )}
        aria-label="Abrir Copiloto Agronómico"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col bg-white dark:bg-[#0d2240] shadow-2xl transition-transform duration-300",
          "w-full sm:w-[380px]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Copiloto Agronómico"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] bg-[#1e4d8c]">
          <Bot className="h-5 w-5 text-white" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-white">Copiloto Agronómico</p>
            <p className="text-[10px] text-[#93c5fd]">TerraMercado IA</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 text-white hover:bg-[#1a3a6a] rounded-md"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <Bot className="h-10 w-10 text-[#60a5f5] mx-auto" />
              <p className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
                ¿En qué te puedo ayudar hoy?
              </p>
              <p className="text-xs text-[#94a3b8]">
                Pregunta sobre plagas, enfermedades, fertilización, manejo de cultivos y más.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.rol === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2.5 space-y-2",
                  msg.rol === "user"
                    ? "bg-[#1e4d8c] text-white rounded-br-sm"
                    : "bg-[#f1f5f9] dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] rounded-bl-sm"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.contenido}</p>

                {/* Product pills */}
                {msg.productosSugeridos && msg.productosSugeridos.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {msg.productosSugeridos.map((p) => (
                      <Link key={p.product_id} href={`/producto/${p.product_id}`}>
                        <Badge className="text-[10px] px-1.5 py-0.5 bg-[#dbeafe] dark:bg-[#1e4d8c] text-[#1e4d8c] dark:text-[#93c5fd] border-0 hover:bg-[#bfdbfe] cursor-pointer">
                          {p.nombre}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Regulatory warnings */}
                {msg.advertenciasRegulatorias && msg.advertenciasRegulatorias.length > 0 && (
                  <div className="space-y-1">
                    {msg.advertenciasRegulatorias.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-2 py-1.5"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 dark:text-amber-400">{w}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Human expert button */}
                {msg.requiereExpertoHumano && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-[#1e4d8c] text-[#1e4d8c] dark:border-[#60a5f5] dark:text-[#60a5f5] h-7"
                  >
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Hablar con experto humano
                  </Button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-[#f1f5f9] dark:bg-[#1a3a6a]">
                <TypingIndicator />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-end gap-2 px-4 py-3 border-t border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta…"
            className="flex-1 resize-none rounded-xl border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] bg-[#f8fafc] dark:bg-[#1a3a6a] px-3 py-2 text-sm text-[#1e293b] dark:text-[#eff6ff] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] max-h-32 overflow-y-auto"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <Button
            type="button"
            size="icon"
            onClick={() => void handleSend()}
            disabled={!input.trim() || loading}
            className="h-9 w-9 rounded-full bg-[#1e4d8c] hover:bg-[#1a3a6a] text-white shrink-0"
            aria-label="Enviar"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
