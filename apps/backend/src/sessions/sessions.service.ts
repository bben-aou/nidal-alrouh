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

    const helper = await this.prisma.user.findUnique({
      where: { email: organizerEmail },
      include: { helperProfile: true },
    });

    if (!helper || !helper.helperProfile) {
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
}
