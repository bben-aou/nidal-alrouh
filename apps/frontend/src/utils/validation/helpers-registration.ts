import { z } from 'zod';

import type { HelperRegistrationFormData } from '@/types/helpers';

const BIO_MIN_CHARS = 50;

const legalSchema = z.object({
  agreesToTerms: z.literal(true),
});

const profileSchema = z.object({
  bio: z.string().min(BIO_MIN_CHARS),
  specializations: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  maxSessionsPerWeek: z.number().min(1).max(20),
});

const calSchema = z.object({
  calUsername: z.string().min(1),
});

export function isLegalValid(
  data: Pick<HelperRegistrationFormData, 'agreesToTerms'>
): boolean {
  return legalSchema.safeParse(data).success;
}

export function isProfileValid(
  data: Pick<
    HelperRegistrationFormData,
    'bio' | 'specializations' | 'languages' | 'maxSessionsPerWeek'
  >
): boolean {
  return profileSchema.safeParse(data).success;
}

export function isCalValid(
  data: Pick<HelperRegistrationFormData, 'calUsername'>
): boolean {
  return calSchema.safeParse(data).success;
}

export function isFormValid(data: HelperRegistrationFormData): boolean {
  return (
    isLegalValid({ agreesToTerms: data.agreesToTerms }) &&
    isProfileValid({
      bio: data.bio,
      specializations: data.specializations,
      languages: data.languages,
      maxSessionsPerWeek: data.maxSessionsPerWeek,
    }) &&
    isCalValid({ calUsername: data.calUsername })
  );
}
