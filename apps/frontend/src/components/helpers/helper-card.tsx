'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { HelperCardProps } from '@/types/helpers';

import { HelperCardBio } from './helper-card-bio';
import { HelperCardFooterContent } from './helper-card-footer-content';
import { HelperCardHeaderContent } from './helper-card-header-content';
import { HelperCardLanguages } from './helper-card-languages';
import { HelperCardSpecializations } from './helper-card-specializations';

export function HelperCard({ helper }: Readonly<HelperCardProps>) {
  return (
    <Card className="group relative flex flex-col h-full border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <HelperCardHeaderContent helper={helper} />

      <CardContent className="flex-1 pb-3 px-5 space-y-3 text-center">
        <HelperCardBio bio={helper.bio} />
        <HelperCardSpecializations specializations={helper.specializations} />
        {helper.languages && helper.languages.length > 0 && (
          <HelperCardLanguages languages={helper.languages} />
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-5">
        <HelperCardFooterContent helperId={helper.id} />
      </CardFooter>
    </Card>
  );
}
