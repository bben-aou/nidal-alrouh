import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { EVENTS_ENDPOINTS } from '@/apis/events/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

export const CREATE_EVENT_KEY = 'CREATE_EVENT_KEY';

export interface CreateEventRequestBody {
  title: string;
  description: string;
  type:
    | 'workshop'
    | 'supportSession'
    | 'consultation'
    | 'communityMeeting'
    | 'webinar';
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  maxAttendees?: number;
  requiresApproval?: boolean;
  coverImage?: string;
  tags?: string[];
}

export interface CreateEventResponse {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  maxAttendees?: number;
  requiresApproval: boolean;
  coverImage?: string;
  tags: string[];
  currentAttendees: number;
  createdAt: string;
  updatedAt: string;
  organizer: {
    id: string;
    name?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
}

const createEventApiCall = async (
  body: CreateEventRequestBody
): Promise<CreateEventResponse> => {
  const response = await apiClient.post<{ data: CreateEventResponse }>(
    EVENTS_ENDPOINTS.EVENTS,
    body
  );
  return response.data;
};

type TUseCreateEventParams = {
  config?: UseMutationOptions<
    CreateEventResponse,
    ApiClientError,
    CreateEventRequestBody
  >;
};

export const useCreateEvent = ({ config }: TUseCreateEventParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation<CreateEventResponse, ApiClientError, CreateEventRequestBody>({
      mutationKey: [CREATE_EVENT_KEY],
      mutationFn: createEventApiCall,
      onSuccess: () => {
        toast.success('Event created successfully');
        queryClient.invalidateQueries({ queryKey: ['events'] });
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create event');
      },
      ...config,
    });

  const createEventWithParams = (params: CreateEventRequestBody) => {
    mutate(params);
  };

  return {
    mutate,
    createEvent: mutate,
    createEventWithParams,
    resetCreateEvent: reset,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
