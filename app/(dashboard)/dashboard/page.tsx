'use client';

import { useAuthStore } from '@/app/store/useAuthStore';
import { 
  Trophy, 
  Target, 
  Flame, 
  CheckCircle, 
  Clock, 
  Calendar,
  MessageSquare,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats } = useSWR('/stats/user', fetcher);

  const statCards = [
    { label: 'Total Solved', value: stats?.TotalSolved || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Current Rank', value: stats?.Rank || 'Unranked', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Solve Streak', value: '4 Days', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Pending Hints', value: '12', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-3 ml-1">
            <Calendar className="w-3 h-3" />
            Last Updated Today
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-2">
            Welcome back, {user?.FullName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground font-semibold text-lg max-w-2xl leading-relaxed">
            You've solved <span className="text-foreground underline decoration-indigo-600/30 underline-offset-4 decoration-2">3 problems</span> this week. Keep the momentum going!
          </p>
        </div>
        <div className="flex -space-x-3 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <img 
              key={i} 
              className="inline-block h-12 w-12 rounded-2xl ring-4 ring-background" 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} 
              alt="Friend"
            />
          ))}
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-muted ring-4 ring-background text-[10px] font-black uppercase tracking-tighter">
            +18
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="group relative rounded-[2rem] border bg-card/50 backdrop-blur-xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1">
            <div className={`mb-4 w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black mb-1 tabular-nums">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-[2.5rem] border bg-gradient-to-br from-indigo-600 to-violet-700 p-1 bg-opacity-10 group overflow-hidden">
          <div className="bg-background/95 h-full rounded-[2.35rem] p-10 backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black">Daily Objective</h3>
              </div>
              <button className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-indigo-600 hover:gap-2 transition-all">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'Tree Flattening Technique', points: 150, time: '35m left', tags: ['Graph', 'DFS'] },
                { title: 'Modular Geometric Series', points: 120, time: '2h left', tags: ['Math', 'NT'] },
              ].map((obj, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl border transition-all hover:bg-muted/50 hover:border-indigo-600/20 group/item cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="h-4 w-4 rounded-full border-2 border-muted group-hover/item:border-indigo-600 transition-colors" />
                    <div>
                      <h4 className="font-black text-lg group-hover/item:text-indigo-600 transition-colors">{obj.title}</h4>
                      <div className="flex gap-2 mt-2">
                        {obj.tags.map(t => (
                          <span key={t} className="text-[9px] font-black uppercase tracking-tighter px-2 py-1 bg-muted rounded-md text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-indigo-600">+{obj.points} XP</div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-muted-foreground mt-1">
                      <Clock className="w-2.5 h-2.5" />
                      {obj.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border bg-card/50 backdrop-blur-xl p-10 flex flex-col justify-between overflow-hidden relative group">
          <UserIcon className="absolute -right-16 -top-16 w-64 h-64 text-muted/10 group-hover:text-indigo-600/10 transition-colors duration-500" />
          <div className="relative">
            <h3 className="text-2xl font-black mb-6">Profile Snapshot</h3>
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName}`} 
                className="w-20 h-20 rounded-3xl ring-4 ring-indigo-500/10" 
                alt="Profile" 
              />
              <div>
                <div className="text-xl font-black">{user?.FullName}</div>
                <div className="text-indigo-600 font-bold text-sm">@{user?.CF_Handle || 'no_handle'}</div>
              </div>
            </div>
          </div>
          <button className="relative w-full py-5 rounded-2xl bg-foreground text-background text-sm font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-500/5">
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
