
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Workout days
CREATE TABLE public.workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title TEXT NOT NULL,
  muscles TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "days_all_own" ON public.workout_days FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.workout_days(user_id, day_number);

-- Exercises
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES public.workout_days(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  muscle TEXT,
  position INT NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_all_own" ON public.exercises FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.exercises(day_id, position);

-- Exercise logs (one row per logged set)
CREATE TABLE public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  set_number INT NOT NULL DEFAULT 1,
  reps INT,
  weight NUMERIC(6,2),
  duration_seconds INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs_all_own" ON public.exercise_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.exercise_logs(exercise_id, log_date DESC);

-- Trigger: create profile + default plan on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d1 UUID; d2 UUID; d3 UUID; d4 UUID;
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.workout_days (user_id, day_number, title, muscles) VALUES
    (NEW.id, 1, 'Press de Pecho y Hombros', ARRAY['Hombro','Pecho','Tríceps','Abdominales','Bíceps']) RETURNING id INTO d1;
  INSERT INTO public.workout_days (user_id, day_number, title, muscles) VALUES
    (NEW.id, 2, 'Brazos Fuertes', ARRAY['Bíceps','Tríceps','Antebrazos']) RETURNING id INTO d2;
  INSERT INTO public.workout_days (user_id, day_number, title, muscles) VALUES
    (NEW.id, 3, 'Espalda y Glúteos Sólidos', ARRAY['Glúteos','Cuádriceps','Pecho','Dorsales','Isquiotibiales']) RETURNING id INTO d3;
  INSERT INTO public.workout_days (user_id, day_number, title, muscles) VALUES
    (NEW.id, 4, 'Pierna Completa', ARRAY['Cuádriceps','Glúteos','Isquiotibiales','Pantorrillas']) RETURNING id INTO d4;

  INSERT INTO public.exercises (day_id, user_id, name, muscle, position) VALUES
    (d1, NEW.id, 'Press de banca', 'Pecho', 1),
    (d1, NEW.id, 'Press inclinado con mancuernas', 'Pecho', 2),
    (d1, NEW.id, 'Press militar', 'Hombro', 3),
    (d1, NEW.id, 'Elevaciones laterales', 'Hombro', 4),
    (d1, NEW.id, 'Fondos en paralelas', 'Tríceps', 5),
    (d1, NEW.id, 'Plancha abdominal', 'Abdominales', 6),
    (d2, NEW.id, 'Curl con barra', 'Bíceps', 1),
    (d2, NEW.id, 'Curl martillo', 'Bíceps', 2),
    (d2, NEW.id, 'Press francés', 'Tríceps', 3),
    (d2, NEW.id, 'Extensión de tríceps en polea', 'Tríceps', 4),
    (d2, NEW.id, 'Curl de muñeca', 'Antebrazos', 5),
    (d2, NEW.id, 'Curl concentrado', 'Bíceps', 6),
    (d3, NEW.id, 'Peso muerto', 'Dorsales', 1),
    (d3, NEW.id, 'Hip thrust', 'Glúteos', 2),
    (d3, NEW.id, 'Remo con barra', 'Dorsales', 3),
    (d3, NEW.id, 'Buenos días', 'Isquiotibiales', 4),
    (d3, NEW.id, 'Pull-ups', 'Dorsales', 5),
    (d3, NEW.id, 'Patada de glúteo', 'Glúteos', 6),
    (d4, NEW.id, 'Sentadilla con barra', 'Cuádriceps', 1),
    (d4, NEW.id, 'Prensa de piernas', 'Cuádriceps', 2),
    (d4, NEW.id, 'Zancadas', 'Glúteos', 3),
    (d4, NEW.id, 'Curl femoral', 'Isquiotibiales', 4),
    (d4, NEW.id, 'Elevación de talones', 'Pantorrillas', 5),
    (d4, NEW.id, 'Sentadilla búlgara', 'Glúteos', 6);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
