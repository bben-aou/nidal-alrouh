'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  // Load React Query Devtools only in development and on the client
  const ReactQueryDevtools =
    process.env.NODE_ENV === 'development'
      ? dynamic(
          () =>
            import('@tanstack/react-query-devtools').then(
              (mod) => mod.ReactQueryDevtools
            ),
          { ssr: false }
        )
      : null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
