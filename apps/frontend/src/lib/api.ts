const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'SEEKER' | 'HELPER';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    emailVerifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

class ApiClient {
  private readonly baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshAccessToken(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      const url = `${this.baseUrl}/auth/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        let message = 'Session expired, please sign in again';
        let payload: unknown = undefined;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          try {
            const data = await response.json();
            payload = data;
            message = (data as { message?: string }).message ?? message;
          } catch {
            if (process.env.NODE_ENV !== 'production') {
              console.debug(
                'Refresh response payload is not JSON; using default message.'
              );
            }
          }
        }
        throw new ApiClientError(
          message,
          response.status,
          'UNAUTHORIZED',
          payload
        );
      }
    })().finally(() => {
      this.isRefreshing = false;
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {};

    if (options.body) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    if (typeof navigator !== 'undefined' && navigator.language) {
      defaultHeaders['Accept-Language'] = navigator.language;
    }

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      let response = await fetch(url, config);

      if (response.status === 401 && endpoint !== '/auth/refresh') {
        try {
          await this.refreshAccessToken();
          response = await fetch(url, config);
        } catch (refreshError) {
          if (refreshError instanceof ApiClientError) {
            throw refreshError;
          }
          throw new ApiClientError(
            'Session expired, please sign in again',
            401,
            'UNAUTHORIZED'
          );
        }
      }

      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            message: response.statusText ?? 'An error occurred',
            statusCode: response.status,
          };
        }
        throw new ApiClientError(
          errorData.message ?? 'Request failed',
          errorData.statusCode ?? response.status,
          errorData.error,
          errorData
        );
      }

      // Handle empty responses (like logout)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const init: RequestInit = { ...options, method: 'POST' };
    if (body !== undefined) init.body = JSON.stringify(body);
    return this.request<T>(endpoint, init);
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const init: RequestInit = { ...options, method: 'PUT' };
    if (body !== undefined) init.body = JSON.stringify(body);
    return this.request<T>(endpoint, init);
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const init: RequestInit = { ...options, method: 'PATCH' };
    if (body !== undefined) init.body = JSON.stringify(body);
    return this.request<T>(endpoint, init);
  }

  async del<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Authentication endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshTokens(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  async getMe(): Promise<{ user: AuthResponse['user'] }> {
    return this.request<{ user: AuthResponse['user'] }>('/auth/me');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const apiClient = new ApiClient();

export class ApiClientError extends Error {
  statusCode: number;
  code?: string;
  payload?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    payload?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.payload = payload;
  }
}
