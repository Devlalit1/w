import Link from 'next/link';
import { Box } from 'lucide-react';

export const metadata = { title: 'Privacy Policy | DevVerse AI' };

const sections = [
  { title: '1. Information We Collect', body: 'We collect information you provide when creating an account (name, email, password), usage data (pages visited, features used), and technical data (IP address, browser type, device). We do not sell your personal data to third parties.' },
  { title: '2. How We Use Your Information', body: 'We use your information to provide and improve our services, send transactional emails (account confirmation, password reset), respond to support requests, and analyze usage patterns to improve the product.' },
  { title: '3. Data Storage & Security', body: 'Your data is stored on secure servers hosted on Railway and Vercel. Passwords are hashed with bcrypt (12 rounds). We use HTTPS/TLS for all data in transit. Access to production data is limited to authorized team members.' },
  { title: '4. Cookies', body: 'We use essential cookies for authentication (JWT tokens stored in localStorage) and analytics cookies (anonymized). You can disable non-essential cookies in your browser settings.' },
  { title: '5. Third-Party Services', body: 'We use Google Gemini AI for architecture analysis (your project data is sent to Google\'s API). We use Vercel for frontend hosting and Railway for backend hosting. Each has their own privacy policy.' },
  { title: '6. Data Retention', body: 'We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time via Settings > Danger Zone or by emailing hello@devverse.ai.' },
  { title: '7. Your Rights', body: 'You have the right to access, correct, export, or delete your personal data. Contact us at hello@devverse.ai to exercise these rights.' },
  { title: '8. Changes to This Policy', body: 'We may update this Privacy Policy. We will notify you of significant changes via email or an in-app notice. Continued use of DevVerse AI after changes constitutes acceptance.' },
];

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
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
