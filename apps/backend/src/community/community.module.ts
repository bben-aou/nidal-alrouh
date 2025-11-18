import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { ContentModerationService } from '../common/services/content-moderation.service';
import { PrismaModule } from '../prisma/prisma.module';

import { CommunityCommentService } from './community-comment.service';
import { CommunityEventsService } from './community-events.service';
import { CommunityLikeService } from './community-like.service';
import { CommunityModerationService } from './community-moderation.service';
import { CommunityPostService } from './community-post.service';
import { CommunitySanitizerService } from './community-sanitizer.service';
import { CommunityStatsService } from './community-stats.service';
import { CommunityController } from './community.controller';
import { CommunityGateway } from './community.gateway';
import { CommunityService } from './community.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    CommunityCommentService,
    CommunityLikeService,
    CommunityModerationService,
    CommunityPostService,
    CommunitySanitizerService,
    CommunityStatsService,
    ContentModerationService,
    CommunityGateway,
    CommunityEventsService,
  ],
  exports: [CommunityService],
})
/**
 * Community feature module wiring controllers, services, gateway, and event bus.
 * Exposes CommunityService for consumption by other modules.
 */
export class CommunityModule {}
