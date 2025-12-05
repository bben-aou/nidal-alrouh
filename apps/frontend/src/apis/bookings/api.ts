import { apiClient } from '@/lib/api';

export interface AvailableSlotsResponse {
  date: string;
  timezone: string;
  availableSlots: Array<{
    time: string;
    duration: number;
    platform: string;
  }>;
}

export interface CreateBookingPayload {
  helperId: string;
  date: string;
  time: string;
  timezone: string;
  duration: number;
  platform: string;
  notes?: string;
}

export interface CreateBookingResponse {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  seekerNote?: string;
  seeker: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  helper: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  helperProfile: {
    id: string;
    name: string;
    bio?: string;
  };
}

export const bookingsApi = {
  getAvailableSlots: async (
    helperId: string,
    date: string
  ): Promise<AvailableSlotsResponse> => {
    const response = await apiClient.get<AvailableSlotsResponse>(
      `/sessions/bookings/available-slots?helperId=${helperId}&date=${date}`
    );
    return response;
  },

  createBooking: async (
    payload: CreateBookingPayload
  ): Promise<CreateBookingResponse> => {
    const response = await apiClient.post<CreateBookingResponse>(
      '/sessions/bookings/create',
      payload
    );
    return response;
  },
};
