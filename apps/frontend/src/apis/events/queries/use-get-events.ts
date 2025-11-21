import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryFunctionContext,
} from '@tanstack/react-query';

import { EVENTS_ENDPOINTS } from '@/apis/events/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  GetEventsParams,
  GetEventsResponse,
  CommunityEvent,
} from '@/types/community';

export const GET_EVENTS_KEY = 'GET_EVENTS_KEY';

const getEventsApiCall = async ({
  pageParam,
  queryKey,
}: QueryFunctionContext<
  [string, GetEventsParams],
  string | undefined
>): Promise<GetEventsResponse> => {
  const [, params] = queryKey;
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.append('limit', String(params.limit));
  if (pageParam) searchParams.append('cursor', String(pageParam));
  if (params.type) searchParams.append('type', params.type);
  if (params.status) searchParams.append('status', params.status);
  if (params.q) searchParams.append('search', params.q);
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);
  const queryString = searchParams.toString();
  const endpoint = `${EVENTS_ENDPOINTS.EVENTS}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<{
    data: CommunityEvent[];
    nextCursor?: string;
  }>(endpoint);
  const items = response.data ?? [];
  const { nextCursor } = response;

  return { items, nextCursor, total: items.length };
};

export const useGetEvents = ({
  params = {},
  config,
}: {
  params?: GetEventsParams;
  config?: Omit<
    UseInfiniteQueryOptions<
      GetEventsResponse,
      ApiClientError,
      InfiniteData<GetEventsResponse>,
      [string, GetEventsParams],
      string | undefined
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >;
} = {}) => {
  const queryKey: [string, GetEventsParams] = [GET_EVENTS_KEY, params];

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    GetEventsResponse,
    ApiClientError,
    InfiniteData<GetEventsResponse>,
    [string, GetEventsParams],
    string | undefined
  >({
    queryKey,
    queryFn: getEventsApiCall,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60 * 1000,
    retry: false,
    ...config,
  });

  const events = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    events,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
