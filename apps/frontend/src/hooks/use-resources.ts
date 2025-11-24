import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api, ApiClientError } from '@/lib/api';
import type { Resource } from '@/types/resource';

// Types
export type ResourceType = 'ARTICLE' | 'VIDEO' | 'LINK';

export interface CreateResourceData {
  title: string;
  description: string;
  type: ResourceType;
  content?: string;
  url?: string;
  tags?: string[];
}

export type UpdateResourceData = Partial<CreateResourceData>;

// Hooks
export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResourceData) => {
      return await api.post<Resource>('/resources', data);
    },
    onSuccess: () => {
      toast.success('Resource created successfully');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create resource');
      }
    },
  });
}

export function useGetResources(type?: ResourceType) {
  return useQuery({
    queryKey: ['resources', type],
    queryFn: async () => {
      const endpoint = type ? `/resources?type=${type}` : '/resources';
      return await api.get<Resource[]>(endpoint);
    },
  });
}

export function useGetResource(id: string) {
  return useQuery({
    queryKey: ['resources', id],
    queryFn: async () => {
      return await api.get<Resource>(`/resources/${id}`);
    },
    enabled: !!id,
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateResourceData;
    }) => {
      return await api.patch<Resource>(`/resources/${id}`, data);
    },
    onSuccess: (data) => {
      toast.success('Resource updated successfully');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resources', data.id] });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update resource');
      }
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.del(`/resources/${id}`);
    },
    onSuccess: () => {
      toast.success('Resource deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete resource');
      }
    },
  });
}
