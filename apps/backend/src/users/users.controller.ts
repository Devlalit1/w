import { Controller, Get, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() avatar?: string;
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Put('profile')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get(':id')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Delete('account')
  @JwtAuthGuard()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete current user account' })
  async deleteAccount(@CurrentUser() user: any) {
    return this.usersService.deleteAccount(user.id);
  }
}
