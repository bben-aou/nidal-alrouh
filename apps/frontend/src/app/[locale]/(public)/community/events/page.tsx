'use client';

import { Calendar, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EventsContent } from '@/components/community/EventsContent';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';

export default function CommunityEventsPage() {
  const t = useTranslations('community');
  const router = useRouter();

  const handleBackToCommunity = () => {
    router.push('/community');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={handleBackToCommunity}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('dashboard.backToCommunity')}
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">
            {t('events.title')}
          </h1>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl">
          {t('events.subtitle')}
        </p>
      </div>

      <EventsContent />
    </div>
  );
}
