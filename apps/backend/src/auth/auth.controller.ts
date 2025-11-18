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
/**
 * Authentication controller handling signup, login, logout, token refresh, and profile.
 * Uses HTTP-only cookies for access/refresh tokens and clears legacy /api/auth cookies for compatibility.
 */
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('signup')
  /**
   * Register a new user and set authentication cookies.
   * Sets HTTP-only `access_token` (15m) and `refresh_token` (7d) at root path and clears legacy /api/auth cookies.
   */
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const result = await this.authService.signup(signupDto);
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    reply.setCookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    reply.setCookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

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
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  /**
   * Authenticate user credentials and issue new access/refresh cookies.
   * Captures `user-agent` and `ip` for session metadata; clears legacy /api/auth cookies after setting root cookies.
   */
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const userAgent = request.headers['user-agent'];
    const { ip } = request;
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    const result = await this.authService.login(loginDto, userAgent, ip);

    reply.setCookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    reply.setCookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

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
  /**
   * Logout the current user by revoking the refresh token and clearing cookies.
   * Clears both root (`/`) and legacy `/api/auth` cookie paths to ensure full sign-out.
   */
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

    reply.clearCookie('access_token', {
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    reply.clearCookie('refresh_token', {
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

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
  /**
   * Rotate access and refresh tokens using the `refresh_token` cookie.
   * If the refresh cookie is missing, respond 401; otherwise set fresh cookies and clear legacy path cookies.
   */
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

    reply.setCookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    reply.setCookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

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
  /**
   * Return the authenticated user's profile.
   * Requires a valid access token via `JwtAuthGuard`.
   */
  async getMe(@Req() request: FastifyRequest & { user: AuthResponse['user'] }) {
    const user = await this.authService.getMe(request.user.id);
    return { user };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  /**
   * Initiate password reset flow by sending a reset email.
   * Accepts the user's email and returns a generic success message.
   */
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(
      forgotPasswordDto.email
    );
    return result;
  }
}
