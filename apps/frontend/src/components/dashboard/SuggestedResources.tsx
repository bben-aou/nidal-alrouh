'use client';

import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SuggestedResources() {
  const t = useTranslations('dashboard');

  const suggestedResources = [
    {
      title: t('suggestedResources.resources.0.title'),
      description: t('suggestedResources.resources.0.description'),
      icon: '🌱',
    },
    {
      title: t('suggestedResources.resources.1.title'),
      description: t('suggestedResources.resources.1.description'),
      icon: '🍃',
    },
    {
      title: t('suggestedResources.resources.2.title'),
      description: t('suggestedResources.resources.2.description'),
      icon: '💪',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('suggestedResources.title')}</CardTitle>
        <CardDescription>{t('suggestedResources.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedResources.map((resource, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <span className="text-2xl">{resource.icon}</span>
            <div>
              <h3 className="font-medium">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {resource.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
