'use client';

import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEFAULT_AVATAR_URL } from '@/lib/constants';
import { HelperProfile } from '@/types/helpers';

interface HelperCardHeaderContentProps {
  helper: HelperProfile;
}

export function HelperCardHeaderContent({
  helper,
}: Readonly<HelperCardHeaderContentProps>) {
  const t = useTranslations('helpers.discovery.card');

  return (
    <div className="pb-3 pt-5 px-5 flex flex-col items-center text-center space-y-2.5">
      <Avatar className="h-20 w-20 ring-2 ring-border/50 transition-all duration-300 group-hover:ring-primary/30 group-hover:scale-105">
        <AvatarImage
          src={helper.user.image || DEFAULT_AVATAR_URL}
          alt={helper.user.name}
        />
        <AvatarFallback className="bg-muted/50 text-muted-foreground font-semibold text-2xl">
          {helper.user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <h3 className="font-semibold text-base text-foreground tracking-tight">
        {helper.user.name}
      </h3>

      <div className="grid grid-cols-2 gap-3 w-full pt-1">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500/90">
            <Star className="h-3 w-3 fill-current" />
            <span className="font-semibold tabular-nums text-sm">
              {helper?.stats?.avgRating?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
            {helper.stats.totalReviews}{' '}
            {helper.stats.totalReviews === 1 ? t('review') : t('reviews')}
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-semibold tabular-nums text-sm text-foreground">
            {helper.stats.completedSessions}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
            {helper.stats.completedSessions === 1
              ? t('session')
              : t('sessions')}
          </span>
        </div>
      </div>
    </div>
  );
}
