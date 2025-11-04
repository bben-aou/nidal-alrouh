'use client';

import { Calendar, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function EventsTab() {
  const t = useTranslations('community');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.upcomingEvents')}</CardTitle>
        <CardDescription>{t('dashboard.eventsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('dashboard.noEvents')}</p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.createEvent')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
