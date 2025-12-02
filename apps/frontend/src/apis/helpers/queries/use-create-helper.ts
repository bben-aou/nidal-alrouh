import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { HELPERS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { CreateHelperPayload, HelperDetails } from '@/types/helpers';

const createHelperApiCall = async (
  payload: CreateHelperPayload
): Promise<HelperDetails> => {
  const response = await apiClient.post<HelperDetails>(
    HELPERS_ENDPOINTS.CREATE,
    payload
  );
  return response;
};

export const useCreateHelper = (
  config?: UseMutationOptions<
    HelperDetails,
    ApiClientError,
    CreateHelperPayload
  >
) => {
  return useMutation<HelperDetails, ApiClientError, CreateHelperPayload>({
    mutationFn: createHelperApiCall,
    ...config,
  });
};
