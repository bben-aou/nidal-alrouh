'use client';

import { Filter, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface JournalSearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function JournalSearchAndFilter({
  searchTerm,
  onSearchChange,
}: Readonly<JournalSearchAndFilterProps>) {
  const t = useTranslations('journal');

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('dashboard.searchReflections')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        {t('dashboard.filter')}
      </Button>
    </div>
  );
}
