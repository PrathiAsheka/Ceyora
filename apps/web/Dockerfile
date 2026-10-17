# ==========================================
# Ceyora Web Next.js Production Image
# Multi-stage build with Next.js Standalone Runner
# ==========================================

# Stage 1: Build & Bundle
FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_ENV=production
ENV OUTPUT_STANDALONE=1

# Install dependencies
RUN apk add --no-cache libc6-compat

# Copy workspace package manifests
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --workspace=@ceyora/web --workspace=@ceyora/shared

# Copy frontend source files
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# Next.js Build
WORKDIR /app/apps/web
ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api
ARG NEXT_PUBLIC_PAYHERE_MERCHANT_ID=1224890
ARG NEXT_PUBLIC_PAYHERE_MODE=sandbox

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_PAYHERE_MERCHANT_ID=${NEXT_PUBLIC_PAYHERE_MERCHANT_ID}
ENV NEXT_PUBLIC_PAYHERE_MODE=${NEXT_PUBLIC_PAYHERE_MODE}

RUN npm run build

# Stage 2: Minimal Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone bundle
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "apps/web/server.js"]
