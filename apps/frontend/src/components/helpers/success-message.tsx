'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SuccessMessage() {
  const t = useTranslations('helpers.registration.success');
  const router = useRouter();
  const locale = useLocale();
  const [countdown, setCountdown] = useState(3);
  const total = 3;
  const progressValue = ((total - countdown) / total) * 100;
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressValue / 100);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push(`/${locale}/helpers/dashboard`);
    }
  }, [countdown, router, locale]);

  return (
    <div className="container max-w-xl py-20 flex justify-center">
      <Card className="w-full text-center border-border/50 bg-card shadow-md">
        <CardHeader>
          <div className="mx-auto relative w-24 h-24 mb-6">
            <svg width={size} height={size} className="absolute inset-0">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={strokeWidth}
                fill="none"
                className="opacity-20"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="hsl(var(--primary))"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-primary/10 text-primary">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          </div>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground mb-6">{t('message')}</p>
          <p
            className="text-sm text-muted-foreground text-center"
            aria-live="polite"
          >
            {t('redirecting', { seconds: countdown })}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href={`/${locale}/helpers/dashboard`}>
              {t('button')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
