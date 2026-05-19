'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Box, Eye, EyeOff, Loader2, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api/client';

const passwordRequirements = [
  { label: 'At least 8 characters', check: (p: string) => p.length >= 8 },
  { label: 'Contains a number', check: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/register', formData);
      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">DevVerse AI</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-muted-foreground">Start building in 3D for free</p>
      </div>

      <div className="glass-strong rounded-2xl p-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium text-foreground mb-2">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              required
              minLength={2}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req) => {
                  const met = req.check(formData.password);
                  return (
                    <div key={req.label} className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-400' : 'text-muted-foreground'}`}>
                      <Check className={`w-3 h-3 ${met ? 'opacity-100' : 'opacity-30'}`} />
                      {req.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
        </p>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
