import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { PROMPTS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

export const GET_PROMPT_BY_ID_KEY = 'GET_PROMPT_BY_ID_KEY';

export interface PromptByIdResponse {
  id: string;
  text: string;
  tags: string[];
  locale: string;
  category: string;
}

type TUseGetPromptByIdParams = {
  id: string;
  config?: UseQueryOptions<PromptByIdResponse, ApiClientError>;
};

const getPromptByIdApiCall = async (
  id: string
): Promise<PromptByIdResponse> => {
  const endpoint = PROMPTS_ENDPOINTS.PROMPT_BY_ID(id);
  const response = await apiClient.get<PromptByIdResponse>(endpoint);
  return response;
};

export const useGetPromptById = ({ id, config }: TUseGetPromptByIdParams) => {
  return useQuery<PromptByIdResponse, ApiClientError>({
    queryKey: [GET_PROMPT_BY_ID_KEY, id],
    queryFn: () => getPromptByIdApiCall(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...config,
  });
};
