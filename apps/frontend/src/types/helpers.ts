export interface CreateHelperPayload {
  bio: string;
  specializations: string[];
  languages: string[];
  maxSessionsPerWeek: number;
  calUsername: string;
}

export interface StepCalIntegrationProps {
  calUsername: string;
  onDataChange: (data: { calUsername: string }) => void;
}

export interface StepLegalDisclaimerProps {
  agreesToTerms: boolean;
  onDataChange: (data: { agreesToTerms: boolean }) => void;
}

export interface StepProfileInfoProps {
  data: {
    bio: string;
    specializations: string[];
    languages: string[];
    maxSessionsPerWeek: number;
  };
  onDataChange: (data: Partial<StepProfileInfoProps['data']>) => void;
}

export interface HelperRegistrationFormData {
  bio: string;
  specializations: string[];
  languages: string[];
  maxSessionsPerWeek: number;
  calUsername: string;
  agreesToTerms: boolean;
}

export interface HelperProfile {
  id: string;
  user: {
    name: string;
    image?: string;
  };
  bio: string;
  specializations: string[];
  languages: string[];
  stats: {
    avgRating: number;
    totalReviews: number;
    completedSessions: number;
  };
}

export interface ApiHelperProfile {
  id: string;
  user: {
    name: string;
    image?: string;
  };
  bio: string;
  specializations: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  completedSessions: number;
}

export interface HelperDetails {
  id: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  bio: string;
  specializations: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  completedSessions: number;
  calUsername: string;
  createdAt: string;
}

export interface HelperStats {
  rating: number;
  reviewCount: number;
  completedSessions: number;
}

export interface HelperCardProps {
  helper: HelperProfile;
}

export interface SearchHelpersParams {
  search?: string;
  specialization?: string;
  language?: string;
}

export interface SearchHelpersResponse {
  data: HelperProfile[];
  message?: string;
  meta?: {
    timestamp: string;
  };
}

export interface HelperReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    name: string;
    image?: string;
  };
  seeker?: {
    name: string;
    avatarUrl?: string | null;
  };
}

export interface HelperReviewsResponse {
  data: HelperReview[];
  message?: string;
  meta?: {
    timestamp: string;
  };
}

export interface Session {
  id: string;
  scheduledAt: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  meetingUrl?: string;
  helper?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  seeker?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}
