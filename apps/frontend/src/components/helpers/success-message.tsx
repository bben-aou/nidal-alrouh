'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/helpers/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container max-w-md py-16 flex justify-center">
      <Card className="w-full text-center border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-700 dark:text-green-300">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-green-600/80 dark:text-green-400/80">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{t('message')}</p>
          <p className="text-xs text-muted-foreground">
            {t('redirecting', { seconds: countdown })}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Link href="/helpers/dashboard">
              {t('button')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
