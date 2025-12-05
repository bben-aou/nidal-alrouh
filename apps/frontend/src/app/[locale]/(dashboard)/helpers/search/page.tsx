'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useSearchHelpers } from '@/apis/helpers';
import { HelperCard } from '@/components/helpers/helper-card';
import { SearchFilters } from '@/components/helpers/search-filters';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

export default function FindHelperPage() {
  const t = useTranslations('helpers.discovery');
  const [filters, setFilters] = useState({
    search: '',
    specialization: 'all',
    language: 'all',
  });

  const debouncedFilters = useDebounce(filters, 500);

  const { helpers, isLoading } = useSearchHelpers({
    params: {
      search: debouncedFilters.search,
      specialization: debouncedFilters.specialization,
      language: debouncedFilters.language,
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      specialization: 'all',
      language: 'all',
    });
  };

  return (
    <div className="container pb-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t('subtitle')}
        </p>
      </div>

      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : helpers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpers.map((helper) => (
            <HelperCard key={helper.id} helper={helper} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground">{t('filters.noHelpersFound')}</p>
          <Button variant="link" onClick={handleClearFilters} className="mt-2">
            {t('filters.clearAllFilters')}
          </Button>
        </div>
      )}
    </div>
  );
}
