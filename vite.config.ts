import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

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

export default defineConfig({
  plugins: [react(), devApi()],
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
});
