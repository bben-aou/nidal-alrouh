import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { JOURNAL_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

import { GET_REFLECTIONS_KEY } from './use-get-reflections';

export const DELETE_REFLECTION_KEY = 'DELETE_REFLECTION_KEY';

export interface DeleteReflectionRequestParams {
  id: string;
}

interface DeleteReflectionResponse {
  success: boolean;
  message: string;
}

type TUseDeleteReflectionParams = {
  config?: UseMutationOptions<
    DeleteReflectionResponse,
    ApiClientError,
    DeleteReflectionRequestParams
  >;
};

const deleteReflectionApiCall = async (
  params: DeleteReflectionRequestParams
): Promise<DeleteReflectionResponse> => {
  await apiClient.del(JOURNAL_ENDPOINTS.REFLECTION_BY_ID(params.id));
  return {
    success: true,
    message: 'Reflection deleted successfully',
  };
};

export const useDeleteReflection = ({
  config,
}: TUseDeleteReflectionParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation({
      mutationKey: [DELETE_REFLECTION_KEY],
      mutationFn: deleteReflectionApiCall,
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message || 'Reflection deleted successfully');
        } else {
          toast.error(data.message || 'Failed to delete reflection');
        }
        queryClient.invalidateQueries({ queryKey: [GET_REFLECTIONS_KEY] });
      },
      onError: (error) => {
        toast.error(error.message || 'Error deleting reflection');
        console.error('Error deleting reflection:', error);
      },
      ...config,
    });

  const invalidateReflections = () => {
    queryClient.invalidateQueries({ queryKey: [GET_REFLECTIONS_KEY] });
  };

  const deleteReflection = (params: DeleteReflectionRequestParams) => {
    mutate(params);
  };

  return {
    deleteReflection: mutate,
    deleteReflectionWithParams: deleteReflection,
    resetDeleteReflection: reset,
    invalidateReflections,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export type { DeleteReflectionResponse };
