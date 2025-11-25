import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CrisisAlert() {
  const t = useTranslations('crisisSupport');

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 shadow-lg shadow-primary/10">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 animate-pulse" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon with pulse effect */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/40">
              <AlertTriangle
                className="h-6 w-6 text-primary"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            {t('alert.title')}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
              24/7
            </span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('alert.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
