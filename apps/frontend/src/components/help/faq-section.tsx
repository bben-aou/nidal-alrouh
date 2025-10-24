'use client';

import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { mockFAQCategories, type FAQCategory } from '@/lib/mock-data/help';

interface FAQSectionProps {
  categories?: FAQCategory[];
}

export function FAQSection({
  categories = mockFAQCategories,
}: Readonly<FAQSectionProps>) {
  const t = useTranslations('help');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {category.questions.map((faq) => (
              <Collapsible
                key={faq.id}
                open={openFAQ === faq.id}
                onOpenChange={() =>
                  setOpenFAQ(openFAQ === faq.id ? null : faq.id)
                }
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-left hover:bg-muted rounded-lg">
                  <span className="font-medium">{faq.question}</span>
                  {openFAQ === faq.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3">
                  <p className="text-muted-foreground">{faq.answer}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-muted-foreground">
                      {t('dashboard.wasHelpful')}
                    </span>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
