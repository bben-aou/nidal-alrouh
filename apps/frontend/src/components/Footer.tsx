'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations('footer');
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="font-arabic text-2xl font-bold text-primary">
                نضال الروح
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('brand.tagline')}
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {t('resources.title')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    {t('resources.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-primary transition-colors"
                  >
                    {t('resources.community')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="hover:text-primary transition-colors"
                  >
                    {t('resources.resources')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="hover:text-primary transition-colors"
                  >
                    {t('resources.events')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {t('legal.title')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    {t('legal.privacy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    {t('legal.terms')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/code-of-conduct"
                    className="hover:text-primary transition-colors"
                  >
                    {t('legal.codeOfConduct')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="hover:text-primary transition-colors"
                  >
                    {t('legal.accessibility')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {t('bottom.copy', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('bottom.madeWith')}</span>
              <Heart className="h-4 w-4 text-destructive fill-current" />
              <span>{t('bottom.forCommunity')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
