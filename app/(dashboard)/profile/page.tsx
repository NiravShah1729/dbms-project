'use client';

import { useAuthStore } from '@/app/store/useAuthStore';
import { 
  User as UserIcon, 
  Mail, 
  Code, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Edit2,
  ChevronRight,
  Trophy,
  Activity,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface UserStats {
  TOTALSOLVED: number;
  CURRENTRANK: number | string;
  TOTALSUBMISSIONS: number;
}

interface Submission {
  SUBMISSIONID: number;
  QUESTIONID: number;
  TITLE: string;
  VERDICTNAME: string;
  SUBMITTEDCODE: string;
  SUBMITTEDAT: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, subsRes] = await Promise.all([
          api.get('/stats/me'),
          api.get('/submissions')
        ]);
        setStats(statsRes.data);
        setSubmissions(subsRes.data);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName}`} 
            className="relative w-48 h-48 rounded-[2.5rem] bg-card border-8 border-background shadow-2xl skew-y-1 transition-transform group-hover:skew-y-0 cursor-pointer object-cover" 
            alt="User Avatar"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl border-4 border-background shadow-xl">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2 font-black text-xs uppercase tracking-[0.2em] text-indigo-600">
            <Shield className="w-3.5 h-3.5" />
            Verified Programmer
          </div>
          <h1 className="text-6xl font-black tracking-tight mb-4">{user?.FullName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            {user?.Roles.map(role => (
              <span key={role} className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-600/20">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-[2.5rem] border bg-card p-8 shadow-xl flex items-center gap-6 group hover:border-indigo-500/50 transition-colors">
            <div className="p-5 rounded-3xl bg-indigo-600/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Trophy className="w-8 h-8" />
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Solved</div>
                <div className="text-3xl font-black">{stats?.TOTALSOLVED || 0}</div>
            </div>
        </div>
        <div className="rounded-[2.5rem] border bg-card p-8 shadow-xl flex items-center gap-6 group hover:border-rose-500/50 transition-colors">
            <div className="p-5 rounded-3xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                <Activity className="w-8 h-8" />
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Submissions</div>
                <div className="text-3xl font-black">{stats?.TOTALSUBMISSIONS || 0}</div>
            </div>
        </div>
        <div className="rounded-[2.5rem] border bg-card p-8 shadow-xl flex items-center gap-6 group hover:border-emerald-500/50 transition-colors">
            <div className="p-5 rounded-3xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Shield className="w-8 h-8" />
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Global Rank</div>
                <div className="text-3xl font-black">#{stats?.CURRENTRANK || '---'}</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Details */}
        <div className="lg:col-span-1 rounded-[3rem] border bg-card/50 backdrop-blur-xl p-10 shadow-2xl space-y-10 group overflow-hidden relative">
          <Settings className="absolute -right-16 -bottom-16 w-64 h-64 text-muted/10 group-hover:rotate-45 transition-transform duration-1000" />
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">Account</h2>
              <button className="p-3 rounded-2xl bg-muted hover:bg-indigo-600 hover:text-white transition-all">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-muted text-muted-foreground group-hover:bg-indigo-600/10 group-hover:text-indigo-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</div>
                  <div className="text-sm font-bold truncate max-w-[150px]">{user?.Email}</div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-muted text-muted-foreground group-hover:bg-indigo-600/10 group-hover:text-indigo-600 transition-colors">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">CF Handle</div>
                  <div className="text-sm font-bold">{user?.CF_Handle || 'Not linked'}</div>
                </div>
              </div>

              {!user?.CF_Handle && (
                <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-start gap-3 mt-4">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="text-[10px] font-black uppercase tracking-tight">
                    Link your Codeforces handle to track progress automatically.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="lg:col-span-2 rounded-[3rem] border bg-card p-10 shadow-2xl relative overflow-hidden group">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
             <Activity className="w-6 h-6 text-indigo-600" />
             My Recent Solves
          </h2>
          
          <div className="space-y-4">
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="font-bold">No submissions found yet.</p>
                </div>
            ) : (
                submissions.slice(0, 5).map((sub) => (
                    <div key={sub.SUBMISSIONID} className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/30 border border-transparent hover:border-indigo-500/20 hover:bg-muted/50 transition-all">
                        <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl font-black text-xs ${sub.VERDICTNAME === 'AC' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {sub.VERDICTNAME}
                            </div>
                            <div>
                                <div className="font-bold text-sm mb-1">{sub.TITLE}</div>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(sub.SUBMITTEDAT).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <button className="p-3 rounded-2xl bg-white border shadow-sm hover:scale-110 transition-transform">
                            <ChevronRight className="w-4 h-4 text-indigo-600" />
                        </button>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
