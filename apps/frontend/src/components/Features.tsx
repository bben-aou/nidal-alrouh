'use client';

import {
  MessageCircle,
  Users,
  BookOpen,
  Calendar,
  Shield,
  Heart,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export const Features = () => {
  const t = useTranslations('home.features');

  const features = [
    {
      icon: MessageCircle,
      title: t('items.communityForum.title'),
      description: t('items.communityForum.description'),
      color: 'text-primary',
    },
    {
      icon: Users,
      title: t('items.privateMessaging.title'),
      description: t('items.privateMessaging.description'),
      color: 'text-secondary',
    },
    {
      icon: BookOpen,
      title: t('items.educationalResources.title'),
      description: t('items.educationalResources.description'),
      color: 'text-accent-dark',
    },
    {
      icon: Calendar,
      title: t('items.communityEvents.title'),
      description: t('items.communityEvents.description'),
      color: 'text-primary',
    },
    {
      icon: Shield,
      title: t('items.protectedAnonymity.title'),
      description: t('items.protectedAnonymity.description'),
      color: 'text-secondary',
    },
    {
      icon: Heart,
      title: t('items.personalTracking.title'),
      description: t('items.personalTracking.description'),
      color: 'text-accent-dark',
    },
  ];
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-soft hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
