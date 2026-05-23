"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "./actions";
import type { Profile } from "@/types";

interface Message {
  id: string;
  contenido: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  leido: boolean;
  product_id: string | null;
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  otherUser: Pick<Profile, "id" | "nombre" | "apellido" | "avatar_url">;
  productId?: string;
}

function Initials({ name }: { name: string }) {
  const parts = name.split(" ");
  const initials =
    parts.length >= 2
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`
      : parts[0].charAt(0);
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e4d8c] text-xs font-semibold text-white uppercase">
      {initials}
    </span>
  );
}

export function MessageThread({
  messages: initialMessages,
  currentUserId,
  otherUser,
  productId,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setError(null);
    setSending(true);

    // Optimistic update
    const optimistic: Message = {
      id: `optimistic-${Date.now()}`,
      contenido: trimmed,
      sender_id: currentUserId,
      receiver_id: otherUser.id,
      created_at: new Date().toISOString(),
      leido: false,
      product_id: productId ?? null,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    const result = await sendMessageAction(otherUser.id, trimmed, productId);
    setSending(false);

    if (!result.success) {
      // Revert optimistic update
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(trimmed);
      setError(result.error ?? "Error al enviar.");
    } else if (result.message) {
      // Replace optimistic with real message
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? (result.message as Message) : m))
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  const otherName = `${otherUser.nombre} ${otherUser.apellido}`;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] bg-white dark:bg-[#0d2240]">
        {otherUser.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={otherUser.avatar_url}
            alt={otherName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <Initials name={otherName} />
        )}
        <span className="font-medium text-sm text-[#1e293b] dark:text-[#eff6ff]">
          {otherName}
        </span>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              {!isOwn && <Initials name={otherName} />}
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 mx-2 ${
                  isOwn
                    ? "bg-[#1e4d8c] text-white rounded-br-sm"
                    : "bg-[#f1f5f9] dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] rounded-bl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.contenido}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isOwn ? "text-[#93c5fd]" : "text-[#94a3b8]"
                  } text-right`}
                >
                  {format(new Date(msg.created_at), "HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="px-4 pb-1 text-xs text-red-500">{error}</p>
      )}

      {/* Input bar */}
      <div className="flex items-end gap-2 px-4 py-3 border-t border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] bg-white dark:bg-[#0d2240]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje…"
          className="flex-1 resize-none rounded-xl border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] bg-[#f8fafc] dark:bg-[#1a3a6a] px-3 py-2 text-sm text-[#1e293b] dark:text-[#eff6ff] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] max-h-32 overflow-y-auto"
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />
        <Button
          type="button"
          size="icon"
          onClick={() => void handleSend()}
          disabled={!input.trim() || sending}
          className="h-9 w-9 rounded-full bg-[#1e4d8c] hover:bg-[#1a3a6a] text-white shrink-0"
          aria-label="Enviar"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
