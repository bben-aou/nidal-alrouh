'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
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
import {
  AnalyticsControlsProps,
  TimeRange,
  TimeRangePreset,
  Granularity,
} from '@/types/journal';
import { getLocalizedDateFormatter } from '@/utils/date';

const analyticsControlsSchema = z.object({
  preset: z.enum(['7D', '30D', '90D', 'CUSTOM']),
  startDate: z.date(),
  endDate: z.date(),
  granularity: z.enum(['day', 'week', 'month']),
});

type AnalyticsControlsFormData = z.infer<typeof analyticsControlsSchema>;

const getPresetDates = (
  preset: TimeRangePreset
): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();

  switch (preset) {
    case '7D':
      start.setDate(end.getDate() - 7);
      break;
    case '30D':
      start.setDate(end.getDate() - 30);
      break;
    case '90D':
      start.setDate(end.getDate() - 90);
      break;
    case 'CUSTOM':
      start.setDate(end.getDate() - 30); // Default to 30 days for custom
      break;
  }

  return { start, end };
};

const getDefaultGranularity = (preset: TimeRangePreset): Granularity => {
  switch (preset) {
    case '7D':
      return 'day';
    case '30D':
      return 'day';
    case '90D':
      return 'week';
    case 'CUSTOM':
      return 'day';
  }
};

export function AnalyticsControls({
  timeRange,
  onTimeRangeChange,
  isLoading = false,
}: AnalyticsControlsProps) {
  const t = useTranslations('journal');

  const TIME_RANGE_PRESETS: { value: TimeRangePreset; label: string }[] = [
    { value: '7D', label: t('dashboard.charts.timeRange.7D') },
    { value: '30D', label: t('dashboard.charts.timeRange.30D') },
    { value: '90D', label: t('dashboard.charts.timeRange.90D') },
    { value: 'CUSTOM', label: t('dashboard.charts.timeRange.CUSTOM') },
  ];

  const GRANULARITY_OPTIONS: { value: Granularity; label: string }[] = [
    { value: 'day', label: t('dashboard.charts.granularity.day') },
    { value: 'week', label: t('dashboard.charts.granularity.week') },
    { value: 'month', label: t('dashboard.charts.granularity.month') },
  ];

  const form = useForm<AnalyticsControlsFormData>({
    defaultValues: {
      preset: timeRange.preset,
      startDate: new Date(timeRange.start),
      endDate: new Date(timeRange.end),
      granularity: timeRange.granularity,
    },
    resolver: zodResolver(analyticsControlsSchema),
  });

  const watchedPreset = form.watch('preset');
  const isCustomRange = watchedPreset === 'CUSTOM';

  React.useEffect(() => {
    if (watchedPreset !== 'CUSTOM') {
      const { start, end } = getPresetDates(watchedPreset);
      const granularity = getDefaultGranularity(watchedPreset);

      form.setValue('startDate', start);
      form.setValue('endDate', end);
      form.setValue('granularity', granularity);

      handleTimeRangeChange({
        preset: watchedPreset,
        start: start.toISOString(),
        end: end.toISOString(),
        granularity,
      });
    }
  }, [watchedPreset, form]);

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    onTimeRangeChange(newTimeRange);
  };

  const handleCustomDateChange = () => {
    const formData = form.getValues();
    if (isCustomRange) {
      handleTimeRangeChange({
        preset: 'CUSTOM',
        start: formData.startDate.toISOString(),
        end: formData.endDate.toISOString(),
        granularity: formData.granularity,
      });
    }
  };

  const formatDate = (date: Date) => {
    const { formatDateWithYear } = getLocalizedDateFormatter(t);
    return formatDateWithYear(date.toISOString(), 'short');
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
      <Form {...form}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Time Range Preset */}
          <FormField
            control={form.control}
            name="preset"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t('dashboard.charts.labels.timeRange')}</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          'dashboard.charts.labels.selectTimeRange'
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_RANGE_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Granularity */}
          <FormField
            control={form.control}
            name="granularity"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {t('dashboard.charts.labels.granularity')}
                </FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (isCustomRange) {
                      handleCustomDateChange();
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          'dashboard.charts.labels.selectGranularity'
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GRANULARITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Custom Date Range */}
        {isCustomRange && (
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {t('dashboard.charts.labels.startDate')}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isLoading}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value)
                          ) : (
                            <span>{t('dashboard.charts.labels.pickDate')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          handleCustomDateChange();
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t('dashboard.charts.labels.endDate')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isLoading}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value)
                          ) : (
                            <span>{t('dashboard.charts.labels.pickDate')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          handleCustomDateChange();
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
        )}
      </Form>
    </div>
  );
}
