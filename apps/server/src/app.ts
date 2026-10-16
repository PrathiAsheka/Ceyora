import cors from "cors";
import express from "express";
import { prisma } from "./db";
import { errorHandler, handle } from "./http";
import { core } from "./routes/core";
import { operations } from "./routes/operations";
import { auth } from "./routes/auth";
import { academic } from "./routes/academic";
import { payhereRouter } from "./routes/payhere";
import { reversalsRouter } from "./routes/reversals";
import { importRouter } from "./routes/import";
import { authenticate, authorize } from "./auth/guard";

// Simple in-memory rate limiter per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 300; // 300 req/min

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  record.count++;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Too many requests. Please slow down and try again shortly.",
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    });
  }

  next();
}

/** The Express app (no listener), so tests can mount it directly. */
export function createApp() {
  const app = express();
  // Behind Vercel's (or any) proxy: use the visitor's IP from X-Forwarded-For,
  // so per-IP sign-in limits apply to people, not to the proxy.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  // Enterprise Security Headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  const origins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(cors({ origin: origins, credentials: true }));
  app.use(express.json({ limit: "4mb" }));
  app.use(express.urlencoded({ extended: true, limit: "4mb" }));
  app.use(rateLimiter);

  if (process.env.LOG_REQUESTS === "1") {
    app.use((req, res, next) => {
      const started = Date.now();
      res.on("finish", () =>
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`)
      );
      next();
    });
  }

  app.get(
    "/api/health",
    handle(async () => {
      await prisma.$queryRaw`SELECT 1`;
      return {
        ok: true,
        service: "ceyora-tuition-bi-server",
        timestamp: new Date().toISOString(),
        version: "2.4.0-enterprise",
        pdpa_compliant: true,
      };
    })
  );

  // Authentication & Authorization Pipeline
  // Authenticates session bearer token and verifies permission scopes
  app.use("/api", authenticate, authorize);

  // API Domain Routers
  app.use("/api/auth", auth);
  app.use("/api", core);
  app.use("/api", operations);
  app.use("/api", academic);
  app.use("/api", payhereRouter);
  app.use("/api", reversalsRouter);
  app.use("/api", importRouter);

  app.use("/api", (_req, res) => res.status(404).json({ error: "Endpoint not found." }));
  app.use(errorHandler);
  return app;
}
