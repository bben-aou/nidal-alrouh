import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflection, ReflectionMood, ReflectionPrivacy } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import {
  CreateReflectionDto,
  GetJournalStatsDto,
  StatsPeriod,
  JournalStatsResponse,
  GetJournalAnalyticsDto,
  AnalyticsGranularity,
  JournalAnalyticsResponseDto,
} from './dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async createReflection(
    userId: string,
    createReflectionDto: CreateReflectionDto
  ): Promise<Reflection> {
    try {
      const { title, content, mood, privacy } = createReflectionDto;

      // Validate mood enum
      if (mood && !Object.values(ReflectionMood).includes(mood)) {
        throw new BadRequestException('Invalid mood value');
      }

      // Validate privacy enum
      if (privacy && !Object.values(ReflectionPrivacy).includes(privacy)) {
        throw new BadRequestException('Invalid privacy value');
      }

      // Calculate word count
      const wordCount = this.calculateWordCount(content);

      const reflection = await this.prisma.reflection.create({
        data: {
          title,
          content,
          mood,
          privacy: privacy as ReflectionPrivacy,
          tags: createReflectionDto.tags ?? [],
          wordCount,
          userId,
        },
      });

      return reflection;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create reflection');
    }
  }

  async getReflectionsByUser(
    userId: string,
    searchQuery?: string
  ): Promise<any[]> {
    try {
      const whereClause: any = { userId };

      if (searchQuery?.trim()) {
        whereClause.OR = [
          {
            title: {
              contains: searchQuery.trim(),
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: searchQuery.trim(),
              mode: 'insensitive',
            },
          },
        ];
      }

      const reflections = await this.prisma.reflection.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reflections;
    } catch {
      throw new BadRequestException('Failed to retrieve reflections');
    }
  }

  async getReflectionById(id: string, userId: string): Promise<Reflection> {
    try {
      const reflection = await this.prisma.reflection.findUnique({
        where: { id },
      });

      if (!reflection) {
        throw new NotFoundException('Reflection not found');
      }

      // Check if user owns the reflection or if it's public
      if (
        reflection.userId !== userId &&
        reflection.privacy !== ReflectionPrivacy.PUBLIC
      ) {
        throw new ForbiddenException('Access denied to this reflection');
      }

      return reflection;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve reflection');
    }
  }

  async updateReflection(
    id: string,
    userId: string,
    updateData: Partial<CreateReflectionDto>
  ): Promise<Reflection> {
    try {
      // First check if reflection exists and user owns it
      const existingReflection = await this.prisma.reflection.findUnique({
        where: { id },
      });

      if (!existingReflection) {
        throw new NotFoundException('Reflection not found');
      }

      if (existingReflection.userId !== userId) {
        throw new ForbiddenException(
          'You can only update your own reflections'
        );
      }

      // Validate enums if provided
      if (
        updateData.mood &&
        !Object.values(ReflectionMood).includes(updateData.mood)
      ) {
        throw new BadRequestException('Invalid mood value');
      }

      if (
        updateData.privacy &&
        !Object.values(ReflectionPrivacy).includes(updateData.privacy)
      ) {
        throw new BadRequestException('Invalid privacy value');
      }

      const updatedReflection = await this.prisma.reflection.update({
        where: { id },
        data: {
          title: updateData.title,
          content: updateData.content,
          mood: updateData.mood as ReflectionMood,
          privacy: updateData.privacy as ReflectionPrivacy,
          tags: updateData.tags,
          wordCount: updateData.content
            ? this.calculateWordCount(updateData.content)
            : undefined,
        },
      });

      return updatedReflection;
    } catch {
      throw new BadRequestException('Failed to update reflection');
    }
  }

  async deleteReflection(id: string, userId: string): Promise<{ id: string }> {
    try {
      // First check if reflection exists and user owns it
      const existingReflection = await this.prisma.reflection.findUnique({
        where: { id },
      });

      if (!existingReflection) {
        throw new NotFoundException('Reflection not found');
      }

      if (existingReflection.userId !== userId) {
        throw new ForbiddenException(
          'You can only delete your own reflections'
        );
      }

      await this.prisma.reflection.delete({
        where: { id },
      });

      return { id };
    } catch {
      throw new BadRequestException('Failed to delete reflection');
    }
  }

  private calculateWordCount(content: string): number {
    if (!content || typeof content !== 'string') {
      return 0;
    }

    // Remove extra whitespace and split by whitespace
    const words = content.trim().split(/\s+/);

    // Filter out empty strings
    return words.filter((word) => word.length > 0).length;
  }

  async getUserStats(
    userId: string,
    query: GetJournalStatsDto
  ): Promise<JournalStatsResponse> {
    try {
      const { period = StatsPeriod.WEEK, startDate, endDate } = query;

      // Calculate date ranges
      const { currentPeriod, previousPeriod } = this.calculateDateRanges(
        period,
        startDate,
        endDate
      );

      // Get current period stats
      const [currentReflections, currentMoodData, currentWordData] =
        await Promise.all([
          this.getReflectionCount(
            userId,
            currentPeriod.start,
            currentPeriod.end
          ),
          this.getMoodStats(userId, currentPeriod.start, currentPeriod.end),
          this.getWordStats(userId, currentPeriod.start, currentPeriod.end),
        ]);

      // Get previous period stats for comparison
      const [previousReflections, previousMoodData, previousWordData] =
        await Promise.all([
          this.getReflectionCount(
            userId,
            previousPeriod.start,
            previousPeriod.end
          ),
          this.getMoodStats(userId, previousPeriod.start, previousPeriod.end),
          this.getWordStats(userId, previousPeriod.start, previousPeriod.end),
        ]);

      // Calculate streak days
      const streakDays = await this.calculateStreakDays(userId);

      return {
        totalReflections: currentReflections,
        totalReflectionsChange: currentReflections - previousReflections,
        streakDays,
        avgMood: currentMoodData.avgMood,
        avgMoodChange: currentMoodData.avgMood - previousMoodData.avgMood,
        totalWords: currentWordData.totalWords,
        totalWordsChange:
          currentWordData.totalWords - previousWordData.totalWords,
        period: {
          start: currentPeriod.start.toISOString(),
          end: currentPeriod.end.toISOString(),
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve journal statistics');
    }
  }

  private calculateDateRanges(
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
        case StatsPeriod.WEEK:
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 6);
          break;
        case StatsPeriod.MONTH:
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 29);
          break;
        case StatsPeriod.ALL:
          currentStart = new Date(2020, 0, 1); // Far back date
          break;
        default:
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 6);
      }

      currentStart.setHours(0, 0, 0, 0);
    }

    // Calculate previous period of same duration
    const periodDuration = currentEnd.getTime() - currentStart.getTime();
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - periodDuration);

    return {
      currentPeriod: { start: currentStart, end: currentEnd },
      previousPeriod: { start: previousStart, end: previousEnd },
    };
  }

  private async getReflectionCount(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return this.prisma.reflection.count({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  private async getMoodStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ avgMood: number }> {
    const moodMapping = {
      [ReflectionMood.VERY_SAD]: 1,
      [ReflectionMood.SAD]: 2,
      [ReflectionMood.NEUTRAL]: 3,
      [ReflectionMood.HAPPY]: 4,
      [ReflectionMood.VERY_HAPPY]: 5,
    };

    const reflections = await this.prisma.reflection.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        mood: true,
      },
    });

    if (reflections.length === 0) {
      return { avgMood: 0 };
    }

    const totalMoodScore = reflections.reduce(
      (sum, reflection) => sum + moodMapping[reflection.mood],
      0
    );

    return {
      avgMood: Math.round((totalMoodScore / reflections.length) * 10) / 10,
    };
  }

  private async getWordStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ totalWords: number }> {
    const result = await this.prisma.reflection.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        wordCount: true,
      },
    });

    return {
      totalWords: result._sum.wordCount || 0,
    };
  }

  private async calculateStreakDays(userId: string): Promise<number> {
    // Get all reflection dates for the user, grouped by day
    const reflections = await this.prisma.reflection.findMany({
      where: { userId },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (reflections.length === 0) {
      return 0;
    }

    // Group reflections by date (YYYY-MM-DD)
    const reflectionDates = new Set(
      reflections.map((r) => r.createdAt.toISOString().split('T')[0])
    );

    // Calculate streak from today backwards
    let streakDays = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      // Max 365 days to prevent infinite loop
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];

      if (reflectionDates.has(dateString)) {
        streakDays++;
      } else {
        break;
      }
    }

    return streakDays;
  }

  async getJournalAnalytics(
    userId: string,
    query: GetJournalAnalyticsDto
  ): Promise<JournalAnalyticsResponseDto> {
    try {
      const {
        startDate,
        endDate,
        granularity = AnalyticsGranularity.DAY,
      } = query;

      // Set default date range if not provided (last 30 days)
      const endDateObj = endDate ? new Date(endDate) : new Date();
      const startDateObj = startDate
        ? new Date(startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Calculate previous period for comparison
      const periodLength = endDateObj.getTime() - startDateObj.getTime();
      const previousStartDate = new Date(startDateObj.getTime() - periodLength);
      const previousEndDate = new Date(startDateObj.getTime());

      // Get current period data
      const [
        currentReflections,
        currentMoodData,
        currentWordData,
        streakDays,
        activityData,
        moodTrendData,
        wordsTrendData,
      ] = await Promise.all([
        this.getReflectionCount(userId, startDateObj, endDateObj),
        this.getMoodStats(userId, startDateObj, endDateObj),
        this.getWordStats(userId, startDateObj, endDateObj),
        this.calculateStreakDays(userId),
        this.getActivityData(userId, startDateObj, endDateObj, granularity),
        this.getMoodTrendData(userId, startDateObj, endDateObj, granularity),
        this.getWordsTrendData(userId, startDateObj, endDateObj, granularity),
      ]);

      // Get previous period data for comparison
      const [previousReflections, previousMoodData, previousWordData] =
        await Promise.all([
          this.getReflectionCount(userId, previousStartDate, previousEndDate),
          this.getMoodStats(userId, previousStartDate, previousEndDate),
          this.getWordStats(userId, previousStartDate, previousEndDate),
        ]);

      return {
        totals: {
          totalReflections: currentReflections,
          totalWords: currentWordData.totalWords,
          averageMood: currentMoodData.avgMood,
          streakDays,
        },
        comparison: {
          reflectionsChange: currentReflections - previousReflections,
          wordsChange: currentWordData.totalWords - previousWordData.totalWords,
          moodChange: currentMoodData.avgMood - previousMoodData.avgMood,
        },
        activityData,
        moodData: moodTrendData,
        wordsData: wordsTrendData,
      };
    } catch {
      throw new BadRequestException('Failed to retrieve journal analytics');
    }
  }

  private async getActivityData(
    userId: string,
    startDate: Date,
    endDate: Date,
    granularity: AnalyticsGranularity
  ): Promise<{ date: string; value: number }[]> {
    const reflections = await this.prisma.reflection.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group by date based on granularity
    const groupedData = new Map<string, number>();

    reflections.forEach((reflection) => {
      const dateKey = this.formatDateByGranularity(
        reflection.createdAt,
        granularity
      );
      groupedData.set(dateKey, (groupedData.get(dateKey) || 0) + 1);
    });

    // Fill in missing dates with 0 values
    const result: { date: string; value: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = this.formatDateByGranularity(currentDate, granularity);
      result.push({
        date: dateKey,
        value: groupedData.get(dateKey) || 0,
      });

      this.incrementDateByGranularity(currentDate, granularity);
    }

    return result;
  }

  private async getMoodTrendData(
    userId: string,
    startDate: Date,
    endDate: Date,
    granularity: AnalyticsGranularity
  ): Promise<{ date: string; mood: number }[]> {
    const moodMapping = {
      [ReflectionMood.VERY_SAD]: 1,
      [ReflectionMood.SAD]: 2,
      [ReflectionMood.NEUTRAL]: 3,
      [ReflectionMood.HAPPY]: 4,
      [ReflectionMood.VERY_HAPPY]: 5,
    };

    const reflections = await this.prisma.reflection.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        mood: true,
      },
    });

    // Group by date and calculate average mood
    const groupedData = new Map<string, { total: number; count: number }>();

    reflections.forEach((reflection) => {
      const dateKey = this.formatDateByGranularity(
        reflection.createdAt,
        granularity
      );
      const moodValue = moodMapping[reflection.mood];

      if (!groupedData.has(dateKey)) {
        groupedData.set(dateKey, { total: 0, count: 0 });
      }

      const data = groupedData.get(dateKey)!;
      data.total += moodValue;
      data.count += 1;
    });

    // Fill in missing dates and calculate averages
    const result: { date: string; mood: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = this.formatDateByGranularity(currentDate, granularity);
      const data = groupedData.get(dateKey);

      result.push({
        date: dateKey,
        mood: data ? Math.round((data.total / data.count) * 10) / 10 : 0,
      });

      this.incrementDateByGranularity(currentDate, granularity);
    }

    return result;
  }

  private async getWordsTrendData(
    userId: string,
    startDate: Date,
    endDate: Date,
    granularity: AnalyticsGranularity
  ): Promise<{ date: string; words: number }[]> {
    const reflections = await this.prisma.reflection.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        wordCount: true,
      },
    });

    // Group by date and sum word counts
    const groupedData = new Map<string, number>();

    reflections.forEach((reflection) => {
      const dateKey = this.formatDateByGranularity(
        reflection.createdAt,
        granularity
      );
      groupedData.set(
        dateKey,
        (groupedData.get(dateKey) || 0) + reflection.wordCount
      );
    });

    // Fill in missing dates with 0 values
    const result: { date: string; words: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = this.formatDateByGranularity(currentDate, granularity);
      result.push({
        date: dateKey,
        words: groupedData.get(dateKey) || 0,
      });

      this.incrementDateByGranularity(currentDate, granularity);
    }

    return result;
  }

  private formatDateByGranularity(
    date: Date,
    granularity: AnalyticsGranularity
  ): string {
    switch (granularity) {
      case AnalyticsGranularity.DAY:
        return date.toISOString().split('T')[0];
      case AnalyticsGranularity.WEEK: {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().split('T')[0];
      }
      case AnalyticsGranularity.MONTH:
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      default:
        return date.toISOString().split('T')[0];
    }
  }

  private incrementDateByGranularity(
    date: Date,
    granularity: AnalyticsGranularity
  ): void {
    switch (granularity) {
      case AnalyticsGranularity.DAY: {
        date.setDate(date.getDate() + 1);
        break;
      }
      case AnalyticsGranularity.WEEK: {
        date.setDate(date.getDate() + 7);
        break;
      }
      case AnalyticsGranularity.MONTH: {
        date.setMonth(date.getMonth() + 1);
        break;
      }
    }
  }

  private getDateFormat(granularity: AnalyticsGranularity): string {
    switch (granularity) {
      case AnalyticsGranularity.DAY:
        return 'YYYY-MM-DD';
      case AnalyticsGranularity.WEEK:
        return 'YYYY-MM-DD';
      case AnalyticsGranularity.MONTH:
        return 'YYYY-MM';
      default:
        return 'YYYY-MM-DD';
    }
  }
}
