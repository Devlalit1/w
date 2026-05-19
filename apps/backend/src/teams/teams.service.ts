import { Injectable, NotFoundException, ConflictException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger('TeamsService');

  constructor(private readonly prisma: PrismaService) {}

  async createTeam(userId: string, name: string, slug: string) {
    const existing = await this.prisma.team.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Team slug already taken');

    const team = await this.prisma.team.create({
      data: {
        name,
        slug,
        members: { create: { userId, role: 'OWNER' } },
      },
      include: { members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } } },
    });
    this.logger.log(`Team created: ${name} by user ${userId}`);
    return team;
  }

  async getTeamById(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
        projects: { where: { deletedAt: null }, take: 10 },
      },
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async getUserTeams(userId: string) {
    return this.prisma.team.findMany({
      where: { members: { some: { userId } } },
      include: { members: { include: { user: { select: { id: true, name: true, avatar: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addMember(teamId: string, requesterId: string, targetEmail: string, role: string = 'MEMBER') {
    const requester = await this.prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId: requesterId } } });
    if (!requester || !['OWNER', 'ADMIN'].includes(requester.role)) throw new ForbiddenException('Only team owners/admins can add members');

    const targetUser = await this.prisma.user.findUnique({ where: { email: targetEmail } });
    if (!targetUser) throw new NotFoundException('User not found');

    return this.prisma.teamMember.create({
      data: { teamId, userId: targetUser.id, role: role as any },
    });
  }

  async removeMember(teamId: string, requesterId: string, targetUserId: string) {
    const requester = await this.prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId: requesterId } } });
    if (!requester || requester.role !== 'OWNER') throw new ForbiddenException('Only team owners can remove members');

    await this.prisma.teamMember.delete({ where: { teamId_userId: { teamId, userId: targetUserId } } });
    return { message: 'Member removed successfully' };
  }
}
