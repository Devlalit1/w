import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, MinLength, MaxLength, IsEmail, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString() @MinLength(2) @MaxLength(50) name: string;
  @IsString() @MinLength(2) @MaxLength(50) slug: string;
}

export class AddMemberDto {
  @IsEmail() email: string;
  @IsString() @IsOptional() role?: string;
}

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new team' })
  async createTeam(@CurrentUser() user: any, @Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(user.id, dto.name, dto.slug);
  }

  @Get()
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get all teams for current user' })
  async getUserTeams(@CurrentUser() user: any) {
    return this.teamsService.getUserTeams(user.id);
  }

  @Get(':id')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get team by ID' })
  async getTeam(@Param('id') id: string) {
    return this.teamsService.getTeamById(id);
  }

  @Post(':id/members')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a member to team' })
  async addMember(@Param('id') teamId: string, @CurrentUser() user: any, @Body() dto: AddMemberDto) {
    return this.teamsService.addMember(teamId, user.id, dto.email, dto.role);
  }

  @Delete(':id/members/:userId')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Remove a member from team' })
  async removeMember(@Param('id') teamId: string, @Param('userId') userId: string, @CurrentUser() user: any) {
    return this.teamsService.removeMember(teamId, user.id, userId);
  }
}
