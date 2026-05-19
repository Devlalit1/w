import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: { id: true, email: true, name: true, avatar: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, data: { name?: string; avatar?: string }) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, avatar: true, role: true, updatedAt: true },
    });
    this.logger.log(`Profile updated for user ${id}`);
    return user;
  }

  async deleteAccount(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(`Account soft-deleted for user ${id}`);
    return { message: 'Account deleted successfully' };
  }
}
