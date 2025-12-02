import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { HelpersController } from './helpers.controller';
import { HelpersService } from './helpers.service';

@Module({
  imports: [PrismaModule],
  controllers: [HelpersController],
  providers: [HelpersService],
  exports: [HelpersService],
})
export class HelpersModule {}
