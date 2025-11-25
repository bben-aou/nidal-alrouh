'use client';

import { CrisisAlert } from '@/components/crisis-support/CrisisAlert';
import { CrisisHero } from '@/components/crisis-support/CrisisHero';
import { CrisisResponseGuide } from '@/components/crisis-support/CrisisResponseGuide';
import { EmergencyContacts } from '@/components/crisis-support/EmergencyContacts';
import { MentalHealthOrganizations } from '@/components/crisis-support/MentalHealthOrganizations';
import { SupportFooter } from '@/components/crisis-support/SupportFooter';

export default function CrisisSupportPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <CrisisHero />

      <CrisisAlert />

      <EmergencyContacts />

      <MentalHealthOrganizations />

      <CrisisResponseGuide />

      <SupportFooter />
    </div>
  );
}
