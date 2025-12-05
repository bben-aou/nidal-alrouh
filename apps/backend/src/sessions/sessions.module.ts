import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { CalWebhookController } from './cal-webhook.controller';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [PrismaModule],
  controllers: [SessionsController, CalWebhookController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
