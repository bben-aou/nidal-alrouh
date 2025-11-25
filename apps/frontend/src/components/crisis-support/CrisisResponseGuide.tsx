import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CrisisResponseGuide() {
  const t = useTranslations('crisisSupport');

  const steps = ['recognize', 'reach', 'safe', 'support'] as const;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('resources.title')}</h2>
      <p className="text-muted-foreground">{t('resources.description')}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card
            key={step}
            className="group relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 border-border/50 bg-background/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold group-hover:bg-primary/20 transition-colors">
                    {index + 1}
                  </div>
                </div>
                <CardTitle className="text-base font-semibold">
                  {t(`resources.steps.${step}.title`)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`resources.steps.${step}.description`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
