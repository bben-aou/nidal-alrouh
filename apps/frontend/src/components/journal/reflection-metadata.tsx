'use client';

import { Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ReflectionMetadataProps {
  date: string;
  time: string;
  wordCount: number;
  authorText: string;
}

export function ReflectionMetadata({
  date,
  time,
  wordCount,
  authorText,
}: Readonly<ReflectionMetadataProps>) {
  const t = useTranslations('journal');

  return (
    <>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{time}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          {wordCount} {t('dashboard.words')}
        </span>
        <span>{authorText}</span>
      </div>
    </>
  );
}
