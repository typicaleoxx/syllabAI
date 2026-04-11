"use client";

import { useState, useRef, useEffect } from "react";
import { Tone } from "@/lib/tone";
import { addCalendarTask } from "@/lib/storage";
import { getApiBaseUrl } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

interface Props {
  tone: Tone;
}

export default function Chat({ tone }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text:
        tone === "genz"
          ? "yo what's up bro. lowkey here to help you slay your deadlines. ask me anything about your schedule or like, life tips or whatever fr"
          : "Hey, I'm here to help with your schedule and give you advice. What do you want to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  function scheduleFromText(text: string) {
    const lower = text.toLowerCase();
    const isScheduleCommand =
      lower.startsWith("add to calendar:") ||
      lower.startsWith("schedule:") ||
      lower.startsWith("calendar:");

    if (!isScheduleCommand) return false;

    const cleaned = text
      .replace(/^add to calendar:|^schedule:|^calendar:/i, "")
      .trim();
    if (!cleaned) return false;

    const dateMatch = cleaned.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    const timeMatch = cleaned.match(/\b(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)\b/);
    const title = cleaned
      .replace(/\b(\d{4}-\d{2}-\d{2})\b/, "")
      .replace(/\b(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)\b/, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!dateMatch || !title) return false;

    addCalendarTask({
      id: `chat-${Date.now()}`,
      title,
      date: dateMatch[1],
      time: timeMatch?.[1] ?? "6:00 PM",
      notes: "Added from chat",
      source: "chat",
    });

    return true;
  }

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    if (scheduleFromText(input)) {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        text: input,
      };

      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          text:
            tone === "genz"
              ? "bet bro, i dropped that into the calendar"
              : "Got it. I added that to the calendar.",
        },
      ]);
      setInput("");
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          tone: tone === "genz" ? "genz" : "normal",
        }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: "ai", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "ai",
          text: "couldn't reach chat API. set NEXT_PUBLIC_API_BASE_URL to your deployed backend and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">
          {tone === "genz" ? "Chat with Your AI Coach" : "Ask AI"}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {tone === "genz"
            ? "lowkey i got all the vibes"
            : "Get help with your schedule"}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm">
              <span className="inline-block animate-pulse">typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            tone === "genz" ? "ask me anything bro..." : "Ask something..."
          }
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 transition-all">
          Send
        </button>
      </div>
      <div className="px-4 pb-4 text-[11px] text-gray-400">
        Tip: type <span className="font-semibold">add to calendar:</span> then a
        date like <span className="font-semibold">2026-04-15</span> and a time
        like <span className="font-semibold">6:00 PM</span>.
      </div>
    </div>
  );
}
