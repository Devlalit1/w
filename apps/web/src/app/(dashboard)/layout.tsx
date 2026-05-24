'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, LayoutDashboard, FolderOpen, Users, Settings, LogOut,
  Plus, Zap, Bell, Menu, X, Brain, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/teams', label: 'Teams', icon: Users },
  { href: '/dashboard/ai', label: 'AI Analysis', icon: Brain },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const mockNotifications = [
  { id: '1', text: 'Project "E-Commerce" was updated', time: '2m ago', unread: true },
  { id: '2', text: 'AI analysis completed for ML Pipeline', time: '1h ago', unread: true },
  { id: '3', text: 'New team member joined DevTeam', time: '3h ago', unread: false },
];

function SidebarContent({
  pathname,
  user,
  handleLogout,
  onClose,
}: {
  pathname: string;
  user: any;
  handleLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white">DevVerse AI</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Action */}
      <div className="px-4 py-3 border-b border-white/5">
        <Link
          href="/dashboard/projects"
          onClick={onClose}
          className="flex items-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium hover:from-blue-500/30 hover:to-violet-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || ''}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-red-400 transition-colors p-1"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  // ESC closes panels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    router.push('/login');
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const pageTitle = navItems.find(
    (n) => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
  )?.label || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 glass border-r border-white/5 flex-col">
        <SidebarContent pathname={pathname} user={user} handleLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 glass-strong border-r border-white/10 flex flex-col md:hidden"
            >
              <SidebarContent
                pathname={pathname}
                user={user}
                handleLogout={handleLogout}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-white transition-colors p-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              {pathname !== '/dashboard' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-white">{pageTitle}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative text-muted-foreground hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-xl border border-white/10 overflow-hidden z-50 shadow-2xl"
                  >
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer ${n.unread ? 'bg-blue-500/5' : ''}`}
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
                            )
                          }
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? 'bg-blue-400' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-relaxed ${n.unread ? 'text-white' : 'text-muted-foreground'}`}>
                              {n.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/5">
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="w-full text-xs text-center text-muted-foreground hover:text-white transition-colors"
                      >
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
