import { enUS, ar, fr } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

import type { Locale as DateFnsLocale } from 'date-fns';

/**
 * Utility function to format dates with localized month names
 */
export function useLocalizedDateFormatter() {
  const t = useTranslations('journal.dashboard.charts.months');

  const formatDate = (
    dateInput: string | Date,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const monthIndex = date.getMonth();

    // Month names mapping
    const monthKeys = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    const longMonthKeys = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    const monthKey =
      format === 'short' ? monthKeys[monthIndex] : longMonthKeys[monthIndex];
    const localizedMonth = t(`${format}.${monthKey}`);

    return `${localizedMonth} ${day}`;
  };

  const formatDateWithYear = (
    dateInput: string | Date,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Month names mapping
    const monthKeys = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    const longMonthKeys = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    const monthKey =
      format === 'short' ? monthKeys[monthIndex] : longMonthKeys[monthIndex];
    const localizedMonth = t(`${format}.${monthKey}`);

    return `${localizedMonth} ${day}, ${year}`;
  };

  return {
    formatDate,
    formatDateWithYear,
  };
}

/**
 * Non-hook version for use in components that don't need reactive updates
 */
export function getLocalizedDateFormatter(t: (key: string) => string) {
  const formatDate = (
    dateInput: string | Date,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const monthIndex = date.getMonth();

    // Month names mapping
    const monthKeys = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    const longMonthKeys = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    const monthKey =
      format === 'short' ? monthKeys[monthIndex] : longMonthKeys[monthIndex];
    const localizedMonth = t(`dashboard.charts.months.${format}.${monthKey}`);

    return `${localizedMonth} ${day}`;
  };

  const formatDateWithYear = (
    dateInput: string | Date,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Month names mapping
    const monthKeys = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    const longMonthKeys = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    const monthKey =
      format === 'short' ? monthKeys[monthIndex] : longMonthKeys[monthIndex];
    const localizedMonth = t(`dashboard.charts.months.${format}.${monthKey}`);

    return `${localizedMonth} ${day}, ${year}`;
  };

  return {
    formatDate,
    formatDateWithYear,
  };
}

/**
 * Centralized date-fns locale resolver based on app locale.
 * Supports all project locales with a safe fallback to English.
 */
export const DATE_FNS_LOCALES: Record<string, DateFnsLocale> = {
  en: enUS,
  ar,
  fr,
};

export function resolveDateFnsLocale(locale: string): DateFnsLocale {
  return DATE_FNS_LOCALES[locale] ?? enUS;
}

/**
 * Formats a time string (HH:mm) to 12-hour format with AM/PM
 */
export function formatTime(time: string): string {
  if (!time) return '';

  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);

  if (isNaN(hour)) return time;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
}
