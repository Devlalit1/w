import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString() name: string;
  @IsString() projectId: string;
}

export class CreateNodeDto {
  @IsString() type: string;
  @IsString() label: string;
  @IsOptional() position?: { x: number; y: number; z: number };
  @IsOptional() data?: any;
  @IsString() @IsOptional() color?: string;
}

export class CreateEdgeDto {
  @IsString() sourceId: string;
  @IsString() targetId: string;
  @IsString() @IsOptional() type?: string;
  @IsString() @IsOptional() label?: string;
}

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new workspace' })
  async createWorkspace(@CurrentUser() user: any, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(dto.projectId, user.id, dto.name);
  }

  @Get(':id')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get workspace with nodes and edges' })
  async getWorkspace(@Param('id') id: string) {
    return this.workspacesService.getWorkspaceById(id);
  }

  @Get('project/:projectId')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get all workspaces for a project' })
  async getProjectWorkspaces(@Param('projectId') projectId: string) {
    return this.workspacesService.getWorkspacesByProject(projectId);
  }

  @Put(':id/data')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Update workspace data' })
  async updateWorkspaceData(@Param('id') id: string, @Body() data: any) {
    return this.workspacesService.updateWorkspaceData(id, data);
  }

  @Post(':id/nodes')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a node to workspace' })
  async createNode(@Param('id') workspaceId: string, @Body() dto: CreateNodeDto) {
    return this.workspacesService.createNode(workspaceId, dto.type, dto.label, dto.position, dto.data, dto.color);
  }

  @Put('nodes/:nodeId')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Update a node' })
  async updateNode(@Param('nodeId') nodeId: string, @Body() updates: any) {
    return this.workspacesService.updateNode(nodeId, updates);
  }

  @Delete('nodes/:nodeId')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Delete a node' })
  async deleteNode(@Param('nodeId') nodeId: string) {
    return this.workspacesService.deleteNode(nodeId);
  }

  @Post(':id/edges')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an edge to workspace' })
  async createEdge(@Param('id') workspaceId: string, @Body() dto: CreateEdgeDto) {
    return this.workspacesService.createEdge(workspaceId, dto.sourceId, dto.targetId, dto.type, dto.label);
  }

  @Delete('edges/:edgeId')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Delete an edge' })
  async deleteEdge(@Param('edgeId') edgeId: string) {
    return this.workspacesService.deleteEdge(edgeId);
  }
}
