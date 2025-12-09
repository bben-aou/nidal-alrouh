import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { USERS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

export interface ApiUserSummary {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role: string;
  username?: string | null;
}

export const SEARCH_USERS_KEY = 'SEARCH_USERS_KEY';

const searchUsersApiCall = async (q: string): Promise<ApiUserSummary[]> => {
  const endpoint = `${USERS_ENDPOINTS.SEARCH}?q=${encodeURIComponent(q)}`;
  const response = await apiClient.get<{ data: ApiUserSummary[] }>(endpoint);
  const data = 'data' in response ? response.data : ([] as ApiUserSummary[]);
  return data;
};

export const useSearchUsers = (q: string, debounceMs: number = 300) => {
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const next = q.trim();
    const t = setTimeout(() => setDebounced(next), debounceMs);
    return () => clearTimeout(t);
  }, [q, debounceMs]);

  return useQuery<ApiUserSummary[], ApiClientError>({
    queryKey: [SEARCH_USERS_KEY, debounced],
    queryFn: () => searchUsersApiCall(debounced),
    enabled: debounced.length >= 2,
    staleTime: 60 * 1000,
  });
};
