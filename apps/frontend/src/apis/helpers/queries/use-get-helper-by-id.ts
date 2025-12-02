import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { HELPERS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { HelperDetails } from '@/types/helpers';

export const GET_HELPER_BY_ID_KEY = 'GET_HELPER_BY_ID_KEY';

const getHelperByIdApiCall = async (id: string): Promise<HelperDetails> => {
  const endpoint = HELPERS_ENDPOINTS.HELPER_BY_ID(id);
  const response = await apiClient.get<HelperDetails>(endpoint);
  return response;
};

export const useGetHelperById = ({
  id,
  config,
}: {
  id: string;
  config?: UseQueryOptions<HelperDetails, ApiClientError>;
}) => {
  return useQuery<HelperDetails, ApiClientError>({
    queryKey: [GET_HELPER_BY_ID_KEY, id],
    queryFn: () => getHelperByIdApiCall(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...config,
  });
};
