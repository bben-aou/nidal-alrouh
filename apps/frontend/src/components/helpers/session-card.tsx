'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Session } from '@/types/helpers';

interface SessionCardProps {
  session: Session;
  role: 'HELPER' | 'USER';
  onComplete?: (id: string) => void;
  onFeedback?: (id: string) => void;
}

export function SessionCard({
  session,
  role,
  onComplete,
  onFeedback,
}: Readonly<SessionCardProps>) {
  const t = useTranslations('helpers.sessions.card');

  const otherPerson = role === 'USER' ? session.helper : session.seeker;
  const start = new Date(session.scheduledAt);
  const end = new Date(start.getTime() + session.duration * 60000);

  const isUpcoming = start > new Date() && session.status === 'SCHEDULED';
  const isPast = end < new Date();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherPerson?.avatarUrl} alt={otherPerson?.name} />
            <AvatarFallback>{otherPerson?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {t('with')} {otherPerson?.name}
            </p>
            <Badge
              variant={session.status === 'SCHEDULED' ? 'default' : 'secondary'}
              className="mt-1"
            >
              {t(`statusLabel.${session.status}`)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(start, 'PPP')}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {format(start, 'p')} - {format(end, 'p')}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        {isUpcoming && session.meetingUrl && (
          <Button asChild size="sm" className="w-full sm:w-auto">
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Video className="mr-2 h-4 w-4" />
              {t('actions.join')}
            </a>
          </Button>
        )}

        {role === 'HELPER' && isPast && session.status === 'SCHEDULED' && (
          <Button size="sm" onClick={() => onComplete?.(session.id)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {t('actions.complete')}
          </Button>
        )}

        {role === 'USER' && session.status === 'COMPLETED' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onFeedback?.(session.id)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {t('actions.feedback')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
