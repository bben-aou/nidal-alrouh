import 'reflect-metadata';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';

import type { Env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const config = app.get(ConfigService<Env>);

  const prefix = config.get('API_PREFIX', { infer: true })!;
  const port = config.get('PORT', { infer: true })!;
  const allowedOrigins = config.get('CORS_ALLOWED_ORIGINS', { infer: true })!;
  const allowedMethods = config.get('CORS_ALLOWED_METHODS', { infer: true })!;
  const allowCredentials = config.get('CORS_CREDENTIALS', { infer: true })!;
  const helmetEnabled = config.get('HELMET_ENABLED', { infer: true })!;

  // Cast Nest's Fastify instance to the Fastify type used by plugins
  const fastify = app
    .getHttpAdapter()
    .getInstance() as unknown as import('fastify').FastifyInstance;

  // Register cookie plugin for authentication
  await fastify.register(cookie);

  // Register CORS plugin with environment-based configuration
  await fastify.register(cors, {
    origin: allowedOrigins,
    credentials: allowCredentials,
    methods: allowedMethods,
  });

  // Register Helmet plugin if enabled
  if (helmetEnabled) {
    await fastify.register(helmet);
  }

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Enable global exception filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Setup Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nidal Alrouh API')
    .setDescription('API documentation for Nidal Alrouh platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('community', 'Community posts and interactions')
    .addTag('journal', 'Personal journal entries')
    .addTag('chat', 'Chat messaging')
    .addTag('users', 'User management')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

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
