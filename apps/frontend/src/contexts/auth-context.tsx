'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'SEEKER' | 'HELPER' | 'ADMIN';
  status: 'pending' | 'active' | 'suspended';
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: User['role']
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

  // Check if user is authenticated on mount
  useEffect(() => {
    void checkAuth(true); // Pass true to indicate this is the initial auth check
  }, []);

  const handleTokenRefresh = async (isInitialCheck = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        // Token refresh successful, check auth again
        await checkAuth(isInitialCheck);
      } else {
        // Refresh failed, clear session
        if (!isInitialCheck) {
          setSessionExpired(true);
        }
        setUser(null);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      if (!isInitialCheck) {
        setSessionExpired(true);
      }
      setUser(null);
    }
  };

  const checkAuth = async (isInitialCheck = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSessionExpired(false);
      } else if (response.status === 401) {
        // Session expired or invalid token
        if (!isInitialCheck) {
          // Only mark as session expired if this is not the initial check
          setSessionExpired(true);
        }
        setUser(null);

        // Attempt token refresh if session expired (but not for initial check)
        if (!isInitialCheck) {
          await handleTokenRefresh();
        }
      } else {
        setUser(null);
        setSessionExpired(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      // Don't mark session as expired for initial check errors
      if (!isInitialCheck) {
        setSessionExpired(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message ?? 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);

      // Redirect to dashboard after successful login
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: User['role'] = 'USER'
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message ?? 'Signup failed');
      }

      const data = await response.json();
      setUser(data.user);

      // Redirect to dashboard after successful signup
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setIsLoggingOut(true);
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/');
      setIsLoggingOut(false);
    }
  };

  const refreshAuth = async () => {
    await handleTokenRefresh();
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshAuth,
        forgotPassword,
        sessionExpired,
        clearSessionExpired: () => setSessionExpired(false),
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
