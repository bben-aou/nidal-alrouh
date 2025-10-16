'use client';

import { Heart, Lock, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const About = () => {
  const t = useTranslations('home.about');
  return (
    <section className="py-20 bg-background">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {t('values.compassion.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('values.compassion.description')}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Lock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {t('values.confidentiality.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('values.confidentiality.description')}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/30 mb-4">
                <Globe className="h-8 w-8 text-accent-dark" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {t('values.accessibility.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('values.accessibility.description')}
              </p>
            </div>
          </div>

          <div className="bg-accent/10 rounded-2xl p-8 mt-12">
            <p className="text-center text-foreground/90 text-lg leading-relaxed">
              {t('meaning')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
