import { useState } from "react";
import { Calculator, X, MessageCircle, Send, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const SERVICES = [
  { id: "web", label: "Website Development", base: 4500 },
  { id: "uiux", label: "UI/UX Design", base: 3500 },
  { id: "cms", label: "CMS Website", base: 3800 },
  { id: "mobile", label: "Mobile App", base: 12000 },
  { id: "saas", label: "SaaS Product", base: 18000 },
  { id: "ecom", label: "Ecommerce", base: 8500 },
  { id: "brand", label: "Brand Identity", base: 4200 },
  { id: "care", label: "Monthly Care", base: 800 },
];

export function CostCalculator() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(["web"]);
  const [pages, setPages] = useState(8);
  const [complexity, setComplexity] = useState<"low" | "med" | "high">("med");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
      );
    }
  }, [open]);

  const factor = complexity === "low" ? 0.8 : complexity === "high" ? 1.6 : 1;
  const base = selected.reduce(
    (sum, id) => sum + (SERVICES.find((s) => s.id === id)?.base ?? 0),
    0,
  );
  const pageAdd = Math.max(0, pages - 5) * 350;
  const total = Math.round((base + pageAdd) * factor);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {open && (
        <div
          ref={panelRef}
          className="mb-3 w-[360px] max-h-[70vh] overflow-auto glass-strong rounded-2xl p-5 shadow-panel"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-lime to-gold">
                <Calculator className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-display text-base font-semibold">Cost Estimator</h4>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Approximate quote
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-2">Services</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {SERVICES.map((s) => {
              const on = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={`text-xs rounded-full px-3 py-1.5 border transition ${
                    on
                      ? "bg-lime text-lime-foreground border-lime"
                      : "border-white/10 text-foreground/70 hover:bg-white/5"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Pages / screens</span>
              <span className="font-semibold">{pages}</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full accent-lime"
            />
          </div>

          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1.5">Complexity</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(["low", "med", "high"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setComplexity(c)}
                  className={`text-xs rounded-lg py-2 border capitalize ${
                    complexity === c
                      ? "bg-white/10 border-white/20"
                      : "border-white/5 hover:bg-white/5"
                  }`}
                >
                  {c === "med" ? "Medium" : c}
                </button>
              ))}
            </div>
          </div>

          <div className="gradient-card rounded-xl p-4 mb-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Estimated
            </p>
            <div className="mt-1 font-display text-3xl font-semibold text-gradient-lime">
              ${total.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Final pricing depends on scope. Book a call for a firm quote.
            </p>
          </div>
          <a
            href="/contact"
            className="block text-center rounded-full bg-lime px-4 py-2.5 text-sm font-semibold text-lime-foreground"
          >
            Get exact quote
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-full bg-lime pl-4 pr-5 py-3 text-sm font-semibold text-lime-foreground shadow-panel hover:brightness-110 transition"
      >
        <Calculator className="h-4 w-4" />
        Cost Calculator
      </button>
    </div>
  );
}

type Msg = { role: "user" | "bot"; text: string };

const BOT_KB: { k: string[]; a: string }[] = [
  {
    k: ["price", "cost", "budget", "how much"],
    a: "Budgets typically range: sites $4.5k–$25k, mobile apps $12k–$60k, SaaS $18k+. Use the Cost Calculator (bottom-left) for a live estimate!",
  },
  {
    k: ["time", "timeline", "how long", "duration"],
    a: "Marketing sites: 4–6 weeks. Web apps: 8–14 weeks. Mobile apps: 10–20 weeks. Timelines depend on scope.",
  },
  {
    k: ["service", "do you", "offer"],
    a: "We offer Web & App development, UI/UX, CMS builds, Ecommerce, SaaS, AI integrations, Branding, and Monthly Care.",
  },
  {
    k: ["contact", "talk", "call", "meet"],
    a: "Head to /contact or click 'Start a Project' — we reply within one business day.",
  },
  {
    k: ["hi", "hello", "hey"],
    a: "Hi there 👋 I'm Nova, the Northline assistant. Ask me about pricing, services, timelines, or how to start a project.",
  },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi 👋 I'm Nova, the Northline assistant. Ask me about services, pricing, or timelines.",
    },
  ]);
  const panelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
      );
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const reply = (t: string) => {
    const low = t.toLowerCase();
    const hit = BOT_KB.find((r) => r.k.some((k) => low.includes(k)));
    return (
      hit?.a ??
      "Good question — the team can answer in detail. Try /contact, or check our /services and /pricing pages."
    );
  };

  const send = () => {
    if (!input.trim()) return;
    const user = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: user }]);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply(user) }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div
          ref={panelRef}
          className="mb-3 w-[360px] h-[520px] flex flex-col glass-strong rounded-2xl shadow-panel overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-lime">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-display text-base font-semibold">Nova</h4>
                <p className="text-[10px] uppercase tracking-widest text-lime">
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-lime text-lime-foreground rounded-br-sm"
                      : "gradient-card rounded-bl-sm text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about services, pricing…"
              className="flex-1 bg-background/40 rounded-full px-4 py-2.5 text-sm border border-white/10 focus:outline-none focus:border-lime/50"
            />
            <button
              onClick={send}
              className="grid h-10 w-10 place-items-center rounded-full bg-lime text-lime-foreground hover:brightness-110"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-lime shadow-panel hover:scale-105 transition"
        aria-label="Chat"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </button>
    </div>
  );
}
