import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { HELPERS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { HelperReview } from '@/types/helpers';

export const GET_HELPER_REVIEWS_KEY = 'GET_HELPER_REVIEWS_KEY';

const getHelperReviewsApiCall = async (
  helperId: string
): Promise<HelperReview[]> => {
  const response = await apiClient.get<HelperReview[]>(
    HELPERS_ENDPOINTS.REVIEWS(helperId)
  );
  return response;
};

export const useGetHelperReviews = (
  helperId: string,
  config?: UseQueryOptions<HelperReview[], ApiClientError>
) => {
  const queryKey = ['helpers', helperId, 'reviews', GET_HELPER_REVIEWS_KEY];

  return useQuery<HelperReview[], ApiClientError>({
    queryKey,
    queryFn: () => getHelperReviewsApiCall(helperId),
    enabled: !!helperId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...config,
  });
};
