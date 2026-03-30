'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import { LayoutDashboard, ListTodo, Trophy, User, LogOut, ShieldAlert, Send } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout: storeLogout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'The Sheet', icon: ListTodo, href: '/sheet' },
    { label: 'Submissions', icon: Send, href: '/submissions' },
    { label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    ...(Array.isArray(user?.Roles) && user?.Roles?.some(role => role.toLowerCase() === 'admin') 
      ? [{ label: 'Admin Panel', icon: ShieldAlert, href: '/admin' }] 
      : [])
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 border-r bg-background p-6">
      <div className="mb-8 flex items-center gap-2 font-black text-2xl text-indigo-600 tracking-tighter">
        <ShieldAlert className="h-6 w-6" />
        <span>DevProgress</span>
      </div>

      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
              pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}

        <button
          onClick={() => {
            storeLogout();
            window.location.href = '/login';
          }}
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}
