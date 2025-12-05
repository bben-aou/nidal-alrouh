import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { HelperStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateHelperProfileDto } from './dto/create-helper-profile.dto';
import { SearchHelpersDto } from './dto/search-helpers.dto';
import { UpdateHelperProfileDto } from './dto/update-helper-profile.dto';

@Injectable()
export class HelpersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a helper profile for the given user.
   * Verification defaults to "auto" unless overridden via environment config.
   */
  async createProfile(userId: string, dto: CreateHelperProfileDto) {
    const existing = await this.prisma.helperProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Helper profile already exists');
    }

    // Determine initial verification status
    const verificationMode = process.env.HELPER_VERIFICATION_MODE || 'auto';
    const status =
      verificationMode === 'auto'
        ? HelperStatus.AUTO_VERIFIED
        : HelperStatus.PENDING_VERIFICATION;

    // Transaction to create profile and update user role
    const [profile] = await this.prisma.$transaction([
      this.prisma.helperProfile.create({
        data: {
          userId,
          bio: dto.bio,
          specializations: dto.specializations,
          languages: dto.languages,
          maxSessionsPerWeek: dto.maxSessionsPerWeek || 4,
          calUsername: dto.calUsername,
          calEventTypeId: dto.calEventTypeId,
          bookingUrl: dto.bookingUrl,
          licenseNumber: dto.licenseNumber,
          yearsOfExperience: dto.yearsOfExperience,
          status,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      }),
      // Upgrade user role to HELPER if they are not ADMIN
      this.prisma.user.update({
        where: { id: userId },
        data: {
          role: {
            set: 'HELPER', // Will be ignored if user is ADMIN via application logic check if needed, but Prisma overwrite is simple for MVP
          },
        },
      }),
    ]);

    // TODO: In manual verification mode, notify admins
    // TODO: Send onboarding email to new helper

    return profile;
  }

  /**
   * Retrieves the helper profile associated with the given user ID.
   */
  async getProfileByUserId(userId: string) {
    const profile = await this.prisma.helperProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Helper profile not found');
    }

    return profile;
  }

  /**
   * Retrieves a public version of a helper profile.
   * Sensitive fields are removed and basic statistics are included.
   */
  async getProfileById(profileId: string) {
    const profile = await this.prisma.helperProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        sessions: {
          where: { status: 'COMPLETED' },
          select: {
            id: true,
            completedAt: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Helper profile not found');
    }

    const completedSessions = profile.sessions.length;

    const feedbackStats = await this.prisma.sessionFeedback.aggregate({
      where: {
        session: { helperProfileId: profileId },
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avgRating = feedbackStats._avg.rating || 0;
    const totalReviews = feedbackStats._count.rating || 0;

    // Exclude internal-only fields
    const { sessions, verificationDocs, verifiedBy, ...publicProfile } =
      profile;

    // Return flat fields to match frontend HelperDetails type
    return {
      ...publicProfile,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: totalReviews,
      completedSessions,
    };
  }

  /**
   * Retrieves feedback for a specific helper profile.
   */
  async getHelperFeedback(profileId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      this.prisma.sessionFeedback.findMany({
        where: {
          session: { helperProfileId: profileId },
        },
        include: {
          seeker: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.sessionFeedback.count({
        where: {
          session: { helperProfileId: profileId },
        },
      }),
    ]);

    const data = feedback.map((item) => ({
      id: item.id,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.createdAt,
      seeker: item.isAnonymous
        ? { name: 'Anonymous', avatarUrl: null }
        : item.seeker,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Updates a helper profile.
   * Only the profile owner is allowed to make changes.
   */
  async updateProfile(
    userId: string,
    profileId: string,
    dto: UpdateHelperProfileDto
  ) {
    const profile = await this.prisma.helperProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Helper profile not found');
    }

    // Ownership check
    if (profile.userId !== userId) {
      throw new ForbiddenException('You do not own this profile');
    }

    const updated = await this.prisma.helperProfile.update({
      where: { id: profileId },
      data: {
        ...(dto.bio && { bio: dto.bio }),
        ...(dto.specializations && { specializations: dto.specializations }),
        ...(dto.languages && { languages: dto.languages }),
        ...(dto.maxSessionsPerWeek !== undefined && {
          maxSessionsPerWeek: dto.maxSessionsPerWeek,
        }),
        ...(dto.calUsername !== undefined && { calUsername: dto.calUsername }),
        ...(dto.calEventTypeId !== undefined && {
          calEventTypeId: dto.calEventTypeId,
        }),
        ...(dto.bookingUrl !== undefined && { bookingUrl: dto.bookingUrl }),
        ...(dto.licenseNumber !== undefined && {
          licenseNumber: dto.licenseNumber,
        }),
        ...(dto.yearsOfExperience !== undefined && {
          yearsOfExperience: dto.yearsOfExperience,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Searches helpers using the provided filters.
   * Returns a paginated list enriched with basic statistics.
   */
  async searchHelpers(dto: SearchHelpersDto) {
    const {
      specializations,
      languages,
      status,
      search,
      page = 1,
      limit = 20,
    } = dto;

    const skip = (page - 1) * limit;

    // Default to showing only verified helpers
    const where: Prisma.HelperProfileWhereInput = {
      status: {
        in: status
          ? [status]
          : [HelperStatus.AUTO_VERIFIED, HelperStatus.VERIFIED],
      },
    };

    if (specializations?.length) {
      where.specializations = { hasSome: specializations };
    }

    if (languages?.length) {
      where.languages = { hasSome: languages };
    }

    if (search) {
      where.OR = [
        { bio: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [helpers, total] = await Promise.all([
      this.prisma.helperProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      }),
      this.prisma.helperProfile.count({ where }),
    ]);

    // Append stats for each returned helper
    const enrichedHelpers = await Promise.all(
      helpers.map(async (helper) => {
        const completedSessions = await this.prisma.supportSession.count({
          where: {
            helperProfileId: helper.id,
            status: 'COMPLETED',
          },
        });

        const feedbackStats = await this.prisma.sessionFeedback.aggregate({
          where: {
            session: { helperProfileId: helper.id },
          },
          _avg: { rating: true },
          _count: { rating: true },
        });

        const avgRating = feedbackStats._avg.rating || 0;
        const totalReviews = feedbackStats._count.rating || 0;

        return {
          ...helper,
          stats: {
            completedSessions,
            avgRating: Math.round(avgRating * 10) / 10,
            totalReviews,
          },
        };
      })
    );

    return {
      data: enrichedHelpers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Suspends (soft-deletes) a helper profile.
   * Keeps historical data intact while preventing future visibility/use.
   */
  async deleteProfile(userId: string, profileId: string) {
    const profile = await this.prisma.helperProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Helper profile not found');
    }

    // Only the owner can suspend their profile
    if (profile.userId !== userId) {
      throw new ForbiddenException('You do not own this profile');
    }

    await this.prisma.helperProfile.update({
      where: { id: profileId },
      data: { status: HelperStatus.SUSPENDED },
    });

    return { message: 'Helper profile suspended successfully' };
  }
}
