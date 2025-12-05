'use client';

import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HelperBookingWidgetProps {
  calUsername: string;
}

export function HelperBookingWidget({
  calUsername,
}: Readonly<HelperBookingWidgetProps>) {
  const t = useTranslations('helpers.discovery.profile');

  useEffect(() => {
    if (calUsername) {
      (async function () {
        const { getCalApi } = await import('@calcom/embed-react');
        const cal = await getCalApi();
        cal('init', { origin: 'https://cal.com' });
      })();
    }
  }, [calUsername]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t('bookSession')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 min-h-[600px]">
        <iframe
          src={`https://cal.com/${calUsername}/30min?embed=true`}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ minHeight: '600px' }}
          title={t('bookSession')}
        ></iframe>
      </CardContent>
    </Card>
  );
}
