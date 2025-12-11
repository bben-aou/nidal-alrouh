import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EventsContent } from '@/components/community/EventsContent';
import { Button } from '@/components/ui/button';

export function CommunityEvents() {
  const t = useTranslations('community');

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {t('events.title')}
          </h2>
          <p className="text-muted-foreground">{t('events.subtitle')}</p>
        </div>
        <Button variant="outline">
          {t('events.viewAll')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <EventsContent />
    </section>
  );
}
