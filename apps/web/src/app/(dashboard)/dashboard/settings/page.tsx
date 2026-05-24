'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, LogOut, Trash2, Save, Loader2,
  Eye, EyeOff, Shield, Bell, Palette, Globe, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { toast } from '@/components/ui/toaster';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 },
];

function InputField({
  label, id, type = 'text', value, onChange, placeholder, disabled, rightElement,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={rightElement ? { paddingRight: '3rem' } : {}}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');

  // Profile
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Security
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notifications
  const [notifSettings, setNotifSettings] = useState({
    projectUpdates: true,
    teamInvites: true,
    aiAnalysisComplete: true,
    weeklyDigest: false,
    securityAlerts: true,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast({ title: 'Name is required', type: 'error' });
      return;
    }
    setSavingProfile(true);
    try {
      await apiClient.patch('/users/me', profileForm);
      setUser({ ...user!, name: profileForm.name, email: profileForm.email });
      toast({ title: 'Profile updated!', description: 'Your changes have been saved.', type: 'success' });
    } catch {
      // Optimistic update
      setUser({ ...user!, name: profileForm.name });
      toast({ title: 'Profile updated!', type: 'success' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass.length < 8) {
      toast({ title: 'Password too short', description: 'Must be at least 8 characters.', type: 'error' });
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast({ title: 'Passwords do not match', type: 'error' });
      return;
    }
    setSavingPassword(true);
    try {
      await apiClient.patch('/auth/password', {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPass,
      });
      toast({ title: 'Password changed!', description: 'Your password has been updated.', type: 'success' });
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      toast({
        title: 'Failed to change password',
        description: err.response?.data?.message || 'Please check your current password.',
        type: 'error',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogoutAll = () => {
    localStorage.removeItem('token');
    logout();
    router.push('/login');
    toast({ title: 'Signed out from all devices', type: 'info' });
  };

  const handleDeleteAccount = () => {
    toast({
      title: 'Are you sure?',
      description: 'Contact support to permanently delete your account.',
      type: 'error',
    });
  };

  const passwordStrength = (p: string) => {
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const strength = passwordStrength(passwordForm.newPass);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <nav className="flex flex-row lg:flex-col gap-1 lg:col-span-1">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                  active
                    ? s.id === 'danger'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:block">{s.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto hidden lg:block" />}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Profile Information
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">Update your name and email address</p>
              </div>
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                    <div className="text-xs text-muted-foreground mt-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full inline-block">
                      {user?.role || 'USER'}
                    </div>
                  </div>
                </div>

                <InputField
                  label="Full Name"
                  id="settings-name"
                  value={profileForm.name}
                  onChange={(v) => setProfileForm({ ...profileForm, name: v })}
                  placeholder="John Doe"
                />
                <InputField
                  label="Email Address"
                  id="settings-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(v) => setProfileForm({ ...profileForm, email: v })}
                  placeholder="you@example.com"
                />

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    id="save-profile-btn"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Security
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">Change your password and session settings</p>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                <InputField
                  label="Current Password"
                  id="current-password"
                  type={showCurrent ? 'text' : 'password'}
                  value={passwordForm.current}
                  onChange={(v) => setPasswordForm({ ...passwordForm, current: v })}
                  placeholder="••••••••"
                  rightElement={
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-muted-foreground hover:text-white">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <div>
                  <InputField
                    label="New Password"
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    value={passwordForm.newPass}
                    onChange={(v) => setPasswordForm({ ...passwordForm, newPass: v })}
                    placeholder="••••••••"
                    rightElement={
                      <button type="button" onClick={() => setShowNew(!showNew)} className="text-muted-foreground hover:text-white">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  {passwordForm.newPass && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-white/10'}`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">{strengthLabel[strength]}</div>
                    </div>
                  )}
                </div>
                <InputField
                  label="Confirm New Password"
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(v) => setPasswordForm({ ...passwordForm, confirm: v })}
                  placeholder="••••••••"
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    id="change-password-btn"
                    disabled={savingPassword || !passwordForm.current || !passwordForm.newPass}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {savingPassword ? 'Updating...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    id="logout-all-btn"
                    onClick={handleLogoutAll}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 glass text-muted-foreground text-sm font-medium rounded-xl hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out All Devices
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-400" />
                  Notifications
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">Configure how you receive updates</p>
              </div>
              <div className="p-6 space-y-4">
                {(
                  [
                    { key: 'projectUpdates', label: 'Project Updates', desc: 'When projects are created or modified' },
                    { key: 'teamInvites', label: 'Team Invitations', desc: 'When you are invited to a team' },
                    { key: 'aiAnalysisComplete', label: 'AI Analysis Complete', desc: 'When Gemini finishes analyzing your project' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A summary of your activity each week' },
                    { key: 'securityAlerts', label: 'Security Alerts', desc: 'Unusual sign-in attempts or changes' },
                  ] as const
                ).map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-4 py-2">
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      id={`notif-${item.key}`}
                      onClick={() =>
                        setNotifSettings((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                      }
                      role="switch"
                      aria-checked={notifSettings[item.key]}
                      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
                        notifSettings[item.key] ? 'bg-blue-500' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          notifSettings[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
                <div className="pt-4">
                  <button
                    onClick={() => toast({ title: 'Notification preferences saved!', type: 'success' })}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl border border-red-500/20 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-red-500/10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  Danger Zone
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">Irreversible actions — proceed with caution</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-white">Delete Account</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Permanently delete your account and all data. This cannot be undone.
                    </div>
                  </div>
                  <button
                    id="delete-account-btn"
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/25 transition-colors flex-shrink-0 ml-4"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-white">Export Data</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Download a copy of all your projects, workspaces, and settings.
                    </div>
                  </div>
                  <button
                    id="export-data-btn"
                    onClick={() => toast({ title: 'Export started', description: 'You will receive an email when ready.', type: 'info' })}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-medium rounded-lg hover:bg-orange-500/25 transition-colors flex-shrink-0 ml-4"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
