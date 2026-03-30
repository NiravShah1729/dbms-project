'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { 
  X, Bold, Italic, Underline, Strikethrough, Type, 
  List, ListOrdered, Quote, Link2, Code, RemoveFormatting, ChevronDown
} from 'lucide-react';

interface NoteData {
  CONTENT: string;
  UPDATEDAT: string | null;
}

interface NotesModalProps {
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

const ToolbarButton = ({ icon: Icon, action }: { icon: any, action?: () => void }) => (
  <button 
    onClick={action}
    className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
    type="button"
  >
    <Icon className="h-4 w-4" strokeWidth={2.5} />
  </button>
);

export default function NotesModal({ questionId, questionTitle, isOpen, onClose }: NotesModalProps) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 2000;

  const { data, error, mutate, isLoading } = useSWR<NoteData>(
    isOpen ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/notes/${questionId}` : null,
    fetcher,
    {
      onSuccess: (data) => {
        if (data && data.CONTENT) {
          setContent(data.CONTENT);
        } else {
          setContent('');
        }
      }
    }
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

  const handleSave = async () => {
    if (content.length > MAX_CHARS) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          QuestionID: questionId,
          Content: content
        })
      });
      if (response.ok) {
        mutate();
        onClose();
      } else {
        console.error('Failed to save note');
      }
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-white">
      <div className="flex flex-col w-full max-w-4xl rounded-2xl bg-[#1e1e1e] shadow-2xl overflow-hidden border border-[#333]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-2xl font-bold tracking-tight">Notes - {questionTitle}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-[#333] hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2 flex-1 flex flex-col min-h-[500px]">
          <div className="flex-1 flex flex-col bg-[#252525] rounded-xl border border-[#333] overflow-hidden">
            
            {/* Fake Rich Text Toolbar */}
            <div className="flex items-center justify-center border-b border-[#333] bg-white mx-auto mt-4 px-2 py-1.5 rounded-lg shadow-sm w-fit gap-1">
              <button className="flex items-center gap-2 px-3 hover:bg-gray-100 rounded py-1 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-700">Normal</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              <ToolbarButton icon={Bold} action={() => insertMarkdown('**', '**')} />
              <ToolbarButton icon={Italic} action={() => insertMarkdown('*', '*')} />
              <ToolbarButton icon={Underline} />
              <ToolbarButton icon={Strikethrough} action={() => insertMarkdown('~~', '~~')} />
              <ToolbarButton icon={Type} />
              
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              
              <ToolbarButton icon={List} action={() => insertMarkdown('- ')} />
              <ToolbarButton icon={ListOrdered} action={() => insertMarkdown('1. ')} />
              
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              
              <ToolbarButton icon={Quote} action={() => insertMarkdown('> ')} />
              <ToolbarButton icon={Link2} action={() => insertMarkdown('[', '](url)')} />
              <ToolbarButton icon={Code} action={() => insertMarkdown('`', '`')} />
              <ToolbarButton icon={RemoveFormatting} />
            </div>

            {/* Text Area */}
            <div className="p-6 flex-1 flex flex-col relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500">Loading note...</span>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-500">Failed to load note.</span>
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  className="w-full flex-1 resize-none bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-0 text-base leading-relaxed"
                  placeholder="Enter a Note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={MAX_CHARS}
                />
              )}
            </div>
            
            {/* Character Count */}
            <div className="px-6 pb-4 text-right">
              <span className={`text-sm ${content.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
                {content.length}/{MAX_CHARS}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#333] bg-[#1a1a1a]">
          <button 
            onClick={onClose}
            className="rounded-lg border border-[#444] px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#333] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="rounded-lg bg-[#2563eb] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
