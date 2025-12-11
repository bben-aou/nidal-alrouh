'use client';

import {
  Heart,
  Shield,
  Users,
  Lock,
  HandHeart,
  AlertTriangle,
  Phone,
  MessageCircle,
  EyeOff,
  Ban,
  Flag,
  Gavel,
  Coffee,
  ExternalLink,
  CheckCircle2,
  AlertOctagon,
  Siren,
  Ear,
  AlertCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CommunityGuidelinesPage() {
  const t = useTranslations('guidelines.communityGuidelines');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            {t('subtitle')}
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t('introduction')}
          </p>
        </div>

        {/* Core Values */}
        <section className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold">
              {t('sections.coreValues.title')}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {t
              .raw('sections.coreValues.values')
              .map((value: string, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: value }}
                  />
                </div>
              ))}
          </div>
        </section>

        {/* Peer Support */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <HandHeart className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">
              {t('sections.peerSupport.title')}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              {t('sections.peerSupport.critical')}
            </p>
          </div>

          <div className="grid gap-3 pl-2">
            {t
              .raw('sections.peerSupport.rules')
              .map((rule: string, idx: number) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{rule}</span>
                </div>
              ))}
          </div>

          <div className="p-6 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex gap-4 items-center">
            <Siren className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">
              {t('sections.peerSupport.emergency')}
            </p>
          </div>
        </section>

        {/* Respectful Communication */}
        <section className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold">
              {t('sections.respectfulCommunication.title')}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {t
              .raw('sections.respectfulCommunication.guidelines')
              .map((guideline: string, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3 p-4 rounded-xl bg-muted/30"
                >
                  <Ear className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: guideline }}
                  />
                </div>
              ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold">
              {t('sections.privacy.title')}
            </h2>
          </div>
          <div className="bg-muted/30 rounded-2xl p-8 space-y-6">
            <ul className="space-y-4">
              {t
                .raw('sections.privacy.rules')
                .map((rule: string, idx: number) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <EyeOff className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
            </ul>
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg">
              <Shield className="w-4 h-4" />
              {t('sections.privacy.yourPrivacy')}
            </div>
          </div>
        </section>

        {/* Prohibited Content */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Ban className="w-6 h-6 text-destructive" />
            <h2 className="text-2xl font-bold">
              {t('sections.prohibited.title')}
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            {t('sections.prohibited.intro')}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(
              t.raw('sections.prohibited.categories') as Record<
                string,
                { title: string; items: string[] }
              >
            ).map(([key, category]) => (
              <div
                key={key}
                className="p-6 rounded-xl border border-border hover:border-destructive/50 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" />
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex gap-2 items-start"
                    >
                      <span className="text-destructive mt-1.5 w-1 h-1 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Content Warnings */}
        <section className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">
              {t('sections.contentWarnings.title')}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {t('sections.contentWarnings.description')}
          </p>
          <div className="grid gap-3">
            {t
              .raw('sections.contentWarnings.examples')
              .map((example: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/10 text-sm font-mono text-orange-800 dark:text-orange-200 border border-orange-100 dark:border-orange-900/20"
                >
                  {example}
                </div>
              ))}
          </div>
          <p className="text-sm text-muted-foreground italic mt-4 flex items-center gap-2">
            <Heart className="w-3 h-3" />
            {t('sections.contentWarnings.purpose')}
          </p>
        </section>

        {/* Reporting & Consequences Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Reporting */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Flag className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold">
                {t('sections.reporting.title')}
              </h2>
            </div>
            <div className="bg-muted/30 rounded-2xl p-6 h-full">
              <p className="text-muted-foreground mb-4">
                {t('sections.reporting.howTo')}
              </p>
              <ol className="space-y-4 mb-6">
                {t
                  .raw('sections.reporting.steps')
                  .map((step: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start text-sm text-muted-foreground"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
              </ol>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t('sections.reporting.emergency')}
              </p>
            </div>
          </section>

          {/* Consequences */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Gavel className="w-6 h-6 text-slate-500" />
              <h2 className="text-2xl font-bold">
                {t('sections.consequences.title')}
              </h2>
            </div>
            <div className="bg-muted/30 rounded-2xl p-6 h-full">
              <p className="text-muted-foreground mb-4">
                {t('sections.consequences.policy')}
              </p>
              <ul className="space-y-3 mb-6">
                {t
                  .raw('sections.consequences.levels')
                  .map((level: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start text-sm text-muted-foreground"
                    >
                      <AlertOctagon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: level }} />
                    </li>
                  ))}
              </ul>
              <p className="text-sm text-primary font-medium">
                {t('sections.consequences.appeal')}
              </p>
            </div>
          </section>
        </div>

        {/* Self-Care */}
        <section className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-8 border border-primary/10">
          <div className="flex items-center gap-3 mb-6">
            <Coffee className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">
              {t('sections.selfCare.title')}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.raw('sections.selfCare.tips').map((tip: string, idx: number) => (
              <div
                key={idx}
                className="flex gap-3 items-start p-3 bg-background/50 rounded-lg"
              >
                <Heart className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span className="text-sm text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <ExternalLink className="w-6 h-6 text-sky-500" />
            <h2 className="text-2xl font-bold">
              {t('sections.resources.title')}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {t('sections.resources.intro')}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {t
              .raw('sections.resources.contacts')
              .map((contact: string, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 flex items-center gap-3"
                >
                  <Phone className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span
                    className="text-sm font-medium text-sky-900 dark:text-sky-100"
                    dangerouslySetInnerHTML={{ __html: contact }}
                  />
                </div>
              ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
