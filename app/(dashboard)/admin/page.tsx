'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { 
  Plus, 
  Loader2, 
  Link as LinkIcon, 
  Type, 
  Star, 
  Tag as TagIcon, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    CF_Link: '',
    Title: '',
    Rating: '',
    Tags: '',
    Hint: '',
    Solution: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/questions', {
        ...formData,
        Rating: Number(formData.Rating),
      });
      setMessage({ type: 'success', text: 'Question added successfully!' });
      setFormData({
        CF_Link: '',
        Title: '',
        Rating: '',
        Tags: '',
        Hint: '',
        Solution: '',
      });
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to add question.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Admin Control Panel</h1>
        <p className="text-muted-foreground font-medium">Add new challenges to the curriculum and manage the system database.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-[2.5rem] border bg-card/50 backdrop-blur-xl p-10 shadow-2xl transition-all hover:shadow-indigo-500/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black">Add New Question</h2>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border animate-in zoom-in duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-bold">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Codeforces Link</label>
              <div className="relative group">
                <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="url"
                  name="CF_Link"
                  required
                  className="w-full rounded-2xl border bg-background/50 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                  placeholder="https://codeforces.com/problemset/problem/..."
                  value={formData.CF_Link}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Title</label>
              <div className="relative group">
                <Type className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="Title"
                  required
                  className="w-full rounded-2xl border bg-background/50 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                  placeholder="Calculation of XORs"
                  value={formData.Title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Rating</label>
              <div className="relative group">
                <Star className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="number"
                  name="Rating"
                  required
                  className="w-full rounded-2xl border bg-background/50 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                  placeholder="800 - 3500"
                  min="800"
                  max="3500"
                  value={formData.Rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Tags (Comma separated)</label>
              <div className="relative group">
                <TagIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="Tags"
                  required
                  className="w-full rounded-2xl border bg-background/50 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                  placeholder="dp, math, greedy"
                  value={formData.Tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Hint / Note</label>
              <div className="relative group">
                <HelpCircle className="absolute left-4 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                <textarea
                  name="Hint"
                  rows={3}
                  className="w-full rounded-2xl border bg-background/50 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium resize-none"
                  placeholder="Think about XOR properties in ranges..."
                  value={formData.Hint}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Reference Solution (C++)</label>
              <div className="relative group">
                <textarea
                  name="Solution"
                  rows={8}
                  className="w-full rounded-3xl border bg-zinc-950 p-6 text-sm text-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-mono leading-relaxed"
                  placeholder="#include <iostream>\nusing namespace std;\n\nint main() {\n  // Code here\n}"
                  value={formData.Solution}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-5 text-sm font-black text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add Challenge to System
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
