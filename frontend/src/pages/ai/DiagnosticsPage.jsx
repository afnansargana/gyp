import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, Wrench } from "lucide-react";
import { Button } from "../../Components/ui";
import { apiClient } from "../../lib/api/client";
import { useAuthStore } from "../../store/useAuthStore";

function TypingDots() {
  return (
    <div className="flex gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-brand-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

export default function DiagnosticsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      text: "Describe the symptom — for example “rattling noise when braking”. I’ll suggest likely causes and the right service to book.",
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (preset) => {
    const symptoms = (preset || input).trim();
    if (symptoms.length < 8 || busy) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/ai-diagnostics" } });
      return;
    }

    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: symptoms }]);
    setBusy(true);
    try {
      const { data } = await apiClient.post("/ai/analyze", { symptoms });
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          text: data.summary,
          issues: data.issues,
          service: data.recommendedService,
          source: data.source,
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: "ai",
          text: err.message || "Diagnostics are temporarily unavailable.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mesh-dark px-4 py-10 text-ink-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> AI Smart Diagnostics
          </p>
          <h1 className="font-display text-3xl font-bold text-ink-50">
            Symptom Analyzer
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            On-device workshop intelligence with a catalog-aware booking shortcut.
          </p>
        </div>

        <div className="glass-panel-strong flex h-[560px] flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
              >
                {msg.role === "ai" && (
                  <div className="mb-2 flex items-center gap-2 text-brand-300">
                    <Bot className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide">
                      AutoFix AI
                    </span>
                  </div>
                )}
                <p>{msg.text}</p>
                {msg.issues?.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {msg.issues.map((issue) => (
                      <li
                        key={issue.title}
                        className="rounded-xl border border-ink-700 bg-ink-950/40 px-3 py-2"
                      >
                        <p className="text-sm font-semibold text-ink-50">{issue.title}</p>
                        <p className="text-xs text-ink-400">{issue.detail}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {msg.service?.name && (
                  <Link
                    to="/appointmentForm"
                    state={{ serviceId: msg.service.id, serviceName: msg.service.name }}
                    className="btn-primary mt-4 w-full"
                  >
                    <Wrench className="h-4 w-4" />
                    Book {msg.service.name}
                  </Link>
                )}
              </motion.div>
            ))}
            <AnimatePresence>
              {busy && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="chat-bubble-ai"
                >
                  <TypingDots />
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-ink-800 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {["Rattling noise when braking", "Car overheats in traffic", "Won't start, just clicking"].map(
                (chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    className="rounded-full border border-ink-700 px-3 py-1 text-xs text-ink-300 hover:border-brand-500/40 hover:text-brand-300"
                  >
                    {chip}
                  </button>
                )
              )}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type the symptom…"
                className="input-field"
              />
              <Button type="submit" disabled={busy || input.trim().length < 8}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
