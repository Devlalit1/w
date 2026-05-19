import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';

@Module({
  imports: [PrismaModule],
  providers: [AIService],
  controllers: [AIController],
  exports: [AIService],
})
export class AIModule {}
