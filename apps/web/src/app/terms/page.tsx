import Link from 'next/link';
import { Box } from 'lucide-react';

export const metadata = { title: 'Terms of Service | DevVerse AI' };

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using DevVerse AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our service.' },
  { title: '2. Description of Service', body: 'DevVerse AI provides an AI-powered 3D developer workspace SaaS platform for visualizing software architectures, generating documentation, and collaborating with teams.' },
  { title: '3. User Accounts', body: 'You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and password. You must notify us immediately of any unauthorized use.' },
  { title: '4. Acceptable Use', body: 'You may not use DevVerse AI to: violate any laws, infringe intellectual property rights, transmit malicious code, attempt to gain unauthorized access to our systems, or use our AI features to generate harmful content.' },
  { title: '5. Intellectual Property', body: 'DevVerse AI and its original content, features, and functionality are owned by DevVerse AI and protected by international copyright laws. Your project data remains your intellectual property.' },
  { title: '6. Subscription & Billing', body: 'Free tier is provided as-is. Paid plans are billed monthly or annually. You may cancel at any time. Refunds are issued within 30 days of billing if requested.' },
  { title: '7. Limitation of Liability', body: 'DevVerse AI is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.' },
  { title: '8. Termination', body: 'We reserve the right to terminate or suspend accounts that violate these terms. You may delete your account at any time from Settings > Danger Zone.' },
  { title: '9. Governing Law', body: 'These terms are governed by applicable law. Disputes shall be resolved through binding arbitration, except for claims that qualify for small claims court.' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DevVerse AI</span>
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: May 20, 2026</p>
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center text-sm text-muted-foreground">
          Questions? <a href="mailto:hello@devverse.ai" className="text-blue-400 hover:text-blue-300">hello@devverse.ai</a>
        </div>
      </div>
    </div>
  );
}
