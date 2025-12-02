'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFiltersProps {
  filters: {
    search: string;
    specialization: string;
    language: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

const SPECIALIZATIONS = [
  'Anxiety',
  'Depression',
  'Stress Management',
  'Grief & Loss',
  'Relationship Issues',
  'Self-Esteem',
  'Life Transitions',
  'Trauma',
  'General Support',
];

const LANGUAGES = ['English', 'Arabic', 'French', 'Spanish'];

export function SearchFilters({
  filters,
  onFilterChange,
  onClear,
}: Readonly<SearchFiltersProps>) {
  const t = useTranslations('helpers.discovery.filters');

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
      <div className="flex-1 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="w-full md:w-[200px]">
        <Select
          value={filters.specialization}
          onValueChange={(value) => onFilterChange('specialization', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('specialization')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allSpecializations')}</SelectItem>
            {SPECIALIZATIONS.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {t(`specializations.${spec}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-[200px]">
        <Select
          value={filters.language}
          onValueChange={(value) => onFilterChange('language', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allLanguages')}</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {t(`languages.${lang}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(filters.search ||
        filters.specialization !== 'all' ||
        filters.language !== 'all') && (
        <Button variant="ghost" onClick={onClear} className="px-3">
          <X className="h-4 w-4 mr-2" />
          {t('clear')}
        </Button>
      )}
    </div>
  );
}
