import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string | null;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    this.logger.log(`New user registered: ${email}`);
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email, deletedAt: null } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    this.logger.log(`User logged in: ${email}`);
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
  }
}
