'use client';

import { useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import { useQuestionStore } from '@/app/store/useQuestionStore';
import { Search, Loader2 } from 'lucide-react';

export default function SheetPage() {
  const { questions, loading, filters, setFilters, fetchQuestions } = useQuestionStore();

  useEffect(() => {
    fetchQuestions(filters);
  }, [filters, fetchQuestions]);

  const ratings = [800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3500];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">The Sheet</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter by tag..."
              className="w-48 rounded-md border bg-muted pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            />
          </div>

          <select 
            className="rounded-md border bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">All Ratings</option>
            {ratings.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          questions.map((q: any) => (
            <QuestionCard key={q.QUESTIONID} question={{
              QuestionID: q.QUESTIONID,
              Title: q.TITLE,
              CF_Link: q.CF_LINK,
              Rating: q.RATING,
              Tags: q.TAGS,
              IsVerified: q.ISVERIFIED === 1,
              HasSolution: q.REFSOLID !== null
            }} />
          ))
        )}
      </div>

      {!loading && questions.length === 0 && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          No questions found matching your criteria.
        </div>
      )}
    </div>
  );
}
