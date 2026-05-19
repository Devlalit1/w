import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';

@Module({
  imports: [PrismaModule],
  providers: [TeamsService],
  controllers: [TeamsController],
  exports: [TeamsService],
})
export class TeamsModule {}
