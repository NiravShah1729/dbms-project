'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { X, MessageSquare, ArrowUp, Flag, Send } from 'lucide-react';

interface Discussion {
  DISCUSSIONID: number;
  QUESTIONID: number;
  USERID: number;
  PARENTID: number | null;
  TEXT: string;
  CREATEDAT: string;
  FULLNAME: string;
  CF_HANDLE: string;
  UPVOTES: number;
  DOWNVOTES: number;
  USERVOTE: number;
  PARENTTEXT: string | null;
  PARENTAUTHOR: string | null;
  PARENTCFHANDLE: string | null;
  PARENTCREATEDAT: string | null;
}

interface DiscussionModalProps {
  questionId: number;
  questionTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const fetcher = (url: string) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.json());
};

export default function DiscussionModal({ questionId, questionTitle, isOpen, onClose }: DiscussionModalProps) {
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<number | null>(null);
  
  const { data: discussions, error, mutate } = useSWR<Discussion[]>(
    isOpen ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/discussions/${questionId}` : null,
    fetcher
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          QuestionID: questionId,
          Text: newComment,
          ParentID: replyToId
        })
      });
      setNewComment('');
      setReplyToId(null);
      mutate();
    } catch (err) {
      console.error('Failed to post discussion', err);
    }
  };

  const handleVote = async (discussionId: number, value: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/discussions/${discussionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });
      mutate();
    } catch (err) {
      console.error('Failed to vote', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-white">
      <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#1e1e1e] px-6 py-4">
          <h2 className="text-xl font-bold">Discussion - {questionTitle}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && <p className="text-red-500">Failed to load discussions.</p>}
          {!discussions && !error && <p className="text-gray-400">Loading...</p>}
          
          {discussions?.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <p>No comments yet. Be the first to start the discussion!</p>
            </div>
          )}

          {discussions?.map((disc) => (
            <div key={disc.DISCUSSIONID} className="flex gap-4 border-b border-[#2a2a2a] pb-6 last:border-0">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c24e00] font-bold text-white shadow-sm">
                {disc.FULLNAME?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-100">{disc.FULLNAME}</span>
                  <span className="text-xs text-gray-400">{formatDate(disc.CREATEDAT)}</span>
                </div>
                
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{disc.TEXT}</p>

                {/* Parent Quote */}
                {disc.PARENTID && (
                  <div className="mt-2 rounded-md border-l-2 border-[#404040] bg-[#222222] p-3 shadow-inner">
                    <p className="text-xs text-gray-400 mb-1">
                      Author - {disc.PARENTAUTHOR || disc.PARENTCFHANDLE || 'Unknown'}, Created on {disc.PARENTCREATEDAT ? formatDate(disc.PARENTCREATEDAT) : ''}
                    </p>
                    <p className="text-sm text-gray-300 italic line-clamp-2">{disc.PARENTTEXT}</p>
                    <button className="text-xs font-semibold text-blue-500 hover:text-blue-400 mt-1">Show More</button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-2 text-gray-400">
                  <button 
                    onClick={() => handleVote(disc.DISCUSSIONID, disc.USERVOTE === 1 ? 0 : 1)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white ${disc.USERVOTE === 1 ? 'text-blue-500' : ''}`}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span>{disc.UPVOTES || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => setReplyToId(replyToId === disc.DISCUSSIONID ? null : disc.DISCUSSIONID)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Reply</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white ml-auto">
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#2a2a2a] bg-[#1e1e1e] p-4">
          {replyToId && (
            <div className="mb-2 flex items-center justify-between text-xs text-gray-400 bg-[#2a2a2a] px-3 py-1.5 rounded-md">
              <span>Replying to {discussions?.find(d => d.DISCUSSIONID === replyToId)?.FULLNAME}</span>
              <button onClick={() => setReplyToId(null)} className="hover:text-white"><X className="h-3 w-3" /></button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              className="max-h-32 min-h-[44px] w-full resize-none rounded-lg border border-[#333] bg-[#222] p-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Add Comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={newComment.split('\\n').length > 1 ? Math.min(newComment.split('\\n').length, 4) : 1}
            />
            <button 
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="flex h-11 items-center justify-center rounded-lg bg-blue-600 px-4 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
