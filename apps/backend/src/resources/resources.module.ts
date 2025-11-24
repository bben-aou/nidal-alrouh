import { Module } from '@nestjs/common';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { PrismaModule } from '../prisma/prisma.module';

import { RecommendationsService } from './recommendations.service';
import { ResourceInteractionsService } from './resource-interactions.service';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

@Module({
  imports: [PrismaModule],
  controllers: [ResourcesController],
  providers: [
    ResourcesService,
    ResourceInteractionsService,
    RecommendationsService,
    ContentModerationService,
  ],
  exports: [ResourcesService, ResourceInteractionsService],
})
export class ResourcesModule {}
