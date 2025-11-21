'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
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

        {/* Date Fro Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !dateFrom && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? (
                format(new Date(dateFrom), 'PPP')
              ) : (
                <span>{t('events.filters.dateFrom')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFrom ? new Date(dateFrom) : undefined}
              onSelect={(date) =>
                onDateFromChange?.(date ? format(date, 'yyyy-MM-dd') : '')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !dateTo && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? (
                format(new Date(dateTo), 'PPP')
              ) : (
                <span>{t('events.filters.dateTo')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateTo ? new Date(dateTo) : undefined}
              onSelect={(date) =>
                onDateToChange?.(date ? format(date, 'yyyy-MM-dd') : '')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

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
