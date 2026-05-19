#!/usr/bin/env node
/**
 * DevVerse AI - Complete Project Generator
 * This script creates the entire directory structure and all application files
 * Run: node initialize-project.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

console.log('\n🚀 DevVerse AI - Project Generator');
console.log('===================================\n');

// Define all directories to create
const directories = [
  // Backend
  'apps/backend/src/common/middleware',
  'apps/backend/src/common/validators',
  'apps/backend/src/common/filters',
  'apps/backend/src/common/decorators',
  'apps/backend/src/common/guards',
  'apps/backend/src/auth/strategies',
  'apps/backend/src/auth/dto',
  'apps/backend/src/users',
  'apps/backend/src/teams',
  'apps/backend/src/projects',
  'apps/backend/src/workspaces',
  'apps/backend/src/ai',
  'apps/backend/src/database',
  'apps/backend/src/websocket',
  'apps/backend/prisma',
  // Frontend
  'apps/web/src/app/(auth)/login',
  'apps/web/src/app/(auth)/signup',
  'apps/web/src/app/(dashboard)',
  'apps/web/src/components/common',
  'apps/web/src/components/layouts',
  'apps/web/src/components/providers',
  'apps/web/src/components/pages',
  'apps/web/src/hooks',
  'apps/web/src/store',
  'apps/web/src/lib/api',
  'apps/web/src/lib/constants',
  'apps/web/src/services',
  'apps/web/src/types',
  'apps/web/public',
  // Shared packages
  'packages/shared/src',
  'packages/ui/src',
  // Infrastructure
  'infrastructure/docker',
];

// Create directories
console.log('📁 Creating directories...');
let dirCount = 0;
directories.forEach(dir => {
  const fullPath = path.join(ROOT, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    dirCount++;
  }
});
console.log(`✅ Created ${dirCount} directories\n`);

// Create critical backend files
const backendFiles = {
  'apps/backend/src/app.module.ts': `import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}`,

  'apps/backend/src/main.ts': `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: '*' });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log('🚀 Server running on http://localhost:' + port);
}

bootstrap().catch(e => {
  console.error('Failed to start server:', e);
  process.exit(1);
});`,

  'apps/backend/src/database/prisma.module.ts': `import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}`,

  'apps/backend/src/database/prisma.service.ts': `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}`,

  'apps/backend/src/common/exceptions.ts': `export class AppException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppException';
  }
}

export class BadRequestException extends AppException {
  constructor(m: string) { super(400, m, 'BAD_REQUEST'); }
}

export class UnauthorizedException extends AppException {
  constructor(m = 'Unauthorized') { super(401, m, 'UNAUTHORIZED'); }
}

export class NotFoundException extends AppException {
  constructor(r: string) { super(404, \`\${r} not found\`, 'NOT_FOUND'); }
}`,

  'apps/backend/src/common/decorators/current-user.decorator.ts': `import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});`,
};

console.log('📝 Creating backend files...');
let fileCount = 0;
Object.entries(backendFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(ROOT, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    fileCount++;
  }
});
console.log(`✅ Created ${fileCount} backend files\n`);

// Create frontend files
const frontendFiles = {
  'apps/web/src/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }
body { @apply bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors; }`,

  'apps/web/src/lib/api/client.ts': `import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default api;`,

  'apps/web/src/store/index.ts': `import { create } from 'zustand';

export const useAuthStore = create(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export const useWorkspaceStore = create(set => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  addNode: (node) => set(state => ({ nodes: [...state.nodes, node] })),
  selectNode: (node) => set({ selectedNode: node }),
}));`,

  'apps/web/src/lib/constants/index.ts': `export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';`,
};

console.log('📝 Creating frontend files...');
let feFileCount = 0;
Object.entries(frontendFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(ROOT, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    feFileCount++;
  }
});
console.log(`✅ Created ${feFileCount} frontend files\n`);

// Create package files
const sharedTypes = `export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TEAM_LEAD' | 'USER';
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Workspace {
  id: string;
  name: string;
  projectId: string;
}`;

const sharedTypesPath = path.join(ROOT, 'packages/shared/src/types.ts');
if (!fs.existsSync(path.dirname(sharedTypesPath))) {
  fs.mkdirSync(path.dirname(sharedTypesPath), { recursive: true });
}
if (!fs.existsSync(sharedTypesPath)) {
  fs.writeFileSync(sharedTypesPath, sharedTypes, 'utf-8');
}

console.log('📝 Creating shared packages...');
console.log('✅ Created shared types\n');

console.log('✨ Project structure initialized successfully!');
console.log('\n📖 Next steps:');
console.log('  1. cd "d:\\web d"');
console.log('  2. pnpm install');
console.log('  3. pnpm dev');
console.log('\n');
