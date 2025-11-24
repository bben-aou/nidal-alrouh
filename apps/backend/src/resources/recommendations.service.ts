import { Injectable } from '@nestjs/common';
import { ResourceType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { ResourceInteractionsService } from './resource-interactions.service';

interface RecommendationScore {
  resourceId: string;
  score: number;
  resource: any;
}

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly interactions: ResourceInteractionsService
  ) {}

  /**
   * Get personalized recommendations for a user
   * Algorithm: Tag-based scoring with diversity and recency factors
   */
  async getRecommendations(userId: string, limit = 10) {
    const preferences = await this.interactions.getUserPreferences(userId);

    const completedResources =
      await this.interactions.getCompletedResources(userId);
    const completedIds = completedResources.map((r) => r.id);

    const allResources = await this.prisma.resource.findMany({
      where: {
        id: {
          notIn: completedIds,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (preferences.length === 0) {
      return this.getPopularResources(limit, completedIds);
    }

    const tagScores = new Map<string, number>();
    let maxScore = 0;
    preferences.forEach((pref) => {
      tagScores.set(pref.tag, pref.score);
      maxScore = Math.max(maxScore, pref.score);
    });

    const scoredResources: RecommendationScore[] = allResources.map(
      (resource) => {
        const score = this.calculateResourceScore(
          resource,
          tagScores,
          maxScore
        );
        return {
          resourceId: resource.id,
          score,
          resource,
        };
      }
    );

    const topResources = this.applyDiversityFilter(scoredResources, limit);

    return topResources.map((item) => item.resource);
  }

  /**
   * Calculate recommendation score for a resource
   * Score = (Tag Match × 0.6) + (Recency × 0.2) + (Type Diversity × 0.2)
   */
  private calculateResourceScore(
    resource: any,
    tagScores: Map<string, number>,
    maxTagScore: number
  ): number {
    let tagMatchScore = 0;
    if (resource.tags && resource.tags.length > 0) {
      const matchingTags = resource.tags.filter((tag: string) =>
        tagScores.has(tag)
      );
      if (matchingTags.length > 0) {
        const totalScore = matchingTags.reduce(
          (sum: number, tag: string) => sum + (tagScores.get(tag) || 0),
          0
        );
        tagMatchScore = totalScore / (maxTagScore * resource.tags.length);
      }
    }

    const daysSinceCreation =
      (Date.now() - new Date(resource.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysSinceCreation / 365);
    const combinedScore = tagMatchScore * 0.7 + recencyScore * 0.3;

    return combinedScore;
  }

  /**
   * Apply diversity filter to ensure variety in resource types
   */
  private applyDiversityFilter(
    scoredResources: RecommendationScore[],
    limit: number
  ): RecommendationScore[] {
    scoredResources.sort((a, b) => b.score - a.score);

    const selected: RecommendationScore[] = [];
    const typeCounts = {
      ARTICLE: 0,
      VIDEO: 0,
      LINK: 0,
    };

    const maxPerType = Math.ceil(limit / 3);

    for (const item of scoredResources) {
      if (selected.length >= limit) break;

      const type = item.resource.type as ResourceType;
      if (typeCounts[type] < maxPerType) {
        selected.push(item);
        typeCounts[type]++;
      }
    }

    if (selected.length < limit) {
      for (const item of scoredResources) {
        if (selected.length >= limit) break;
        if (!selected.find((s) => s.resourceId === item.resourceId)) {
          selected.push(item);
        }
      }
    }

    return selected;
  }

  /**
   * Get popular resources for new users with no preferences
   */
  private async getPopularResources(limit: number, excludeIds: string[] = []) {
    const viewCounts = await this.prisma.resourceView.groupBy({
      by: ['resourceId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      where: {
        resourceId: {
          notIn: excludeIds,
        },
      },
      take: limit,
    });

    const resourceIds = viewCounts.map((v) => v.resourceId);

    if (resourceIds.length === 0) {
      return this.prisma.resource.findMany({
        where: {
          id: {
            notIn: excludeIds,
          },
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    return this.prisma.resource.findMany({
      where: {
        id: {
          in: resourceIds,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  /**
   * Get trending resources (most viewed in last 7 days)
   */
  async getTrendingResources(limit = 10) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const viewCounts = await this.prisma.resourceView.groupBy({
      by: ['resourceId'],
      _count: {
        id: true,
      },
      where: {
        viewedAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    const resourceIds = viewCounts.map((v) => v.resourceId);

    if (resourceIds.length === 0) {
      return this.prisma.resource.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    return this.prisma.resource.findMany({
      where: {
        id: {
          in: resourceIds,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  /**
   * Get similar resources based on tags
   */
  async getSimilarResources(resourceId: string, limit = 5) {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (resource?.tags?.length === 0) {
      return [];
    }

    const similarResources = await this.prisma.resource.findMany({
      where: {
        id: {
          not: resourceId,
        },
        tags: {
          hasSome: resource.tags,
        },
      },
      take: limit * 2,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const scored = similarResources.map((r) => {
      const overlap = r.tags.filter((tag) => resource.tags.includes(tag));
      return {
        resource: r,
        score: overlap.length,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((item) => item.resource);
  }
}
