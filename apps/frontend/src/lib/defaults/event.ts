import type { EventFormData } from '@/lib/validations/event';

import type { DefaultValues } from 'react-hook-form';

export const defaultEventFormValues: DefaultValues<EventFormData> = {
  title: '',
  description: '',
  type: 'workshop',
  status: 'upcoming',
  startTime: '',
  endTime: '',
  location: '',
  meetingUrl: '',
  maxAttendees: 50,
  requiresApproval: false,
  coverImage: '',
  tags: [],
};
