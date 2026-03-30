'use client';

import { create } from 'zustand';
import api from '@/lib/api';

interface LeaderboardUser {
  USERID: number;
  FULLNAME: string;
  CF_HANDLE: string;
  TOTALSOLVED: number;
  CURRENTRANK: number;
}

interface LeaderboardState {
  top: LeaderboardUser[];
  user: LeaderboardUser | null;
  loading: boolean;
  fetchLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  top: [],
  user: null,
  loading: false,
  fetchLeaderboard: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/stats/leaderboard');
      set({ top: response.data.top, user: response.data.user });
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
    } finally {
      set({ loading: false });
    }
  },
}));
