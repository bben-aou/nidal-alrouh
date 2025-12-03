import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { HELPERS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { HelperReviewsResponse } from '@/types/helpers';

export const GET_HELPER_REVIEWS_KEY = 'GET_HELPER_REVIEWS_KEY';

const getHelperReviewsApiCall = async (
  helperId: string
): Promise<HelperReviewsResponse> => {
  const response = await apiClient.get<HelperReviewsResponse>(
    HELPERS_ENDPOINTS.REVIEWS(helperId)
  );
  return response;
};

export const useGetHelperReviews = (
  helperId: string,
  config?: UseQueryOptions<HelperReviewsResponse, ApiClientError>
) => {
  const queryKey = ['helpers', helperId, 'reviews', GET_HELPER_REVIEWS_KEY];

  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery<HelperReviewsResponse, ApiClientError>({
      queryKey,
      queryFn: () => getHelperReviewsApiCall(helperId),
      enabled: !!helperId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
      ...config,
    });

  const reviews = data?.data ?? [];

  return {
    reviews,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};
