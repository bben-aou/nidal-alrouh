import { CalendarX } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  className?: string;
}

export function EventListEmpty({
  title,
  description,
  className = '',
}: Readonly<Props>) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md">
        {description}
      </p>
    </div>
  );
}
