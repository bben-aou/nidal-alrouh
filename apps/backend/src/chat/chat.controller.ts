import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import { ChatService } from './chat.service';
import { CreateDmRoomDto } from './dto/create-dm-room.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { SendMessageDto } from './dto/send-message.dto';
@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  private readonly logger = new Logger(ChatController.name);

  @Post('dm')
  @ApiOperation({ summary: 'Create or get a DM room' })
  @ApiBody({ type: CreateDmRoomDto })
  @ApiCreatedResponse({ description: 'DM room created or returned' })
  async createOrGetDmRoom(
    @Body() dto: CreateDmRoomDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const room = await this.chatService.findOrCreateDmRoom(
      req.user.id,
      dto.otherUserId
    );
    return { data: room, message: 'DM room ready' };
  }

  @Post('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Send a message to a room' })
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  @ApiBody({ type: SendMessageDto })
  @ApiCreatedResponse({ description: 'Message sent' })
  async sendMessage(
    @Param('roomId', new ParseUUIDPipe({ version: '4' })) roomId: string,
    @Body() body: Omit<SendMessageDto, 'roomId'>,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const msg = await this.chatService.sendMessage(
      roomId,
      req.user.id,
      body.content
    );
    return { data: msg, message: 'Message sent' };
  }

  @Get('rooms')
  @ApiOperation({
    summary:
      'List rooms for current user with participants, lastMessage, unreadCount',
  })
  @ApiOkResponse({ description: 'Rooms retrieved successfully' })
  async listRooms(@Req() req: FastifyRequest & { user: AuthResponse['user'] }) {
    const rooms = await this.chatService.listRoomsForUser(req.user.id);
    return { data: rooms, message: 'Rooms retrieved' };
  }

  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'List messages in a room' })
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiOkResponse({ description: 'Messages retrieved successfully' })
  async listMessages(
    @Param('roomId', new ParseUUIDPipe({ version: '4' })) roomId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] },
    @Query('limit') limit = 50,
    @Query('cursor') cursor?: string
  ) {
    const msgs = await this.chatService.listMessages(
      roomId,
      req.user.id,
      Number(limit),
      cursor
    );
    return { data: msgs, message: 'Messages retrieved' };
  }

  @Post('rooms/:roomId/read')
  @ApiOperation({ summary: 'Mark room as read' })
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  @ApiBody({ type: MarkReadDto })
  async markRead(
    @Param('roomId', new ParseUUIDPipe({ version: '4' })) roomId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const res = await this.chatService.markRead(roomId, req.user.id);
    return { data: res, message: 'Room marked as read' };
  }
}
