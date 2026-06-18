import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Dev-only: serve POST /api/enroll during `vite dev` by calling the same
 * transport-agnostic core the Vercel function uses, so the form works locally.
 * In production Vercel serves `api/enroll.ts` as a serverless function instead.
 */
function devEnrollApi(): Plugin {
  return {
    name: "dev-enroll-api",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/enroll", (req, res) => {
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
            const { processEnrollment } = await server.ssrLoadModule("/server/enroll.ts");
            const result = await processEnrollment(payload, {
              submittedAt: new Date().toISOString(),
            });
            return send(result.ok ? 200 : result.status, result);
          } catch (err) {
            server.config.logger.error(
              "[dev /api/enroll] " + (err instanceof Error ? err.message : String(err))
            );
            return send(502, { ok: false, error: "Could not process enrolment (dev)." });
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devEnrollApi()],
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
});
