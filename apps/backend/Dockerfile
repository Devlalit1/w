# ─────────────────────────────────────────────
# Stage 1: Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace manifests first (for layer caching)
COPY package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

# Copy lockfile if it exists
COPY pnpm-lock.yaml* ./

# Install ALL dependencies (dev + prod) for building
RUN pnpm install --no-frozen-lockfile --filter backend...

# Copy source code
COPY apps/backend/ ./apps/backend/
COPY packages/ ./packages/

# Generate Prisma Client
# In pnpm monorepo, prisma client goes to root node_modules
RUN pnpm --filter backend prisma:generate

# Compile TypeScript → dist/
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
COPY apps/backend/package.json ./apps/backend/
COPY pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --no-frozen-lockfile --filter backend... --prod

# Copy compiled output from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Copy Prisma schema (needed for migrations & runtime)
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# Copy the generated Prisma client from root node_modules (pnpm hoists it there)
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client ./node_modules/.prisma/client

# Expose port
EXPOSE 3001

# Working directory for the app
WORKDIR /app/apps/backend

CMD ["node", "dist/main"]
