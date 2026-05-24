import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class AnalyzeDto {
  @IsString() @IsOptional() projectId?: string;
  @IsString() @IsOptional() description?: string;
}

export class AnalyzeArchitectureDto {
  @IsString() @IsOptional() description?: string;
}

export class GenerateDocDto {
  @IsArray() @IsOptional() nodes?: any[];
}

export class AnalyzeComplexityDto {
  @IsString() code: string;
}

@ApiTags('AI')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  /**
   * POST /api/ai/analyze — called by frontend AI page
   * Body: { projectId: string }
   */
  @Post('analyze')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Analyze project (body contains projectId)' })
  async analyzePost(@Body() dto: AnalyzeDto) {
    const projectId = dto.projectId || 'unknown';
    const description = dto.description || 'Auto-analyze project architecture';
    return this.aiService.analyzeArchitecture(projectId, description);
  }

  /**
   * POST /api/ai/analyze/:projectId — legacy param-based route
   */
  @Post('analyze/:projectId')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Analyze project architecture with Gemini AI' })
  async analyzeArchitecture(
    @Param('projectId') projectId: string,
    @Body() dto: AnalyzeArchitectureDto,
  ) {
    return this.aiService.analyzeArchitecture(projectId, dto.description || 'Analyze architecture');
  }

  @Post('documentation/:projectId')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate documentation for project' })
  async generateDocumentation(
    @Param('projectId') projectId: string,
    @Body() dto: GenerateDocDto,
  ) {
    return this.aiService.generateDocumentation(projectId, dto.nodes || []);
  }

  @Post('complexity/:projectId')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Analyze code complexity' })
  async analyzeComplexity(
    @Param('projectId') projectId: string,
    @Body() dto: AnalyzeComplexityDto,
  ) {
    return this.aiService.analyzeComplexity(projectId, dto.code);
  }

  @Get('analyses/:projectId')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get all AI analyses for a project' })
  async getAnalyses(@Param('projectId') projectId: string) {
    return this.aiService.getAnalyses(projectId);
  }
}
