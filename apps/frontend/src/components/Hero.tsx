'use client';

import { Heart, Users, HeartPulse, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import heroImage from '@/assets/hero-journey.jpg';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export const Hero = () => {
  const t = useTranslations('home.hero');
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
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

      <div className="container relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="font-arabic text-5xl md:text-7xl font-bold text-primary mb-2">
            {t('arabicTitle')}
          </h1>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('latinTitle')}
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('tagline')}
          </p>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            {t('description')}
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <div className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 backdrop-blur-sm transition-all duration-300 hover:from-primary/10 hover:to-secondary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300 border border-primary/20">
                <Heart className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                {t('trustIndicators.nonprofit')}
              </span>
            </div>
            <div className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-secondary/5 to-accent/5 border-2 border-secondary/20 backdrop-blur-sm transition-all duration-300 hover:from-secondary/10 hover:to-accent/10 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 group-hover:bg-secondary/15 transition-colors duration-300 border border-secondary/20">
                <Users className="h-3.5 w-3.5 text-secondary" />
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                {t('trustIndicators.confidential')}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5 justify-center items-center pt-8">
            <Link href="/login?type=seeker">
              <Button
                size="lg"
                className="w-60 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base font-medium rounded-3xl shadow-lg  border-0"
              >
                <HeartPulse className="mr-1 h-5 w-5" />
                {t('buttons.needSupport')}
              </Button>
            </Link>

            <Link href="/login?type=helper">
              <Button
                size="lg"
                className="w-60 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-5 text-base font-medium rounded-3xl shadow-lg border-0"
              >
                <HeartHandshake className="mr-2 h-5 w-5" />
                {t('buttons.wantToHelp')}
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground pt-8 italic">
            {t('encouragement')}
          </p>
        </div>
      </div>
    </section>
  );
};
