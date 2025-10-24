'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ContactSection } from '@/components/help/contact-section';
import { CreateTicketDialog } from '@/components/help/create-ticket-dialog';
import { FAQSection } from '@/components/help/faq-section';
import { SupportOptions } from '@/components/help/support-options';
import { SupportTickets } from '@/components/help/support-tickets';
import { TutorialsSection } from '@/components/help/tutorials-section';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardHelpPage() {
  const t = useTranslations('help');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.description')}</p>
        </div>
        <CreateTicketDialog />
      </div>

      {/* Quick Support Options */}
      <SupportOptions />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('dashboard.searchHelp')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faq">{t('dashboard.tabs.faq')}</TabsTrigger>
          <TabsTrigger value="tutorials">
            {t('dashboard.tabs.tutorials')}
          </TabsTrigger>
          <TabsTrigger value="tickets">
            {t('dashboard.tabs.tickets')}
          </TabsTrigger>
          <TabsTrigger value="contact">
            {t('dashboard.tabs.contact')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <FAQSection />
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <TutorialsSection />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <SupportTickets />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
