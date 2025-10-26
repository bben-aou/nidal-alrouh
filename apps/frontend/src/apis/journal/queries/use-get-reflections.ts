import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { JOURNAL_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

export const GET_REFLECTIONS_KEY = 'GET_REFLECTIONS_KEY';

export interface ReflectionItem {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  privacy: 'PRIVATE' | 'PUBLIC' | 'FRIENDS_ONLY';
  tags: string[];
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

type GetReflectionsResponse = ReflectionItem[];

interface GetReflectionsParams {
  q?: string;
  page?: number;
  limit?: number;
}

type TUseGetReflectionsParams = {
  params?: GetReflectionsParams;
  config?: UseQueryOptions<GetReflectionsResponse, ApiClientError>;
};

const getReflectionsApiCall = async (
  params: GetReflectionsParams = {}
): Promise<GetReflectionsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.append('q', params.q);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = `${JOURNAL_ENDPOINTS.REFLECTIONS}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<GetReflectionsResponse>(endpoint);
  return response;
};

export const useGetReflections = ({
  params = {},
  config,
}: TUseGetReflectionsParams = {}) => {
  const queryKey = [GET_REFLECTIONS_KEY, params];

  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery({
      queryKey,
      queryFn: () => getReflectionsApiCall(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
      ...config,
    });

  const reflections = data || [];

  return {
    reflections,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};

export type { GetReflectionsResponse, GetReflectionsParams };
