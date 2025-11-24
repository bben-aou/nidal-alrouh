import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { PrismaModule } from '../prisma/prisma.module';

import { RecommendationsService } from './recommendations.service';
import { ResourceInteractionsService } from './resource-interactions.service';
import { ResourcesController } from './resources.controller';
import { ResourcesGateway } from './resources.gateway';
import { ResourcesService } from './resources.service';

@Module({
  imports: [
    PrismaModule,
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
  controllers: [ResourcesController],
  providers: [
    ResourcesService,
    ResourceInteractionsService,
    RecommendationsService,
    ContentModerationService,
    ResourcesGateway,
  ],
  exports: [ResourcesService, ResourceInteractionsService],
})
export class ResourcesModule {}
