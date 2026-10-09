import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import { buildFilmPages, pageSizes } from "./scripts/film-pages.ts";
import { filmFile, filmLang, langCookie } from "./middleware.ts";

/**
 * Dev-only: serve the POST /api/* endpoints during `vite dev` by calling the
 * same transport-agnostic cores the Vercel functions use, so the forms work
 * locally. In production Vercel serves `api/*.ts` as serverless functions.
 *
 * To add another endpoint locally: add one entry to ROUTES.
 */
const ROUTES: Array<{ path: string; module: string; handler: string }> = [
  { path: "/api/enroll", module: "/server/enroll.ts", handler: "processEnrollment" },
  { path: "/api/callback", module: "/server/callback.ts", handler: "processCallback" },
];

function devApi(): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      for (const route of ROUTES) {
        server.middlewares.use(route.path, (req, res) => {
          const send = (status: number, body: unknown) => {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
          };

          if (req.method !== "POST") {
            res.setHeader("Allow", "POST");
            return send(405, { ok: false, error: "Method not allowed" });
          }

          let raw = "";
          req.on("data", (chunk) => (raw += chunk));
          req.on("end", async () => {
            try {
              const payload = raw ? JSON.parse(raw) : {};
              const mod = await server.ssrLoadModule(route.module);
              const process = mod[route.handler] as (
                input: unknown,
                meta: { submittedAt: string }
              ) => Promise<{ ok: boolean; status: number }>;
              const result = await process(payload, { submittedAt: new Date().toISOString() });
              return send(result.status, result);
            } catch (err) {
              server.config.logger.error(
                `[dev ${route.path}] ` + (err instanceof Error ? err.message : String(err))
              );
              return send(502, { ok: false, error: "Could not process request (dev)." });
            }
          });
        });
      }
    },
  };
}

/**
 * The film watch pages (/film, /film/short) are standalone static HTML, not
 * part of the SPA: generated from src/film/* into dist/film/ on build, and
 * served from memory by the dev server.
 */
function filmPages(): Plugin {
  const root = import.meta.dirname;
  return {
    name: "film-pages",
    async generateBundle() {
      const files = await buildFilmPages({ root });
      for (const f of files) this.emitFile({ type: "asset", fileName: f.fileName, source: f.source });
      this.info(`film pages: ${pageSizes(files)}`);
    },
    // `vite preview` mirrors middleware.ts and vercel.json for /film and /film/short:
    // the language pick (and its cookie), then the rewrite to the built file
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const [p, q] = (req.url || "").split("?");
        const route = p.replace(/\/$/, "");
        if (route === "/film" || route === "/film/short") {
          const { lang, asked } = filmLang(new URL(req.url || "/", "http://localhost"), req.headers.cookie || null);
          if (asked) res.setHeader("set-cookie", langCookie(lang));
          req.url = `${filmFile(route, lang)}${q ? `?${q}` : ""}`;
        }
        next();
      });
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || "").split(/[?#]/)[0].replace(/\/$/, "");
        if (url !== "/film" && url !== "/film/short" && !/^\/film\/hls-[\d.]+\.js$/.test(url)) return next();
        try {
          const files = await buildFilmPages({ root });
          const { lang } = filmLang(new URL(req.url || "/", "http://localhost"), req.headers.cookie || null);
          const want = url.endsWith(".js") ? url : filmFile(url, lang);
          const hit = files.find((f) => "/" + f.fileName === want);
          if (!hit) return next();
          res.setHeader("Content-Type", hit.fileName.endsWith(".js") ? "text/javascript" : "text/html; charset=utf-8");
          res.end(hit.source);
        } catch (err) {
          next(err);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApi(), filmPages()],
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
});
