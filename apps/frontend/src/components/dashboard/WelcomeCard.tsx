'use client';

import { Sun, Moon, Sparkles, Stars, Cloud, CloudSun } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

export function WelcomeCard() {
  const { user } = useAuth();
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const isNightTime = new Date().getHours() >= 18 || new Date().getHours() < 6;

  return (
    <Card className="relative overflow-hidden border-[0.5px] bg-card/50">
      {/* Background decorative elements */}
      {isNightTime ? (
        <>
          <div
            className={`absolute top-2 sm:top-4 text-primary/15 ${isRTL ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}`}
          >
            <Stars className="h-10 w-10 sm:h-16 sm:w-16" strokeWidth={1} />
          </div>
          <div
            className={`absolute top-6 sm:top-8 text-primary/10 hidden sm:block ${isRTL ? 'left-16 sm:left-24' : 'right-16 sm:right-24'}`}
          >
            <Stars className="h-8 w-8 sm:h-12 sm:w-12" strokeWidth={1} />
          </div>
        </>
      ) : (
        <>
          <div
            className={`absolute top-2 sm:top-4 text-primary/15 ${isRTL ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}`}
          >
            <CloudSun className="h-10 w-10 sm:h-16 sm:w-16" strokeWidth={1} />
          </div>
          <div
            className={`absolute top-6 sm:top-8 text-primary/10 hidden sm:block ${isRTL ? 'left-16 sm:left-24' : 'right-16 sm:right-24'}`}
          >
            <Cloud className="h-8 w-8 sm:h-12 sm:w-12" strokeWidth={1} />
          </div>
        </>
      )}
      <CardHeader className="relative space-y-2 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="rounded-xl bg-primary/10 p-2 sm:p-2.5 dark:bg-primary/15 w-fit">
            {isNightTime ? (
              <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            ) : (
              <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-medium tracking-tight bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            {t('welcome')}, <span className="font-semibold">{user?.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent" />
          {t('greeting.description')}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
