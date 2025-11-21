import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, EventStatus, RegistrationStatus } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { DEFAULT_SANITIZE_OPTIONS } from '../common/utils/sanitize-html.config';
import { PrismaService } from '../prisma/prisma.service';

import { CreateEventDto } from './dto/create-event.dto';
import { EventsRealtimeService } from './events-realtime.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService,
    private readonly eventsRealtime: EventsRealtimeService
  ) {}

  /**
   * Create a new community event.
   * Validates content for sensitive material, sanitizes description, and creates the event.
   * @param userId Organizer user ID
   * @param dto Event creation payload
   */
  async createEvent(userId: string, dto: CreateEventDto) {
    this.contentModeration.validateEventTitle(dto.title);

    this.contentModeration.validateEventDescription(dto.description);

    if (dto.tags && dto.tags.length > 0) {
      this.contentModeration.validateEventTags(dto.tags);
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const sanitizedDescription = sanitizeHtml(
      dto.description,
      DEFAULT_SANITIZE_OPTIONS
    );

    const sanitizedLocation = dto.location
      ? sanitizeHtml(dto.location, DEFAULT_SANITIZE_OPTIONS)
      : null;

    const data: Prisma.EventCreateInput = {
      title: dto.title.trim(),
      description: sanitizedDescription,
      type: dto.type,
      status: dto.status || EventStatus.upcoming,
      startDate,
      endDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      timezone: dto.timezone,
      location: sanitizedLocation,
      meetingUrl: dto.meetingUrl,
      maxAttendees: dto.maxAttendees,
      requiresApproval: dto.requiresApproval || false,
      coverImage: dto.coverImage,
      tags: dto.tags?.map((tag) => tag.toLowerCase().trim()) || [],
      organizer: { connect: { id: userId } },
    };

    const result = await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data,
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

      await tx.eventRegistration.create({
        data: {
          eventId: event.id,
          userId,
          status: RegistrationStatus.CONFIRMED,
        },
      });

      await tx.event.update({
        where: { id: event.id },
        data: { currentAttendees: { increment: 1 } },
      });

      const updated = await tx.event.findUnique({
        where: { id: event.id },
        include: {
          organizer: {
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
    });

    this.eventsRealtime.emitEventCreated(result);
    return result;
  }

  /**
   * Get events with optional filtering and pagination.
   * @param userId Current user ID (reserved for future role-based filtering)
   * @param query Filter and pagination parameters
   */
  async getEvents(userId: string, query: any) {
    const { limit = 20, cursor, type, status } = query;

    const where: Prisma.EventWhereInput = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const events = await this.prisma.event.findMany({
      where,
      take: Math.min(limit, 50) + 1, // Fetch one extra item to determine if there is a next page
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (events.length > Math.min(limit, 50)) {
      const nextItem = events.pop();
      nextCursor = nextItem?.id || null;
    }

    let registeredIds = new Set<string>();
    try {
      const eventIds = events.map((e) => e.id);
      if (eventIds.length > 0) {
        const regs = await this.prisma.eventRegistration.findMany({
          where: {
            userId,
            eventId: { in: eventIds },
            status: { not: RegistrationStatus.CANCELLED },
          },
          select: { eventId: true },
        });
        registeredIds = new Set(regs.map((r) => r.eventId));
      }
    } catch (error) {
      console.error('Error fetching event registrations:', error);
    }

    return {
      items: events.map((e) => ({
        ...e,
        isRegistered: registeredIds.has(e.id),
      })),
      nextCursor,
    };
  }

  /**
   * Get a specific event by ID.
   * @param userId Current user ID (reserved for future role-based filtering)
   * @param eventId Event ID to retrieve
   */
  async getEventById(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        registrations: {
          where: {
            status: RegistrationStatus.CONFIRMED,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let isRegistered = false;
    try {
      const reg = await this.prisma.eventRegistration.findFirst({
        where: {
          userId,
          eventId,
          status: { not: RegistrationStatus.CANCELLED },
        },
        select: { id: true },
      });
      isRegistered = Boolean(reg);
    } catch (error) {
      console.error('Error fetching event registration:', error);
    }

    const attendees = event.registrations.map((reg) => ({
      id: reg.user.id,
      name: reg.user.name,
      avatar: reg.user.avatarUrl,
      registeredAt: reg.createdAt.toISOString(),
    }));

    const { registrations, ...eventData } = event;

    return { ...eventData, isRegistered, attendees };
  }

  /**
   * Register current user for an event.
   */
  async registerForEvent(userId: string, eventId: string, notes?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (
      event.status !== EventStatus.upcoming &&
      event.status !== EventStatus.ongoing
    ) {
      throw new BadRequestException(
        'Registration is only allowed for upcoming or ongoing events'
      );
    }

    const existing = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (existing && existing.status !== RegistrationStatus.CANCELLED) {
      throw new BadRequestException('Already registered for this event');
    }

    const confirmedCount = await this.prisma.eventRegistration.count({
      where: { eventId, status: RegistrationStatus.CONFIRMED },
    });
    const capacity = event.maxAttendees ?? null;
    if (capacity !== null && confirmedCount >= capacity) {
      throw new BadRequestException('Event is full');
    }

    const { requiresApproval } = event;

    const result = await this.prisma.$transaction(async (tx) => {
      const registration = await tx.eventRegistration.upsert({
        where: { eventId_userId: { eventId, userId } },
        update: {
          status: requiresApproval
            ? RegistrationStatus.PENDING
            : RegistrationStatus.CONFIRMED,
          notes,
        },
        create: {
          eventId,
          userId,
          status: requiresApproval
            ? RegistrationStatus.PENDING
            : RegistrationStatus.CONFIRMED,
          notes,
        },
      });

      if (registration.status === RegistrationStatus.CONFIRMED) {
        await tx.event.update({
          where: { id: eventId },
          data: { currentAttendees: { increment: 1 } },
        });
      }

      const updatedEvent = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          organizer: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      });

      return { registration, event: updatedEvent };
    });
    this.eventsRealtime.emitRegistrationUpdated(eventId, {
      userId,
      action: 'register',
      currentAttendees: result.event?.currentAttendees,
    });
    return result;
  }

  /**
   * Unregister current user from an event.
   */
  async unregisterFromEvent(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (userId === event.organizerId) {
      throw new BadRequestException(
        'Organizer cannot unregister. Please delete the event instead'
      );
    }

    const registration = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (!registration || registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('Not registered for this event');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedReg = await tx.eventRegistration.update({
        where: { eventId_userId: { eventId, userId } },
        data: { status: RegistrationStatus.CANCELLED },
      });

      if (
        registration.status === RegistrationStatus.CONFIRMED &&
        event.currentAttendees > 0
      ) {
        await tx.event.update({
          where: { id: eventId },
          data: { currentAttendees: { decrement: 1 } },
        });
      }

      const updatedEvent = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          organizer: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      });

      return { registration: updatedReg, event: updatedEvent };
    });
    this.eventsRealtime.emitRegistrationUpdated(eventId, {
      userId,
      action: 'unregister',
      currentAttendees: result.event?.currentAttendees,
    });
    return result;
  }
  /**
   * Update an existing event.
   * @param userId User ID requesting the update (must be organizer)
   * @param eventId Event ID to update
   * @param dto Update data
   */
  async updateEvent(userId: string, eventId: string, dto: CreateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new BadRequestException('Only the organizer can update the event');
    }

    if (dto.title) this.contentModeration.validateEventTitle(dto.title);
    if (dto.description)
      this.contentModeration.validateEventDescription(dto.description);
    if (dto.tags && dto.tags.length > 0)
      this.contentModeration.validateEventTags(dto.tags);

    const startDate = dto.startDate ? new Date(dto.startDate) : event.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : event.endDate;

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const sanitizedDescription = dto.description
      ? sanitizeHtml(dto.description, DEFAULT_SANITIZE_OPTIONS)
      : undefined;

    const sanitizedLocation = dto.location
      ? sanitizeHtml(dto.location, DEFAULT_SANITIZE_OPTIONS)
      : undefined;

    const data: Prisma.EventUpdateInput = {
      ...dto,
      title: dto.title?.trim(),
      description: sanitizedDescription,
      location: sanitizedLocation,
      tags: dto.tags?.map((tag) => tag.toLowerCase().trim()),
      startDate,
      endDate,
    };

    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    this.eventsRealtime.emitEventUpdated(updatedEvent);
    return updatedEvent;
  }

  /**
   * Delete an event.
   * @param userId User ID requesting the delete (must be organizer)
   * @param eventId Event ID to delete
   */
  async deleteEvent(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new BadRequestException('Only the organizer can delete the event');
    }

    await this.prisma.event.delete({
      where: { id: eventId },
    });

    this.eventsRealtime.emitEventDeleted(eventId);
    return { success: true };
  }
}
