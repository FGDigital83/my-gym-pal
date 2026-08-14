import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Flame } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/plan" });
  },
  component: LoginPage,
});

async function checkBackendHealth(): Promise<boolean> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return true;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"checking" | "up" | "down">("checking");

  const runHealthCheck = async () => {
    setStatus("checking");
    setStatus((await checkBackendHealth()) ? "up" : "down");
  };

  useEffect(() => {
    void runHealthCheck();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/plan" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success(t("accountCreated"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isNetwork = /failed to fetch|networkerror|load failed/i.test(msg);
      if (isNetwork) setStatus("down");
      toast.error(
        isNetwork
          ? "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo en unos segundos."
          : msg || t("errorGeneric"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(t("googleError"));
  };

  const handleForgot = async () => {
    if (!email) {
      toast.error(t("resetEmailPrompt"));
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) toast.error(error.message);
    else toast.success(t("resetEmailSent"));
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center glow-neon">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training Plan</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">{t("brandTag")}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-2xl">
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "signin" ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}
            >{t("signin")}</button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "signup" ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}
            >{t("signup")}</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePh")} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPh")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("passwordPh")} />
            </div>
            <Button type="submit" disabled={loading} className="w-full glow-neon">
              <Flame className="h-4 w-4" />
              {loading ? "..." : mode === "signin" ? t("signin") : t("signup")}
            </Button>
            {mode === "signin" && (
              <button
                type="button"
                onClick={handleForgot}
                className="block w-full text-center text-xs text-white/80 hover:text-white underline-offset-4 hover:underline"
              >
                {t("forgotPassword")}
              </button>
            )}
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{t("or")}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" onClick={handleGoogle} className="w-full">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.97h5.27c-.23 1.5-1.7 4.4-5.27 4.4-3.17 0-5.76-2.62-5.76-5.85S9 6.77 12.18 6.77c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.78 4.2 14.7 3.3 12.18 3.3 6.92 3.3 2.7 7.55 2.7 12.62c0 5.07 4.22 9.32 9.48 9.32 5.47 0 9.1-3.85 9.1-9.27 0-.62-.07-1.1-.18-1.57z"/></svg>
            {t("continueGoogle")}
          </Button>
        </div>
      </div>
    </div>
  );
}
