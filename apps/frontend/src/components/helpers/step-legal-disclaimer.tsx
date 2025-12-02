'use client';

import { AlertCircle, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StepLegalDisclaimerProps } from '@/types/helpers';

export function StepLegalDisclaimer({
  agreesToTerms,
  onDataChange,
}: Readonly<StepLegalDisclaimerProps>) {
  const t = useTranslations('helpers.registration.legal');

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-5 w-5" />
        <AlertTitle>{t('title')}</AlertTitle>
        <AlertDescription>{t('subtitle')}</AlertDescription>
      </Alert>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <h3 className="text-lg font-semibold">{t('guidelines.title')}</h3>
        <p className="text-muted-foreground">{t('guidelines.intro')}</p>

        <ul className="space-y-2 my-4">
          <li>{t('guidelines.point1')}</li>
          <li>{t('guidelines.point2')}</li>
          <li>{t('guidelines.point3')}</li>
          <li>{t('guidelines.point4')}</li>
          <li>{t('guidelines.point5')}</li>
          <li>{t('guidelines.point6')}</li>
        </ul>

        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('important.title')}</AlertTitle>
          <AlertDescription>{t('important.message')}</AlertDescription>
        </Alert>

        <div className="bg-muted p-4 rounded-lg mt-6">
          <h4 className="font-semibold mb-2">{t('platform.title')}</h4>
          <ul className="space-y-1 text-sm">
            <li>✓ {t('platform.point1')}</li>
            <li>✓ {t('platform.point2')}</li>
            <li>✓ {t('platform.point3')}</li>
          </ul>
        </div>

        <div className="bg-destructive/10 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">{t('notPlatform.title')}</h4>
          <ul className="space-y-1 text-sm">
            <li>✗ {t('notPlatform.point1')}</li>
            <li>✗ {t('notPlatform.point2')}</li>
            <li>✗ {t('notPlatform.point3')}</li>
          </ul>
        </div>
      </div>

      <div className="flex items-start space-x-3 border-t pt-6">
        <Checkbox
          id="agree-terms"
          checked={agreesToTerms}
          onCheckedChange={(checked) =>
            onDataChange({ agreesToTerms: checked === true })
          }
        />
        <Label
          htmlFor="agree-terms"
          className="text-sm font-medium leading-relaxed cursor-pointer"
        >
          {t('agreement')}
        </Label>
      </div>
    </div>
  );
}
