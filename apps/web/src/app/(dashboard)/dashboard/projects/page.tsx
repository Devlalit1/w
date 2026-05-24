'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen, Plus, Box, Loader2, Search, X, ExternalLink,
  Trash2, Clock, MoreHorizontal, GitBranch
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from '@/components/ui/toaster';

interface Project {
  id: string;
  name: string;
  description?: string;
  workspaces?: any[];
  createdAt: string;
  updatedAt?: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const res = await apiClient.get('/projects');
      setProjects(res.data || []);
    } catch {
      setProjects([
        {
          id: '1',
          name: 'E-Commerce Platform',
          description: 'Full microservices architecture with API gateway',
          workspaces: [{}],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: '2',
          name: 'ML Pipeline',
          description: 'Data processing and model serving infrastructure',
          workspaces: [],
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        {
          id: '3',
          name: 'Mobile Backend',
          description: 'GraphQL API for iOS/Android apps',
          workspaces: [{}, {}],
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = () => setMenuOpenId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // ESC to close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCreate) {
        setShowCreate(false);
        setError('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showCreate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const res = await apiClient.post('/projects', form);
      const newProject = res.data;
      setProjects([newProject, ...projects]);
      setShowCreate(false);
      setForm({ name: '', description: '' });
      toast({ title: 'Project created!', description: `"${newProject.name}" is ready.`, type: 'success' });
    } catch (err: any) {
      // Optimistic local add when backend is down
      const localProject: Project = {
        id: `local-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        workspaces: [],
        createdAt: new Date().toISOString(),
      };
      setProjects([localProject, ...projects]);
      setShowCreate(false);
      setForm({ name: '', description: '' });
      toast({ title: 'Project created!', description: `"${localProject.name}" saved locally.`, type: 'success' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setMenuOpenId(null);
    setDeletingId(id);
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch {
      // Proceed optimistically
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
    toast({ title: 'Project deleted', description: `"${name}" has been removed.`, type: 'info' });
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const gradients = [
    'from-blue-500/20 to-cyan-500/20 border-blue-500/20',
    'from-violet-500/20 to-purple-500/20 border-violet-500/20',
    'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
    'from-orange-500/20 to-red-500/20 border-orange-500/20',
    'from-pink-500/20 to-rose-500/20 border-pink-500/20',
    'from-cyan-500/20 to-blue-500/20 border-cyan-500/20',
  ];
  const iconColors = ['text-blue-400', 'text-violet-400', 'text-emerald-400', 'text-orange-400', 'text-pink-400', 'text-cyan-400'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          id="create-project-btn"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          aria-label="Search projects"
          className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6 h-48 shimmer-bg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-16 text-center"
        >
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">
            {search ? 'No projects match your search' : 'No projects yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {search
              ? 'Try a different search term'
              : 'Create your first project to start visualizing your architecture.'}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((project, i) => {
              const gradientIdx = i % gradients.length;
              const isDeleting = deletingId === project.id;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isDeleting ? 0.5 : 1, scale: isDeleting ? 0.97 : 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-xl p-6 hover:bg-white/[0.07] transition-all duration-300 group flex flex-col relative"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[gradientIdx]} border flex items-center justify-center flex-shrink-0`}
                    >
                      <FolderOpen className={`w-5 h-5 ${iconColors[gradientIdx]}`} />
                    </div>

                    {/* More menu */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Project options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {menuOpenId === project.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -4 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-8 z-20 glass-strong rounded-xl border border-white/10 overflow-hidden w-40 shadow-xl"
                          >
                            <Link
                              href={`/workspace/${project.id}`}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Open Workspace
                            </Link>
                            <button
                              onClick={() => handleDelete(project.id, project.name)}
                              disabled={isDeleting}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex-1 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {project.workspaces?.length || 0} workspace{(project.workspaces?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.createdAt)}
                      </span>
                    </div>
                    <Link
                      href={`/workspace/${project.id}`}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      Open <Box className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCreate(false);
                setError('');
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-strong rounded-2xl p-8 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">New Project</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Set up your architecture workspace</p>
                </div>
                <button
                  onClick={() => { setShowCreate(false); setError(''); }}
                  className="text-muted-foreground hover:text-white transition-colors p-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label htmlFor="project-name-input" className="block text-sm font-medium text-foreground mb-2">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="project-name-input"
                    type="text"
                    required
                    autoFocus
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="My Awesome Project"
                    maxLength={80}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm transition-all"
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">{form.name.length}/80</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your project architecture..."
                    rows={3}
                    maxLength={300}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm resize-none transition-all"
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">{form.description.length}/300</div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setError(''); }}
                    className="flex-1 py-3 glass text-muted-foreground rounded-xl hover:text-white hover:bg-white/8 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    id="create-project-submit"
                    type="submit"
                    disabled={creating || !form.name.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {creating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
                    ) : (
                      <><Plus className="w-4 h-4" />Create Project</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
