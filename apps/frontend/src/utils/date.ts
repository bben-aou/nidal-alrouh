import { enUS, ar, fr } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

import type { Locale as DateFnsLocale } from 'date-fns';

/**
 * Utility function to format dates with localized month names
 */
export function useLocalizedDateFormatter() {
  const t = useTranslations('journal.dashboard.charts.months');

  const formatDate = (
    dateString: string,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateString);
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
    dateString: string,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateString);
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
    dateString: string,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateString);
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
    dateString: string,
    format: 'short' | 'long' = 'short'
  ) => {
    const date = new Date(dateString);
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
