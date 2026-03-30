'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle,
  Trash2,
  Database,
  Search,
  Pencil,
  X,
  Code
} from 'lucide-react';
import useSWR, { useSWRConfig } from 'swr';

const fetcher = (url: string) => api.get(url).then(res => res.data);

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
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { data: questions, mutate } = useSWR('/questions', fetcher);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Filtered questions
  const filteredQuestions = Array.isArray(questions) ? questions.filter((q: any) => 
    (q.TITLE || q.Title || '').toLowerCase().includes(search.toLowerCase()) || 
    (q.RATING || q.Rating || '').toString().includes(search) ||
    (q.QUESTIONID || q.QuestionID || '').toString().includes(search)
  ) : [];

  const resetForm = () => {
    setFormData({
      CF_Link: '',
      Title: '',
      Rating: '',
      Tags: '',
      Hint: '',
      Solution: '',
    });
    setEditingId(null);
    setMessage({ type: '', text: '' });
  };

  const handleEdit = async (q: any) => {
    setMessage({ type: '', text: '' });
    const qId = q.QUESTIONID || q.QuestionID;
    setEditingId(qId);
    
    // Fetch full question data including solution
    try {
      const fullData = await api.get(`/questions/${qId}`);
      const sol = fullData.data.solutions?.[0]?.CODESNIPPET || '';
      setFormData({
        CF_Link: q.CF_LINK || q.CF_Link,
        Title: q.TITLE || q.Title,
        Rating: (q.RATING || q.Rating).toString(),
        Tags: q.TAGS || q.Tags,
        Hint: fullData.data.HINT || fullData.data.Hint || '',
        Solution: sol,
      });
      // Scroll to form on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to fetch full question data', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, {
          ...formData,
          Rating: Number(formData.Rating),
        });
        setMessage({ type: 'success', text: 'Question updated successfully!' });
      } else {
        await api.post('/questions', {
          ...formData,
          Rating: Number(formData.Rating),
        });
        setMessage({ type: 'success', text: 'Question created successfully!' });
      }
      mutate();
      if (!editingId) resetForm();
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Operation failed.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    setDeletingId(id);
    setMessage({ type: '', text: '' });
    try {
      await api.delete(`/questions/${id}`);
      setMessage({ type: 'success', text: 'Question removed from database.' });
      mutate();
    } catch (err: any) {
      const errorMessage = err.response?.data?.details || 'Database integrity check failed.';
      setMessage({ 
        type: 'error', 
        text: errorMessage.includes('ORA-20001') 
          ? errorMessage.split(': ').slice(1).join(': ') 
          : 'Cannot delete: Trigger blocked the action due to existing submissions.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-widest mb-1">
             <Database className="w-3 h-3" /> System Administration
          </div>
          <h1 className="text-3xl font-black tracking-tight">Curriculum Manager</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Total Challenges</div>
            <div className="text-2xl font-black text-indigo-600">{questions?.length || 0}</div>
          </div>
          <button 
            onClick={resetForm}
            className="flex items-center gap-2 bg-indigo-600 px-5 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Question
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: List (8 cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by title, rating, or ID..."
              className="w-full bg-card/50 border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rounded-[2.5rem] border bg-card/20 backdrop-blur-sm overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">ID / Rating</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Title</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredQuestions?.map((q: any) => {
                    const qId = q.QUESTIONID || q.QuestionID;
                    const title = q.TITLE || q.Title;
                    const rating = q.RATING || q.Rating;
                    const link = q.CF_LINK || q.CF_Link;

                    return (
                      <tr key={qId} className="group hover:bg-indigo-600/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground">ID: {qId}</span>
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-[10px] font-black ${
                              rating >= 2100 ? 'bg-rose-500/10 text-rose-500' :
                              rating >= 1600 ? 'bg-amber-500/10 text-amber-500' :
                              'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {rating}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm truncate max-w-[200px] md:max-w-xs">{title}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-xs opacity-60">{link}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 pr-2">
                            <button 
                              onClick={() => handleEdit(q)}
                              className="p-2.5 rounded-xl bg-card border hover:border-indigo-600/50 hover:text-indigo-600 transition-all active:scale-90"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(qId)}
                              disabled={deletingId === qId}
                              className="p-2.5 rounded-xl bg-card border hover:border-rose-600/50 hover:text-rose-600 transition-all active:scale-90 disabled:opacity-30"
                              title="Delete"
                            >
                              {deletingId === qId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!filteredQuestions?.length && (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center text-muted-foreground italic text-sm">
                        No challenges found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Side Sheet Form (5 cols) */}
        <div className="xl:col-span-5 space-y-6 sticky top-8">
          <div className="rounded-[2.5rem] border bg-card/80 backdrop-blur-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  {editingId ? <Pencil className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-black">{editingId ? 'Edit Challenge' : 'Create Question'}</h2>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    {editingId ? `Modification ID: ${editingId}` : 'New Database Record'}
                  </p>
                </div>
              </div>
              {editingId && (
                <button onClick={resetForm} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                   <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border animate-in zoom-in duration-300 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500 font-bold'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                <span className="text-xs leading-relaxed">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Codeforces URL
                </label>
                <input
                  type="url"
                  name="CF_Link"
                  required
                  className="w-full rounded-2xl border bg-background/50 px-4 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                  placeholder="https://codeforces.com/..."
                  value={formData.CF_Link}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Type className="w-3 h-3" /> Title
                  </label>
                  <input
                    type="text"
                    name="Title"
                    required
                    className="w-full rounded-2xl border bg-background/50 px-4 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                    placeholder="Problem A"
                    value={formData.Title}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Star className="w-3 h-3" /> Rating
                  </label>
                  <input
                    type="number"
                    name="Rating"
                    required
                    className="w-full rounded-2xl border bg-background/50 px-4 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                    placeholder="800"
                    value={formData.Rating}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <TagIcon className="w-3 h-3" /> Tags
                  </label>
                  <input
                    type="text"
                    name="Tags"
                    required
                    className="w-full rounded-2xl border bg-background/50 px-4 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                    placeholder="dp, math"
                    value={formData.Tags}
                    onChange={handleChange}
                  />
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <HelpCircle className="w-3 h-3" /> Hint / Summary
                  </label>
                  <textarea
                    name="Hint"
                    rows={3}
                    className="w-full rounded-2xl border bg-background/50 px-4 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium resize-none"
                    placeholder="Brief explanation..."
                    value={formData.Hint}
                    onChange={handleChange}
                  />
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Code className="w-3 h-3" /> Reference C++
                  </label>
                  <textarea
                    name="Solution"
                    rows={6}
                    className="w-full rounded-3xl border bg-zinc-950 p-4 text-xs text-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-mono"
                    placeholder="#include <iostream>..."
                    value={formData.Solution}
                    onChange={handleChange}
                  />
              </div>

              <div className="flex gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-2xl bg-muted px-4 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/80 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? 'Save Changes' : 'Publish Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
