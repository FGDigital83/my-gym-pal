import { createServerFn } from "@tanstack/react-start";

export const findExerciseVideo = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string }) => ({ query: String(input.query).slice(0, 120) }))
  .handler(async ({ data }) => {
    const q = encodeURIComponent(`${data.query} ejercicio demostración correcta`);
    try {
      const res = await fetch(`https://www.youtube.com/results?search_query=${q}&sp=EgIYAQ%253D%253D`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        },
      });
      if (!res.ok) return { videoId: null as string | null };
      const html = await res.text();
      const ids = [...html.matchAll(/"videoId":"([\w-]{11})"/g)].map((m) => m[1]);
      return { videoId: ids[0] ?? null };
    } catch {
      return { videoId: null as string | null };
    }
  });
