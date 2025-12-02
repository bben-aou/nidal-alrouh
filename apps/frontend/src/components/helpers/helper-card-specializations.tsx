'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';

interface HelperCardSpecializationsProps {
  specializations: string[];
}

export function HelperCardSpecializations({
  specializations,
}: Readonly<HelperCardSpecializationsProps>) {
  const t = useTranslations('helpers.discovery.card');

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        {t('specializations')}
      </h4>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {specializations.slice(0, 5).map((spec) => (
          <Badge
            key={spec}
            variant="secondary"
            className="text-[11px] font-normal px-2 py-0.5 bg-muted/50 text-muted-foreground border-0 hover:bg-muted/70 transition-colors"
          >
            {spec}
          </Badge>
        ))}
        {specializations.length > 5 && (
          <Badge
            variant="secondary"
            className="text-[11px] font-medium px-2 py-0.5 bg-muted/30 text-muted-foreground/70 border-0"
          >
            +{specializations.length - 5}
          </Badge>
        )}
      </div>
    </div>
  );
}
