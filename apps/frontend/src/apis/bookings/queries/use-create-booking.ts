import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { bookingsApi, CreateBookingPayload } from '../api';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      bookingsApi.createBooking(payload),
    onSuccess: (data) => {
      toast.success('Booking created successfully!');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      return data;
    },
    onError: (error) => {
      toast.error('Failed to create booking. Please try again.');
      console.error('Booking creation error:', error);
    },
  });
};
