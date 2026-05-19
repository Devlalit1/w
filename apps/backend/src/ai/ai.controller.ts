import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class AnalyzeArchitectureDto {
  @IsString() description: string;
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

  @Post('analyze/:projectId')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Analyze project architecture with Gemini AI' })
  async analyzeArchitecture(@Param('projectId') projectId: string, @Body() dto: AnalyzeArchitectureDto) {
    return this.aiService.analyzeArchitecture(projectId, dto.description);
  }

  @Post('documentation/:projectId')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate documentation for project' })
  async generateDocumentation(@Param('projectId') projectId: string, @Body() dto: GenerateDocDto) {
    return this.aiService.generateDocumentation(projectId, dto.nodes || []);
  }

  @Post('complexity/:projectId')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Analyze code complexity' })
  async analyzeComplexity(@Param('projectId') projectId: string, @Body() dto: AnalyzeComplexityDto) {
    return this.aiService.analyzeComplexity(projectId, dto.code);
  }

  @Get('analyses/:projectId')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get all AI analyses for a project' })
  async getAnalyses(@Param('projectId') projectId: string) {
    return this.aiService.getAnalyses(projectId);
  }
}
