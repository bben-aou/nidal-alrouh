'use client';

import { CheckCircle, MessageSquareWarning } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('legal.privacyPolicy');

  const renderSection = (sectionKey: string) => {
    const section = t.raw(`sections.${sectionKey}`);

    return (
      <section key={sectionKey} className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>

        {section.important && (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-center gap-3 text-sm font-semibold text-amber-900 dark:text-amber-100">
              <MessageSquareWarning />
              {section.important}
            </div>
          </div>
        )}

        {section.content && (
          <p className="text-muted-foreground leading-relaxed">
            {section.content}
          </p>
        )}

        {section.highlight && (
          <p className="text-base font-semibold text-primary">
            {section.highlight}
          </p>
        )}

        {section.points && (
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {section.points.map((point: string, idx: number) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        )}

        {section.features && (
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {section.features.map((feature: string, idx: number) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        )}

        {section.commitment && (
          <>
            <p className="text-muted-foreground leading-relaxed">
              {section.commitment}
            </p>
            {section.measures && (
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {section.measures.map((measure: string, idx: number) => (
                  <li key={idx}>{measure}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {section.registration && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium">{section.registration}</p>
          </div>
        )}

        {section.note && (
          <p className="text-sm text-muted-foreground italic">{section.note}</p>
        )}

        {section.notice && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {section.notice}
            </p>
          </div>
        )}

        {section.categories &&
          Object.keys(section.categories).map((catKey) => {
            const category = section.categories[catKey];
            return (
              <div key={catKey} className="ml-4 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {category.title}
                </h3>
                {category.items && (
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    {category.items.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

        {section.purposes && (
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {section.purposes.map((purpose: string, idx: number) => (
              <li key={idx}>{purpose}</li>
            ))}
          </ul>
        )}

        {section.noSelling && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50">
            <div className="flex items-center gap-3 text-sm font-semibold text-green-900 dark:text-green-100">
              <CheckCircle />
              {section.noSelling}
            </div>
          </div>
        )}

        {section.policy && (
          <>
            <p className="text-muted-foreground">{section.policy}</p>
            {section.periods && (
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                {section.periods.map((period: string, idx: number) => (
                  <li key={idx}>{period}</li>
                ))}
              </ul>
            )}
            {section.exceptions && (
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                {section.exceptions.map((exception: string, idx: number) => (
                  <li key={idx}>{exception}</li>
                ))}
              </ul>
            )}
            {section.methods && (
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                {section.methods.map((method: string, idx: number) => (
                  <li key={idx}>{method}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {section.intro && (
          <>
            <p className="text-muted-foreground">{section.intro}</p>
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
            {section.exercise && (
              <p className="text-sm font-medium text-primary mt-4">
                {section.exercise}
              </p>
            )}
          </>
        )}

        {section.description && (
          <>
            <p className="text-muted-foreground">{section.description}</p>
            {section.types && (
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                {section.types.map((type: string, idx: number) => (
                  <li key={idx}>{type}</li>
                ))}
              </ul>
            )}
            {section.analytics && (
              <p className="text-sm font-medium text-primary mt-2">
                {section.analytics}
              </p>
            )}
          </>
        )}

        {section.email && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{section.email}</p>
            {section.address && <p>{section.address}</p>}
            {section.cndp && <p>{section.cndp}</p>}
          </div>
        )}

        {section.international && (
          <p className="text-sm text-muted-foreground">
            {section.international}
          </p>
        )}

        {section.review && (
          <p className="text-sm text-muted-foreground italic">
            {section.review}
          </p>
        )}
      </section>
    );
  };

  const sections = [
    'introduction',
    'platformNature',
    'dataController',
    'dataCollection',
    'dataUse',
    'dataSecurity',
    'dataRetention',
    'yourRights',
    'dataSharing',
    'cookies',
    'children',
    'changes',
    'contact',
    'beta',
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => renderSection(section))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Questions about this Privacy Policy? Contact us at{' '}
            <a
              href="mailto:privacy@nidal-alrouh.ma"
              className="text-primary hover:underline"
            >
              privacy@nidal-alrouh.ma
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
