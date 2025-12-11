import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function CommunityHero() {
  const t = useTranslations('community');

  return (
    <section className="text-center space-y-6">
      <h1 className="text-4xl md:text-6xl font-bold text-foreground">
        {t('hero.title')}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        {t('hero.subtitle')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg">
          <UserPlus className="mr-2 h-4 w-4" />
          {t('hero.joinCommunity')}
        </Button>
        <Button variant="outline" size="lg">
          {t('hero.browseDiscussions')}
        </Button>
      </div>
    </section>
  );
}
