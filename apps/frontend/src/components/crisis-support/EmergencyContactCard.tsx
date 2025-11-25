import { Phone, type LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface EmergencyContactCardProps {
  icon: LucideIcon;
  name: string;
  number: string;
  description: string;
  availability: string;
  primary?: boolean;
}

export function EmergencyContactCard({
  icon: Icon,
  name,
  number,
  description,
  availability,
  primary = false,
}: EmergencyContactCardProps) {
  return (
    <a href={`tel:${number.replace(/\s/g, '')}`} className="block group">
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 cursor-pointer ${
          primary
            ? 'border-primary/30 bg-primary/5 dark:bg-primary/5'
            : 'border-border/50 bg-background/50'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">{name}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {number}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {availability}
              </div>
            </div>
            <Phone className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
