import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { CHAT_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { ApiChatRoom } from '@/types/chat';

import { GET_CHAT_ROOMS_KEY } from './use-get-rooms';

interface CreateDmParams {
  otherUserId: string;
}

interface CreateDmResponse {
  data: ApiChatRoom;
  message?: string;
}

export const CREATE_DM_KEY = 'CREATE_DM_KEY';

const createDmApiCall = async (
  params: CreateDmParams
): Promise<CreateDmResponse> => {
  const response = await apiClient.post<CreateDmResponse>(
    CHAT_ENDPOINTS.DM,
    params
  );
  return response;
};

export const useCreateDm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<CreateDmResponse, ApiClientError, CreateDmParams>({
    mutationKey: [CREATE_DM_KEY],
    mutationFn: createDmApiCall,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [GET_CHAT_ROOMS_KEY] });

      const room = response.data;
      if (room?.id) {
        router.push(`/dashboard/chat?roomId=${room.id}`);
      } else {
        // We might need to check if response itself is the room if the backend returns it directly
        // But based on CreateDmResponse interface, it should be in data
        toast.success('Chat created');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create chat');
    },
  });
};
