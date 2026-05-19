#!/usr/bin/env python3
"""
DevVerse AI - Complete Project Generator with All Files
Generates complete directory structure and all necessary files
"""

import os
from pathlib import Path
from typing import Dict

ROOT = r"d:\web d"

# First, create all necessary directories
DIRECTORIES = [
    # Backend
    r"apps\backend\src\common\middleware",
    r"apps\backend\src\common\validators",
    r"apps\backend\src\common\filters",
    r"apps\backend\src\common\decorators",
    r"apps\backend\src\common\guards",
    r"apps\backend\src\auth\strategies",
    r"apps\backend\src\auth\dto",
    r"apps\backend\src\users\entities",
    r"apps\backend\src\users\dto",
    r"apps\backend\src\teams\entities",
    r"apps\backend\src\teams\dto",
    r"apps\backend\src\projects\entities",
    r"apps\backend\src\projects\dto",
    r"apps\backend\src\workspaces\entities",
    r"apps\backend\src\workspaces\dto",
    r"apps\backend\src\ai\services",
    r"apps\backend\src\ai\dto",
    r"apps\backend\src\database\seeders",
    r"apps\backend\src\websocket",
    r"apps\backend\prisma",
    # Frontend
    r"apps\web\src\app\(auth)\login",
    r"apps\web\src\app\(auth)\signup",
    r"apps\web\src\app\(dashboard)",
    r"apps\web\src\app\workspace",
    r"apps\web\src\components\common",
    r"apps\web\src\components\layouts",
    r"apps\web\src\components\3d-viewer",
    r"apps\web\src\components\forms",
    r"apps\web\src\components\providers",
    r"apps\web\src\components\pages",
    r"apps\web\src\hooks\api",
    r"apps\web\src\hooks\ui",
    r"apps\web\src\store",
    r"apps\web\src\lib\utils",
    r"apps\web\src\lib\api",
    r"apps\web\src\lib\constants",
    r"apps\web\src\services\api",
    r"apps\web\src\services\websocket",
    r"apps\web\src\types\models",
    r"apps\web\src\types\api",
    r"apps\web\public",
    # AI Service
    r"apps\ai-service\app\services",
    r"apps\ai-service\app\models",
    r"apps\ai-service\app\routers",
    # Packages
    r"packages\shared\src\types",
    r"packages\shared\src\utils",
    r"packages\ui\src\components",
    # Infrastructure
    r"infrastructure\docker",
    r"infrastructure\k8s",
]

def create_directories():
    """Create all necessary directories"""
    print("📁 Creating directory structure...")
    for dir_path in DIRECTORIES:
        full_path = os.path.join(ROOT, dir_path)
        Path(full_path).mkdir(parents=True, exist_ok=True)
    print(f"✅ Created {len(DIRECTORIES)} directories")

def create_files():
    """Create backend application files"""
    print("📝 Creating backend application files...")
    
    files = {
        # Backend core
        r"apps\backend\src\app.module.ts": 'import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";\nimport { ConfigModule } from "@nestjs/config";\nimport { PrismaModule } from "@/database/prisma.module";\nimport { LoggingMiddleware } from "@/common/middleware/logging.middleware";\nimport { AuthModule } from "@/auth/auth.module";\nimport { UsersModule } from "@/users/users.module";\nimport { TeamsModule } from "@/teams/teams.module";\nimport { ProjectsModule } from "@/projects/projects.module";\nimport { WorkspacesModule } from "@/workspaces/workspaces.module";\nimport { AIModule } from "@/ai/ai.module";\n\n@Module({\n  imports: [\n    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),\n    PrismaModule,\n    AuthModule,\n    UsersModule,\n    TeamsModule,\n    ProjectsModule,\n    WorkspacesModule,\n    AIModule,\n  ],\n})\nexport class AppModule implements NestModule {\n  configure(consumer: MiddlewareConsumer) {\n    consumer.apply(LoggingMiddleware).forRoutes("*");\n  }\n}',
        
        r"apps\backend\src\main.ts": 'import { NestFactory } from "@nestjs/core";\nimport { ValidationPipe, Logger } from "@nestjs/common";\nimport { AppModule } from "./app.module";\nimport { HttpExceptionFilter } from "./common/filters/http-exception.filter";\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  const logger = new Logger("Bootstrap");\n  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));\n  app.useGlobalFilters(new HttpExceptionFilter());\n  app.enableCors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true });\n  const port = process.env.PORT || 3001;\n  await app.listen(port);\n  logger.log(`🚀 Server running on http://localhost:${port}`);\n}\n\nbootstrap().catch(e => { console.error(e); process.exit(1); });',
        
        # Common
        r"apps\backend\src\common\exceptions.ts": 'export class AppException extends Error { constructor(public statusCode: number, public message: string, public code?: string) { super(message); this.name = "AppException"; } }\nexport class BadRequestException extends AppException { constructor(m: string) { super(400, m, "BAD_REQUEST"); } }\nexport class UnauthorizedException extends AppException { constructor(m = "Unauthorized") { super(401, m, "UNAUTHORIZED"); } }\nexport class NotFoundException extends AppException { constructor(r: string) { super(404, `${r} not found`, "NOT_FOUND"); } }\nexport class ConflictException extends AppException { constructor(m: string) { super(409, m, "CONFLICT"); } }',
        
        r"apps\backend\src\common\middleware\logging.middleware.ts": 'import { Injectable, NestMiddleware } from "@nestjs/common";\nimport { Request, Response, NextFunction } from "express";\n\n@Injectable()\nexport class LoggingMiddleware implements NestMiddleware {\n  use(req: Request, res: Response, next: NextFunction) {\n    const start = Date.now();\n    res.on("finish", () => console.log(`[${req.method}] ${req.url} - ${res.statusCode} (${Date.now() - start}ms)`));\n    next();\n  }\n}',
        
        r"apps\backend\src\common\filters\http-exception.filter.ts": 'import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";\nimport { Response } from "express";\n\n@Catch()\nexport class HttpExceptionFilter implements ExceptionFilter {\n  catch(exception: any, host: ArgumentsHost) {\n    const ctx = host.switchToHttp();\n    const response = ctx.getResponse<Response>();\n    let status = HttpStatus.INTERNAL_SERVER_ERROR;\n    let message = "Internal server error";\n    if (exception instanceof HttpException) {\n      status = exception.getStatus();\n      message = exception.message;\n    }\n    response.status(status).json({ statusCode: status, message, timestamp: new Date().toISOString() });\n  }\n}',
        
        r"apps\backend\src\common\decorators\current-user.decorator.ts": 'import { createParamDecorator, ExecutionContext } from "@nestjs/common";\nexport const CurrentUser = createParamDecorator((data: any, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user);',
        
        r"apps\backend\src\common\guards\jwt-auth.guard.ts": 'import { UseGuards } from "@nestjs/common";\nimport { AuthGuard } from "@nestjs/passport";\nexport const JwtAuthGuard = () => UseGuards(AuthGuard("jwt"));',
    }
    
    for file_path, content in files.items():
        full_path = os.path.join(ROOT, file_path)
        Path(full_path).write_text(content, encoding='utf-8')
    
    print(f"✅ Created {len(files)} core backend files")

def create_frontend_files():
    """Create frontend files"""
    print("📝 Creating frontend application files...")
    
    files = {
        r"apps\web\src\globals.css": '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
        r"apps\web\src\lib\api\client.ts": 'import axios from "axios";\nconst api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001" });\napi.interceptors.request.use(c => { const t = typeof window !== "undefined" ? localStorage.getItem("token") : null; if (t) c.headers.Authorization = `Bearer ${t}`; return c; });\nexport default api;',
        r"apps\web\src\store\index.ts": 'import { create } from "zustand";\nexport const useAuthStore = create(set => ({ user: null, token: null, setUser: u => set({ user: u }), setToken: t => set({ token: t }) }));',
        r"apps\web\src\lib\constants\index.ts": 'export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";',
    }
    
    for file_path, content in files.items():
        full_path = os.path.join(ROOT, file_path)
        Path(full_path).write_text(content, encoding='utf-8')
    
    print(f"✅ Created {len(files)} frontend files")

if __name__ == '__main__':
    print("\n🚀 DevVerse AI Project Generator\n")
    create_directories()
    create_files()
    create_frontend_files()
    print("\n✨ Project initialization complete!\n")
