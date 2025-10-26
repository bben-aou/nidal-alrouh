'use client';

import { Lock, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ReflectionActions } from '@/components/journal/reflection-actions';
import { ReflectionContent } from '@/components/journal/reflection-content';
import { ReflectionMetadata } from '@/components/journal/reflection-metadata';
import { ReflectionMoodBadge } from '@/components/journal/reflection-mood-badge';
import { ReflectionTags } from '@/components/journal/reflection-tags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { JournalReflection as JournalReflectionType } from '@/lib/mock-data/journal';

interface JournalReflectionProps {
  entry: JournalReflectionType;
}

export function JournalReflection({ entry }: Readonly<JournalReflectionProps>) {
  const t = useTranslations('journal');
  const { user: currentUser } = useAuth();
  const isCurrentUserAuthor = currentUser?.id === entry.authorId;
  const authorText = isCurrentUserAuthor
    ? t('dashboard.by_you')
    : t('dashboard.by_name', { name: entry.authorName });

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">
                {entry.title}
              </CardTitle>
              {entry.isPrivate ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          <ReflectionActions
            entry={entry}
            isCurrentUserAuthor={isCurrentUserAuthor}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Mood and date info */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <ReflectionMoodBadge mood={entry.mood} />
          <ReflectionMetadata
            date={entry.date}
            time={entry.time}
            wordCount={entry.wordCount}
            authorText={authorText}
          />
        </div>

        {/* Content */}
        <ReflectionContent content={entry.content} />

        {/* Tags */}
        <ReflectionTags tags={entry.tags} />
      </CardContent>
    </Card>
  );
}
