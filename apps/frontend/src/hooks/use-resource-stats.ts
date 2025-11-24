'use client';

import { useEffect, useState } from 'react';

import { ResourceApiService } from '@/services/resource-api.service';
import type { UserResourceStats } from '@/types/resource';

export function useResourceStats() {
  const [stats, setStats] = useState<UserResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchStats();
  }, []);

  return { stats, loading };
}
