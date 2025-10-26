import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { PROMPTS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

export const GET_PROMPT_CATEGORIES_KEY = 'GET_PROMPT_CATEGORIES_KEY';

type GetPromptCategoriesResponse = string[];

type TUseGetPromptCategoriesParams = {
  config?: UseQueryOptions<GetPromptCategoriesResponse, ApiClientError>;
};

const getPromptCategoriesApiCall =
  async (): Promise<GetPromptCategoriesResponse> => {
    const endpoint = PROMPTS_ENDPOINTS.PROMPT_CATEGORIES;
    const response = await apiClient.get<GetPromptCategoriesResponse>(endpoint);
    return response;
  };

export const useGetPromptCategories = ({
  config,
}: TUseGetPromptCategoriesParams = {}) => {
  return useQuery<GetPromptCategoriesResponse, ApiClientError>({
    queryKey: [GET_PROMPT_CATEGORIES_KEY],
    queryFn: getPromptCategoriesApiCall,
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    ...config,
  });
};
