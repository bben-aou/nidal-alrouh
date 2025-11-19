import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
  message: string;
  details?: string;
  onRetry: () => void;
  className?: string;
}

export function EventListError({
  message,
  details,
  onRetry,
  className = '',
}: Readonly<Props>) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground text-center max-w-md">{details}</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
