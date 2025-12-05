import { createHmac } from 'crypto';

import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

import { CalWebhookPayload } from './dto/cal-webhook.dto';
import { SessionsService } from './sessions.service';

/**
 * Public webhook controller for Cal.com integrations.
 * This controller does NOT require JWT authentication.
 * Instead, it verifies requests using the CAL_WEBHOOK_SECRET.
 */
@ApiTags('webhooks')
@Controller('webhooks')
export class CalWebhookController {
  private readonly logger = new Logger(CalWebhookController.name);

  constructor(private readonly sessionsService: SessionsService) {}

  @Post('cal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive Cal.com booking webhooks',
    description:
      'Public endpoint for Cal.com to send booking events (created, rescheduled, cancelled)',
  })
  @ApiHeader({
    name: 'x-cal-signature-256',
    description: 'HMAC signature from Cal.com',
    required: true,
  })
  async handleCalWebhook(
    @Body() payload: CalWebhookPayload,
    @Headers('x-cal-signature-256') signature: string
  ) {
    // Verify the webhook signature
    this.verifySignature(payload, signature);

    this.logger.log(
      `Received Cal.com webhook: ${payload.triggerEvent} for booking ${payload.payload?.uid}`
    );

    try {
      const result = await this.sessionsService.handleCalWebhook(payload);
      return {
        success: true,
        message: `Webhook processed: ${payload.triggerEvent}`,
        data: result,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error processing webhook: ${errorMessage}`,
        errorStack
      );
      throw error;
    }
  }

  /**
   * Verifies the HMAC-SHA256 signature from Cal.com webhooks.
   * Cal.com sends the signature in the `x-cal-signature-256` header.
   */
  private verifySignature(payload: CalWebhookPayload, signature: string): void {
    const secret = process.env.CAL_WEBHOOK_SECRET;

    if (!secret) {
      this.logger.warn(
        'CAL_WEBHOOK_SECRET not configured - skipping signature verification'
      );
      // In development, allow requests without signature verification
      if (process.env.NODE_ENV === 'production') {
        throw new UnauthorizedException('Webhook secret not configured');
      }
      return;
    }

    if (!signature) {
      throw new UnauthorizedException('Missing webhook signature');
    }

    const payloadString = JSON.stringify(payload);
    const expectedSignature = createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    // Signature from Cal.com may be prefixed with "sha256="
    const normalizedSignature = signature.replace('sha256=', '');

    if (normalizedSignature !== expectedSignature) {
      this.logger.warn('Invalid webhook signature received');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    this.logger.debug('Webhook signature verified successfully');
  }
}
