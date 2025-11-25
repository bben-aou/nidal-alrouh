import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SupportFooter() {
  const t = useTranslations('crisisSupport');

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-5 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-50" />

      <div className="relative z-10 flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
            <Heart className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="text-base font-bold text-primary">
            {t('footer.title')}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('footer.message')}
          </p>
        </div>
      </div>
    </div>
  );
}
