import { Heart, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function MentalHealthOrganizations() {
  const t = useTranslations('crisisSupport');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('ngos.title')}</h2>
      <p className="text-muted-foreground">{t('ngos.description')}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Depression Support */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 border-border/50 bg-background/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base font-semibold">
                  {t('ngos.organizations.depression.name')}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Support groups and resources
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-sm text-muted-foreground mb-3">
              {t('ngos.organizations.depression.description')}
            </p>
            <p className="text-xs text-primary font-medium">
              {t('ngos.organizations.depression.contact')}
            </p>
          </CardContent>
        </Card>

        {/* Psychiatric Hospitals */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 border-border/50 bg-background/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base font-semibold">
                  {t('ngos.organizations.hospitals.name')}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Major psychiatric care facilities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-sm text-muted-foreground mb-3">
              {t('ngos.organizations.hospitals.description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-foreground min-w-[80px]">
                  Casablanca:
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('ngos.organizations.hospitals.casablanca')}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-foreground min-w-[80px]">
                  Rabat:
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('ngos.organizations.hospitals.rabat')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
