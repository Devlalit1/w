'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Box, LayoutDashboard, FolderOpen, Users, Settings, LogOut,
  Plus, Zap, Bell
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/teams', label: 'Teams', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">DevVerse AI</span>
          </Link>
        </div>

        {/* Quick Action */}
        <div className="px-4 py-3 border-b border-white/5">
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium hover:from-blue-500/30 hover:to-violet-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* AI Badge */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-3 py-2 glass rounded-lg text-xs text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Gemini AI Active</span>
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email || ''}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <button className="relative text-muted-foreground hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500" />
          </button>
        </div>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
