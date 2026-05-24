'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FolderOpen, Plus, Box, ArrowRight, Activity, Zap, Users,
  Brain, Clock, TrendingUp, GitBranch
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api/client';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

function StatCard({ label, value, icon: Icon, color, isLoading }: any) {
  return (
    <div className="glass rounded-xl p-5 hover:bg-white/[0.07] transition-all duration-300 group">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-white">
        {isLoading ? <div className="w-8 h-6 shimmer-bg rounded" /> : value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const DEMO_ACTIVITY = [
  { id: '1', type: 'project', text: 'Created project "E-Commerce Platform"', time: new Date(Date.now() - 7200000).toISOString(), icon: FolderOpen, color: 'text-blue-400' },
  { id: '2', type: 'ai', text: 'AI analysis completed for ML Pipeline', time: new Date(Date.now() - 14400000).toISOString(), icon: Brain, color: 'text-violet-400' },
  { id: '3', type: 'workspace', text: 'Updated workspace architecture diagram', time: new Date(Date.now() - 86400000).toISOString(), icon: Box, color: 'text-emerald-400' },
  { id: '4', type: 'team', text: 'Invited alice@example.com to Engineering team', time: new Date(Date.now() - 172800000).toISOString(), icon: Users, color: 'text-orange-400' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, teamsRes] = await Promise.allSettled([
          apiClient.get('/projects'),
          apiClient.get('/teams'),
        ]);
        if (projRes.status === 'fulfilled') setProjects(projRes.value.data || []);
        if (teamsRes.status === 'fulfilled') setTeams(teamsRes.value.data || []);
      } catch {
        setProjects([
          { id: '1', name: 'E-Commerce Platform', description: 'Microservices architecture', updatedAt: new Date().toISOString(), workspaces: [{}] },
          { id: '2', name: 'Analytics Dashboard', description: 'Real-time data visualization', updatedAt: new Date().toISOString(), workspaces: [] },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalWorkspaces = projects.reduce((a, p) => a + (p.workspaces?.length || 0), 0);
  const totalMembers = teams.reduce((a, t) => a + (t.members?.length || 0), 0);

  const stats = [
    { label: 'Total Projects', icon: FolderOpen, color: 'from-blue-500 to-cyan-500', value: projects.length },
    { label: 'Team Members', icon: Users, color: 'from-violet-500 to-purple-500', value: totalMembers || teams.length ? totalMembers : 3 },
    { label: 'Workspaces', icon: Box, color: 'from-emerald-500 to-teal-500', value: totalWorkspaces },
    { label: 'AI Analyses', icon: Zap, color: 'from-orange-500 to-red-500', value: projects.length * 2 },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {greeting()}, {user?.name?.split(' ')[0] || 'Developer'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
            <StatCard {...stat} isLoading={isLoading} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/projects', label: 'New Project', icon: Plus, color: 'from-blue-500 to-violet-500' },
            { href: '/dashboard/ai', label: 'AI Analysis', icon: Brain, color: 'from-violet-500 to-purple-500' },
            { href: '/dashboard/teams', label: 'Invite Member', icon: Users, color: 'from-emerald-500 to-teal-500' },
            { href: '/dashboard/projects', label: 'View Projects', icon: GitBranch, color: 'from-orange-500 to-red-500' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="glass rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-200 group flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{action.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Projects */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn} className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="glass rounded-xl p-5 shimmer-bg h-20" />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-white font-medium mb-1">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first project to get started.</p>
              <Link href="/dashboard/projects"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm rounded-lg hover:opacity-90 transition">
                <Plus className="w-4 h-4" /> Create Project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map((project, i) => (
                <motion.div key={project.id} custom={6 + i} initial="hidden" animate="visible" variants={fadeIn}>
                  <Link href="/dashboard/projects">
                    <div className="glass rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">{project.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{project.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Box className="w-3 h-3" />
                            {project.workspaces?.length || 0}
                          </div>
                          {project.updatedAt && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground hidden sm:flex">
                              <Clock className="w-3 h-3" />
                              {formatRelative(project.updatedAt)}
                            </div>
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Feed */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeIn} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              Activity
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          <div className="glass rounded-xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {DEMO_ACTIVITY.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{formatRelative(item.time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-white/5">
              <Link href="/dashboard/projects" className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> View all activity
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
