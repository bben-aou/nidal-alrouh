import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { JournalController, PromptsController } from './journal.controller';
import { JournalService } from './journal.service';
import { PromptsService } from './prompts.service';

@Module({
  imports: [PrismaModule],
  controllers: [JournalController, PromptsController],
  providers: [JournalService, PromptsService],
  exports: [JournalService, PromptsService],
})
export class JournalModule {}
