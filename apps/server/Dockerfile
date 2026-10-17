# ==========================================
# Ceyora Backend API Server Production Image
# Multi-stage build for minimal footprint and maximum security
# ==========================================

# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma engine compatibility
RUN apk add --no-cache openssl libc6-compat

# Copy package manifests
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci --workspace=@ceyora/server --workspace=@ceyora/shared

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Generate Prisma client and compile TypeScript
WORKDIR /app/apps/server
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache openssl libc6-compat

# Run as non-root user for enterprise container security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 ceyora

# Copy build artifacts and runtime dependencies
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/package.json ./apps/server/
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules

USER ceyora

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

WORKDIR /app/apps/server
CMD ["node", "dist/src/index.js"]
