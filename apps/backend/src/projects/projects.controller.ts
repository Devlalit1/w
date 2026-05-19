import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString() @MinLength(2) name: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() teamId?: string;
}

export class UpdateProjectDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() description?: string;
  @IsBoolean() @IsOptional() isPublic?: boolean;
}

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  async createProject(@CurrentUser() user: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(user.id, dto.name, dto.description, dto.teamId);
  }

  @Get()
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get all projects for current user' })
  async getUserProjects(@CurrentUser() user: any) {
    return this.projectsService.getUserProjects(user.id);
  }

  @Get(':id')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get project by ID' })
  async getProject(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.getProjectById(id, user.id);
  }

  @Put(':id')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Update project' })
  async updateProject(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, user.id, dto);
  }

  @Delete(':id')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Delete project (soft delete)' })
  async deleteProject(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.deleteProject(id, user.id);
  }
}
