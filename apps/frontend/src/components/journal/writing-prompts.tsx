'use client';

import { Plus, Edit3 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockJournalPrompts } from '@/lib/mock-data/journal';

export function WritingPrompts() {
  const t = useTranslations('journal');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('dashboard.writingPrompts')}</h2>
      <p className="text-muted-foreground">
        {t('dashboard.promptsDescription')}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {mockJournalPrompts.map((prompt, index) => (
          <Card
            key={index}
            className="group hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium leading-relaxed">{prompt}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.morePrompts')}
        </Button>
      </div>
    </div>
  );
}
