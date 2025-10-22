'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { type LoginFormData } from '@/lib/validations/auth';

import { LoginForm } from './components/login-form';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {t('login.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('login.subtitle')}</p>
      </div>

      <LoginForm onSubmit={onSubmit} isLoading={isLoading} error={error} />
    </div>
  );
}
