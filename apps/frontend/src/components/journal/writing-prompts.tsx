'use client';

import { Plus, Edit3, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

import { useGetPrompts, type PromptItem } from '@/apis/prompts';
import { CreateReflectionDialog } from '@/components/journal/create-reflection-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { deriveTitleFromPrompt } from '@/lib/utils/journal';

const supportedLocales = ['en', 'fr', 'ar'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

function toSupportedLocale(locale: string): string {
  return supportedLocales.includes(locale as SupportedLocale) ? locale : 'en';
}

export function WritingPrompts() {
  const t = useTranslations('journal');
  const locale = useLocale();
  const lang = toSupportedLocale(locale);

  const [open, setOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | undefined>(
    undefined
  );

  const {
    data: promptsData,
    isLoading,
    error,
  } = useGetPrompts({
    params: { locale: lang, limit: 6 },
  });

  const prompts = promptsData?.prompts || [];

  const selectedTitle = selectedPrompt
    ? deriveTitleFromPrompt(selectedPrompt.text)
    : undefined;
  const selectedTags = selectedPrompt?.tags ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('dashboard.writingPrompts')}
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('dashboard.writingPrompts')}
        </h2>
        <p className="text-muted-foreground text-center py-8">
          Failed to load prompts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('dashboard.writingPrompts')}</h2>
      <p className="text-muted-foreground">
        {t('dashboard.promptsDescription')}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {prompts.map((prompt, index: number) => (
          <Card
            key={prompt.id || index}
            className="group hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium leading-relaxed">
                  {prompt.text}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setOpen(true);
                  }}
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

      {/* Hidden controlled dialog used by prompts */}
      <CreateReflectionDialog
        open={open}
        onOpenChange={setOpen}
        initialTitle={selectedTitle}
        initialContent={''}
        contentPlaceholder={selectedPrompt?.text ?? ''}
        initialTags={selectedTags}
        hideTrigger
      />
    </div>
  );
}
