import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import type { CreateReportData } from '@/types/community';

export const REPORT_POST_KEY = 'REPORT_POST_KEY';

interface ReportPostParams {
  postId: string | number;
  data: CreateReportData;
}

interface ReportPostResponse {
  data?: unknown;
  message?: string;
}

const reportPost = async ({
  postId,
  data,
}: ReportPostParams): Promise<ReportPostResponse> => {
  const endpoint = COMMUNITY_ENDPOINTS.POST_REPORTS(postId.toString());
  const response = await apiClient.post<ReportPostResponse>(endpoint, {
    reason: data.reason,
  });
  return response;
};

type TUseReportPostParams = {
  config?: UseMutationOptions<
    ReportPostResponse,
    ApiClientError,
    ReportPostParams
  >;
};

export const useReportPost = ({ config }: TUseReportPostParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation<ReportPostResponse, ApiClientError, ReportPostParams>({
      mutationKey: [REPORT_POST_KEY],
      mutationFn: reportPost,
      onSuccess: (resp) => {
        toast.success(resp?.message || 'Post reported successfully');
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (err: ApiClientError) => {
        toast.error(err.message || 'Error reporting post');
        console.error('Error reporting post:', err);
      },
      ...config,
    });

  const reportPostWithParams = (params: ReportPostParams) => {
    mutate(params);
  };

  return {
    mutate,
    reportPost: mutate,
    reportPostWithParams,
    resetReportPost: reset,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export type { ReportPostResponse, ReportPostParams };
