// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Set CAPACITOR=1 to build a fully static SPA bundle (with a real dist/index.html)
// for Capacitor / Android. The default build keeps SSR on Cloudflare Workers.
const isCapacitor = process.env.CAPACITOR === "1";

export default isCapacitor
  ? defineConfig({
      // SPA mode: prerender the root HTML shell and let the client router take over.
      // (Cloudflare Worker output is skipped automatically when CAPACITOR=1.)
      tanstackStart: {
        spa: { enabled: true },
        pages: [{ path: "/", prerender: { enabled: true, crawlLinks: false } }],
      },
    } as Parameters<typeof defineConfig>[0])
  : defineConfig({
      // Default (Lovable Cloud / Workers) build keeps the SSR error wrapper.
      tanstackStart: {
        server: { entry: "server" },
      },
    });
