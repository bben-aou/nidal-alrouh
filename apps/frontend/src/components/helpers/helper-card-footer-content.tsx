'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface HelperCardFooterContentProps {
  helperId: string;
}

export function HelperCardFooterContent({
  helperId,
}: Readonly<HelperCardFooterContentProps>) {
  const t = useTranslations('helpers.discovery.card');

  return (
    <Button
      asChild
      className="w-full h-9 text-sm font-medium bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-none"
      variant="outline"
    >
      <Link
        href={`/helpers/${helperId}`}
        className="flex items-center justify-center gap-2"
      >
        {t('viewProfile')}
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </Button>
  );
}
