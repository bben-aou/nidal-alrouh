import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { JOURNAL_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

import { GET_REFLECTIONS_KEY } from './use-get-reflections';

export const CREATE_REFLECTION_KEY = 'CREATE_REFLECTION_KEY';

export interface CreateReflectionRequestBody {
  title: string;
  content: string;
  mood: string;
  tags: string[];
  privacy: 'PRIVATE' | 'PUBLIC';
}

interface CreateReflectionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    content: string;
    mood: string;
    privacy: 'PRIVATE' | 'PUBLIC';
    tags: string[];
    createdAt: string;
  };
}

type TUseCreateReflectionParams = {
  config?: UseMutationOptions<
    CreateReflectionResponse,
    ApiClientError,
    CreateReflectionRequestBody
  >;
};

const createReflectionApiCall = async (
  body: CreateReflectionRequestBody
): Promise<CreateReflectionResponse> => {
  const response = await apiClient.post<CreateReflectionResponse>(
    JOURNAL_ENDPOINTS.REFLECTIONS,
    body
  );
  return response;
};

export const useCreateReflection = ({
  config,
}: TUseCreateReflectionParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation({
      mutationKey: [CREATE_REFLECTION_KEY],
      mutationFn: createReflectionApiCall,
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message || 'Reflection created successfully');
        } else {
          toast.error(data.message || 'Failed to create reflection');
        }
        queryClient.invalidateQueries({ queryKey: [GET_REFLECTIONS_KEY] });
      },
      onError: (error) => {
        toast.error(error.message || 'Error creating reflection');
        console.error('Error creating reflection:', error);
      },
      ...config,
    });

  const invalidateReflections = () => {
    queryClient.invalidateQueries({ queryKey: [GET_REFLECTIONS_KEY] });
  };

  const createReflection = (params: CreateReflectionRequestBody) => {
    mutate(params);
  };

  return {
    createReflection: mutate,
    createReflectionWithParams: createReflection,
    resetCreateReflection: reset,
    invalidateReflections,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export type { CreateReflectionResponse };
