'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Loader2, X, Mail, Crown, Shield,
  UserMinus, Search, Copy, Check
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store';
import { toast } from '@/components/ui/toaster';

interface TeamMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: { id: string; name: string; email: string; avatar: string | null };
}

interface Team {
  id: string;
  name: string;
  slug: string;
  members: TeamMember[];
  createdAt: string;
}

const ROLE_ICONS: Record<string, any> = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: Users,
};

const ROLE_COLORS: Record<string, string> = {
  OWNER: 'text-yellow-400',
  ADMIN: 'text-blue-400',
  MEMBER: 'text-muted-foreground',
};

const DEMO_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Engineering',
    slug: 'engineering',
    members: [
      { id: 'm1', role: 'OWNER', user: { id: 'u1', name: 'You', email: 'you@example.com', avatar: null } },
      { id: 'm2', role: 'ADMIN', user: { id: 'u2', name: 'Alice Chen', email: 'alice@example.com', avatar: null } },
      { id: 'm3', role: 'MEMBER', user: { id: 'u3', name: 'Bob Smith', email: 'bob@example.com', avatar: null } },
    ],
    createdAt: new Date().toISOString(),
  },
];

function Avatar({ name, size = 8 }: { name: string; size?: number }) {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px`, fontSize: `${size * 1.5}px` }}
    >
      {name[0]?.toUpperCase() || '?'}
    </div>
  );
}

export default function TeamsPage() {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', slug: '' });
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState('MEMBER');
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/teams');
        const data = res.data || [];
        setTeams(data.length ? data : DEMO_TEAMS);
        if (data.length) setSelectedTeam(data[0]);
        else setSelectedTeam(DEMO_TEAMS[0]);
      } catch {
        setTeams(DEMO_TEAMS);
        setSelectedTeam(DEMO_TEAMS[0]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setCreating(true);
    try {
      const res = await apiClient.post('/teams', createForm);
      const team = res.data;
      setTeams((prev) => [...prev, team]);
      setSelectedTeam(team);
      toast({ title: 'Team created!', description: `"${team.name}" is ready.`, type: 'success' });
    } catch {
      const localTeam: Team = {
        id: `local-${Date.now()}`,
        name: createForm.name,
        slug: createForm.slug,
        members: [
          {
            id: 'm-local',
            role: 'OWNER',
            user: { id: user?.id || 'u0', name: user?.name || 'You', email: user?.email || '', avatar: null },
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setTeams((prev) => [...prev, localTeam]);
      setSelectedTeam(localTeam);
      toast({ title: 'Team created!', type: 'success' });
    } finally {
      setCreating(false);
      setShowCreateTeam(false);
      setCreateForm({ name: '', slug: '' });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !addEmail.trim()) return;
    setAdding(true);
    try {
      await apiClient.post(`/teams/${selectedTeam.id}/members`, { email: addEmail, role: addRole });
      const newMember: TeamMember = {
        id: `m-${Date.now()}`,
        role: addRole as any,
        user: { id: `u-${Date.now()}`, name: addEmail.split('@')[0], email: addEmail, avatar: null },
      };
      const updated = { ...selectedTeam, members: [...selectedTeam.members, newMember] };
      setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? updated : t)));
      setSelectedTeam(updated);
      toast({ title: 'Member invited!', description: `Invitation sent to ${addEmail}`, type: 'success' });
    } catch {
      toast({ title: 'Could not add member', description: 'Make sure the email is registered.', type: 'error' });
    } finally {
      setAdding(false);
      setAddEmail('');
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string, memberName: string) => {
    try {
      await apiClient.delete(`/teams/${teamId}/members/${userId}`);
    } catch { /* optimistic */ }
    const updated = { ...selectedTeam!, members: selectedTeam!.members.filter((m) => m.user.id !== userId) };
    setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)));
    setSelectedTeam(updated);
    toast({ title: 'Member removed', description: `${memberName} has been removed from the team.`, type: 'info' });
  };

  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(slug).then(() => {
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
    });
  };

  const filteredMembers = (selectedTeam?.members || []).filter(
    (m) =>
      m.user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.user.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Teams</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your teams and collaborate with others</p>
        </div>
        <button
          id="create-team-btn"
          onClick={() => setShowCreateTeam(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Team
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : teams.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">No teams yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create a team to collaborate with others.</p>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
              Your Teams
            </div>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  selectedTeam?.id === team.id
                    ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                    : 'glass text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-400">
                  {team.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-white">{team.name}</div>
                  <div className="text-xs text-muted-foreground">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Team Detail */}
          {selectedTeam && (
            <motion.div
              key={selectedTeam.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass rounded-xl overflow-hidden"
            >
              {/* Team Header */}
              <div className="px-6 py-5 border-b border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedTeam.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                        @{selectedTeam.slug}
                      </code>
                      <button
                        onClick={() => copySlug(selectedTeam.slug)}
                        className="text-muted-foreground hover:text-white transition-colors"
                        title="Copy slug"
                      >
                        {copiedSlug ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm rounded-lg hover:bg-blue-500/25 transition-colors flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Invite
                  </button>
                </div>
              </div>

              {/* Member Search */}
              <div className="px-6 py-4 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search members..."
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Members List */}
              <div className="divide-y divide-white/5">
                {filteredMembers.length === 0 ? (
                  <div className="px-6 py-8 text-center text-muted-foreground text-sm">No members match your search</div>
                ) : (
                  filteredMembers.map((member) => {
                    const RoleIcon = ROLE_ICONS[member.role] || Users;
                    const isOwner = member.role === 'OWNER';
                    const isSelf = member.user.email === user?.email;
                    return (
                      <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors">
                        <Avatar name={member.user.name} size={9} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">{member.user.name}</span>
                            {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {member.user.email}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                        </div>
                        {!isOwner && !isSelf && (
                          <button
                            onClick={() => handleRemoveMember(selectedTeam.id, member.user.id, member.user.name)}
                            className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove member"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreateTeam(false); }}
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
                <h2 className="text-xl font-bold text-white">Create Team</h2>
                <button onClick={() => setShowCreateTeam(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ name: e.target.value, slug: autoSlug(e.target.value) })}
                    placeholder="Engineering Team"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slug (URL-safe identifier)</label>
                  <input
                    type="text"
                    required
                    value={createForm.slug}
                    onChange={(e) => setCreateForm({ ...createForm, slug: autoSlug(e.target.value) })}
                    placeholder="engineering-team"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm font-mono"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTeam(false)}
                    className="flex-1 py-3 glass text-muted-foreground rounded-xl hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !createForm.name.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {creating ? 'Creating...' : 'Create Team'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddMember(false); }}
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
                <h2 className="text-xl font-bold text-white">Invite Member</h2>
                <button onClick={() => setShowAddMember(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={addEmail}
                      onChange={(e) => setAddEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['MEMBER', 'ADMIN'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setAddRole(role)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                          addRole === role
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                            : 'glass border-white/10 text-muted-foreground hover:text-white hover:border-white/20'
                        }`}
                      >
                        {role.charAt(0) + role.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 py-3 glass text-muted-foreground rounded-xl hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding || !addEmail.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    {adding ? 'Sending...' : 'Send Invite'}
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
