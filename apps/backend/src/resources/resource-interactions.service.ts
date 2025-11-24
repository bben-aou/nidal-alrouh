import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourceInteractionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record a resource view
   */
  async recordView(userId: string, resourceId: string) {
    return this.prisma.resourceView.create({
      data: {
        userId,
        resourceId,
      },
    });
  }

  /**
   * Get recently viewed resources for a user
   */
  async getRecentViews(userId: string, limit = 20) {
    const views = await this.prisma.resourceView.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: limit,
      distinct: ['resourceId'],
      include: {
        resource: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return views.map((view) => ({
      ...view.resource,
      viewedAt: view.viewedAt,
    }));
  }

  /**
   * Add a bookmark
   */
  async addBookmark(userId: string, resourceId: string) {
    return this.prisma.resourceBookmark.upsert({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        userId,
        resourceId,
        progress: 0,
      },
      include: {
        resource: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Remove a bookmark
   */
  async removeBookmark(userId: string, resourceId: string) {
    return this.prisma.resourceBookmark.delete({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });
  }

  /**
   * Update bookmark progress
   */
  async updateBookmarkProgress(
    userId: string,
    resourceId: string,
    progress: number
  ) {
    return this.prisma.resourceBookmark.update({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
      data: {
        progress: Math.min(100, Math.max(0, progress)),
      },
    });
  }

  /**
   * Get all bookmarks for a user
   */
  async getBookmarks(userId: string) {
    return this.prisma.resourceBookmark.findMany({
      where: { userId },
      orderBy: [{ progress: 'asc' }, { updatedAt: 'desc' }],
      include: {
        resource: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Mark a resource as completed
   */
  async markComplete(userId: string, resourceId: string) {
    await this.prisma.resourceBookmark.updateMany({
      where: {
        userId,
        resourceId,
      },
      data: {
        progress: 100,
      },
    });

    return this.prisma.resourceCompletion.upsert({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId,
        resourceId,
      },
    });
  }

  /**
   * Get user's completed resources
   */
  async getCompletedResources(userId: string) {
    const completions = await this.prisma.resourceCompletion.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        resource: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return completions.map((completion) => ({
      ...completion.resource,
      completedAt: completion.completedAt,
    }));
  }

  /**
   * Update user preferences based on interactions
   * This is called when user views, bookmarks, or completes a resource
   */
  async updateUserPreferences(userId: string, tags: string[]) {
    if (tags?.length === 0) return;

    // Update or create preference for each tag
    const updates = tags.map((tag) =>
      this.prisma.userResourcePreference.upsert({
        where: {
          userId_tag: {
            userId,
            tag,
          },
        },
        update: {
          score: {
            increment: 1,
          },
        },
        create: {
          userId,
          tag,
          score: 1,
        },
      })
    );

    await Promise.all(updates);
  }

  /**
   * Get user's tag preferences sorted by score
   */
  async getUserPreferences(userId: string) {
    return this.prisma.userResourcePreference.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
    });
  }

  /**
   * Get user statistics for resources
   */
  async getUserStats(userId: string) {
    const [totalViews, bookmarkCount, completionCount, preferences] =
      await Promise.all([
        this.prisma.resourceView.count({
          where: { userId },
        }),
        this.prisma.resourceBookmark.count({
          where: { userId },
        }),
        this.prisma.resourceCompletion.count({
          where: { userId },
        }),
        this.getUserPreferences(userId),
      ]);

    const completedResources = await this.prisma.resourceCompletion.findMany({
      where: { userId },
      include: {
        resource: {
          select: {
            type: true,
          },
        },
      },
    });

    const typeStats = completedResources.reduce(
      (acc, completion) => {
        const { type } = completion.resource;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalResourcesByType = await this.prisma.resource.groupBy({
      by: ['type'],
      _count: true,
    });

    const typeTotals = totalResourcesByType.reduce(
      (acc, item) => {
        acc[item.type] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalViews,
      bookmarkCount,
      completionCount,
      topPreferences: preferences.slice(0, 5),
      byType: {
        ARTICLE: {
          completed: typeStats.ARTICLE || 0,
          total: typeTotals.ARTICLE || 0,
        },
        VIDEO: {
          completed: typeStats.VIDEO || 0,
          total: typeTotals.VIDEO || 0,
        },
        LINK: {
          completed: typeStats.LINK || 0,
          total: typeTotals.LINK || 0,
        },
      },
    };
  }

  /**
   * Check if a resource is bookmarked by user
   */
  async isBookmarked(userId: string, resourceId: string): Promise<boolean> {
    const bookmark = await this.prisma.resourceBookmark.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });
    return !!bookmark;
  }

  /**
   * Check if a resource is completed by user
   */
  async isCompleted(userId: string, resourceId: string): Promise<boolean> {
    const completion = await this.prisma.resourceCompletion.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });
    return !!completion;
  }
}
