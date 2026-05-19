'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderOpen, Plus, Box, ArrowRight, Activity, Zap, Users } from 'lucide-react';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api/client';

const quickStats = [
  { label: 'Total Projects', icon: FolderOpen, color: 'from-blue-500 to-cyan-500', key: 'projects' },
  { label: 'Team Members', icon: Users, color: 'from-violet-500 to-purple-500', key: 'members' },
  { label: 'Workspaces', icon: Box, color: 'from-emerald-500 to-teal-500', key: 'workspaces' },
  { label: 'AI Analyses', icon: Zap, color: 'from-orange-500 to-red-500', key: 'analyses' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await apiClient.get('/projects');
        setProjects(res.data || []);
      } catch {
        // Show demo data if backend not connected
        setProjects([
          { id: '1', name: 'E-Commerce Platform', description: 'Microservices architecture', updatedAt: new Date().toISOString(), workspaces: [{}] },
          { id: '2', name: 'Analytics Dashboard', description: 'Real-time data visualization', updatedAt: new Date().toISOString(), workspaces: [] },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  const stats = [
    { ...quickStats[0], value: projects.length },
    { ...quickStats[1], value: 3 },
    { ...quickStats[2], value: projects.reduce((a, p) => a + (p.workspaces?.length || 0), 0) },
    { ...quickStats[3], value: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'Developer'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="glass rounded-xl p-5 hover:bg-white/8 transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoading ? <div className="w-8 h-6 shimmer-bg rounded" /> : stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Projects */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Link href="/dashboard/projects" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="glass rounded-xl p-5 shimmer-bg h-20" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-white font-medium mb-1">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first project to get started.</p>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm rounded-lg hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" /> Create Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.slice(0, 4).map((project, i) => (
              <motion.div
                key={project.id}
                custom={5 + i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Link href={`/dashboard/projects`}>
                  <div className="glass rounded-xl p-5 hover:bg-white/8 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">{project.name}</h3>
                          <p className="text-xs text-muted-foreground">{project.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {project.workspaces?.length || 0} workspace{project.workspaces?.length !== 1 ? 's' : ''}
                        </span>
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
      <motion.div custom={8} initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-center gap-3 text-muted-foreground py-8">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Activity feed will appear here as you use the workspace</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
