'use client';

import { useState } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { 
  Trophy, 
  CheckCircle, 
  Calendar,
  ChevronRight,
  Shield,
  Activity,
  Edit2,
  Flame,
  RefreshCw,
} from 'lucide-react';
import useSWR, { useSWRConfig } from 'swr';
import api from '@/lib/api';
import SimpleHeatmap from '@/components/shared/SimpleHeatmap';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface Submission {
  SUBMISSIONID: number;
  QUESTIONID: number;
  TITLE: string;
  VERDICTNAME: string;
  SUBMITTEDCODE: string;
  SUBMITTEDAT: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useSWR('/stats/me', fetcher);
  const { data: submissions, isLoading: submissionsLoading } = useSWR('/submissions', fetcher);
  const { data: analytics } = useSWR('/stats/analytics', fetcher);
  const { mutate } = useSWRConfig();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post('/stats/sync');
      mutate('/stats/me');
      mutate('/stats/analytics');
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  const statCards = [
    { label: 'Total Solved', value: stats?.TOTALSOLVED || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Current Rank', value: stats?.CURRENTRANK ? `#${stats.CURRENTRANK}` : '---', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Solve History', value: stats?.TOTALSUBMISSIONS || 0, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Sub Efficiency', value: analytics?.solveRatio ? `${analytics.solveRatio}%` : '---', icon: Flame, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName}`} 
              className="relative w-24 h-24 rounded-2xl bg-card border-4 border-background shadow-xl object-cover" 
              alt="User Avatar"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-1">
              <Shield className="w-3 h-3" />
              Verified Developer
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-1">
              {user?.FullName}
            </h1>
            <div className="flex gap-2">
              {user?.Roles.map(role => (
                <span key={role} className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-indigo-600/10 text-indigo-600 rounded-md border border-indigo-600/20">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Profile Completeness</div>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-[85%]" />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors disabled:opacity-50"
              title="Re-sync Statistics"
            >
              <RefreshCw className={`w-5 h-5 text-indigo-600 ${syncing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="group relative rounded-[2rem] border bg-card/50 backdrop-blur-xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1">
            <div className={`mb-4 w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black mb-1 tabular-nums">
              {statsLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded-md" /> : stat.value}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Heatmap */}
        <div className="lg:col-span-1 space-y-8">
          <SimpleHeatmap data={(analytics?.heatmap || []).map((d: any) => ({
            submission_date: d.SUBMISSION_DATE || d.submission_date,
            count: d.count || d.COUNT || 0
          }))} />
        </div>

        {/* Right Column: Recent Activity/Submissions */}
        <div className="lg:col-span-2 rounded-[3rem] border bg-card p-10 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <Activity className="w-6 h-6 text-indigo-600" />
              Recent Activity
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:gap-2 transition-all flex items-center gap-1">
              View History <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-4">
            {submissionsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-2xl" />
              ))
            ) : !submissions || submissions.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <div className="text-4xl mb-4">📭</div>
                <p className="font-bold font-black text-xs uppercase tracking-widest">No activity found.</p>
              </div>
            ) : (
              submissions.slice(0, 5).map((sub: Submission) => (
                <div key={sub.SUBMISSIONID} className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-transparent hover:border-indigo-500/10 hover:bg-muted/40 transition-all group/item">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] ${sub.VERDICTNAME === 'AC' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {sub.VERDICTNAME}
                    </div>
                    <div>
                      <div className="font-black text-sm mb-0.5 group-hover/item:text-indigo-600 transition-colors">{sub.TITLE}</div>
                      <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(sub.SUBMITTEDAT).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button className="p-2.5 rounded-xl bg-background border shadow-sm group-hover/item:translate-x-1 transition-all">
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


