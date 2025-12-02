import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import { CreateHelperProfileDto } from './dto/create-helper-profile.dto';
import { SearchHelpersDto } from './dto/search-helpers.dto';
import { UpdateHelperProfileDto } from './dto/update-helper-profile.dto';
import { HelpersService } from './helpers.service';

@Controller('helpers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HelpersController {
  constructor(private readonly helpersService: HelpersService) {}

  @Post()
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  createProfile(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Body() createDto: CreateHelperProfileDto
  ) {
    return this.helpersService.createProfile(req.user.id, createDto);
  }

  @Get('search')
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  search(@Query() searchDto: SearchHelpersDto) {
    return this.helpersService.searchHelpers(searchDto);
  }

  @Get(':id')
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  getProfile(@Param('id') id: string) {
    return this.helpersService.getProfileById(id);
  }

  @Get(':id/feedback')
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  getHelperFeedback(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.helpersService.getHelperFeedback(
      id,
      Number(page) || 1,
      Number(limit) || 20
    );
  }

  @Patch(':id')
  @Roles('HELPER', 'ADMIN')
  updateProfile(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Param('id') id: string,
    @Body() updateDto: UpdateHelperProfileDto
  ) {
    return this.helpersService.updateProfile(req.user.id, id, updateDto);
  }

  @Delete(':id')
  @Roles('HELPER', 'ADMIN')
  deleteProfile(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Param('id') id: string
  ) {
    return this.helpersService.deleteProfile(req.user.id, id);
  }
}
