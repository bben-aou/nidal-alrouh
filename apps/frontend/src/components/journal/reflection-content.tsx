'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface ReflectionContentProps {
  content: string;
}

export function ReflectionContent({
  content,
}: Readonly<ReflectionContentProps>) {
  const t = useTranslations('journal');
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowExpandButton = content.length > 150;

  return (
    <div className="space-y-4">
      {/* Content */}
      <div className={`relative ${!isExpanded ? 'max-h-[4.5em]' : ''} mb-4`}>
        <p
          className={`text-muted-foreground transition-all duration-300 ease-in-out ${!isExpanded ? 'line-clamp-3' : ''}`}
        >
          {content}
        </p>
        {!isExpanded && shouldShowExpandButton && (
          <div
            className="absolute bottom-[-1rem] left-0 right-0 h-8 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, var(--card) 100%)',
              opacity: '0.95',
            }}
          />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {shouldShowExpandButton && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <EyeOff className="mr-1 h-3 w-3" />
                <span>{t('dashboard.read_less')}</span>
              </>
            ) : (
              <>
                <Eye className="mr-1 h-3 w-3" />
                <span>{t('dashboard.read')}</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
