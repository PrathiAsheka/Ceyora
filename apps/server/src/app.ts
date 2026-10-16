import cors from "cors";
import express from "express";
import { prisma } from "./db";
import { errorHandler, handle } from "./http";
import { core } from "./routes/core";
import { operations } from "./routes/operations";
import { auth } from "./routes/auth";
import { academic } from "./routes/academic";
import { authenticate, authorize } from "./auth/guard";

/** The Express app (no listener), so tests can mount it directly. */
export function createApp() {
  const app = express();
  // Behind Vercel's (or any) proxy: use the visitor's IP from X-Forwarded-For,
  // so per-IP sign-in limits apply to people, not to the proxy.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  const origins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(cors({ origin: origins }));
  app.use(express.json({ limit: "2mb" }));
  if (process.env.LOG_REQUESTS === "1") {
    app.use((req, res, next) => {
      const started = Date.now();
      res.on("finish", () => console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`));
      next();
    });
  }

  app.get(
    "/api/health",
    handle(async () => {
      await prisma.$queryRaw`SELECT 1`;
      return { ok: true };
    }),
  );
  // Every /api route below needs a valid session and the right permission.
  app.use("/api", authenticate, authorize);
  app.use("/api/auth", auth);
  app.use("/api", core);
  app.use("/api", operations);
  app.use("/api", academic);
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));
  app.use(errorHandler);
  return app;
}
