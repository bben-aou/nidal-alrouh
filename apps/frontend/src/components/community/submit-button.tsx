'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { SubmitButtonProps } from '@/types/community';

export function SubmitButton({
  isValid,
  hasContent,
}: Readonly<SubmitButtonProps>) {
  const t = useTranslations('community');

  return (
    <div className="flex justify-end pt-2">
      <Button
        type="submit"
        disabled={!isValid || !hasContent}
        className="min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary/10"
      >
        <Send className="mr-2 h-4 w-4" />
        {t('dashboard.post')}
      </Button>
    </div>
  );
}
