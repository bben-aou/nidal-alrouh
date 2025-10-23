'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import heroImage from '@/assets/login.png';
import { useAuth } from '@/contexts/auth-context';
import { type RegisterFormData } from '@/lib/validations/auth';

import { RegisterForm } from './components/register-form';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signup(data.name, data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full p-6">
      <div className="flex w-full gap-6 max-w-7xl mx-auto">
        <div className="block sm:hidden md:hidden lg:block lg:flex-1 relative rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
          <Image
            src={heroImage}
            alt="Journey of healing"
            fill
            sizes="50vw"
            className="object-cover rounded-2xl"
            quality={100}
            priority
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[440px] space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                {t('register.title')}
              </h2>
              <p className="text-muted-foreground">{t('register.subtitle')}</p>
            </div>
            <RegisterForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
