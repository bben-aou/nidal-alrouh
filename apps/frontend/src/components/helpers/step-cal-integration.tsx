'use client';

import { Calendar, ExternalLink, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepCalIntegrationProps } from '@/types/helpers';

export function StepCalIntegration({
  calUsername,
  onDataChange,
}: Readonly<StepCalIntegrationProps>) {
  const t = useTranslations('helpers.registration.cal');

  const bookingUrl = calUsername
    ? `https://cal.com/${calUsername}`
    : 'https://cal.com/username';

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg border">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-background rounded-full border">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t('title')}</h3>
            <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert mb-6">
          <p>{t('explanation')}</p>
          <ol className="list-decimal pl-4 space-y-2 mt-2">
            <li>
              {t('steps.1')}{' '}
              <a
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                cal.com <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </li>
            <li>{t('steps.2')}</li>
            <li>{t('steps.3')}</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="calUsername">{t('username.label')}</Label>
          <div className="flex gap-2 items-center">
            <span className="text-muted-foreground bg-muted px-3 py-2 rounded-md border">
              cal.com/
            </span>
            <Input
              id="calUsername"
              placeholder="your-username"
              value={calUsername}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');
                onDataChange({ calUsername: value });
              }}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('username.hint')}</p>
        </div>

        {calUsername && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>{t('preview.title')}</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="p-2 bg-background rounded border text-sm font-mono break-all">
                {bookingUrl}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t('preview.note')}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
