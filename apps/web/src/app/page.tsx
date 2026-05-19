'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Box, Users, Brain, GitBranch, Shield, ChevronRight, Star, Code2, Database } from 'lucide-react';

const features = [
  {
    icon: Box,
    title: '3D Architecture Visualization',
    description: 'Explore your software architecture in an immersive 3D space. Drag, zoom, and connect components visually.',
    color: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Powered by Google Gemini AI. Generate documentation, analyze complexity, and get smart recommendations.',
    color: 'from-violet-500 to-purple-500',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work together with your team in shared workspaces. See live cursors, updates, and presence awareness.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  {
    icon: Code2,
    title: 'Code Intelligence',
    description: 'Analyze code complexity, detect dependencies, and get AI-powered refactoring suggestions.',
    color: 'from-orange-500 to-red-500',
    glow: 'rgba(249, 115, 22, 0.3)',
  },
  {
    icon: Database,
    title: 'Database Visualization',
    description: 'Visualize database schemas, relationships, and data flows in your 3D workspace.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6, 182, 212, 0.3)',
  },
  {
    icon: Shield,
    title: 'Security Analysis',
    description: 'Identify vulnerabilities, security risks, and compliance issues in your architecture.',
    color: 'from-rose-500 to-pink-500',
    glow: 'rgba(244, 63, 94, 0.3)',
  },
];

const stats = [
  { value: '10K+', label: 'Developers', icon: Users },
  { value: '50K+', label: 'Projects Created', icon: GitBranch },
  { value: '99.9%', label: 'Uptime', icon: Zap },
  { value: '4.9★', label: 'Rating', icon: Star },
];



const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse-slow pointer-events-none ${className}`}
    />
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <FloatingOrb className="w-[600px] h-[600px] bg-blue-600 -top-48 -left-32" />
      <FloatingOrb className="w-[500px] h-[500px] bg-violet-600 -top-24 right-0" />
      <FloatingOrb className="w-[400px] h-[400px] bg-cyan-600 top-1/2 left-1/2 -translate-x-1/2" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DevVerse AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            Powered by Google Gemini AI
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            The{' '}
            <span className="text-gradient">AI-Powered</span>
            <br />
            3D Developer Workspace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Visualize software architectures in stunning 3D, collaborate in real-time with your team,
            and leverage AI to generate documentation and analyze complexity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              id="hero-cta-signup"
              className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center gap-2 glow-blue"
            >
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              id="hero-cta-demo"
              className="px-8 py-4 text-base font-semibold glass text-white rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
            >
              <Box className="w-4 h-4" /> View Demo
            </Link>
          </motion.div>
        </div>

        {/* Hero Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="glass rounded-2xl p-1 glow-blue">
            <div className="bg-card rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
              {/* Simulated 3D workspace preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 opacity-80" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  {[
                    { label: 'Frontend', color: '#3b82f6', top: -20 },
                    { label: 'API Gateway', color: '#8b5cf6', top: 0 },
                    { label: 'Database', color: '#06b6d4', top: 20 },
                  ].map((node, i) => (
                    <motion.div
                      key={node.label}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      style={{ marginTop: node.top }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: `${node.color}33`, border: `2px solid ${node.color}`, boxShadow: `0 0 20px ${node.color}66` }}
                      >
                        {node.label.split(' ')[0]}
                      </div>
                      <span className="text-xs text-muted-foreground">{node.label}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Interactive 3D Workspace Preview
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{' '}
              <span className="text-gradient">ship faster</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              From 3D visualization to AI-powered insights, DevVerse AI has the tools modern developers need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="glass rounded-xl p-6 hover:bg-white/8 transition-all duration-300 group cursor-pointer"
                  style={{ '--glow-color': feature.glow } as any}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-strong rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              Ready to visualize your architecture?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers building better software with AI-powered insights and 3D visualization.
            </p>
            <Link
              href="/signup"
              id="bottom-cta"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:opacity-90 transition-all"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Box className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">DevVerse AI © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {['Privacy', 'Terms', 'Contact', 'GitHub'].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
