'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { useResourcesRealtime } from '@/hooks/use-resources-realtime';
import { ResourceApiService } from '@/services/resource-api.service';
import type { UserResourceStats } from '@/types/resource';

export function useResourceStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await ResourceApiService.getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useResourcesRealtime({
    onUserStatsUpdated: (userId) => {
      if (user?.id === userId) {
        fetchStats();
      }
    },
  });

  return { stats, loading };
}
