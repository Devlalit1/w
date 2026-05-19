import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger('ProjectsService');

  constructor(private readonly prisma: PrismaService) {}

  async createProject(userId: string, name: string, description?: string, teamId?: string) {
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const project = await this.prisma.project.create({
      data: { name, slug, description, createdBy: userId, teamId },
      include: { creator: { select: { id: true, name: true, avatar: true } }, team: true },
    });
    this.logger.log(`Project created: ${name} by user ${userId}`);
    return project;
  }

  async getProjectById(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        team: true,
        workspaces: true,
        analyses: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async getUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { createdBy: userId, deletedAt: null },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        team: true,
        workspaces: { take: 3 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProject(id: string, userId: string, data: { name?: string; description?: string; isPublic?: boolean }) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.createdBy !== userId) throw new ForbiddenException('Not authorized to update this project');

    return this.prisma.project.update({
      where: { id },
      data,
      include: { creator: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async deleteProject(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.createdBy !== userId) throw new ForbiddenException('Not authorized to delete this project');

    await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Project deleted successfully' };
  }
}
