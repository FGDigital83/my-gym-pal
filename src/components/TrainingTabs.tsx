import { Link, useRouterState } from "@tanstack/react-router";
import { ListChecks, Sparkles } from "lucide-react";

export function TrainingTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const onAI = path.startsWith("/ai-routine");
  const base =
    "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition border";
  const active = "bg-primary text-primary-foreground border-primary";
  const idle = "bg-card text-muted-foreground border-border hover:border-primary";
  return (
    <div className="flex gap-2">
      <Link to="/plan" className={`${base} ${onAI ? idle : active}`}>
        <ListChecks className="h-4 w-4" /> Rutina
      </Link>
      <Link to="/ai-routine" className={`${base} ${onAI ? active : idle}`}>
        <Sparkles className="h-4 w-4" /> Rutina IA
      </Link>
    </div>
  );
}
