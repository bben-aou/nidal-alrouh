import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourcesService } from './resources.service';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Body() createResourceDto: CreateResourceDto
  ) {
    return this.resourcesService.create(request.user.id, createResourceDto);
  }

  @Get()
  findAll(@Query('type') type?: ResourceType) {
    return this.resourcesService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Body() updateResourceDto: UpdateResourceDto
  ) {
    return this.resourcesService.update(id, request.user.id, updateResourceDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.resourcesService.remove(id, request.user.id);
  }
}
