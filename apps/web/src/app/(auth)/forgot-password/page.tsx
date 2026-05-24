'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ArrowRight, Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch {
      // Always show success for security (don't reveal if email exists)
    } finally {
      setIsLoading(false);
      setSent(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">DevVerse AI</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-white">
          {sent ? 'Check your email' : 'Reset your password'}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-xs mx-auto">
          {sent
            ? `We sent a reset link to ${email}. It expires in 15 minutes.`
            : "Enter your email and we'll send you a link to reset your password"}
        </p>
      </div>

      <div className="glass-strong rounded-2xl p-8">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t get it? Check your spam folder or{' '}
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  try again
                </button>
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 w-full justify-center py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <button
                id="forgot-submit"
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
                ) : (
                  <>Send reset link <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
