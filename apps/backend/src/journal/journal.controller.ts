import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Reflection, SupportedPromptLocale } from '@prisma/client';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import {
  CreateReflectionDto,
  GetPromptsDto,
  PromptsListResponseDto,
  PromptResponseDto,
  GetJournalStatsDto,
  JournalStatsResponse,
  GetJournalAnalyticsDto,
  JournalAnalyticsResponseDto,
} from './dto';
import { JournalService } from './journal.service';
import { PromptsService } from './prompts.service';

interface CreateReflectionResponse {
  success: boolean;
  message: string;
  data: Reflection;
}

interface DeleteReflectionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    deletedAt: string;
  };
}

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(
    private readonly journalService: JournalService,
    private readonly promptsService: PromptsService
  ) {}

  @Post('reflections')
  @HttpCode(HttpStatus.CREATED)
  async createReflection(
    @Body() createReflectionDto: CreateReflectionDto,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ): Promise<CreateReflectionResponse> {
    const reflection = await this.journalService.createReflection(
      request.user.id,
      createReflectionDto
    );

    return {
      success: true,
      message: 'Reflection created successfully',
      data: reflection,
    };
  }

  @Get('reflections')
  async getUserReflections(
    @Req() request: FastifyRequest & { user: AuthResponse['user'] },
    @Query('q') searchQuery?: string
  ): Promise<any[]> {
    return this.journalService.getReflectionsByUser(
      request.user.id,
      searchQuery
    );
  }

  @Get('reflections/:id')
  async getReflectionById(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ): Promise<Reflection> {
    return this.journalService.getReflectionById(id, request.user.id);
  }

  @Put('reflections/:id')
  async updateReflection(
    @Param('id') id: string,
    @Body() updateReflectionDto: Partial<CreateReflectionDto>,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ): Promise<Reflection> {
    return this.journalService.updateReflection(
      id,
      request.user.id,
      updateReflectionDto
    );
  }

  @Delete('reflections/:id')
  @HttpCode(HttpStatus.OK)
  async deleteReflection(
    @Param('id') id: string,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ): Promise<DeleteReflectionResponse> {
    const deletedReflection = await this.journalService.deleteReflection(
      id,
      request.user.id
    );

    return {
      success: true,
      message: 'Reflection deleted successfully',
      data: {
        id: deletedReflection.id,
        deletedAt: new Date().toISOString(),
      },
    };
  }

  @Get('stats')
  async getJournalStats(
    @Query() query: GetJournalStatsDto,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ): Promise<{ data: JournalStatsResponse; message: string }> {
    const stats = await this.journalService.getUserStats(
      request.user.id,
      query
    );

    return {
      data: stats,
      message: 'Journal statistics retrieved successfully',
    };
  }

  @Get('analytics')
  async getJournalAnalytics(
    @Query() query: GetJournalAnalyticsDto,
    @Req() request: FastifyRequest & { user: AuthResponse['user'] }
  ): Promise<{ data: JournalAnalyticsResponseDto; message: string }> {
    const analytics = await this.journalService.getJournalAnalytics(
      request.user.id,
      query
    );

    return {
      data: analytics,
      message: 'Journal analytics retrieved successfully',
    };
  }
}

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  async getPrompts(
    @Query() query: GetPromptsDto
  ): Promise<PromptsListResponseDto> {
    return this.promptsService.getPrompts(query);
  }

  @Get('categories')
  async getCategories(): Promise<{ categories: string[] }> {
    const categories = await this.promptsService.getAvailableCategories();
    return { categories };
  }

  @Get(':id')
  async getPromptById(
    @Param('id') id: string,
    @Query('locale') locale?: SupportedPromptLocale
  ): Promise<PromptResponseDto> {
    return this.promptsService.getPromptById(id, locale);
  }
}
