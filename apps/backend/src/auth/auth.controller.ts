import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest, FastifyReply } from 'fastify';

import { AuthService } from './auth.service';
import { SignupDto, LoginDto, ForgotPasswordDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const result = await this.authService.signup(signupDto);
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    // Set access token in httpOnly cookie
    reply.setCookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // Set refresh token in httpOnly cookie (allow refresh after signup)
    reply.setCookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // Clear any legacy cookies scoped to '/api/auth'
    reply.clearCookie('access_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    // Also clear legacy refresh token cookies
    reply.clearCookie('refresh_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    return {
      user: result.user,
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const userAgent = request.headers['user-agent'];
    const { ip } = request;
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    const result = await this.authService.login(loginDto, userAgent, ip);

    // Set access token in httpOnly cookie
    reply.setCookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // Set refresh token in httpOnly cookie
    reply.setCookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // Clear any legacy cookies scoped to '/api/auth'
    reply.clearCookie('access_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    reply.clearCookie('refresh_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    return {
      user: result.user,
      message: 'Login successful',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req()
    request: FastifyRequest & {
      user: AuthResponse['user'];
      cookies?: Record<string, string>;
    },
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const refreshToken = request.cookies?.['refresh_token'];
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    await this.authService.logout(request.user.id, refreshToken);

    // Clear cookies
    reply.clearCookie('access_token', {
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    reply.clearCookie('refresh_token', {
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // Also clear any legacy cookies scoped to '/api/auth'
    reply.clearCookie('access_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    reply.clearCookie('refresh_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    return {
      message: 'Logout successful',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: FastifyRequest & { cookies?: Record<string, string> },
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const refreshToken = request.cookies?.['refresh_token'];
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    if (!refreshToken) {
      reply.code(401);
      return { message: 'Refresh token not found' };
    }

    const result = await this.authService.refreshTokens(refreshToken);

    // Set new access token in httpOnly cookie
    reply.setCookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // Set new refresh token in httpOnly cookie
    reply.setCookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // Clear any legacy cookies scoped to '/api/auth'
    reply.clearCookie('access_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    reply.clearCookie('refresh_token', {
      path: '/api/auth',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    return {
      message: 'Tokens refreshed successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() request: FastifyRequest & { user: AuthResponse['user'] }) {
    const user = await this.authService.getMe(request.user.id);
    return { user };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(
      forgotPasswordDto.email
    );
    return result;
  }
}
