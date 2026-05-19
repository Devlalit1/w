# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --no-frozen-lockfile --filter backend

# Copy source
COPY apps/backend/ ./apps/backend/
COPY packages/ ./packages/

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build
RUN cd apps/backend && pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --no-frozen-lockfile --filter backend --prod

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/node_modules/.prisma ./apps/backend/node_modules/.prisma

EXPOSE 3001

CMD ["node", "apps/backend/dist/main"]
