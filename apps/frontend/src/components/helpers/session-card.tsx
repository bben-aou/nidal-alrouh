'use client';

import { format, formatDistanceToNow } from 'date-fns';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  MessageSquare,
  User,
  Timer,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Session } from '@/types/helpers';
import { resolveDateFnsLocale } from '@/utils/date';

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
  const locale = useLocale();
  const dateLocale = resolveDateFnsLocale(locale);

  const otherPerson = role === 'USER' ? session.helper : session.seeker;
  const start = new Date(session.scheduledAt);
  const end = new Date(start.getTime() + session.duration * 60000);

  const isUpcoming = start > new Date() && session.status === 'SCHEDULED';
  const isPast = end < new Date();
  const isCompleted = session.status === 'COMPLETED';
  const isCancelled = session.status === 'CANCELLED';

  const getTimeContext = () => {
    if (isUpcoming) {
      return formatDistanceToNow(start, {
        addSuffix: true,
        locale: dateLocale,
      });
    }
    if (isPast || isCompleted) {
      return formatDistanceToNow(end, { addSuffix: true, locale: dateLocale });
    }
    return null;
  };

  const getStatusStyles = () => {
    switch (session.status) {
      case 'SCHEDULED':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const timeContext = getTimeContext();

  return (
    <div className="group rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="p-4 sm:p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={
                role === 'USER' && otherPerson?.id
                  ? `/helpers/${otherPerson.id}`
                  : '#'
              }
              className="shrink-0"
            >
              <Avatar className="h-11 w-11 ring-2 ring-background transition-transform hover:scale-105">
                <AvatarImage
                  src={otherPerson?.avatarUrl ?? '/default-profile.jpg'}
                  alt={otherPerson?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {otherPerson?.name?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {otherPerson?.name}
                </p>
                {role === 'USER' && otherPerson?.id && (
                  <Link
                    href={`/helpers/${otherPerson.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('with')} •{' '}
                <span className="text-foreground/70">
                  {session.duration} {t('minutes')}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge
              variant="outline"
              className={`${getStatusStyles()} text-xs font-medium`}
            >
              {t(`statusLabel.${session.status}`)}
            </Badge>
            {timeContext && (
              <span className="text-xs text-muted-foreground">
                {timeContext}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span>
              {format(start, 'EEE, MMM d, yyyy', { locale: dateLocale })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>
              {format(start, 'p', { locale: dateLocale })} –{' '}
              {format(end, 'p', { locale: dateLocale })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="h-4 w-4 text-primary/70" />
            <span>{session.duration} min</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 justify-between border-t border-border/50 pt-4">
          <div>
            {otherPerson?.id && !isCancelled && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/dashboard/chat">
                  <MessageSquare className="h-4 w-4" />
                  {t('actions.message')}
                </Link>
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {isUpcoming && session.meetingUrl && (
              <Button asChild size="sm" className="gap-2">
                <a
                  href={session.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video className="h-4 w-4" />
                  {t('actions.join')}
                </a>
              </Button>
            )}

            {role === 'HELPER' && isPast && session.status === 'SCHEDULED' && (
              <Button
                size="sm"
                className="gap-2"
                onClick={() => onComplete?.(session.id)}
              >
                <CheckCircle className="h-4 w-4" />
                {t('actions.complete')}
              </Button>
            )}

            {role === 'USER' && isCompleted && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => onFeedback?.(session.id)}
              >
                <MessageSquare className="h-4 w-4" />
                {t('actions.feedback')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
