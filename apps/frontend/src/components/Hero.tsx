'use client';

import { Heart, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import heroImage from '@/assets/hero-journey.jpg';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  const t = useTranslations('home.hero');
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Journey of healing"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Arabic Title */}
          <h1 className="font-arabic text-5xl md:text-7xl font-bold text-primary mb-2">
            {t('arabicTitle')}
          </h1>

          {/* Latin Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('latinTitle')}
          </h2>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('tagline')}
          </p>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            {t('description')}
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <div className="safe-indicator">
              <Heart className="h-4 w-4" />
              <span>{t('trustIndicators.nonprofit')}</span>
            </div>
            <div className="safe-indicator">
              <Users className="h-4 w-4" />
              <span>{t('trustIndicators.confidential')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/login?type=seeker">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-soft-lg hover:shadow-soft-lg hover:scale-105 transition-all duration-300"
              >
                <Heart className="mr-2 h-5 w-5" />
                {t('buttons.needSupport')}
              </Button>
            </Link>

            <Link href="/login?type=helper">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-secondary bg-secondary/10 hover:bg-secondary text-secondary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-soft hover:shadow-soft-md hover:scale-105 transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                {t('buttons.wantToHelp')}
              </Button>
            </Link>
          </div>

          {/* Subtle encouragement */}
          <p className="text-sm text-muted-foreground pt-8 italic">
            {t('encouragement')}
          </p>
        </div>
      </div>
    </section>
  );
};
