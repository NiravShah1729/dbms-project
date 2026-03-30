'use client';

import { useState } from 'react';
import { CheckCircle2, Bookmark, Lightbulb, Code2, StickyNote, MessageCircle } from 'lucide-react';
import DiscussionModal from './shared/DiscussionModal';
import NotesModal from './shared/NotesModal';

export interface QuestionProps {
  question: {
    QuestionID: number;
    Title: string;
    CF_Link: string;
    Rating: number;
    Tags: string;
    IsVerified?: boolean;
    HasSolution?: boolean;
  };
}

export default function QuestionCard({ question }: QuestionProps) {
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const tags = question.Tags?.split(',') || [];

  return (
    <>
      <div className="group relative rounded-xl border bg-card p-4 transition-all hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-card-foreground line-clamp-1">{question.Title || 'Untitled Question'}</h3>
              {question.IsVerified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="font-bold text-primary">{question.Rating}</span>
              {tags.map((tag) => (
                <span key={tag} className="text-muted-foreground">#{tag.trim()}</span>
              ))}
            </div>
          </div>
          
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t pt-4">
          <div className="flex gap-2">
              <button 
                onClick={() => setIsDiscussionOpen(true)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                  <MessageCircle className="h-3 w-3" />
                  Discussion
              </button>
              <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  <Lightbulb className="h-3 w-3" />
                  Hint
              </button>
              <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  <Code2 className="h-3 w-3" />
                  Solution
              </button>
              <button 
                onClick={() => setIsNotesOpen(true)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                  <StickyNote className="h-3 w-3" />
                  Note
              </button>
          </div>

          <a 
            href={question.CF_Link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-md bg-secondary px-3 py-1.5 text-xs font-bold transition-colors hover:bg-secondary/80"
          >
            Solve on CF
          </a>
        </div>
      </div>
      
      <DiscussionModal 
        questionId={question.QuestionID} 
        questionTitle={question.Title || 'Untitled'} 
        isOpen={isDiscussionOpen}
        onClose={() => setIsDiscussionOpen(false)}
      />
      <NotesModal 
        questionId={question.QuestionID} 
        questionTitle={question.Title || 'Untitled'} 
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </>
  );
}
