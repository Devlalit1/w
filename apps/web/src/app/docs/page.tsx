'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, ArrowRight, Book, Code2, Zap, Users, GitBranch, ChevronRight } from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    icon: Book,
    color: 'from-blue-500 to-cyan-500',
    articles: ['Quick Start Guide', 'Creating Your First Project', 'Understanding Workspaces', 'Inviting Team Members'],
  },
  {
    title: 'AI Features',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    articles: ['AI Architecture Analysis', 'Auto-generated Documentation', 'Complexity Scoring', 'Smart Recommendations'],
  },
  {
    title: '3D Workspace',
    icon: Code2,
    color: 'from-emerald-500 to-teal-500',
    articles: ['Adding Nodes', 'Connecting Components', 'Zoom & Pan Controls', 'Exporting Diagrams'],
  },
  {
    title: 'Collaboration',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    articles: ['Team Management', 'Member Roles & Permissions', 'Shared Workspaces', 'Activity Feed'],
  },
  {
    title: 'Integrations',
    icon: GitBranch,
    color: 'from-pink-500 to-rose-500',
    articles: ['GitHub Integration', 'CI/CD Pipelines', 'REST API Reference', 'Webhooks'],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DevVerse AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:opacity-90 flex items-center gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Documentation</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to build better software with DevVerse AI
          </p>
          {/* Search */}
          <div className="mt-8 max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search documentation..."
              className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm"
            />
          </div>
        </motion.div>

        {/* Quick Start Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">New to DevVerse AI?</h2>
            <p className="text-muted-foreground text-sm">
              Follow our quick start guide to set up your first 3D workspace in under 5 minutes.
            </p>
          </div>
          <Link
            href="/signup"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
          >
            Start Tutorial <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Doc Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="glass rounded-xl p-6 hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.articles.map((article) => (
                    <li key={article}>
                      <button
                        onClick={() => {}}
                        className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-white transition-colors group/item text-left"
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 group-hover/item:text-blue-400 transition-colors" />
                          {article}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* API Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 glass rounded-xl p-6 flex items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-white font-semibold mb-1">REST API Reference</h3>
            <p className="text-sm text-muted-foreground">Full API documentation with examples for all endpoints</p>
          </div>
          <a
            href="https://w-production-d2ff.up.railway.app/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 glass text-blue-400 hover:text-blue-300 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            View API Docs <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
