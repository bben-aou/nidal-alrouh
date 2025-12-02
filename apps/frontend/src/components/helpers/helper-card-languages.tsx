'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';

interface HelperCardLanguagesProps {
  languages: string[];
}

export function HelperCardLanguages({
  languages,
}: Readonly<HelperCardLanguagesProps>) {
  const t = useTranslations('helpers.discovery.card');

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        {t('languages')}
      </h4>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {languages.map((lang) => (
          <Badge
            key={lang}
            variant="outline"
            className="text-[11px] font-normal px-2 py-0.5 bg-background/50 text-muted-foreground border-border/50"
          >
            {lang}
          </Badge>
        ))}
      </div>
    </div>
  );
}
