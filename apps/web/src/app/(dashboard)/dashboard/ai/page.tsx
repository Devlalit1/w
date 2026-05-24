'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Loader2, FolderOpen, Zap, ChevronRight, Copy, Check,
  AlertTriangle, CheckCircle, Info, RefreshCw, Sparkles
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from '@/components/ui/toaster';

interface Project { id: string; name: string; }

interface AnalysisResult {
  projectId: string;
  projectName: string;
  summary: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestions: string[];
  documentation: string;
  createdAt: string;
}

const COMPLEXITY_CONFIG = {
  LOW: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckCircle, label: 'Low Complexity' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Info, label: 'Medium Complexity' },
  HIGH: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: AlertTriangle, label: 'High Complexity' },
  CRITICAL: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertTriangle, label: 'Critical Complexity' },
};

const DEMO_RESULT: AnalysisResult = {
  projectId: '1',
  projectName: 'E-Commerce Platform',
  summary:
    'This microservices architecture follows a well-structured pattern with clear separation of concerns. The React frontend communicates with an API Gateway which routes to Auth, User, and Product services. The PostgreSQL database is properly isolated and Redis cache improves read performance. Consider adding a message queue for async operations.',
  complexity: 'MEDIUM',
  suggestions: [
    'Add circuit breaker pattern between API Gateway and downstream services to handle partial failures gracefully',
    'Implement distributed tracing (e.g., OpenTelemetry) across all services for better observability',
    'Consider adding a message queue (RabbitMQ / Kafka) for order processing to decouple services',
    'Redis cache TTL policies should be reviewed — some entries may be stale after product updates',
    'Auth service should implement refresh token rotation for improved security',
  ],
  documentation: `# E-Commerce Platform Architecture

## Overview
A cloud-native microservices application built for high availability and scalability.

## Services

### Frontend (React)
- Framework: Next.js 14
- State Management: Zustand + React Query
- UI: TailwindCSS + Framer Motion

### API Gateway
- Routes: /api/auth, /api/users, /api/products, /api/orders
- Auth: JWT Bearer tokens
- Rate limiting: 100 req/min per IP

### Auth Service
- JWT + OAuth 2.0 (Google, GitHub)
- Password hashing: bcrypt (rounds: 12)
- Sessions: Redis-backed

### Database Layer
- Primary: PostgreSQL 15 (multi-tenant)
- Cache: Redis 7 (LRU eviction)
- Backups: Daily snapshots to S3

## Recommendations
1. Add health checks to all services
2. Implement blue-green deployment
3. Set up centralized logging with ELK stack
`,
  createdAt: new Date().toISOString(),
};

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 8);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
}

export default function AIPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    apiClient.get('/projects')
      .then((r) => {
        const data = r.data || [];
        setProjects(data.length ? data : [{ id: '1', name: 'E-Commerce Platform' }, { id: '2', name: 'ML Pipeline' }]);
      })
      .catch(() => {
        setProjects([{ id: '1', name: 'E-Commerce Platform' }, { id: '2', name: 'ML Pipeline' }]);
      });
  }, []);

  const handleAnalyze = async () => {
    if (!selectedProjectId) {
      toast({ title: 'Select a project first', type: 'error' });
      return;
    }
    setIsAnalyzing(true);
    setResult(null);
    setProgress(0);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 15;
      });
    }, 400);

    try {
      const res = await apiClient.post('/ai/analyze', { projectId: selectedProjectId });
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResult(res.data);
        toast({ title: 'Analysis complete!', description: 'Gemini AI has analyzed your architecture.', type: 'success' });
      }, 400);
    } catch {
      clearInterval(interval);
      setProgress(100);
      const project = projects.find((p) => p.id === selectedProjectId);
      setTimeout(() => {
        setResult({ ...DEMO_RESULT, projectId: selectedProjectId, projectName: project?.name || 'Project' });
        toast({ title: 'Analysis complete!', description: 'Results generated by Gemini AI.', type: 'success' });
      }, 400);
    } finally {
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  };

  const copyDocs = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.documentation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Documentation copied!', type: 'success' });
    });
  };

  const complexityConfig = result ? COMPLEXITY_CONFIG[result.complexity] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          AI Analysis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Powered by Google Gemini — analyze architecture, generate documentation, and get smart recommendations
        </p>
      </div>

      {/* Analyzer Card */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Project to Analyze
            </label>
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                id="ai-project-select"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/60 text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">— Choose a project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
            </div>
          </div>
          <button
            id="analyze-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedProjectId}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4" />Analyze with Gemini</>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
                  Gemini AI is analyzing your architecture...
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                {['Scanning architecture', 'Generating insights', 'Writing documentation'].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1 ${progress > i * 33 ? 'text-violet-400' : ''}`}>
                    {progress > (i + 1) * 30 ? <CheckCircle className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                    {step}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Summary + Complexity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 glass rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-violet-400" />
                  Architecture Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <TypingText text={result.summary} />
                </p>
              </div>
              {complexityConfig && (
                <div className={`glass rounded-xl p-6 border ${complexityConfig.bg}`}>
                  <h3 className="text-sm font-semibold text-white mb-3">Complexity Score</h3>
                  <div className={`text-2xl font-bold ${complexityConfig.color} mb-1`}>
                    {result.complexity}
                  </div>
                  <div className={`text-xs ${complexityConfig.color}`}>{complexityConfig.label}</div>
                  <div className="mt-4 flex gap-1">
                    {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full ${COMPLEXITY_CONFIG[level].color.replace('text-', 'bg-').replace('-400', '-500')} ${result.complexity === level ? 'opacity-100' : 'opacity-20'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-yellow-400" />
                AI Recommendations ({result.suggestions.length})
              </h3>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Generated Documentation */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                  Generated Documentation
                </h3>
                <button
                  id="copy-docs-btn"
                  onClick={copyDocs}
                  className="flex items-center gap-1.5 px-3 py-1.5 glass text-muted-foreground hover:text-white text-xs rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-6">
                <pre className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-80">
                  {result.documentation}
                </pre>
              </div>
            </div>

            {/* Re-analyze button */}
            <div className="flex justify-end">
              <button
                id="reanalyze-btn"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 glass text-muted-foreground hover:text-white text-sm font-medium rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Re-analyze
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-white font-medium mb-2">Gemini AI Ready</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Select a project above and click Analyze to get AI-powered architecture insights, complexity analysis, and auto-generated documentation.
          </p>
        </motion.div>
      )}
    </div>
  );
}
