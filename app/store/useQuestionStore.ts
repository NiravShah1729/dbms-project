'use client';

import { create } from 'zustand';
import api from '@/lib/api';

interface Question {
  QUESTIONID: number;
  TITLE: string;
  CF_LINK: string;
  RATING: number;
  TAGS: string;
  ISVERIFIED: number;
  REFSOLID: number | null;
  SOLVEDSTATUS: 'AC' | 'WA' | 'TLE' | 'MLE' | 'CE' | null;
  ISBOOKMARKED: number;
}

interface QuestionState {
  questions: Question[];
  loading: boolean;
  filters: { rating: string; tag: string; bookmarked: boolean };
  fetchQuestions: (params?: { rating: string; tag: string; bookmarked: boolean }) => Promise<void>;
  setFilters: (filters: { rating: string; tag: string; bookmarked: boolean }) => void;
  toggleBookmark: (questionId: number) => Promise<void>;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  loading: false,
  filters: { rating: '', tag: '', bookmarked: false },
  setFilters: (filters) => set({ filters }),
  fetchQuestions: async (params) => {
    set({ loading: true });
    try {
      const response = await api.get('/questions', { params });
      console.log(response.data);
      set({ questions: response.data as Question[] });
    } catch (err) {
      console.error('Fetch questions error:', err);
    } finally {
      set({ loading: false });
    }
  },
  toggleBookmark: async (questionId) => {
    try {
      const response = await api.post('/bookmarks/toggle', { QuestionID: questionId });
      const { isBookmarked } = response.data;
      
      // Update local state
      const { questions } = get();
      set({
        questions: questions.map(q => 
          q.QUESTIONID === questionId 
            ? { ...q, ISBOOKMARKED: isBookmarked ? 1 : 0 } 
            : q
        )
      });
    } catch (err) {
      console.error('Toggle bookmark error:', err);
    }
  },
}));
