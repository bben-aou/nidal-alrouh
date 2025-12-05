import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SessionStatus } from '@prisma/client';
import { FastifyRequest } from 'fastify';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import { AvailableSlotsDto } from './dto/available-slots.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateSessionFeedbackDto } from './dto/create-feedback.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  getUserSessions(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Query('status') status?: SessionStatus
  ) {
    return this.sessionsService.getUserSessions(req.user.id, status);
  }

  @Get(':id')
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  getSession(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Param('id') id: string
  ) {
    return this.sessionsService.getSessionById(id, req.user.id);
  }

  @Patch(':id/complete')
  @Roles('HELPER', 'ADMIN')
  markComplete(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Param('id') id: string
  ) {
    return this.sessionsService.markSessionComplete(id, req.user.id);
  }

  @Post(':id/feedback')
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  createFeedback(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Param('id') id: string,
    @Body() dto: CreateSessionFeedbackDto
  ) {
    return this.sessionsService.createFeedback(id, req.user.id, dto);
  }

  @Get('helpers/:helperProfileId/feedback')
  @Roles()
  getHelperFeedback(@Param('helperProfileId') helperProfileId: string) {
    return this.sessionsService.getHelperFeedback(helperProfileId);
  }

  @Get('bookings/available-slots')
  @Roles()
  getAvailableSlots(@Query() dto: AvailableSlotsDto) {
    return this.sessionsService.getAvailableSlots(dto.helperId, dto.date);
  }

  @Post('bookings/create')
  @Roles('USER', 'SEEKER', 'HELPER', 'ADMIN')
  createBooking(
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Body() dto: CreateBookingDto
  ) {
    return this.sessionsService.createBooking(req.user.id, dto);
  }
}
