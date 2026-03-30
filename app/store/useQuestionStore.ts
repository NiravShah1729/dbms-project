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
}

interface QuestionState {
  questions: Question[];
  loading: boolean;
  filters: { rating: string; tag: string };
  fetchQuestions: (params?: { rating: string; tag: string }) => Promise<void>;
  setFilters: (filters: { rating: string; tag: string }) => void;
}

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: [],
  loading: false,
  filters: { rating: '', tag: '' },
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
}));
