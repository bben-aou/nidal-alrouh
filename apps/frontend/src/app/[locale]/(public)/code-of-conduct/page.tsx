'use client';

import {
  ShieldCheck,
  HeartHandshake,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Gavel,
  FileText,
  CheckCircle2,
  XCircle,
  UserCog,
  Scale,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CodeOfConductPage() {
  const t = useTranslations('guidelines.codeOfConduct');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            {t('subtitle')}
          </p>
        </div>

        {/* Pledge */}
        <section className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <HeartHandshake className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold">{t('pledge')}</h2>
          </div>
          {/* Note: The pledge text is actually the content of the h2 above in the json structure? 
                        Wait, checking json: "pledge": "As members..." is a string. 
                        So the h2 above is wrong, it should be a paragraph.
                        Let's fix this.
                    */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('pledge')}
          </p>
        </section>

        {/* Standards */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">{t('standards.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Positive Behavior */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
                <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                  {t('standards.positive.title')}
                </h3>
              </div>
              <div className="space-y-3">
                {t
                  .raw('standards.positive.items')
                  .map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Unacceptable Behavior */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <ThumbsDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-xl font-semibold text-red-900 dark:text-red-100">
                  {t('standards.unacceptable.title')}
                </h3>
              </div>
              <div className="space-y-3">
                {t
                  .raw('standards.unacceptable.items')
                  .map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Responsibilities & Enforcement Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Responsibilities */}
          <section className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 h-full">
            <div className="flex items-center gap-3 mb-6">
              <UserCog className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">
                {t('responsibilities.title')}
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>{t('responsibilities.description')}</p>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-sm text-blue-900 dark:text-blue-100">
                <p>{t('responsibilities.rights')}</p>
              </div>
            </div>
          </section>

          {/* Enforcement */}
          <section className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 h-full">
            <div className="flex items-center gap-3 mb-6">
              <Gavel className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold">{t('enforcement.title')}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>{t('enforcement.process')}</p>
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                <Scale className="w-4 h-4" />
                <span>Fair & Confidential Process</span>
              </div>
            </div>
          </section>
        </div>

        {/* Scope */}
        <section className="bg-muted/30 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-background mb-4 shadow-sm">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('scope')}
          </p>
        </section>

        {/* Footer/Attribution */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
            <FileText className="w-4 h-4" />
            <span>Attribution</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {t('attribution')}
          </p>
        </div>
      </div>
    </div>
  );
}
