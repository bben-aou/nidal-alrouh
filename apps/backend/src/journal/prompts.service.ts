import { Injectable, NotFoundException } from '@nestjs/common';
import { SupportedPromptLocale } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import {
  GetPromptsDto,
  PromptResponseDto,
  PromptsListResponseDto,
} from './dto';

@Injectable()
export class PromptsService {
  private cache = new Map<
    string,
    { data: PromptResponseDto[]; timestamp: number }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private prisma: PrismaService) {}

  async getPrompts(query: GetPromptsDto): Promise<PromptsListResponseDto> {
    const {
      locale = SupportedPromptLocale.en,
      category,
      limit = 20,
      offset = 0,
    } = query;

    // Check cache first
    const cacheKey = `prompts:${locale}:${category || 'all'}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedPrompts = cached.data.slice(startIndex, endIndex);

      return {
        prompts: paginatedPrompts,
        total: cached.data.length,
        hasMore: endIndex < cached.data.length,
      };
    }

    // Fetch from database
    const whereClause: any = {
      prompt: {
        isActive: true,
      },
      locale,
    };

    if (category) {
      whereClause.prompt.category = category;
    }

    const [translations, total] = await Promise.all([
      this.prisma.promptTranslation.findMany({
        where: whereClause,
        include: {
          prompt: {
            select: {
              id: true,
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.promptTranslation.count({
        where: whereClause,
      }),
    ]);

    const prompts: PromptResponseDto[] = translations.map((translation) => ({
      id: translation.promptId,
      text: translation.text,
      tags: translation.tags,
      locale: translation.locale,
      category: translation.prompt?.category || undefined,
    }));

    // Update cache
    this.cache.set(cacheKey, {
      data: prompts,
      timestamp: Date.now(),
    });

    // Apply pagination
    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedPrompts = prompts.slice(startIndex, endIndex);

    return {
      prompts: paginatedPrompts,
      total,
      hasMore: endIndex < prompts.length,
    };
  }

  async getPromptById(
    id: string,
    locale: SupportedPromptLocale = SupportedPromptLocale.en
  ): Promise<PromptResponseDto> {
    const translation = await this.prisma.promptTranslation.findFirst({
      where: {
        prompt: {
          id,
          isActive: true,
        },
        locale,
      },
      include: {
        prompt: {
          select: {
            id: true,
            category: true,
          },
        },
      },
    });

    if (!translation) {
      // Fallback to English if requested locale not found
      if (locale !== SupportedPromptLocale.en) {
        return this.getPromptById(id, SupportedPromptLocale.en);
      }
      throw new NotFoundException('Prompt not found');
    }

    return {
      id: translation.promptId,
      text: translation.text,
      tags: translation.tags,
      locale: translation.locale,
      category: translation.prompt?.category || undefined,
    };
  }

  async getAvailableCategories(): Promise<string[]> {
    const categories = await this.prisma.prompt.findMany({
      where: {
        isActive: true,
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return categories
      .map((item) => item.category)
      .filter((category): category is string => category !== null);
  }

  // Cache invalidation method (for admin operations)
  invalidateCache(locale?: SupportedPromptLocale): void {
    if (locale) {
      // Invalidate specific locale cache
      for (const key of this.cache.keys()) {
        if (key.includes(`:${locale}:`)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }
}
