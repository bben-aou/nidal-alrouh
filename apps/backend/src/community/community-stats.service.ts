import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CommunityStatsResponseDto } from './dto/community-stats-response.dto';
import {
  GetCommunityStatsDto,
  StatsPeriod,
} from './dto/get-community-stats.dto';

@Injectable()
export class CommunityStatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate current and previous date ranges based on the requested period or custom dates.
   * - `WEEK`: last 7 days ending today
   * - `MONTH`: last 30 days ending today
   * - `ALL`: from a fixed baseline (2020-01-01) to today
   * - `CUSTOM`: uses provided ISO `startDate` and `endDate`
   * Returns both `currentPeriod` and `previousPeriod` of equal duration.
   * @param period Requested stats period.
   * @param startDate ISO start date when `period` is `CUSTOM`.
   * @param endDate ISO end date when `period` is `CUSTOM`.
   * @returns Object with `{ currentPeriod, previousPeriod }` date ranges.
   */
  calculateDateRanges(
    period: StatsPeriod,
    startDate?: string,
    endDate?: string
  ) {
    const now = new Date();
    let currentStart: Date;
    let currentEnd: Date;

    if (period === StatsPeriod.CUSTOM && startDate && endDate) {
      currentStart = new Date(startDate);
      currentEnd = new Date(endDate);
    } else {
      currentEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );

      switch (period) {
        case StatsPeriod.MONTH: {
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 29);
          break;
        }
        case StatsPeriod.ALL: {
          currentStart = new Date(2020, 0, 1);
          break;
        }
        case StatsPeriod.WEEK:
        default: {
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 6);
          break;
        }
      }

      currentStart.setHours(0, 0, 0, 0);
    }

    const periodDuration = currentEnd.getTime() - currentStart.getTime();
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - periodDuration);

    return {
      currentPeriod: { start: currentStart, end: currentEnd },
      previousPeriod: { start: previousStart, end: previousEnd },
    };
  }

  /**
   * Aggregate counts for posts, likes, and comments within a date range.
   * @param period Date range with `start` and `end`.
   * @returns Object containing `{ posts, likes, comments }` totals for the period.
   */
  async getCountsForPeriod(period: { start: Date; end: Date }) {
    const [posts, likes, comments] = await Promise.all([
      this.prisma.post.count({
        where: { createdAt: { gte: period.start, lte: period.end } },
      }),
      this.prisma.postLike.count({
        where: { createdAt: { gte: period.start, lte: period.end } },
      }),
      this.prisma.comment.count({
        where: { createdAt: { gte: period.start, lte: period.end } },
      }),
    ]);
    return { posts, likes, comments };
  }

  /**
   * Collect unique user IDs active in the date range across posts, likes, and comments.
   * @param period Date range with `start` and `end`.
   * @returns Set of user IDs representing active members.
   */
  async getActiveUserIdsForPeriod(period: { start: Date; end: Date }) {
    const [postUsers, likeUsers, commentUsers] = await Promise.all([
      this.prisma.post.findMany({
        where: { createdAt: { gte: period.start, lte: period.end } },
        select: { userId: true },
      }),
      this.prisma.postLike.findMany({
        where: { createdAt: { gte: period.start, lte: period.end } },
        select: { userId: true },
      }),
      this.prisma.comment.findMany({
        where: { createdAt: { gte: period.start, lte: period.end } },
        select: { userId: true },
      }),
    ]);

    const userIds = new Set<string>();
    for (const p of postUsers) {
      userIds.add(p.userId);
    }
    for (const l of likeUsers) {
      userIds.add(l.userId);
    }
    for (const c of commentUsers) {
      userIds.add(c.userId);
    }
    return userIds;
  }

  /**
   * Compute community statistics for the current period and compare to a previous period.
   * Returns totals and deltas for posts, likes, comments, and active members.
   * Note: `upcomingEvents` is a placeholder until an events module exists.
   * @param userId Current user ID (reserved for future role-based filtering).
   * @param query Stats period and optional custom date range.
   * @returns Aggregated stats and ISO period boundaries.
   */
  async getStats(
    userId: string,
    query: GetCommunityStatsDto
  ): Promise<CommunityStatsResponseDto> {
    const { period = StatsPeriod.WEEK, startDate, endDate } = query;

    const { currentPeriod, previousPeriod } = this.calculateDateRanges(
      period,
      startDate,
      endDate
    );

    const [
      { posts: currentPosts, likes: currentLikes, comments: currentComments },
      currentActiveUsersSet,
    ] = await Promise.all([
      this.getCountsForPeriod(currentPeriod),
      this.getActiveUserIdsForPeriod(currentPeriod),
    ]);

    const [
      { posts: prevPosts, likes: prevLikes, comments: prevComments },
      prevActiveUsersSet,
    ] = await Promise.all([
      this.getCountsForPeriod(previousPeriod),
      this.getActiveUserIdsForPeriod(previousPeriod),
    ]);

    const activeMembers = currentActiveUsersSet.size;
    const prevActiveMembers = prevActiveUsersSet.size;

    const upcomingEvents = 0;
    const prevUpcomingEvents = 0;

    return {
      totalPosts: currentPosts,
      totalPostsChange: currentPosts - prevPosts,
      totalLikes: currentLikes,
      totalLikesChange: currentLikes - prevLikes,
      totalComments: currentComments,
      totalCommentsChange: currentComments - prevComments,
      activeMembers,
      activeMembersChange: activeMembers - prevActiveMembers,
      upcomingEvents,
      upcomingEventsChange: upcomingEvents - prevUpcomingEvents,
      period: {
        start: currentPeriod.start.toISOString(),
        end: currentPeriod.end.toISOString(),
      },
    };
  }
}
