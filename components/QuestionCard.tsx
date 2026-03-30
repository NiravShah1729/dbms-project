'use client';

import { useState } from 'react';
import { CheckCircle2, Bookmark, Lightbulb, Code2, StickyNote, Send, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export interface QuestionProps {
  question: {
    QuestionID: number;
    Title: string;
    CF_Link: string;
    Rating: number;
    Tags: string;
    IsVerified?: boolean;
    HasSolution?: boolean;
    SolvedStatus?: 'AC' | 'WA' | 'TLE' | 'MLE' | 'CE' | null;
  };
}

export default function QuestionCard({ question }: QuestionProps) {
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<'AC' | 'WA' | 'TLE' | 'MLE' | 'CE' | null>(question.SolvedStatus || null);
  const [error, setError] = useState<string | null>(null);

  const tags = question.Tags?.split(',') || [];

  const handleCheckSubmission = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/submissions/verify', {
        QuestionID: question.QuestionID,
        CF_Link: question.CF_Link
      });
      if (response.data.success) {
        setVerdict(response.data.verdict);
      }
    } catch (err: any) {
      console.error('Check submission error:', err);
      setError(err.response?.data?.error || 'Failed to verify submission');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (verdict === 'AC') return 'bg-green-500/10 border-green-500/50';
    if (verdict) return 'bg-red-500/10 border-red-500/50';
    return 'bg-card border-border';
  };

  return (
    <div className={`group relative flex flex-col gap-4 rounded-xl border p-5 transition-all hover:shadow-md sm:flex-row sm:items-center ${getStatusColor()}`}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-card-foreground line-clamp-1">
            {question.Title || 'Untitled Question'}
          </h3>
          {question.IsVerified && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
          {verdict === 'AC' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {question.Rating}
          </span>
          {tags.map((tag) => (
            <span key={tag} className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
              #{tag.trim()}
            </span>
          ))}
        </div>

        <div className="flex gap-4 pt-1">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                <Lightbulb className="h-4 w-4" />
                Hint
            </button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                <Code2 className="h-4 w-4" />
                Solution
            </button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                <StickyNote className="h-4 w-4" />
                Note
            </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <div className="flex items-center gap-2">
           {error && (
             <div className="flex items-center gap-1 text-[10px] text-destructive font-medium" title={error}>
               <AlertCircle className="h-3 w-3" />
               Error
             </div>
           )}
           <button 
             onClick={handleCheckSubmission}
             disabled={loading}
             className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-green-700 disabled:opacity-50"
           >
             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
             {verdict ? 'Re-check' : 'Check Submission'}
           </button>
           
           <a 
             href={question.CF_Link} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-bold transition-all hover:bg-secondary/80"
           >
             Solve on CF
           </a>
           
           <button className="rounded-lg border bg-background p-2 text-muted-foreground hover:text-primary transition-colors">
             <Bookmark className="h-5 w-5" />
           </button>
        </div>
        
        {verdict && (
          <div className={`text-xs font-bold uppercase ${verdict === 'AC' ? 'text-green-500' : 'text-red-500'}`}>
            Verdict: {verdict}
          </div>
        )}
      </div>
    </div>
  );
}
