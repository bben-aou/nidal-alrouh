import { FastifyRequest } from 'fastify';
import { Socket } from 'socket.io';

/**
 * Token source locations in order of preference
 */
export enum TokenSource {
  AUTH = 'auth',
  HEADER = 'header',
  COOKIE = 'cookie',
}

export interface TokenLocation {
  source: TokenSource;
  value: string;
}

/**
 * Extracts a token from a cookie string
 * @param cookieHeader - Raw cookie header string
 * @param cookieName - Name of the cookie to extract
 * @returns The cookie value if found, undefined otherwise
 */
export function extractTokenFromCookie(
  cookieHeader: string,
  cookieName: string = 'access_token'
): string | undefined {
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((pair) => {
      const [key, ...rest] = pair.trim().split('=');
      return [decodeURIComponent(key), decodeURIComponent(rest.join('='))];
    })
  );
  return cookies[cookieName];
}

/**
 * Extracts a token from an authorization header
 * @param authHeader - Authorization header value
 * @returns The token if found, undefined otherwise
 */
export function extractTokenFromAuthHeader(
  authHeader: string
): string | undefined {
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  return undefined;
}

/**
 * Extracts a JWT token from a Socket.IO handshake
 * Checks multiple sources in order: auth object, authorization header, cookies
 * @param client - Socket.IO client socket
 * @param cookieName - Optional cookie name to look for (defaults to 'access_token')
 * @returns Object containing the token and its source if found
 */
export function extractTokenFromSocket(
  client: Socket,
  cookieName: string = 'access_token'
): TokenLocation | undefined {
  // 1. Check auth object
  const authToken = client.handshake.auth?.token;
  if (authToken) {
    return { source: TokenSource.AUTH, value: authToken };
  }

  // 2. Check authorization header
  const authHeader = client.handshake.headers?.authorization;
  if (authHeader) {
    const headerToken = extractTokenFromAuthHeader(authHeader);
    if (headerToken) {
      return { source: TokenSource.HEADER, value: headerToken };
    }
  }

  // 3. Check cookies
  const cookieHeader = client.handshake.headers?.cookie;
  if (cookieHeader) {
    const cookieToken = extractTokenFromCookie(cookieHeader, cookieName);
    if (cookieToken) {
      return { source: TokenSource.COOKIE, value: cookieToken };
    }
  }

  return undefined;
}

/**
 * Extracts a JWT token from a Fastify request
 * Checks multiple sources in order: authorization header, cookies
 * @param request - Fastify request object
 * @param cookieName - Optional cookie name to look for (defaults to 'access_token')
 * @returns Object containing the token and its source if found
 */
export function extractTokenFromRequest(
  request: FastifyRequest,
  cookieName: string = 'access_token'
): TokenLocation | undefined {
  // 1. Check authorization header
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const headerToken = extractTokenFromAuthHeader(authHeader);
    if (headerToken) {
      return { source: TokenSource.HEADER, value: headerToken };
    }
  }

  // 2. Check cookies
  const cookieToken = (request as any).cookies?.[cookieName];
  if (cookieToken) {
    return { source: TokenSource.COOKIE, value: cookieToken };
  }

  return undefined;
}
