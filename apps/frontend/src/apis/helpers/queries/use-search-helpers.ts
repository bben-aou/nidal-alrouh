import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { HELPERS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { SearchHelpersParams, SearchHelpersResponse } from '@/types/helpers';

export const SEARCH_HELPERS_KEY = 'SEARCH_HELPERS_KEY';

const searchHelpersApiCall = async (
  params: SearchHelpersParams = {}
): Promise<SearchHelpersResponse> => {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.append('search', params.search);
  if (params.specialization && params.specialization !== 'all')
    searchParams.append('specializations', params.specialization);
  if (params.language && params.language !== 'all')
    searchParams.append('languages', params.language);

  const queryString = searchParams.toString();
  const endpoint = `${HELPERS_ENDPOINTS.SEARCH}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<SearchHelpersResponse>(endpoint);
  return response;
};

export const useSearchHelpers = ({
  params = {},
  config,
}: {
  params?: SearchHelpersParams;
  config?: UseQueryOptions<SearchHelpersResponse, ApiClientError>;
} = {}) => {
  const queryKey = ['helpers', 'search', SEARCH_HELPERS_KEY, params];

  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery<SearchHelpersResponse, ApiClientError>({
      queryKey,
      queryFn: () => searchHelpersApiCall(params),
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: false,
      ...config,
    });

  const helpers = data?.data ?? [];

  return {
    helpers,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};
