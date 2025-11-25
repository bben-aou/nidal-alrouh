import { Phone, AlertTriangle, Shield, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmergencyContactCard } from './EmergencyContactCard';

export function EmergencyContacts() {
  const t = useTranslations('crisisSupport');

  const emergencyContacts = [
    {
      icon: Phone,
      name: t('contacts.nationalHotline.name'),
      number: t('contacts.nationalHotline.number'),
      description: t('contacts.nationalHotline.description'),
      availability: t('contacts.nationalHotline.availability'),
      primary: true,
    },
    {
      icon: AlertTriangle,
      name: t('contacts.medical.name'),
      number: t('contacts.medical.number'),
      description: t('contacts.medical.description'),
      availability: t('contacts.medical.availability'),
      primary: false,
    },
    {
      icon: Shield,
      name: t('contacts.police.name'),
      number: t('contacts.police.number'),
      description: t('contacts.police.description'),
      availability: t('contacts.police.availability'),
      primary: false,
    },
    {
      icon: Heart,
      name: t('contacts.poisonControl.name'),
      number: t('contacts.poisonControl.number'),
      description: t('contacts.poisonControl.description'),
      availability: t('contacts.poisonControl.availability'),
      primary: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('emergencyTitle')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {emergencyContacts.map((contact, index) => (
          <EmergencyContactCard key={index} {...contact} />
        ))}
      </div>
    </div>
  );
}
