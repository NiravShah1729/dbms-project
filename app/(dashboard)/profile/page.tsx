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
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-[3rem] border bg-card/50 backdrop-blur-xl p-10 shadow-2xl space-y-10 group overflow-hidden relative">
          <Settings className="absolute -right-16 -bottom-16 w-64 h-64 text-muted/10 group-hover:rotate-45 transition-transform duration-1000" />
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">Account Details</h2>
              <button onClick={() => setEditing(!editing)} className="p-3 rounded-2xl bg-muted hover:bg-indigo-600 hover:text-white transition-all group-hover:scale-110">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-muted text-muted-foreground group-hover:bg-indigo-600/10 group-hover:text-indigo-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Email Address</div>
                  <div className="text-lg font-bold">{user?.Email}</div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-muted text-muted-foreground group-hover:bg-indigo-600/10 group-hover:text-indigo-600 transition-colors">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Codeforces Handle</div>
                  <div className="text-lg font-bold">{user?.CF_Handle || 'Not linked'}</div>
                </div>
              </div>

              {!user?.CF_Handle && (
                <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-start gap-3 mt-4 animate-bounce">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="text-xs font-black uppercase tracking-tighter leading-normal">
                    Please link your Codeforces handle to track progress automatically.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border bg-zinc-950 p-10 shadow-2xl flex flex-col justify-between overflow-hidden group">
          <div className="relative">
            <h2 className="text-2xl font-black text-white mb-2">Platform Security</h2>
            <p className="text-zinc-500 text-sm font-medium mb-10">Manage your credentials and API access tokens.</p>
            
            <div className="space-y-4">
              <button className="w-full p-6 flex items-center justify-between rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold hover:border-indigo-600/50 hover:bg-zinc-800 transition-all">
                <span>Change Password</span>
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="w-full p-6 flex items-center justify-between rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold hover:border-indigo-600/50 hover:bg-zinc-800 transition-all">
                <span>API Keys</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="mt-10 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between group-hover:bg-rose-500/20 transition-colors">
            <div>
              <div className="text-rose-500 font-black text-xs uppercase tracking-widest mb-1">Advanced Options</div>
              <div className="text-rose-500/70 text-[10px] font-bold">This action cannot be undone.</div>
            </div>
            <button className="text-rose-600 font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
