import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

import type { Env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const config = app.get(ConfigService<Env>);
  const prefix = config.get('API_PREFIX', { infer: true }) ?? 'api';
  const port = config.get('PORT', { infer: true }) ?? 3001;

  app.setGlobalPrefix(prefix);
  await app.listen(port, '0.0.0.0');
  const logger = new Logger('Bootstrap');
  logger.log(`Backend listening on http://localhost:${port}/${prefix}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    `Failed to start server: ${err instanceof Error ? err.message : String(err)}`
  );
  process.exit(1);
});
