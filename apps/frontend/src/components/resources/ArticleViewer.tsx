'use client';

import { cn } from '@/lib/utils';

interface ArticleViewerProps {
  content: string;
  className?: string;
}

export function ArticleViewer({
  content,
  className,
}: Readonly<ArticleViewerProps>) {
  return (
    <article
      className={cn(
        'prose prose-lg dark:prose-invert max-w-none',
        // Typography enhancements
        'prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground',
        'prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12',
        'prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2',
        'prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8',
        'prose-p:text-lg prose-p:leading-8 prose-p:text-muted-foreground prose-p:mb-6',
        // Links
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:text-foreground/80 prose-blockquote:my-8',
        // Lists
        'prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:text-lg prose-li:leading-7 prose-li:mb-2',
        'prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6',
        // Code blocks
        'prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-foreground',
        'prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:border',
        // Images
        'prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:w-full',
        // Strong/Bold
        'prose-strong:font-bold prose-strong:text-foreground',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
