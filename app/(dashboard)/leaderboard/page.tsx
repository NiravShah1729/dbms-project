'use client';

import { useEffect } from 'react';
import { useLeaderboardStore } from '@/app/store/useLeaderboardStore';
import { Trophy, Medal, Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const { top, user, loading, fetchLeaderboard } = useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">Top contributors in the community</p>
      </div>

      {/* Pinned User Stats */}
      {user && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/50 bg-primary/10 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Your Standing</span>
                <h3 className="text-2xl font-bold">{user.FULLNAME}</h3>
              </div>
            </div>
            
            <div className="text-right">
                <span className="text-sm text-muted-foreground">Global Rank</span>
                <div className="text-4xl font-black text-primary">#{user.CURRENTRANK || 'N/A'}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-primary/20 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Total Solved</span>
              <span className="text-xl font-bold text-primary">{user.TOTALSOLVED} Problems</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">CF Handle</span>
                <span className="text-xl font-bold text-primary">@{user.CF_HANDLE || 'None'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                <th className="h-12 px-6 text-left font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Rank</th>
                <th className="h-12 px-6 text-left font-bold text-muted-foreground uppercase tracking-widest text-[10px]">User</th>
                <th className="h-12 px-6 text-right font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top.map((usr: any, idx: number) => (
                <tr key={usr.USERID} className={`group hover:bg-muted/30 transition-colors ${usr.USERID === user?.USERID ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {idx === 0 && <Medal className="h-5 w-5 text-yellow-500" />}
                      {idx === 1 && <Medal className="h-5 w-5 text-slate-400" />}
                      {idx === 2 && <Medal className="h-5 w-5 text-amber-700" />}
                      <span className={`font-black tracking-tighter text-xl ${idx < 3 ? 'text-foreground' : 'text-muted-foreground/50'}`}>#{idx + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold group-hover:text-primary transition-colors text-lg">{usr.FULLNAME}</span>
                      <span className="text-xs text-muted-foreground">@{usr.CF_HANDLE}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="rounded-full bg-secondary px-3 py-1 font-black text-secondary-foreground shadow-sm">
                      {usr.TOTALSOLVED}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
