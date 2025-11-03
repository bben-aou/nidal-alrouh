import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthResponse } from '../auth/interfaces/auth.interface';

import { CommunityService } from './community.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetCommentsQueryDto } from './dto/get-comments.dto';
import { GetPostsQueryDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}
  private readonly logger = new Logger(CommunityController.name);
  @Get('posts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get community posts',
    description:
      'Retrieve a paginated list of community posts with optional filtering',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of posts to return (max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'locale',
    required: false,
    type: String,
    description: 'Filter by locale (e.g., en, ar)',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiOkResponse({ description: 'Posts retrieved successfully' })
  async getPosts(
    @Query() query: GetPostsQueryDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const currentUserId = req.user.id;
    return this.communityService.getPosts(query, currentUserId);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new community post with content sanitization',
  })
  @ApiBody({ type: CreatePostDto, description: 'Post creation data' })
  @ApiCreatedResponse({ description: 'Post created successfully' })
  @ApiForbiddenResponse({ description: 'Authentication required' })
  async createPost(
    @Body() dto: CreatePostDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const post = await this.communityService.createPost(req.user.id, dto);
    return { data: post, message: 'Post created' };
  }

  @Get('posts/:postId')
  async getPostById(
    @Param('postId') postId: string,
    @Req() req?: FastifyRequest & { user?: AuthResponse['user'] }
  ) {
    const currentUserId = req?.user?.id;
    return this.communityService.getPostById(postId, currentUserId);
  }

  @Patch('posts/:postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.communityService.updatePost(req.user.id, postId, dto);
  }

  @Delete('posts/:postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('postId') postId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.communityService.deletePost(req.user.id, postId);
  }

  @Post('posts/:postId/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 likes per minute
  @ApiOperation({
    summary: 'Like a post',
    description: 'Add a like to a community post',
  })
  @ApiParam({ name: 'postId', description: 'Post ID to like' })
  @ApiCreatedResponse({ description: 'Post liked successfully' })
  @ApiForbiddenResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiTooManyRequestsResponse({
    description: 'Rate limit exceeded (10 likes per minute)',
  })
  async likePost(
    @Param('postId') postId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const result = await this.communityService.likePost(req.user.id, postId);
    return { data: result, message: result.message };
  }

  @Delete('posts/:postId/likes')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 unlikes per minute
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const result = await this.communityService.unlikePost(req.user.id, postId);
    return { data: result, message: result.message };
  }

  @Get('posts/:postId/likes/me')
  @UseGuards(JwtAuthGuard)
  async hasLiked(
    @Param('postId') postId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.communityService.hasLiked(req.user.id, postId);
  }

  @Post('posts/:postId/hide')
  @UseGuards(JwtAuthGuard)
  async hidePost(
    @Param('postId') postId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.communityService.hidePost(req.user.id, postId);
  }

  @Delete('posts/:postId/hide')
  @UseGuards(JwtAuthGuard)
  async unhidePost(
    @Param('postId') postId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.communityService.unhidePost(req.user.id, postId);
  }

  @Post('posts/:postId/reports')
  @UseGuards(JwtAuthGuard)
  async reportPost(
    @Param('postId') postId: string,
    @Body() dto: CreateReportDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.communityService.createPostReport(req.user.id, postId, dto);
  }

  @Get('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get comments for a post',
    description: 'Retrieve paginated comments for a specific community post',
  })
  @ApiParam({ name: 'postId', description: 'Post ID to get comments for' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of comments to return (max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiOkResponse({ description: 'Comments retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async getComments(
    @Param('postId') postId: string,
    @Query() query: GetCommentsQueryDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const currentUserId = req.user.id;
    return this.communityService.getComments(postId, query, currentUserId);
  }

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 comments per minute
  @ApiOperation({
    summary: 'Create a comment',
    description: 'Add a comment to a community post with content sanitization',
  })
  @ApiParam({ name: 'postId', description: 'Post ID to comment on' })
  @ApiBody({ type: CreateCommentDto, description: 'Comment creation data' })
  @ApiCreatedResponse({ description: 'Comment created successfully' })
  @ApiForbiddenResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiTooManyRequestsResponse({
    description: 'Rate limit exceeded (10 comments per minute)',
  })
  async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    const comment = await this.communityService.createComment(
      req.user.id,
      postId,
      dto
    );
    return { data: comment, message: 'Comment created' };
  }

  @Delete('posts/:postId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: FastifyRequest & { user: AuthResponse['user'] }
  ) {
    return this.communityService.deleteComment(req.user.id, postId, commentId);
  }
}
