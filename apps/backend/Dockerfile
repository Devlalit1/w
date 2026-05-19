# ─────────────────────────────────────────────
# Stage 1: Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace config first (layer cache optimization)
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Install ALL dependencies (dev + prod needed for build)
RUN pnpm install --no-frozen-lockfile --filter backend...

# Copy backend source code
COPY apps/backend/ ./apps/backend/

# Generate Prisma Client (writes into node_modules)
RUN cd apps/backend && npx prisma generate

# Build TypeScript → dist/
RUN pnpm --filter backend build

# ─────────────────────────────────────────────
# Stage 2: Production
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/

# Install ONLY production dependencies
RUN pnpm install --no-frozen-lockfile --filter backend... --prod

# Copy compiled JS from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Copy Prisma schema (required at runtime for query engine)
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# Copy the entire node_modules from builder
# This is the safest approach — avoids glob issues with pnpm's content-addressable store
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

WORKDIR /app/apps/backend

CMD ["node", "dist/main"]
