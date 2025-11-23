import { Module } from '@nestjs/common';

import { ContentModerationService } from '../common/services/content-moderation.service';

import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService, ContentModerationService],
})
export class ResourcesModule {}
