'use client';

import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const languages = [
    { code: 'en', name: t('english'), dir: 'ltr' },
    { code: 'ar', name: t('arabic'), dir: 'rtl' },
    { code: 'fr', name: t('french'), dir: 'ltr' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    const selectedLanguage = languages.find((lang) => lang.code === newLocale);

    if (selectedLanguage) {
      // Update document direction and language
      document.documentElement.dir = selectedLanguage.dir;
      document.documentElement.lang = newLocale;

      // Navigate to the new locale
      startTransition(() => {
        router.replace(pathname, { locale: newLocale });
      });
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <Globe className="h-4 w-4 mr-2" />
          {currentLanguage?.name ?? t('selectLanguage')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
