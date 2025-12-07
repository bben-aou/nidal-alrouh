'use client';

import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Shield,
  ThumbsUp,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StepLegalDisclaimerProps } from '@/types/helpers';

export function StepLegalDisclaimer({
  agreesToTerms,
  onDataChange,
}: Readonly<StepLegalDisclaimerProps>) {
  const t = useTranslations('helpers.registration.legal');

  return (
    <div className="space-y-6">
      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">
          {t('title')}
        </AlertTitle>
        <AlertDescription className="text-foreground/80">
          {t('subtitle')}
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            {t('guidelines.title')}
          </h3>
          <p className="text-muted-foreground mb-4">{t('guidelines.intro')}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-colors"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <span className="text-sm">{t(`guidelines.point${i}`)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-emerald-500/10 bg-emerald-500/10">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ThumbsUp className="h-5 w-5" />
                {t('platform.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="mt-0.5 h-5 w-5 p-0 flex items-center justify-center border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0"
                  >
                    <Check className="h-3 w-3" />
                  </Badge>
                  <span className="text-sm text-foreground/90">
                    {t(`platform.point${i}`)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-rose-500/20 bg-rose-500/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-rose-500/10 bg-rose-500/10">
              <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
                {t('notPlatform.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="mt-0.5 h-5 w-5 p-0 flex items-center justify-center border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Badge>
                  <span className="text-sm text-foreground/90">
                    {t(`notPlatform.point${i}`)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Alert
            variant="destructive"
            className="border-destructive/30 bg-destructive/5 text-destructive-foreground dark:text-red-400"
          >
            <AlertCircle className="h-5 w-5 text-destructive dark:text-red-400" />
            <AlertTitle className="font-semibold text-destructive dark:text-red-400">
              {t('important.title')}
            </AlertTitle>
            <AlertDescription className="text-destructive/90 dark:text-red-300/90 mt-1 font-medium bg-transparent">
              {t('important.message')}
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="flex items-start space-x-3 border-t pt-6 mt-8">
        <Checkbox
          id="agree-terms"
          checked={agreesToTerms}
          onCheckedChange={(checked) =>
            onDataChange({ agreesToTerms: checked === true })
          }
          className="mt-1"
        />
        <Label
          htmlFor="agree-terms"
          className="text-sm font-medium leading-relaxed cursor-pointer select-none"
        >
          {t('agreement')}
        </Label>
      </div>
    </div>
  );
}
