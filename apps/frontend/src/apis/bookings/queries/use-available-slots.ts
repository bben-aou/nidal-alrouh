import { useQuery } from '@tanstack/react-query';

import { bookingsApi } from '../api';

export const useAvailableSlots = (helperId: string, date: string) => {
  return useQuery({
    queryKey: ['available-slots', helperId, date],
    queryFn: () => bookingsApi.getAvailableSlots(helperId, date),
    enabled: !!helperId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
