import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as 'en' | 'ar' | 'fr')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}/common.json`)).default,
      home: (await import(`../messages/${locale}/home.json`)).default,
      auth: (await import(`../messages/${locale}/auth.json`)).default,
      dashboard: (await import(`../messages/${locale}/dashboard.json`)).default,
      about: (await import(`../messages/${locale}/about.json`)).default,
      community: (await import(`../messages/${locale}/community.json`)).default,
      resources: (await import(`../messages/${locale}/resources.json`)).default,
      contact: (await import(`../messages/${locale}/contact.json`)).default,
      settings: (await import(`../messages/${locale}/settings.json`)).default,
      profile: (await import(`../messages/${locale}/profile.json`)).default,
      journal: (await import(`../messages/${locale}/journal.json`)).default,
      help: (await import(`../messages/${locale}/help.json`)).default,
      crisisSupport: (await import(`../messages/${locale}/crisisSupport.json`))
        .default,
      chat: (await import(`../messages/${locale}/chat.json`)).default,
      legal: (await import(`../messages/${locale}/legal.json`)).default,
      guidelines: (await import(`../messages/${locale}/guidelines.json`))
        .default,
    },
  };
});
