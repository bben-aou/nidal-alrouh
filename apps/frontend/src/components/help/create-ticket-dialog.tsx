'use client';

import { Plus, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CreateTicketDialogProps {
  triggerText?: string;
}

export function CreateTicketDialog({
  triggerText,
}: Readonly<CreateTicketDialogProps>) {
  const t = useTranslations('help');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {triggerText || t('dashboard.newTicket')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('dashboard.createSupportTicket')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.ticketDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder={t('dashboard.ticketSubject')} />
          <div className="grid grid-cols-2 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('dashboard.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account Issues</SelectItem>
                <SelectItem value="technical">Technical Problems</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="billing">Billing Questions</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('dashboard.selectPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder={t('dashboard.describeIssue')}
            className="min-h-[150px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline">{t('dashboard.saveDraft')}</Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              {t('dashboard.submitTicket')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
