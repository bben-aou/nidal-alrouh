import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { PROMPTS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

export const GET_PROMPTS_KEY = 'GET_PROMPTS_KEY';

export interface PromptItem {
  id: string;
  text: string;
  tags: string[];
  locale: string;
  category: string;
}

export interface GetPromptsResponse {
  prompts: PromptItem[];
  total: number;
  hasMore: boolean;
}

interface GetPromptsParams {
  locale?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

type TUseGetPromptsParams = {
  params?: GetPromptsParams;
  config?: UseQueryOptions<GetPromptsResponse, ApiClientError>;
};

const getPromptsApiCall = async (
  params: GetPromptsParams = {}
): Promise<GetPromptsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.locale) searchParams.append('locale', params.locale);
  if (params.category) searchParams.append('category', params.category);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());

  const queryString = searchParams.toString();
  const endpoint = `${PROMPTS_ENDPOINTS.PROMPTS}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<GetPromptsResponse>(endpoint);
  return response;
};

export const useGetPrompts = ({
  params = {},
  config,
}: TUseGetPromptsParams = {}) => {
  return useQuery<GetPromptsResponse, ApiClientError>({
    queryKey: [GET_PROMPTS_KEY, params],
    queryFn: () => getPromptsApiCall(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...config,
  });
};

export type { GetPromptsParams };
