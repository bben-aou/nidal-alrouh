'use client';

import { useTranslations } from 'next-intl';

export default function TermsOfServicePage() {
  const t = useTranslations('legal.termsOfService');

  const renderSection = (sectionKey: string) => {
    const section = t.raw(`sections.${sectionKey}`);

    return (
      <section key={sectionKey} className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>

        {section.disclaimer && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border-2 border-red-500 dark:border-red-900/50">
            <p className="text-sm font-bold text-red-900 dark:text-red-100 mb-2">
              {section.disclaimer}
            </p>
          </div>
        )}

        {section.points && (
          <ul className="space-y-3 text-muted-foreground">
            {section.points.map((point: string, idx: number) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: point }} />
              </li>
            ))}
          </ul>
        )}

        {section.requirements && (
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {section.requirements.map((req: string, idx: number) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        )}

        {section.rules && (
          <ul className="space-y-2 text-muted-foreground">
            {section.rules.map((rule: string, idx: number) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <span dangerouslySetInnerHTML={{ __html: rule }} />
              </li>
            ))}
          </ul>
        )}

        {section.ownership && (
          <p className="text-muted-foreground leading-relaxed">
            {section.ownership}
          </p>
        )}

        {section.responsibilities && (
          <>
            <p className="text-base font-semibold text-primary">
              {section.responsibilities[0]}
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              {section.responsibilities
                .slice(1)
                .map((resp: string, idx: number) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: resp }} />
                ))}
            </ul>
          </>
        )}

        {section.prohibited && (
          <div className="ml-4 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              {section.prohibited.title}
            </h3>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              {section.prohibited.items.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {section.feature && (
          <>
            <p className="text-muted-foreground">{section.feature}</p>
            {section.terms && (
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {section.terms.map((term: string, idx: number) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {section.commitment && (
          <>
            <p className="text-muted-foreground">{section.commitment}</p>
            {section.points && (
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {section.points.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {section.policy && (
          <>
            <p className="text-muted-foreground">{section.policy}</p>
            {section.actions && (
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {section.actions.map((action: string, idx: number) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {section.disclaimers && (
          <ul className="space-y-2 text-muted-foreground">
            {section.disclaimers.map((disclaimer: string, idx: number) => (
              <li key={idx} className="flex gap-2">
                <span dangerouslySetInnerHTML={{ __html: disclaimer }} />
              </li>
            ))}
          </ul>
        )}

        {section.platform && (
          <p className="text-muted-foreground">{section.platform}</p>
        )}

        {section.userContent && (
          <p className="text-muted-foreground">{section.userContent}</p>
        )}

        {section.restrictions && (
          <p className="text-muted-foreground">{section.restrictions}</p>
        )}

        {section.rights && (
          <ul className="space-y-2 text-muted-foreground">
            {section.rights.map((right: string, idx: number) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <span dangerouslySetInnerHTML={{ __html: right }} />
              </li>
            ))}
          </ul>
        )}

        {section.law && (
          <>
            <p className="text-muted-foreground">{section.law}</p>
            {section.jurisdiction && (
              <p className="text-muted-foreground">{section.jurisdiction}</p>
            )}
            {section.resolution && (
              <p className="text-sm text-muted-foreground italic">
                {section.resolution}
              </p>
            )}
          </>
        )}

        {section.email && (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{section.email}</p>
            {section.support && <p>{section.support}</p>}
          </div>
        )}

        {section.notice && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {section.notice}
            </p>
          </div>
        )}
      </section>
    );
  };

  const sections = [
    'platform',
    'eligibility',
    'accounts',
    'userContent',
    'anonymity',
    'privacy',
    'moderation',
    'liability',
    'intellectualProperty',
    'termination',
    'governingLaw',
    'changes',
    'contact',
    'beta',
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
          <div className="text-sm text-muted-foreground">
            <p>{t('lastUpdated', { date: 'November 26, 2024' })}</p>
          </div>

          {/* Acceptance Notice */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm font-medium text-foreground">
              {t('acceptance')}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => renderSection(section))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Questions about these Terms? Contact us at{' '}
            <a
              href="mailto:legal@nidal-alrouh.ma"
              className="text-primary hover:underline"
            >
              legal@nidal-alrouh.ma
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
