'use client';

import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function ContactSection() {
  const t = useTranslations('help');

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.contactInformation')}</CardTitle>
          <CardDescription>{t('dashboard.contactDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">support@nidalrouh.com</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.emailResponse')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.phoneHours')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{t('dashboard.liveChat')}</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.chatAvailable')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickContact')}</CardTitle>
          <CardDescription>
            {t('dashboard.quickContactDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder={t('dashboard.yourName')} />
          <Input placeholder={t('dashboard.yourEmail')} />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={t('dashboard.selectTopic')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Inquiry</SelectItem>
              <SelectItem value="technical">Technical Support</SelectItem>
              <SelectItem value="billing">Billing Question</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder={t('dashboard.yourMessage')}
            className="min-h-[100px]"
          />
          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {t('dashboard.sendMessage')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
