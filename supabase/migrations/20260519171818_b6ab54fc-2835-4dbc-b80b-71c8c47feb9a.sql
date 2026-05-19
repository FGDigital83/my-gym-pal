CREATE TABLE public.health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  age integer,
  height_cm numeric,
  weight_kg numeric,
  bmi numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "health_logs_all_own" ON public.health_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_health_logs_user_date ON public.health_logs(user_id, log_date DESC);