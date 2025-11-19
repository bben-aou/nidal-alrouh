'use client';

import { Calendar, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventType, EventStatus } from '@/types/community';

interface EventFiltersProps {
  searchQuery?: string;
  selectedType?: EventType | 'all';
  selectedStatus?: EventStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  onSearchChange?: (query: string) => void;
  onTypeChange?: (type: EventType | 'all') => void;
  onStatusChange?: (status: EventStatus | 'all') => void;
  onDateFromChange?: (date: string) => void;
  onDateToChange?: (date: string) => void;
  onClearFilters?: () => void;
  className?: string;
  showClearButton?: boolean;
}

export function EventFilters({
  searchQuery = '',
  selectedType = 'all',
  selectedStatus = 'all',
  dateFrom = '',
  dateTo = '',
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  className = '',
  showClearButton = true,
}: Readonly<EventFiltersProps>) {
  const t = useTranslations('community');

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'all' ||
    selectedStatus !== 'all' ||
    dateFrom ||
    dateTo;

  const handleClearFilters = () => {
    onSearchChange?.('');
    onTypeChange?.('all');
    onStatusChange?.('all');
    onDateFromChange?.('');
    onDateToChange?.('');
    onClearFilters?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('events.filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Event Type Filter */}
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('events.filters.selectType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('events.filters.allTypes')}</SelectItem>
            <SelectItem value="workshop">
              {t('events.type.workshop')}
            </SelectItem>
            <SelectItem value="supportSession">
              {t('events.type.supportSession')}
            </SelectItem>
            <SelectItem value="consultation">
              {t('events.type.consultation')}
            </SelectItem>
            <SelectItem value="communityMeeting">
              {t('events.type.communityMeeting')}
            </SelectItem>
            <SelectItem value="webinar">{t('events.type.webinar')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Event Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('events.filters.selectStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('events.filters.allStatuses')}
            </SelectItem>
            <SelectItem value="upcoming">
              {t('events.status.upcoming')}
            </SelectItem>
            <SelectItem value="ongoing">
              {t('events.status.ongoing')}
            </SelectItem>
            <SelectItem value="completed">
              {t('events.status.completed')}
            </SelectItem>
            <SelectItem value="cancelled">
              {t('events.status.cancelled')}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date From Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder={t('events.filters.dateFrom')}
            value={dateFrom}
            onChange={(e) => onDateFromChange?.(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Date To Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder={t('events.filters.dateTo')}
            value={dateTo}
            onChange={(e) => onDateToChange?.(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {showClearButton && hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t('events.filters.clearFilters')}
          </Button>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              {t('events.filters.search')}: {searchQuery}
              <button
                onClick={() => onSearchChange?.('')}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {t('events.filters.type')}: {t(`events.type.${selectedType}`)}
              <button
                onClick={() => onTypeChange?.('all')}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {t('events.filters.status')}:{' '}
              {t(`events.status.${selectedStatus}`)}
              <button
                onClick={() => onStatusChange?.('all')}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {dateFrom && (
            <Badge variant="secondary" className="gap-1">
              {t('events.filters.from')}: {dateFrom}
              <button
                onClick={() => onDateFromChange?.('')}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {dateTo && (
            <Badge variant="secondary" className="gap-1">
              {t('events.filters.to')}: {dateTo}
              <button
                onClick={() => onDateToChange?.('')}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
