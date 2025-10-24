'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  mockSupportTickets,
  getStatusColor,
  getPriorityColor,
  getStatusIcon,
  type SupportTicket,
} from '@/lib/mock-data/help';

interface SupportTicketsProps {
  tickets?: SupportTicket[];
}

export function SupportTickets({
  tickets = mockSupportTickets,
}: Readonly<SupportTicketsProps>) {
  const t = useTranslations('help');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t('dashboard.mySupportTickets')}
        </h2>
        <Badge variant="outline">
          {tickets.length} {t('dashboard.activeTickets')}
        </Badge>
      </div>
      <div className="space-y-3">
        {tickets.map((ticket) => {
          const StatusIcon = getStatusIcon(ticket.status);
          return (
            <Card
              key={ticket.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.id}</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {ticket.status}
                      </Badge>
                      <span
                        className={`text-sm ${getPriorityColor(ticket.priority)}`}
                      >
                        {ticket.priority} priority
                      </span>
                    </div>
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created {ticket.created}</span>
                      <span>Last update {ticket.lastUpdate}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('dashboard.viewTicket')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
