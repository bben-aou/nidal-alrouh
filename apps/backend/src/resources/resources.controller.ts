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

  private async enrichResources(userId: string, resources: any[]) {
    return Promise.all(
      resources.map(async (resource) => ({
        ...resource,
        isBookmarked: await this.interactionsService.isBookmarked(
          userId,
          resource.id
        ),
        isCompleted: await this.interactionsService.isCompleted(
          userId,
          resource.id
        ),
      }))
    );
  }

  @Get('recommended')
  async getRecommended(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const resources = await this.recommendationsService.getRecommendations(
      request.user.id,
      limit
    );
    return this.enrichResources(request.user.id, resources);
  }

  @Get('trending')
  async getTrending(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const resources =
      await this.recommendationsService.getTrendingResources(limit);
    return this.enrichResources(request.user.id, resources);
  }

  @Get('bookmarks')
  getBookmarks(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.interactionsService.getBookmarks(request.user.id);
  }

  @Get('recent-views')
  async getRecentViews(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const resources = await this.interactionsService.getRecentViews(
      request.user.id,
      limit
    );
    return this.enrichResources(request.user.id, resources);
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
  async getSimilar(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const resources = await this.recommendationsService.getSimilarResources(
      id,
      limit
    );
    return this.enrichResources(request.user.id, resources);
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
