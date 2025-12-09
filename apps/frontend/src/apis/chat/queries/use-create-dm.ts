import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { CHAT_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { ApiChatRoom } from '@/types/chat';

import { GET_CHAT_ROOMS_KEY } from './use-get-rooms';

interface CreateDmParams {
  otherUsername?: string;
  otherUserId?: string;
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
  const params = useParams();
  const locale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale || 'en';

  return useMutation<CreateDmResponse, ApiClientError, CreateDmParams>({
    mutationKey: [CREATE_DM_KEY],
    mutationFn: createDmApiCall,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [GET_CHAT_ROOMS_KEY] });

      const room = response.data;
      if (room?.id) {
        // Redirect to chat page with locale and roomId
        router.push(`/${locale}/dashboard/chat?roomId=${room.id}`);
        toast.success(response.message || 'Chat created successfully');
      } else {
        toast.error('Chat created but unable to navigate');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create chat');
    },
  });
};
