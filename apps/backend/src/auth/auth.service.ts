import { randomBytes } from 'crypto';

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

import { SignupDto, LoginDto } from './dto';
import {
  AuthResponse,
  JwtPayload,
  UserSessionData,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signup(
    signupDto: SignupDto
  ): Promise<AuthResponse & { refreshToken: string }> {
    const { email } = signupDto;
    const { password } = signupDto;
    const { name } = signupDto;
    const role: UserRole = signupDto.role ?? UserRole.USER;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        role,
        status: UserStatus.active,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
      },
    });

    // Generate tokens (include refresh token for session creation)
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Create refresh session so new users can refresh immediately
    await this.createSession(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ip?: string
  ): Promise<{
    user: {
      id: string;
      email: string;
      name: string | null;
      role: UserRole;
      status: UserStatus;
      emailVerifiedAt: Date | null;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    const { email } = loginDto;
    const { password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    if (user.status === UserStatus.suspended) {
      throw new UnauthorizedException('Account suspended');
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Create session
    await this.createSession(user.id, refreshToken, userAgent, ip);

    // Remove password hash from response
    const userWithHash: {
      id: string;
      email: string;
      name: string | null;
      role: UserRole;
      status: UserStatus;
      emailVerifiedAt: Date | null;
      passwordHash: string;
    } = user;
    const { passwordHash, ...userResponse } = userWithHash;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Find active sessions for this user and verify the provided token
      const sessions = await this.prisma.userSession.findMany({
        where: {
          userId,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      let revoked = false;
      for (const session of sessions) {
        if (await argon2.verify(session.refreshTokenHash, refreshToken)) {
          await this.prisma.userSession.update({
            where: { id: session.id },
            data: { revokedAt: new Date() },
          });
          revoked = true;
          break;
        }
      }

      if (!revoked) {
        // If we couldn't find a matching session, revoke all as a fallback
        await this.prisma.userSession.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    } else {
      // Revoke all sessions for the user
      await this.prisma.userSession.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }
  }

  async refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Find a valid (non-revoked, non-expired) session whose stored hash matches the provided token
    const candidateSessions = await this.prisma.userSession.findMany({
      where: {
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });

    const session = await (async () => {
      for (const s of candidateSessions) {
        if (await argon2.verify(s.refreshTokenHash, refreshToken)) {
          return s;
        }
      }
      return null;
    })();

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.user.status === UserStatus.suspended) {
      throw new UnauthorizedException('Account suspended');
    }

    // Revoke old session
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const tokens = this.generateTokens(
      session.user.id,
      session.user.email,
      session.user.role
    );

    // Create new session
    await this.createSession(
      session.user.id,
      tokens.refreshToken,
      session.userAgent,
      session.ip
    );

    return tokens;
  }

  async getMe(userId: string): Promise<{
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    status: UserStatus;
    emailVerifiedAt: Date | null;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Always return success message for security reasons (don't reveal if email exists)
    if (!user) {
      return {
        message:
          'If an account with that email exists, we have sent a password reset link.',
      };
    }

    return {
      message:
        'If an account with that email exists, we have sent a password reset link.',
    };
  }

  private generateTokens(
    userId: string,
    email: string,
    role: UserRole
  ): { accessToken: string; refreshToken: string } {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = randomBytes(32).toString('hex');

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createSession(
    userId: string,
    refreshToken: string,
    userAgent?: string | null,
    ip?: string | null
  ): Promise<UserSessionData> {
    const refreshTokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date();
    const refreshTtlDays = Number.parseInt(
      this.configService.get<string>('JWT_REFRESH_TTL') ?? '7',
      10
    );
    expiresAt.setDate(expiresAt.getDate() + refreshTtlDays);

    const session = await this.prisma.userSession.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
        userAgent,
        ip,
      },
    });

    return session;
  }
}
