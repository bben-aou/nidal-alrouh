import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';

import type { User } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('search')
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiOkResponse({ description: 'User search results' })
  async search(@Query('q') q: string) {
    const results = await this.usersService.search(q);
    return { data: results, message: 'Users found' };
  }
}
