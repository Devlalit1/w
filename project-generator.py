#!/usr/bin/env python3
"""
DevVerse AI - Complete Project Generator
This script generates all necessary files and directories for the monorepo.
"""

import os
import json
from pathlib import Path
from typing import Dict, List

# Root directory
ROOT = r"d:\web d"

# Define all files to create with their content
FILES_TO_CREATE: Dict[str, str] = {
    # Backend - App Module
    "apps\\backend\\src\\app.module.ts": '''import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaModule } from '@/database/prisma.module';
import { LoggingMiddleware } from '@/common/middleware/logging.middleware';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { TeamsModule } from '@/teams/teams.module';
import { ProjectsModule } from '@/projects/projects.module';
import { WorkspacesModule } from '@/workspaces/workspaces.module';
import { AIModule } from '@/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    ProjectsModule,
    WorkspacesModule,
    AIModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}''',

    # Backend - Main entry point
    "apps\\backend\\src\\main.ts": '''import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});''',

    # Exception filter
    "apps\\backend\\src\\common\\filters\\http-exception.filter.ts": '''import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}''',

    # Logging middleware
    "apps\\backend\\src\\common\\middleware\\logging.middleware.ts": '''import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, url } = req;
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${method}] ${url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  }
}''',

    # Prisma Module
    "apps\\backend\\src\\database\\prisma.module.ts": '''import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}''',

    # Prisma Service
    "apps\\backend\\src\\database\\prisma.service.ts": '''import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}''',

    # Exceptions
    "apps\\backend\\src\\common\\exceptions.ts": '''export class AppException extends Error {
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
  constructor(message: string) {
    super(400, message, 'BAD_REQUEST');
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}''',

    # Auth Module
    "apps\\backend\\src\\auth\\auth.module.ts": '''import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '@/database/prisma.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}''',

    # Auth Service (simplified for space)
    "apps\\backend\\src\\auth\\auth.service.ts": '''import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/database/prisma.service';
import { UnauthorizedException } from '@/common/exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken, user: { id: user.id, email: user.email, name: user.name } };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isValid = await bcrypt.compare(password, user.password!);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken, user: { id: user.id, email: user.email, name: user.name } };
  }
}''',

    # Auth Controller
    "apps\\backend\\src\\auth\\auth.controller.ts": '''import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: any): Promise<any> {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any): Promise<any> {
    return this.authService.login(body.email, body.password);
  }
}''',

    # JWT Strategy
    "apps\\backend\\src\\auth\\strategies\\jwt.strategy.ts": '''import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { UnauthorizedException } from '@/common/exceptions';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');
    return { id: user.id, email: user.email, role: user.role };
  }
}''',

    # JWT Guard
    "apps\\backend\\src\\common\\guards\\jwt-auth.guard.ts": '''import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const JwtAuthGuard = () => UseGuards(AuthGuard('jwt'));''',

    # Current User Decorator
    "apps\\backend\\src\\common\\decorators\\current-user.decorator.ts": '''import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});''',

    # Users Module
    "apps\\backend\\src\\users\\users.module.ts": '''import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}''',

    # Users Service
    "apps\\backend\\src\\users\\users.service.ts": '''import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { NotFoundException } from '@/common/exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(private prisma: PrismaService) {}

  async getUserById(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User');
    const { password, ...rest } = user;
    return rest;
  }
}''',

    # Users Controller
    "apps\\backend\\src\\users\\users.controller.ts": '''import { Controller, Get, UseGuards, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard())
  async getProfile(@CurrentUser() user: any): Promise<any> {
    return this.usersService.getUserById(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard())
  async getUserById(@Param('id') id: string): Promise<any> {
    return this.usersService.getUserById(id);
  }
}''',

    # Teams Module
    "apps\\backend\\src\\teams\\teams.module.ts": '''import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';

@Module({
  imports: [PrismaModule],
  providers: [TeamsService],
  controllers: [TeamsController],
  exports: [TeamsService],
})
export class TeamsModule {}''',

    # Teams Service
    "apps\\backend\\src\\teams\\teams.service.ts": '''import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { NotFoundException, ConflictException } from '@/common/exceptions';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger('TeamsService');

  constructor(private prisma: PrismaService) {}

  async createTeam(userId: string, name: string, slug: string): Promise<any> {
    const existing = await this.prisma.team.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Team slug already exists');

    const team = await this.prisma.team.create({
      data: {
        name,
        slug,
        members: { create: { userId, role: 'OWNER' } },
      },
      include: { members: true },
    });

    this.logger.log(`Team created: ${name}`);
    return team;
  }

  async getTeamById(id: string): Promise<any> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: { members: { include: { user: true } } },
    });
    if (!team) throw new NotFoundException('Team');
    return team;
  }

  async getUserTeams(userId: string): Promise<any[]> {
    return this.prisma.team.findMany({
      where: { members: { some: { userId } } },
      include: { members: true },
    });
  }
}''',

    # Teams Controller
    "apps\\backend\\src\\teams\\teams.controller.ts": '''import { Controller, Post, Get, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async createTeam(@CurrentUser() user: any, @Body() body: any): Promise<any> {
    return this.teamsService.createTeam(user.id, body.name, body.slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard())
  async getTeam(@Param('id') id: string): Promise<any> {
    return this.teamsService.getTeamById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard())
  async getUserTeams(@CurrentUser() user: any): Promise<any> {
    return this.teamsService.getUserTeams(user.id);
  }
}''',

    # Projects Module
    "apps\\backend\\src\\projects\\projects.module.ts": '''import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}''',

    # Projects Service
    "apps\\backend\\src\\projects\\projects.service.ts": '''import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { NotFoundException } from '@/common/exceptions';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger('ProjectsService');

  constructor(private prisma: PrismaService) {}

  async createProject(userId: string, name: string, description?: string, teamId?: string): Promise<any> {
    const slug = name.toLowerCase().replace(/\\s+/g, '-');
    const project = await this.prisma.project.create({
      data: { name, slug, description, createdBy: userId, teamId },
      include: { creator: true },
    });
    this.logger.log(`Project created: ${name}`);
    return project;
  }

  async getProjectById(id: string): Promise<any> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { creator: true, workspaces: true },
    });
    if (!project) throw new NotFoundException('Project');
    return project;
  }

  async getUserProjects(userId: string): Promise<any[]> {
    return this.prisma.project.findMany({
      where: { createdBy: userId, deletedAt: null },
      include: { creator: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}''',

    # Projects Controller
    "apps\\backend\\src\\projects\\projects.controller.ts": '''import { Controller, Post, Get, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async createProject(@CurrentUser() user: any, @Body() body: any): Promise<any> {
    return this.projectsService.createProject(user.id, body.name, body.description, body.teamId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard())
  async getProject(@Param('id') id: string): Promise<any> {
    return this.projectsService.getProjectById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard())
  async getUserProjects(@CurrentUser() user: any): Promise<any> {
    return this.projectsService.getUserProjects(user.id);
  }
}''',

    # Workspaces Module
    "apps\\backend\\src\\workspaces\\workspaces.module.ts": '''import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

@Module({
  imports: [PrismaModule],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}''',

    # Workspaces Service
    "apps\\backend\\src\\workspaces\\workspaces.service.ts": '''import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { NotFoundException } from '@/common/exceptions';

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger('WorkspacesService');

  constructor(private prisma: PrismaService) {}

  async createWorkspace(projectId: string, userId: string, name: string, teamId?: string): Promise<any> {
    const workspace = await this.prisma.workspace.create({
      data: { name, projectId, ownerId: userId, teamId },
      include: { nodes: true, edges: true },
    });
    this.logger.log(`Workspace created: ${name}`);
    return workspace;
  }

  async getWorkspaceById(id: string): Promise<any> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { nodes: true, edges: true, project: true, owner: true },
    });
    if (!workspace) throw new NotFoundException('Workspace');
    return workspace;
  }

  async createNode(workspaceId: string, type: string, label: string, position?: any): Promise<any> {
    return this.prisma.workspaceNode.create({
      data: { workspaceId, type, label, position: position || {} },
    });
  }

  async createEdge(workspaceId: string, sourceId: string, targetId: string, type?: string): Promise<any> {
    return this.prisma.workspaceEdge.create({
      data: { workspaceId, sourceId, targetId, type: type || 'CONNECTION' },
    });
  }
}''',

    # Workspaces Controller
    "apps\\backend\\src\\workspaces\\workspaces.controller.ts": '''import { Controller, Post, Get, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(@CurrentUser() user: any, @Body() body: any): Promise<any> {
    return this.workspacesService.createWorkspace(body.projectId, user.id, body.name, body.teamId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard())
  async getWorkspace(@Param('id') id: string): Promise<any> {
    return this.workspacesService.getWorkspaceById(id);
  }

  @Post(':id/nodes')
  @UseGuards(JwtAuthGuard())
  async createNode(@Param('id') workspaceId: string, @Body() body: any): Promise<any> {
    return this.workspacesService.createNode(workspaceId, body.type, body.label, body.position);
  }

  @Post(':id/edges')
  @UseGuards(JwtAuthGuard())
  async createEdge(@Param('id') workspaceId: string, @Body() body: any): Promise<any> {
    return this.workspacesService.createEdge(workspaceId, body.sourceId, body.targetId, body.type);
  }
}''',

    # AI Module
    "apps\\backend\\src\\ai\\ai.module.ts": '''import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';

@Module({
  imports: [PrismaModule],
  providers: [AIService],
  controllers: [AIController],
  exports: [AIService],
})
export class AIModule {}''',

    # AI Service
    "apps\\backend\\src\\ai\\ai.service.ts": '''import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService {
  private readonly logger = new Logger('AIService');

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async analyzeProject(projectId: string, analysisType: string): Promise<any> {
    this.logger.log(`Analyzing project ${projectId} with type ${analysisType}`);
    const aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL');
    
    const analysis = await this.prisma.aiAnalysis.create({
      data: {
        projectId,
        type: analysisType,
        result: { status: 'pending', message: 'Analysis queued' },
      },
    });

    return analysis;
  }

  async generateDocumentation(projectId: string): Promise<any> {
    return this.analyzeProject(projectId, 'DOCUMENTATION');
  }

  async analyzeComplexity(projectId: string): Promise<any> {
    return this.analyzeProject(projectId, 'COMPLEXITY');
  }
}''',

    # AI Controller
    "apps\\backend\\src\\ai\\ai.controller.ts": '''import { Controller, Post, Get, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('analyze/:projectId')
  @UseGuards(JwtAuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async analyze(@Param('projectId') projectId: string, @Body() body: any): Promise<any> {
    return this.aiService.analyzeProject(projectId, body.type);
  }

  @Post('documentation/:projectId')
  @UseGuards(JwtAuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async generateDocumentation(@Param('projectId') projectId: string): Promise<any> {
    return this.aiService.generateDocumentation(projectId);
  }

  @Post('complexity/:projectId')
  @UseGuards(JwtAuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async analyzeComplexity(@Param('projectId') projectId: string): Promise<any> {
    return this.aiService.analyzeComplexity(projectId);
  }
}''',
}

def create_project():
    """Create all project files and directories"""
    
    # Create directories
    print("Creating directory structure...")
    dirs_created = set()
    
    for file_path in FILES_TO_CREATE.keys():
        dir_path = os.path.dirname(os.path.join(ROOT, file_path))
        if dir_path and dir_path not in dirs_created:
            Path(dir_path).mkdir(parents=True, exist_ok=True)
            dirs_created.add(dir_path)
            print(f"  📁 {file_path.split(os.sep)[0]}")
    
    # Create files
    print("\nCreating application files...")
    files_created = 0
    
    for file_path, content in FILES_TO_CREATE.items():
        full_path = os.path.join(ROOT, file_path)
        try:
            Path(full_path).write_text(content, encoding='utf-8')
            files_created += 1
        except Exception as e:
            print(f"  ❌ Error creating {file_path}: {e}")
    
    print(f"\n✅ Project initialization complete!")
    print(f"   - {len(dirs_created)} directories created")
    print(f"   - {files_created} files created")

if __name__ == '__main__':
    create_project()
