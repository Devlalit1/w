'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, Check, ArrowRight, Zap, Users, HardDrive } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for solo developers getting started',
    features: [
      '3 projects',
      '1 workspace per project',
      '10 AI analyses / month',
      'Basic 3D visualization',
      'Community support',
    ],
    cta: 'Get Started',
    ctaHref: '/signup',
    highlighted: false,
    icon: HardDrive,
    gradient: 'from-slate-500 to-slate-600',
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For professional developers and power users',
    features: [
      'Unlimited projects',
      'Unlimited workspaces',
      '500 AI analyses / month',
      'Advanced 3D features',
      'Priority support',
      'Export to PDF/PNG',
      'API access',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/signup',
    highlighted: true,
    icon: Zap,
    gradient: 'from-blue-500 to-violet-500',
    badge: 'Most Popular',
  },
  {
    name: 'Team',
    price: '$49',
    period: 'per month',
    description: 'For engineering teams that need to collaborate',
    features: [
      'Everything in Pro',
      'Up to 20 team members',
      'Unlimited AI analyses',
      'Real-time collaboration',
      'Shared workspaces',
      'SSO / SAML',
      'Dedicated support',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    ctaHref: '/signup',
    highlighted: false,
    icon: Users,
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function PricingPage() {
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
            <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-blue-500/15 to-violet-500/10 border-2 border-blue-500/40 glow-blue'
                    : 'glass'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-5">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-muted-foreground ml-1 text-sm">/{plan.period}</span>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90 glow-blue'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center glass rounded-2xl p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Have questions?</h3>
          <p className="text-muted-foreground mb-6">Our team is ready to help you find the right plan.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
