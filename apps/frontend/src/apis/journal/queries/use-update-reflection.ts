import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { JOURNAL_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

import { GET_REFLECTIONS_KEY } from './use-get-reflections';

export const UPDATE_REFLECTION_KEY = 'UPDATE_REFLECTION_KEY';

export interface UpdateReflectionRequestBody {
  title?: string;
  content?: string;
  mood?: string;
  tags?: string[];
  privacy?: 'PRIVATE' | 'PUBLIC';
}

export interface UpdateReflectionRequestParams {
  id: string;
  body: UpdateReflectionRequestBody;
}

export interface UpdateReflectionResponse {
  id: string;
  title: string;
  content: string;
  mood: string;
  privacy: 'PRIVATE' | 'PUBLIC' | 'FRIENDS_ONLY';
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const updateReflectionApiCall = async (
  params: UpdateReflectionRequestParams
): Promise<UpdateReflectionResponse> => {
  const endpoint = JOURNAL_ENDPOINTS.REFLECTION_BY_ID(params.id);
  const response = await apiClient.put<UpdateReflectionResponse>(
    endpoint,
    params.body
  );
  return response;
};

export const useUpdateReflection = ({
  config,
}: {
  config?: UseMutationOptions<
    UpdateReflectionResponse,
    ApiClientError,
    UpdateReflectionRequestParams
  >;
} = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation({
      mutationKey: [UPDATE_REFLECTION_KEY],
      mutationFn: updateReflectionApiCall,
      onSuccess: () => {
        toast.success('Reflection updated successfully');
        queryClient.invalidateQueries({ queryKey: [GET_REFLECTIONS_KEY] });
      },
      onError: (error) => {
        toast.error(error.message || 'Error updating reflection');
        console.error('Error updating reflection:', error);
      },
      ...config,
    });

  const invalidateReflections = () => {
    queryClient.invalidateQueries({ queryKey: [GET_REFLECTIONS_KEY] });
  };

  const updateReflection = (params: UpdateReflectionRequestParams) => {
    mutate(params);
  };

  return {
    updateReflection: mutate,
    updateReflectionWithParams: updateReflection,
    resetUpdateReflection: reset,
    invalidateReflections,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
