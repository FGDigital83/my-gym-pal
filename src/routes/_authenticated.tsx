import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Dumbbell, LogOut, HeartPulse, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };
  const onHealth = path.startsWith("/health");
  const onTraining = !onHealth;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link to="/plan" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Training Plan</span>
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-2">
          <Link
            to="/plan"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition border ${
              onTraining ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary"
            }`}
          >
            <Dumbbell className="h-4 w-4" />
            {t("training")}
          </Link>
          <Link
            to="/health"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition border ${
              onHealth ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary"
            }`}
          >
            <HeartPulse className="h-4 w-4" />
            {t("health")}
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>
    </div>
  );
}
