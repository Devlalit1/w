import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger('WorkspacesService');

  constructor(private readonly prisma: PrismaService) {}

  async createWorkspace(projectId: string, userId: string, name: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const workspace = await this.prisma.workspace.create({
      data: { name, projectId, ownerId: userId },
      include: { nodes: true, edges: true, project: true },
    });
    this.logger.log(`Workspace created: ${name}`);
    return workspace;
  }

  async getWorkspaceById(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true,
        project: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatar: true } },
      },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  async getWorkspacesByProject(projectId: string) {
    return this.prisma.workspace.findMany({
      where: { projectId },
      include: {
        nodes: { take: 5 },
        owner: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateWorkspaceData(id: string, data: any) {
    return this.prisma.workspace.update({
      where: { id },
      data: { data, updatedAt: new Date() },
    });
  }

  async createNode(workspaceId: string, type: string, label: string, position?: any, data?: any, color?: string) {
    return this.prisma.workspaceNode.create({
      data: {
        workspaceId,
        type: type as any,
        label,
        position: position || { x: 0, y: 0, z: 0 },
        data: data || {},
        color,
      },
    });
  }

  async updateNode(nodeId: string, updates: any) {
    return this.prisma.workspaceNode.update({ where: { id: nodeId }, data: updates });
  }

  async deleteNode(nodeId: string) {
    await this.prisma.workspaceNode.delete({ where: { id: nodeId } });
    return { message: 'Node deleted' };
  }

  async createEdge(workspaceId: string, sourceId: string, targetId: string, type?: string, label?: string) {
    return this.prisma.workspaceEdge.create({
      data: {
        workspaceId,
        sourceId,
        targetId,
        type: (type || 'CONNECTION') as any,
        label,
      },
    });
  }

  async deleteEdge(edgeId: string) {
    await this.prisma.workspaceEdge.delete({ where: { id: edgeId } });
    return { message: 'Edge deleted' };
  }
}
