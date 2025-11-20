import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import { CreateEventDto } from './dto/create-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  private readonly logger = new Logger(EventsController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 events per minute
  @ApiOperation({
    summary: 'Create a new event',
    description:
      'Create a new community event with content moderation and validation',
  })
  @ApiBody({ type: CreateEventDto, description: 'Event creation data' })
  @ApiCreatedResponse({ description: 'Event created successfully' })
  @ApiForbiddenResponse({ description: 'Authentication required' })
  async createEvent(
    @Body() dto: CreateEventDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const event = await this.eventsService.createEvent(req.user.id, dto);
    return { data: event, message: 'Event created successfully' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get events',
    description:
      'Retrieve a paginated list of community events with optional filtering',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of events to return (max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by event type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by event status',
  })
  @ApiOkResponse({ description: 'Events retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Authentication required' })
  async getEvents(
    @Query() query: any,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const events = await this.eventsService.getEvents(req.user.id, query);
    return { data: events, message: 'Events retrieved successfully' };
  }

  @Get(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get event by ID',
    description: 'Retrieve a specific event by its ID',
  })
  @ApiParam({ name: 'eventId', description: 'Event ID to retrieve' })
  @ApiOkResponse({ description: 'Event retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiForbiddenResponse({ description: 'Authentication required' })
  async getEventById(
    @Param('eventId') eventId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const event = await this.eventsService.getEventById(req.user.id, eventId);
    return { data: event, message: 'Event retrieved successfully' };
  }

  @Post(':eventId/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register for an event',
    description: 'Register the current user for the specified event',
  })
  @ApiParam({ name: 'eventId', description: 'Event ID to register for' })
  @ApiBody({ type: RegisterEventDto, required: false })
  async registerForEvent(
    @Param('eventId') eventId: string,
    @Body() dto: RegisterEventDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const { event } = await this.eventsService.registerForEvent(
      req.user.id,
      eventId,
      dto?.notes
    );
    return { data: event, message: 'Registered successfully' };
  }

  @Post(':eventId/unregister')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Unregister from an event',
    description: 'Cancel registration for the specified event',
  })
  @ApiParam({ name: 'eventId', description: 'Event ID to unregister from' })
  async unregisterFromEvent(
    @Param('eventId') eventId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const { event } = await this.eventsService.unregisterFromEvent(
      req.user.id,
      eventId
    );
    return { data: event, message: 'Registration cancelled successfully' };
  }
}
