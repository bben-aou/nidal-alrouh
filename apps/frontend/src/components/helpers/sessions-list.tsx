'use client';

import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SessionCard } from '@/components/helpers/session-card';
import { SessionFeedbackDialog } from '@/components/helpers/session-feedback-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api';
import { Session } from '@/types/helpers';

export function SessionsList() {
  const t = useTranslations('helpers.sessions');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(
    null
  );

  // Fetch sessions with React Query
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      return await apiClient.get<Session[]>('/sessions');
    },
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.patch(`/sessions/${id}/complete`);
    },
    onSuccess: () => {
      // Invalidate and refetch sessions
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (error) => {
      console.error('Failed to complete session:', error);
    },
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async ({
      sessionId,
      rating,
      comment,
    }: {
      sessionId: string;
      rating: number;
      comment: string;
    }) => {
      return await apiClient.post(`/sessions/${sessionId}/feedback`, {
        rating,
        comment,
      });
    },
    onError: (error) => {
      console.error('Failed to submit feedback:', error);
      throw error;
    },
  });

  const handleCompleteSession = (id: string) => {
    completeSessionMutation.mutate(id);
  };

  const handleFeedback = (id: string) => {
    setFeedbackSessionId(id);
  };

  const handleSubmitFeedback = async (
    sessionId: string,
    rating: number,
    comment: string
  ) => {
    await submitFeedbackMutation.mutateAsync({
      sessionId,
      rating,
      comment,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingSessions = sessions.filter((s) => {
    const endTime = new Date(
      new Date(s.scheduledAt).getTime() + s.duration * 60000
    );
    return endTime > new Date() && s.status !== 'CANCELLED';
  });
  const pastSessions = sessions.filter((s) => {
    const endTime = new Date(
      new Date(s.scheduledAt).getTime() + s.duration * 60000
    );
    return endTime <= new Date() || s.status === 'CANCELLED';
  });

  const role = user?.role === 'HELPER' ? 'HELPER' : 'USER';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            {t('tabs.upcoming')} ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="past">{t('tabs.past')}</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                role={role}
                onComplete={handleCompleteSession}
              />
            ))
          ) : (
            <p className="text-muted-foreground py-8 text-center">
              {t('empty.upcoming')}
            </p>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-4">
          {pastSessions.length > 0 ? (
            pastSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                role={role}
                onFeedback={handleFeedback}
              />
            ))
          ) : (
            <p className="text-muted-foreground py-8 text-center">
              {t('empty.past')}
            </p>
          )}
        </TabsContent>
      </Tabs>

      <SessionFeedbackDialog
        sessionId={feedbackSessionId}
        isOpen={!!feedbackSessionId}
        onClose={() => setFeedbackSessionId(null)}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
}
