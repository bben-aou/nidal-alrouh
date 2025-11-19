import { z } from 'zod';

export const baseEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  type: z.enum([
    'workshop',
    'supportSession',
    'consultation',
    'communityMeeting',
    'webinar',
  ]),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  location: z.string().min(1).max(500),
  meetingUrl: z.url().optional().or(z.literal('')),
  maxAttendees: z.number().min(1).max(1000),
  requiresApproval: z.boolean(),
  coverImage: z.url().optional().or(z.literal('')),
  tags: z.array(z.string()),
});

export type EventFormData = z.infer<typeof baseEventSchema>;

export const createEventSchema = (t: (key: string) => string) =>
  baseEventSchema
    .extend({
      title: z.string().min(1, t('validation.titleRequired')).max(200),
      description: z
        .string()
        .min(1, t('validation.descriptionRequired'))
        .max(2000),
      startDate: z.date({ message: t('validation.startDateRequired') }),
      endDate: z.date({ message: t('validation.endDateRequired') }),
      startTime: z.string().min(1, t('validation.startTimeRequired')),
      endTime: z.string().min(1, t('validation.endTimeRequired')),
      location: z.string().min(1, t('validation.locationRequired')).max(500),
      maxAttendees: z
        .number({ message: t('validation.maxAttendeesMin') })
        .min(1, t('validation.maxAttendeesMin'))
        .max(1000),
      meetingUrl: z
        .url({ message: t('validation.meetingUrlInvalid') })
        .optional()
        .or(z.literal('')),
      coverImage: z
        .url({ message: t('validation.meetingUrlInvalid') })
        .optional()
        .or(z.literal('')),
    })
    .refine(
      (data) =>
        !data.startDate || !data.endDate || data.endDate >= data.startDate,
      { path: ['endDate'], message: t('validation.endDateAfterStart') }
    );
