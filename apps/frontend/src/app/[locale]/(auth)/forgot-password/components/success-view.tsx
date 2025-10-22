'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

interface SuccessViewProps {
  onResend: () => void;
}

export function SuccessView({ onResend }: SuccessViewProps) {
  const t = useTranslations('auth');

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          {t('forgotPassword.successTitle')}
        </h1>
        <p className="text-muted-foreground">
          {t('forgotPassword.successMessage')}
        </p>
      </div>

      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('forgotPassword.backToLogin')}
          </Link>
        </Button>

        <Button variant="outline" onClick={onResend} className="w-full">
          {t('forgotPassword.resend')}
        </Button>
      </div>
    </div>
  );
}
