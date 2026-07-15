"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { LeadBotApiResponse, LeadBotMessage, LeadBotState, LeadBotTracking } from "@/lib/leadBot/types";
import MaterialIcon from "./MaterialIcon";

const STORAGE_KEY = "coradir_homes_lead_bot_state";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_LEAD_BOT_WHATSAPP_NUMBER || "5492664649967";

function createClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getInitialState(pathname: string): LeadBotState {
  const pageProject = pathname.includes("/locales-comerciales")
    ? "locales-comerciales"
    : pathname.includes("/juana-64")
      ? "juana-64"
      : pathname.includes("/san-luis")
        ? "san-luis"
        : pathname.includes("/villa-mercedes")
          ? "villa-mercedes"
          : pathname.includes("/la-torre-ii")
            ? "la-torre-ii"
            : undefined;

  return {
    clientId: createClientId(),
    intent: "indefinido",
    project: pageProject,
    lastPageProject: pageProject,
    messages: [],
    score: 0,
    missingFields: [],
  };
}

// Una conversacion sin actividad por mas de este tiempo se considera vieja:
// se arranca de cero con el proyecto de la pagina como default.
const CONVERSATION_STALE_MS = 12 * 60 * 60 * 1000;

function isConversationStale(messages: Partial<LeadBotState>["messages"]) {
  if (!Array.isArray(messages) || messages.length === 0) return true;
  const lastTimestamp = messages[messages.length - 1]?.timestamp;
  if (!lastTimestamp) return true;
  const elapsed = Date.now() - Date.parse(lastTimestamp);
  return !Number.isFinite(elapsed) || elapsed > CONVERSATION_STALE_MS;
}

function readStoredState(pathname: string): LeadBotState {
  if (typeof window === "undefined") return getInitialState(pathname);

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return getInitialState(pathname);

    const parsed = JSON.parse(stored) as Partial<LeadBotState>;
    if (!parsed.clientId) return getInitialState(pathname);
    const initialState = getInitialState(pathname);

    // Conversacion vacia o vieja: el proyecto de la pagina actual es el default,
    // pero se conservan identidad y datos de contacto ya capturados.
    if (isConversationStale(parsed.messages)) {
      return {
        ...initialState,
        clientId: parsed.clientId,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
      };
    }

    // Conversacion viva: manda lo conversado. La pagina donde esta parado el
    // usuario NO pisa el proyecto que ya eligio o cambio charlando con el bot.
    return {
      ...initialState,
      ...parsed,
      project: parsed.project || initialState.project,
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      missingFields: Array.isArray(parsed.missingFields) ? parsed.missingFields : [],
    };
  } catch {
    return getInitialState(pathname);
  }
}

function getTracking(pathname: string): LeadBotTracking {
  if (typeof window === "undefined") return { pathname };

  const params = new URLSearchParams(window.location.search);
  return {
    pathname,
    referrer: document.referrer,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };
}

function pushDataLayer(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const dataLayerWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  dataLayerWindow.dataLayer = dataLayerWindow.dataLayer || [];
  dataLayerWindow.dataLayer.push(event);
}

function buildWhatsAppUrl(state: LeadBotState) {
  const message = [
    "Hola! Ya hable con el asistente de Coradir Homes.",
    state.name ? `Mi nombre es ${state.name}.` : null,
    state.email ? `Mi email es ${state.email}.` : null,
    state.phone ? `Mi numero es ${state.phone}.` : null,
    state.project ? `Me interesa ${state.project}.` : null,
    state.intent && state.intent !== "indefinido" ? `Estoy consultando para ${state.intent}.` : null,
    state.budgetText ? `Presupuesto/comentario: ${state.budgetText}.` : null,
    state.advisorSummary ? `Resumen para asesor: ${state.advisorSummary}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function FormattedMessageContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const renderInline = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const href = linkMatch[2];
        const isExternal = /^https?:\/\//i.test(href);

        return (
          <a
            key={index}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="font-semibold text-blue underline underline-offset-2"
          >
            {linkMatch[1]}
          </a>
        );
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      const titleMatch = part.match(/^([^:]{2,40}:)(\s+.*)?$/);
      if (titleMatch) {
        return (
          <span key={index}>
            <strong>{titleMatch[1]}</strong>
            {titleMatch[2] || ""}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
        const bulletLines = lines.filter((line) => /^[-•]\s+/.test(line));

        if (bulletLines.length === lines.length && lines.length > 0) {
          return (
            <ul key={blockIndex} className="space-y-2.5 pl-4">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="list-disc">
                  {renderInline(line.replace(/^[-•]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function useTypewriterText(text: string, enabled: boolean, onComplete?: () => void) {
  const [visibleText, setVisibleText] = useState(enabled ? "" : text);
  const [isTyping, setIsTyping] = useState(enabled);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!enabled) {
      setVisibleText(text);
      setIsTyping(false);
      return;
    }

    setVisibleText("");
    setIsTyping(true);
    let index = 0;
    let timeoutId: number | undefined;
    const charsPerStep = text.length > 450 ? 4 : text.length > 220 ? 3 : 2;

    const step = () => {
      index = Math.min(index + charsPerStep, text.length);
      setVisibleText(text.slice(0, index));

      if (index < text.length) {
        timeoutId = window.setTimeout(step, 12);
      } else {
        setIsTyping(false);
        onCompleteRef.current?.();
      }
    };

    const timer = window.setTimeout(step, 70);
    return () => {
      window.clearTimeout(timer);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [enabled, text]);

  return { visibleText, isTyping };
}

function ChatMessage({
  message,
  animate,
  onAnimationComplete,
}: {
  message: LeadBotMessage;
  animate: boolean;
  onAnimationComplete?: () => void;
}) {
  const isUser = message.role === "user";
  const { visibleText, isTyping } = useTypewriterText(message.content, animate && !isUser, onAnimationComplete);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-blue text-white"
          : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <FormattedMessageContent content={visibleText} />
        {isTyping ? <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse bg-current" /> : null}
      </div>
    </div>
  );
}

function getMessageKey(message: LeadBotMessage, index: number) {
  return `${message.role}-${message.timestamp}-${index}`;
}

export default function LeadQualificationChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNudge, setShowNudge] = useState(false);
  const [hasDismissedNudge, setHasDismissedNudge] = useState(false);
  const [state, setState] = useState<LeadBotState>(() => getInitialState(pathname));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingAssistantAnimationKeyRef = useRef<string | null>(null);
  const animatedAssistantMessageKeysRef = useRef<Set<string>>(new Set());

  const isEnabled = process.env.NEXT_PUBLIC_LEAD_BOT_ENABLED === "true";
  const hasCommercialIntent = state.intent === "comprar" || state.intent === "alquilar" || state.intent === "invertir";
  const hasUsefulContext = Boolean(state.project || state.budgetStatus || state.wantsHumanHandoff);
  const hasLeadContact = Boolean(state.name && (state.email || state.phone));
  const canUseWhatsAppWithoutStoredContact = Boolean(state.wantsHumanHandoff && state.declinedContact);
  const canHandoffToWhatsApp =
    (hasLeadContact || canUseWhatsAppWithoutStoredContact) &&
    (Boolean(state.wantsHumanHandoff) ||
      state.classification === "SQL" ||
      (state.classification === "MQL" && hasCommercialIntent && hasUsefulContext));

  const introMessage = useMemo<LeadBotMessage>(() => ({
    role: "assistant",
    content: "Hola, soy la IA de Coradir Homes. ¿En qué podemos ayudarte?",
    timestamp: new Date().toISOString(),
  }), []);

  useEffect(() => {
    setState(readStoredState(pathname));
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, isLoading]);

  useEffect(() => {
    if (!isOpen || isMinimized || isLoading) return;
    inputRef.current?.focus();
  }, [isLoading, isMinimized, isOpen, state.messages.length]);

  useEffect(() => {
    if (isOpen || hasDismissedNudge) return;

    const show = () => {
      setShowNudge(true);
      window.setTimeout(() => setShowNudge(false), 9000);
    };

    const onScroll = () => {
      if (window.scrollY > 80) show();
    };

    const timer = window.setTimeout(show, 4500);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", show, { once: true });
    window.addEventListener("touchstart", show, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
    };
  }, [hasDismissedNudge, isOpen]);

  const queueLatestAssistantAnimation = useCallback((messages: LeadBotMessage[]) => {
    const lastMessageIndex = messages.length - 1;
    const lastMessage = messages[lastMessageIndex];

    if (lastMessage?.role !== "assistant") {
      pendingAssistantAnimationKeyRef.current = null;
      return;
    }

    const key = getMessageKey(lastMessage, lastMessageIndex);
    pendingAssistantAnimationKeyRef.current = animatedAssistantMessageKeysRef.current.has(key) ? null : key;
  }, []);

  const markMessageAnimated = useCallback((key: string) => {
    animatedAssistantMessageKeysRef.current.add(key);
    if (pendingAssistantAnimationKeyRef.current === key) {
      pendingAssistantAnimationKeyRef.current = null;
    }
  }, []);

  if (!isEnabled) return null;

  const visibleMessages = state.messages.length ? state.messages : [introMessage];

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowNudge(false);
    setHasDismissedNudge(true);
    pushDataLayer({
      event: "lead_bot_open",
      pathname,
    });
    void fetch("/api/lead-bot/event", {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
      body: JSON.stringify({ clientId: state.clientId, type: "bot_opened", payload: { tracking: getTracking(pathname) } }),
    });
  };

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    setInput("");
    setError("");
    setIsLoading(true);

    const optimisticState: LeadBotState = {
      ...state,
      messages: [
        ...state.messages,
        { role: "user", content: message, timestamp: new Date().toISOString() },
      ],
    };
    setState(optimisticState);

    try {
      const response = await fetch("/api/lead-bot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: state.clientId,
          message,
          state,
          tracking: getTracking(pathname),
        }),
      });

      const payload = (await response.json()) as ({ success: boolean; error?: string } & Partial<LeadBotApiResponse>);

      if (!response.ok || !payload.success || !payload.state || !payload.nextAction) {
        throw new Error(payload.error || "No pudimos procesar el mensaje.");
      }

      queueLatestAssistantAnimation(payload.state.messages);
      setState(payload.state);
      for (const eventPayload of payload.events || []) {
        pushDataLayer(eventPayload);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No pudimos procesar el mensaje.");
      const fallbackState: LeadBotState = {
        ...optimisticState,
        messages: [
          ...optimisticState.messages,
          {
            role: "assistant",
            content: "Estamos con mucha consulta. Podés dejarme tu email o tocar WhatsApp para hablar con un asesor.",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      queueLatestAssistantAnimation(fallbackState.messages);
      setState(fallbackState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppHandoff = () => {
    pushDataLayer({
      event: "lead_bot_whatsapp_handoff",
      classification: state.classification,
      score: state.score,
      project: state.project,
      intent: state.intent,
    });
    void fetch("/api/lead-bot/event", {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
      body: JSON.stringify({ clientId: state.clientId, type: "whatsapp_clicked", payload: { project: state.project, intent: state.intent } }),
    });
    window.open(buildWhatsAppUrl(state), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 xl:bottom-6 xl:right-6">
      {isOpen && !isMinimized ? (
        <section
          className="flex h-[min(620px,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-2xl animate-whatsapp-chat-in"
          aria-label="Asistente de Coradir Homes"
        >
          <header className="flex items-center justify-between bg-blue px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                <MaterialIcon name="smart_toy" className="text-[20px]" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Coradir Homes</p>
                <p className="text-xs text-white/80">Asistente IA</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Minimizar chat"
              >
                <MaterialIcon name="minimize" className="text-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Cerrar chat"
              >
                <MaterialIcon name="close" className="text-[18px]" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {visibleMessages.map((message, index) => {
              const key = getMessageKey(message, index);
              const shouldAnimate =
                message.role === "assistant" &&
                pendingAssistantAnimationKeyRef.current === key &&
                !animatedAssistantMessageKeysRef.current.has(key);

              return (
                <ChatMessage
                  key={key}
                  message={message}
                  animate={shouldAnimate}
                  onAnimationComplete={() => markMessageAnimated(key)}
                />
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {canHandoffToWhatsApp && (
            <div className="border-t border-slate-200 bg-white px-4 py-3">
              <button
                type="button"
                onClick={handleWhatsAppHandoff}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#20BA5A]"
              >
                <MaterialIcon name="chat" className="text-[18px]" />
                Hablar por WhatsApp
              </button>
            </div>
          )}

          <form onSubmit={submitMessage} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <label htmlFor="lead-bot-message" className="sr-only">
              Mensaje
            </label>
            <input
              ref={inputRef}
              id="lead-bot-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              className="h-11 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/20 disabled:opacity-60"
              placeholder="Escribí tu consulta..."
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue text-white transition hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Enviar mensaje"
            >
              <MaterialIcon name="send" className="text-[18px]" />
            </button>
          </form>
        </section>
      ) : null}

      {showNudge && !isOpen && (
        <div
          className="relative max-w-[270px] rounded-lg border border-[#25D366]/20 bg-white px-4 py-3 text-sm text-slate-800 shadow-xl animate-slide-in-right"
          role="tooltip"
        >
          <button
            type="button"
            onClick={() => {
              setShowNudge(false);
              setHasDismissedNudge(true);
            }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600 transition hover:bg-slate-300"
            aria-label="Cerrar mensaje del asistente"
          >
            <MaterialIcon name="close" className="text-[14px]" />
          </button>
          <p className="font-bold text-slate-900">¿Tenés dudas?</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Hablá con la IA de Coradir Homes y encontrá la opción que mejor encaja con vos.
          </p>
          <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b border-r border-[#25D366]/20 bg-white" />
        </div>
      )}

      <button
        type="button"
        onClick={isOpen && isMinimized ? () => setIsMinimized(false) : openChat}
        className="group relative"
        aria-label="Abrir asistente de Coradir Homes"
      >
        <span className="absolute inset-0 h-14 w-14 rounded-full bg-[#25D366]/25 animate-ping xl:h-16 xl:w-16" />
        <span className="absolute inset-0 h-14 w-14 rounded-full bg-[#25D366]/35 animate-pulse xl:h-16 xl:w-16" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:bg-[#20BA5A] hover:shadow-2xl group-hover:scale-105 xl:h-16 xl:w-16">
          <MaterialIcon name="chat" className="text-[32px]" />
        </span>
      </button>
    </div>
  );
}
