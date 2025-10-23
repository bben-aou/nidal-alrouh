import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export function AuthHeader() {
  const t = useTranslations();

  return (
    <header className="w-full border-b">
      <div className="container px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <h1 className="font-arabic text-2xl font-bold text-primary">
              نضال الروح
            </h1>
            <span className="hidden sm:inline text-sm text-muted-foreground">
              / Nidal Al-Rouh
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-sm gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('general.backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
