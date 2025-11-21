import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EventDetailsContent } from '@/components/community/EventDetailsContent';

interface EventDetailsPageProps {
  params: {
    locale: string;
    eventId: string;
  };
}

export function generateMetadata(): Metadata {
  // In a real application,we will fetch event data here for metadata
  // For now, we'll use default metadata
  return {
    title: 'Event Details | Community',
    description:
      'View event details and register for upcoming community events',
    openGraph: {
      title: 'Event Details',
      description: 'Join our community event',
      type: 'website',
    },
  };
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { eventId } = params;

  if (!eventId) {
    notFound();
  }

  return <EventDetailsContent eventId={eventId} />;
}
