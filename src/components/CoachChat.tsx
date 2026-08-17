import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithCoach, type CoachMessage } from "@/lib/ai-routine.functions";
import { useI18n } from "@/lib/i18n";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "¿Qué ejercicios me recomiendas hoy para pecho y por qué?",
  "Tengo 40 minutos, ¿qué entreno?",
  "Me molesta el hombro, ¿qué alternativa hago al press militar?",
  "¿Cómo progreso en sentadilla?",
];

export function CoachChat({ context }: { context?: string }) {
  const { lang } = useI18n();
  const run = useServerFn(chatWithCoach);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const mutation = useMutation({
    mutationFn: async (history: CoachMessage[]) => run({ data: { messages: history, lang, context } }),
    onSuccess: (r) => {
      if (r.error === "rate_limited") return toast.error("Demasiadas peticiones, prueba en un minuto.");
      if (r.error === "credits") return toast.error("Se han agotado los créditos de IA.");
      if (r.error || !r.text) return toast.error("El entrenador IA no ha podido responder. Inténtalo de nuevo.");
      setMessages((m) => [...m, { role: "assistant", content: r.text }]);
    },
    onError: () => toast.error("El entrenador IA no ha podido responder."),
  });

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || mutation.isPending) return;
    const next: CoachMessage[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <section className="rounded-2xl border bg-card p-5 space-y-4">
      <header className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Entrenador IA</h2>
      </header>
      <p className="text-sm text-muted-foreground">
        Pregúntale qué ejercicios hacer: te explicará el porqué, la técnica y las series y repeticiones.
      </p>

      <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-primary/10 border border-primary/30 ml-8 whitespace-pre-wrap"
                : "bg-muted/40 border border-border mr-8 prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-strong:text-foreground"
            }`}
          >
            {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Pensando...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-md border border-border bg-card text-foreground hover:border-primary transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta al entrenador..."
          aria-label="Mensaje para el entrenador IA"
        />
        <Button type="submit" disabled={mutation.isPending || !input.trim()}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </section>
  );
}
