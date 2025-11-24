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
  ParseIntPipe,
} from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { RecommendationsService } from './recommendations.service';
import { ResourceInteractionsService } from './resource-interactions.service';
import { ResourcesService } from './resources.service';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly interactionsService: ResourceInteractionsService,
    private readonly recommendationsService: RecommendationsService
  ) {}

  @Post()
  create(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Body() createResourceDto: CreateResourceDto
  ) {
    return this.resourcesService.create(request.user.id, createResourceDto);
  }

  @Get()
  findAll(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('type') type?: ResourceType,
    @Query('tags') tags?: string | string[],
    @Query('search') search?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;

    return this.resourcesService.findAll({
      type,
      tags: tagsArray,
      search,
      page,
      limit,
      userId: request.user.id,
    });
  }

  @Get('recommended')
  getRecommended(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.recommendationsService.getRecommendations(
      request.user.id,
      limit
    );
  }

  @Get('trending')
  getTrending(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.recommendationsService.getTrendingResources(limit);
  }

  @Get('bookmarks')
  getBookmarks(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.interactionsService.getBookmarks(request.user.id);
  }

  @Get('recent-views')
  getRecentViews(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.interactionsService.getRecentViews(request.user.id, limit);
  }

  @Get('stats')
  getUserStats(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.interactionsService.getUserStats(request.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.resourcesService.findOne(id, request.user.id);
  }

  @Get(':id/similar')
  getSimilar(
    @Param('id') id: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.recommendationsService.getSimilarResources(id, limit);
  }

  @Post(':id/view')
  recordView(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.interactionsService.recordView(request.user.id, id);
  }

  @Post(':id/bookmark')
  async addBookmark(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const resource = await this.resourcesService.findOne(id);
    if (resource.tags && resource.tags.length > 0) {
      await this.interactionsService.updateUserPreferences(
        request.user.id,
        resource.tags
      );
    }

    return this.interactionsService.addBookmark(request.user.id, id);
  }

  @Delete(':id/bookmark')
  removeBookmark(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.interactionsService.removeBookmark(request.user.id, id);
  }

  @Patch(':id/bookmark/progress')
  updateBookmarkProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.interactionsService.updateBookmarkProgress(
      request.user.id,
      id,
      progress
    );
  }

  @Post(':id/complete')
  async markComplete(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const resource = await this.resourcesService.findOne(id);
    if (resource.tags && resource.tags.length > 0) {
      await Promise.all([
        this.interactionsService.updateUserPreferences(
          request.user.id,
          resource.tags
        ),
        this.interactionsService.updateUserPreferences(
          request.user.id,
          resource.tags
        ),
      ]);
    }

    return this.interactionsService.markComplete(request.user.id, id);
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
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
