import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { SessionStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CalWebhookPayload } from './dto/cal-webhook.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateSessionFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Handles incoming Cal.com webhook events and delegates to the right handler.
   */
  async handleCalWebhook(payload: CalWebhookPayload) {
    this.logger.log(`Received Cal.com webhook: ${payload.triggerEvent}`);

    switch (payload.triggerEvent) {
      case 'BOOKING_CREATED':
        return this.handleBookingCreated(payload);
      case 'BOOKING_RESCHEDULED':
        return this.handleBookingRescheduled(payload);
      case 'BOOKING_CANCELLED':
        return this.handleBookingCancelled(payload);
      default:
        this.logger.warn(
          `Unknown webhook event: ${(payload as { triggerEvent: string }).triggerEvent}`
        );
    }
  }

  private async handleBookingCreated(payload: CalWebhookPayload) {
    const { payload: bookingData } = payload;

    // Assumption: organizer is the helper, first attendee is the seeker
    const organizerEmail = bookingData.organizer.email;
    const seekerEmail = bookingData.attendees[0]?.email;

    if (!seekerEmail) {
      throw new BadRequestException('No attendee found in booking');
    }

    // Try to find helper by email first
    let helper = await this.prisma.user.findUnique({
      where: { email: organizerEmail },
      include: { helperProfile: true },
    });

    // If not found by email, try to find by calUsername from organizer name or booking type
    if (!helper || !helper.helperProfile) {
      // Cal.com organizer name often includes the username slug
      // Also try extracting from the booking type (e.g., "username/30min")
      const bookingType = bookingData.type; // e.g., "helper-username/30min"
      const calUsername = bookingType?.split('/')[0];

      if (calUsername) {
        const helperProfile = await this.prisma.helperProfile.findFirst({
          where: { calUsername },
          include: { user: true },
        });

        if (helperProfile) {
          helper = {
            ...helperProfile.user,
            helperProfile,
          };
        }
      }
    }

    if (!helper || !helper.helperProfile) {
      this.logger.error(
        `Helper not found for organizer email: ${organizerEmail}, booking type: ${bookingData.type}`
      );
      throw new NotFoundException('Helper profile not found');
    }

    const seeker = await this.prisma.user.findUnique({
      where: { email: seekerEmail },
    });

    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    // Prefer Cal's video URL if available
    const meetingUrl = bookingData.videoCallData?.url || null;

    const session = await this.prisma.supportSession.create({
      data: {
        seekerId: seeker.id,
        helperId: helper.id,
        helperProfileId: helper.helperProfile.id,
        calBookingId: bookingData.bookingId.toString(),
        calBookingUid: bookingData.uid,
        scheduledAt: new Date(bookingData.startTime),
        duration: bookingData.length,
        meetingUrl,
        topic: bookingData.metadata?.topic || null,
        seekerNote: bookingData.metadata?.note || null,
        status: SessionStatus.SCHEDULED,
      },
      include: {
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        helper: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Session created: ${session.id}`);
    return session;
  }

  private async handleBookingRescheduled(payload: CalWebhookPayload) {
    const { payload: bookingData } = payload;

    const session = await this.prisma.supportSession.findUnique({
      where: { calBookingUid: bookingData.uid },
    });

    if (!session) {
      this.logger.warn(`Session not found for booking UID: ${bookingData.uid}`);
      return;
    }

    await this.prisma.supportSession.update({
      where: { id: session.id },
      data: {
        scheduledAt: new Date(bookingData.startTime),
        duration: bookingData.length,
      },
    });

    this.logger.log(`Session rescheduled: ${session.id}`);
  }

  private async handleBookingCancelled(payload: CalWebhookPayload) {
    const { payload: bookingData } = payload;

    const session = await this.prisma.supportSession.findUnique({
      where: { calBookingUid: bookingData.uid },
    });

    if (!session) {
      this.logger.warn(`Session not found for booking UID: ${bookingData.uid}`);
      return;
    }

    await this.prisma.supportSession.update({
      where: { id: session.id },
      data: {
        status: SessionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    this.logger.log(`Session cancelled: ${session.id}`);
  }

  /**
     
     * Returns all sessions for a user, as both seeker and helper.
     * Can be optionally filtered by status.
     
    **/

  async getUserSessions(userId: string, statusFilter?: SessionStatus) {
    const where: any = {
      OR: [{ seekerId: userId }, { helperId: userId }],
    };

    if (statusFilter) {
      where.status = statusFilter;
    }

    const sessions = await this.prisma.supportSession.findMany({
      where,
      orderBy: {
        scheduledAt: 'desc',
      },
      include: {
        seeker: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        helper: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        helperProfile: {
          select: {
            id: true,
            bio: true,
            specializations: true,
          },
        },
        feedback: true,
      },
    });

    return sessions;
  }

  /**
   * Returns a single session by ID if the user is part of it.
   */
  async getSessionById(sessionId: string, userId: string) {
    const session = await this.prisma.supportSession.findUnique({
      where: { id: sessionId },
      include: {
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        helper: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        helperProfile: true,
        feedback: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Users can only access sessions they are part of
    if (session.seekerId !== userId && session.helperId !== userId) {
      throw new ForbiddenException('You are not part of this session');
    }

    return session;
  }

  /**
   * Marks a session as completed.
   * Only the helper for the session is allowed to do this.
   */
  async markSessionComplete(sessionId: string, userId: string) {
    const session = await this.prisma.supportSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Only the helper can mark a session as complete
    if (session.helperId !== userId) {
      throw new ForbiddenException('Only helper can mark session complete');
    }

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Session already completed');
    }

    const updated = await this.prisma.supportSession.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    this.logger.log(`Session marked complete: ${sessionId}`);
    return updated;
  }

  /**
   * Creates feedback for a completed session.
   * Feedback can only be left once and only by the seeker.
   */
  async createFeedback(
    sessionId: string,
    userId: string,
    dto: CreateSessionFeedbackDto
  ) {
    const session = await this.prisma.supportSession.findUnique({
      where: { id: sessionId },
      include: { feedback: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Only the seeker can leave feedback
    if (session.seekerId !== userId) {
      throw new ForbiddenException('Only seeker can leave feedback');
    }

    if (session.status !== SessionStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed sessions');
    }

    if (session.feedback) {
      throw new BadRequestException('Feedback already submitted');
    }

    const feedback = await this.prisma.sessionFeedback.create({
      data: {
        sessionId,
        seekerId: userId,
        rating: dto.rating,
        comment: dto.comment,
        isAnonymous: dto.isAnonymous ?? true,
      },
    });

    this.logger.log(`Feedback created for session: ${sessionId}`);
    return feedback;
  }

  /**
   * Returns feedback for a helper profile.
   * Anonymous reviews hide seeker details in the response.
   */
  async getHelperFeedback(helperProfileId: string) {
    const feedback = await this.prisma.sessionFeedback.findMany({
      where: {
        session: {
          helperProfileId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        session: {
          select: {
            id: true,
            scheduledAt: true,
            completedAt: true,
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return feedback.map((f) => ({
      ...f,
      seeker: f.isAnonymous ? null : f.seeker,
    }));
  }

  /**
   * Get available time slots for a helper on a specific date.
   */
  getAvailableSlots(helperId: string, date: string) {
    // For now, return mock data. In a real implementation, this would:
    // 1. Check the helper's availability settings
    // 2. Check existing bookings for conflicts
    // 3. Return available time slots

    const mockSlots = [
      { time: '09:00', duration: 30, platform: 'Google Meet' },
      { time: '09:30', duration: 30, platform: 'Google Meet' },
      { time: '10:00', duration: 30, platform: 'Google Meet' },
      { time: '14:00', duration: 30, platform: 'Google Meet' },
      { time: '14:30', duration: 30, platform: 'Google Meet' },
      { time: '15:00', duration: 30, platform: 'Google Meet' },
    ];

    return {
      date,
      timezone: 'Africa/Casablanca',
      availableSlots: mockSlots,
    };
  }

  /**
   * Create a new booking session.
   */
  async createBooking(userId: string, dto: CreateBookingDto) {
    // Validate helper exists
    const helper = await this.prisma.helperProfile.findUnique({
      where: { id: dto.helperId },
      include: { user: true },
    });

    if (!helper) {
      throw new NotFoundException('Helper not found');
    }

    // Parse date and time to create a proper datetime
    const scheduledAt = new Date(`${dto.date}T${dto.time}:00`);

    // Create the session
    const session = await this.prisma.supportSession.create({
      data: {
        seekerId: userId,
        helperId: helper.userId,
        helperProfileId: dto.helperId,
        scheduledAt,
        duration: dto.duration,
        seekerNote: dto.notes,
        status: SessionStatus.SCHEDULED,
      },
      include: {
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        helper: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        helperProfile: true,
      },
    });

    this.logger.log(
      `Booking created for user ${userId} with helper ${dto.helperId}`
    );

    return session;
  }
}
