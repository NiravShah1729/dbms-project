'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { X, Lightbulb, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Loader2, AlertCircle } from 'lucide-react';

interface SolutionModalProps {
  questionId: number;
  questionTitle: string;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'hints' | 'codes';
}

interface QuestionDetails {
  QUESTIONID: number;
  TITLE: string;
  HINT: string;
  solutions: {
    REFSOLID: number;
    DESCRIPTION: string;
    CODESNIPPET: string;
    LANGUAGE: string;
  }[];
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to load solution data');
  }
  return res.json();
};

export default function SolutionModal({ questionId, questionTitle, isOpen, onClose, defaultTab = 'hints' }: SolutionModalProps) {
  const [activeTab, setActiveTab] = useState<'hints' | 'codes'>(defaultTab);
  const [expandedHints, setExpandedHints] = useState<number[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setExpandedHints([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen, defaultTab]);

  const { data, error, isLoading } = useSWR<QuestionDetails>(
    isOpen ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/questions/${questionId}` : null,
    fetcher
  );

  if (!isOpen) return null;

  // Use the raw hint text directly instead of splitting
  const rawHint = data?.HINT || '';
  const codeSnippet = data?.solutions?.[0]?.CODESNIPPET || 'No reference solution provided.';

  const toggleHint = () => {
    setExpandedHints(prev => 
      prev.includes(0) ? [] : [0]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-white">
      <div className="flex flex-col w-full max-w-4xl max-h-[85vh] rounded-2xl bg-[#141414] shadow-2xl overflow-hidden border border-[#2a2a2a]">
        
        {/* Header */}
        <div className="flex flex-col border-b border-[#2a2a2a] bg-[#1a1a1a] px-8 pt-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Solution - {questionTitle}</h2>
            <button onClick={onClose} className="rounded-full p-1.5 text-blue-500 hover:bg-[#2a2a2a] transition-colors">
              <X className="h-7 w-7" strokeWidth={2.5} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] w-fit p-1 rounded-xl mb-4">
            <button 
              onClick={() => setActiveTab('hints')}
              className={`px-5 py-2.5 rounded-lg text-lg font-semibold transition-all ${
                activeTab === 'hints' 
                  ? 'bg-[#222] text-blue-500 shadow-sm' 
                  : 'text-gray-300 hover:text-white hover:bg-[#222]'
              }`}
            >
              Hint
            </button>
            <button 
              onClick={() => setActiveTab('codes')}
              className={`px-5 py-2.5 rounded-lg text-lg font-semibold transition-all ${
                activeTab === 'codes' 
                  ? 'bg-[#222] text-blue-500 shadow-sm' 
                  : 'text-gray-300 hover:text-white hover:bg-[#222]'
              }`}
            >
              Codes
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
               <p className="font-medium">Loading solutions...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center gap-3 border border-red-500/20">
                 <AlertCircle className="h-5 w-5" />
                 <span className="font-semibold">Failed to load solution data.</span>
              </div>
            </div>
          )}

          {!isLoading && !error && activeTab === 'hints' && (
            <div className="space-y-4">
              {!rawHint.trim() ? (
                <div className="text-center text-gray-500 font-medium py-10">No hints available for this problem.</div>
              ) : (
                <div className={`border border-[#2a2a2a] rounded-xl overflow-hidden transition-all duration-200 ${expandedHints.includes(0) ? 'bg-[#1e1e1e]' : 'bg-[#181818] hover:bg-[#222]'}`}>
                  <button 
                    onClick={toggleHint}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <Lightbulb className={`h-5 w-5 ${expandedHints.includes(0) ? 'text-yellow-500' : 'text-gray-500'}`} />
                      <span className={`text-lg font-bold ${expandedHints.includes(0) ? 'text-white' : 'text-gray-200'}`}>Hint</span>
                    </div>
                    {expandedHints.includes(0) ? (
                      <ChevronUp className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedHints.includes(0) && (
                    <div className="px-5 pb-5 pt-2 text-gray-300 whitespace-pre-wrap leading-relaxed border-t border-[#2a2a2a] mt-2">
                      {rawHint}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && activeTab === 'codes' && (
            <div className="h-full">
              {data?.solutions?.length === 0 ? (
                <div className="text-center text-gray-500 font-medium py-10">No reference code available.</div>
              ) : (
                <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6 h-full overflow-y-auto">
                  <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    <code>{codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-8 py-5 bg-[#141414]">
          <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-[#222]">
            <ThumbsUp className="h-7 w-7" strokeWidth={2.5} />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-[#222]">
            <ThumbsDown className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>
        
      </div>
    </div>
  );
}
