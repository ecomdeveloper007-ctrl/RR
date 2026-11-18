import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  X,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import type {
  TeamMemberItem,
  TeamPermissionKey,
  TeamPermissions,
  TeamRole,
} from '../types/portfolio';
import {
  ALL_PERMISSION_KEYS,
  PERMISSION_METADATA,
  ROLE_METADATA,
  STATUS_METADATA,
  getDefaultPermissionsForRole,
  isPrimarySuperAdminEmail,
  normalizePermissionsForRole,
} from '../utils/rbac';

export const TeamManagementTab: React.FC = () => {
  const { isSuperAdmin, user } = useAuth();
  const {
    teamMembers,
    inviteTeamMember,
    updateTeamMember,
    toggleTeamMemberStatus,
    revokeTeamMemberAccess,
    removeTeamMemberRecord,
    showToast,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Add Member Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('editor');
  const [invitePermissions, setInvitePermissions] = useState<TeamPermissions>(
    getDefaultPermissionsForRole('editor')
  );
  const [sendEmailInvite, setSendEmailInvite] = useState(true);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [inviteFormError, setInviteFormError] = useState<string | null>(null);
  const [createdInviteInfo, setCreatedInviteInfo] = useState<{
    email: string;
    link: string;
    emailSent: boolean;
    notice?: string;
  } | null>(null);

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<TeamRole>('editor');
  const [editPermissions, setEditPermissions] = useState<TeamPermissions>(
    getDefaultPermissionsForRole('editor')
  );
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Action Confirmation Modal State (Deactivate / Revoke / Remove)
  const [confirmAction, setConfirmAction] = useState<{
    member: TeamMemberItem;
    type: 'deactivate' | 'activate' | 'revoke' | 'remove';
  } | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return teamMembers.filter((m) => {
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [teamMembers, searchQuery, roleFilter, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: teamMembers.length,
      active: teamMembers.filter((m) => m.status === 'active').length,
      pending: teamMembers.filter((m) => m.status === 'pending').length,
      restricted: teamMembers.filter((m) => m.status === 'inactive' || m.status === 'revoked').length,
    };
  }, [teamMembers]);

  if (!isSuperAdmin) {
    return (
      <div className="max-w-3xl bg-slate-950 p-8 rounded-2xl border border-rose-900/50 text-center space-y-3">
        <Lock className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Super Admin Access Required</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Team Member Management and role permission controls are strictly protected server-side and restricted exclusively to the Super Admin.
        </p>
      </div>
    );
  }

  const handleRoleChangeInAdd = (nextRole: TeamRole) => {
    setInviteRole(nextRole);
    setInvitePermissions(getDefaultPermissionsForRole(nextRole));
  };

  const handleToggleAddPerm = (key: TeamPermissionKey) => {
    if (inviteRole === 'super_admin') return;
    if (key === 'manage_team_members') return;
    if (inviteRole === 'editor' && key === 'manage_website_settings') return;
    if (inviteRole === 'viewer' && key !== 'view_dashboard') return;
    setInvitePermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteFormError(null);
    if (!inviteName.trim()) {
      setInviteFormError('Please enter the team member’s full name.');
      return;
    }
    if (!inviteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) {
      setInviteFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmittingInvite(true);
    try {
      const result = await inviteTeamMember({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        permissions: invitePermissions,
        sendInviteEmail: sendEmailInvite,
      });

      setCreatedInviteInfo({
        email: inviteEmail.trim().toLowerCase(),
        link: result.inviteLink,
        emailSent: result.emailSent,
        notice: result.emailNotice,
      });
      setInviteName('');
      setInviteEmail('');
      setInviteRole('editor');
      setInvitePermissions(getDefaultPermissionsForRole('editor'));
    } catch (err: unknown) {
      setInviteFormError(err instanceof Error ? err.message : 'Failed to invite team member.');
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const openEditModal = (member: TeamMemberItem) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditRole(member.role);
    setEditPermissions(normalizePermissionsForRole(member.role, member.permissions));
    setEditError(null);
  };

  const handleEditRoleChange = (nextRole: TeamRole) => {
    setEditRole(nextRole);
    setEditPermissions(getDefaultPermissionsForRole(nextRole));
  };

  const handleToggleEditPerm = (key: TeamPermissionKey) => {
    if (editRole === 'super_admin') return;
    if (key === 'manage_team_members') return;
    if (editRole === 'editor' && key === 'manage_website_settings') return;
    if (editRole === 'viewer' && key !== 'view_dashboard') return;
    setEditPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setEditError(null);
    if (!editName.trim()) {
      setEditError('Name cannot be empty.');
      return;
    }

    setIsSavingEdit(true);
    try {
      await updateTeamMember(editingMember.email, {
        name: editName.trim(),
        role: editRole,
        permissions: editPermissions,
      });
      setEditingMember(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Failed to update permissions.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setIsConfirmLoading(true);
    try {
      const { member, type } = confirmAction;
      if (type === 'deactivate') {
        await toggleTeamMemberStatus(member, 'inactive');
      } else if (type === 'activate') {
        await toggleTeamMemberStatus(member, 'active');
      } else if (type === 'revoke') {
        await revokeTeamMemberAccess(member);
      } else if (type === 'remove') {
        await removeTeamMemberRecord(member);
      }
      setConfirmAction(null);
    } catch {
      // Error toast already surfaced by context
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      showToast('Secure activation link copied to clipboard!');
    } catch {
      showToast('Could not copy automatically — please copy the link manually.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#10B981]" />
            <span>Team Management &amp; Role Access Control</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Invite collaborators, assign RBAC roles and custom permissions, and enforce server-side access revocation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreatedInviteInfo(null);
            setInviteFormError(null);
            setIsAddOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: counts.total, color: 'text-white' },
          { label: 'Active Access', value: counts.active, color: 'text-emerald-400' },
          { label: 'Pending Invites', value: counts.pending, color: 'text-amber-400' },
          { label: 'Deactivated / Revoked', value: counts.restricted, color: 'text-rose-400' },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {stat.label}
            </span>
            <span className={`text-2xl font-bold mt-1 block ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search team members by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Deactivated</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      {/* Team Member Listing */}
      <div className="space-y-3">
        {filteredMembers.map((member) => {
          const isPrimary = isPrimarySuperAdminEmail(member.email);
          const isSelf =
            user?.email && user.email.toLowerCase() === member.email.toLowerCase();
          const roleMeta = ROLE_METADATA[member.role] || ROLE_METADATA.viewer;
          const statusMeta = STATUS_METADATA[member.status] || STATUS_METADATA.pending;
          const enabledPerms = ALL_PERMISSION_KEYS.filter(
            (k) => member.permissions?.[k]
          );
          const inviteLink = `${window.location.origin}/?invite=${encodeURIComponent(member.email)}#pj-control`;

          return (
            <div
              key={member.email}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Identity & Metadata */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{member.name}</h4>
                    {isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Primary Owner
                      </span>
                    )}
                    {isSelf && !isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        You
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${roleMeta.badgeClass}`}
                    >
                      {roleMeta.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <Mail className="w-3 h-3 text-emerald-400" />
                      {member.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Added: {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Last Accessed:{' '}
                      <strong className="text-slate-300">
                        {member.lastAccessAt
                          ? new Date(member.lastAccessAt).toLocaleString()
                          : 'Not yet signed in'}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {member.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => copyLink(inviteLink)}
                      className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Invite Link</span>
                    </button>
                  )}

                  {!isPrimary && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edit Permissions</span>
                      </button>

                      {member.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ member, type: 'deactivate' })}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Deactivate</span>
                        </button>
                      ) : member.status === 'inactive' || member.status === 'revoked' ? (
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ member, type: 'activate' })}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Activate</span>
                        </button>
                      ) : null}

                      {member.status !== 'revoked' && (
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ member, type: 'revoke' })}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-950 border border-rose-800/60 text-rose-300 text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Revoke Access</span>
                        </button>
                      )}

                      {member.status === 'revoked' && (
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ member, type: 'remove' })}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800"
                          title="Delete revoked member entry (preserves content & audit logs)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Enabled Permissions Matrix Chips */}
              <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
                  Permissions:
                </span>
                {enabledPerms.length > 0 ? (
                  enabledPerms.map((permKey) => (
                    <span
                      key={permKey}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      {PERMISSION_METADATA[permKey].label}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-500">No active dashboard permissions</span>
                )}
              </div>
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="p-10 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              No team members match your current search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* ADD TEAM MEMBER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Invite New Team Member</h4>
                  <p className="text-[11px] text-slate-400">
                    Member activates their account securely via verified Firebase Authentication.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {createdInviteInfo && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-700/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Invitation Created for {createdInviteInfo.email}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {createdInviteInfo.emailSent
                      ? 'A Firebase sign-in activation email has been sent. You can also share this direct secure activation link:'
                      : 'Share the secure activation link below with your team member so they can sign in with Google or verify their own password:'}
                  </p>
                  {createdInviteInfo.notice && !createdInviteInfo.emailSent && (
                    <p className="text-[10px] text-amber-300">
                      Note: Passwordless email link provider returned: {createdInviteInfo.notice}. The member can still activate immediately using the link below via Google Sign-In or Email/Password verification.
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdInviteInfo.link}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-[11px] text-emerald-300 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => copyLink(createdInviteInfo.link)}
                      className="px-3 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}

              <form id="invite-team-form" onSubmit={handleCreateInvite} className="space-y-4">
                {inviteFormError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{inviteFormError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Assign Role *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(['super_admin', 'admin', 'editor', 'viewer'] as TeamRole[]).map((r) => {
                      const meta = ROLE_METADATA[r];
                      const selected = inviteRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleChangeInAdd(r)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selected
                              ? 'bg-emerald-950/50 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{meta.label}</span>
                            {selected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            {meta.shortDesc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Granular Permissions */}
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      Individual Permissions
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Defaults pre-selected for {ROLE_METADATA[inviteRole].label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_PERMISSION_KEYS.map((key) => {
                      const meta = PERMISSION_METADATA[key];
                      const checked = Boolean(invitePermissions[key]);
                      const locked =
                        inviteRole === 'super_admin' ||
                        key === 'manage_team_members' ||
                        (inviteRole === 'editor' && key === 'manage_website_settings') ||
                        (inviteRole === 'viewer' && key !== 'view_dashboard');

                      return (
                        <label
                          key={key}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs ${
                            locked
                              ? 'bg-slate-950/50 border-slate-800/70 opacity-60 cursor-not-allowed'
                              : 'bg-slate-950 border-slate-800 cursor-pointer hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={locked}
                            onChange={() => handleToggleAddPerm(key)}
                            className="mt-0.5 w-3.5 h-3.5 rounded text-emerald-500 bg-slate-900 border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-slate-200">{meta.label}</div>
                            <div className="text-[10px] text-slate-500">{meta.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailInvite}
                    onChange={(e) => setSendEmailInvite(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700"
                  />
                  <span>
                    Attempt to send Firebase email invitation link automatically (a shareable activation link is always generated).
                  </span>
                </label>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              <button
                type="submit"
                form="invite-team-form"
                disabled={isSubmittingInvite}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold inline-flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmittingInvite ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Invitation...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create &amp; Send Invite</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ROLE & PERMISSIONS MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Edit Role &amp; Permissions</h4>
                  <p className="text-[11px] text-slate-400">{editingMember.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form id="edit-member-form" onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-5">
              {editError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['super_admin', 'admin', 'editor', 'viewer'] as TeamRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleEditRoleChange(r)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        editRole === r
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ROLE_METADATA[r].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PERMISSION_KEYS.map((key) => {
                  const meta = PERMISSION_METADATA[key];
                  const checked = Boolean(editPermissions[key]);
                  const locked =
                    editRole === 'super_admin' ||
                    key === 'manage_team_members' ||
                    (editRole === 'editor' && key === 'manage_website_settings') ||
                    (editRole === 'viewer' && key !== 'view_dashboard');

                  return (
                    <label
                      key={key}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs ${
                        locked
                          ? 'bg-slate-900/40 border-slate-800/70 opacity-60 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-800 cursor-pointer hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={locked}
                        onChange={() => handleToggleEditPerm(key)}
                        className="mt-0.5 w-3.5 h-3.5 rounded text-emerald-500 bg-slate-950 border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-slate-200">{meta.label}</div>
                        <div className="text-[10px] text-slate-500">{meta.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </form>

            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-member-form"
                disabled={isSavingEdit}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold inline-flex items-center gap-2 disabled:opacity-60"
              >
                {isSavingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Role &amp; Permissions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR DEACTIVATE / ACTIVATE / REVOKE / REMOVE */}
      {confirmAction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmAction.type === 'activate'
                    ? 'bg-emerald-950 text-emerald-400'
                    : 'bg-rose-950 text-rose-400'
                }`}
              >
                {confirmAction.type === 'activate' ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {confirmAction.type === 'deactivate' && 'Deactivate Team Member'}
                  {confirmAction.type === 'activate' && 'Reactivate Team Member'}
                  {confirmAction.type === 'revoke' && 'Revoke Team Member Access'}
                  {confirmAction.type === 'remove' && 'Remove Team Record'}
                </h4>
                <p className="text-[11px] text-slate-400">{confirmAction.member.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmAction.type === 'deactivate' &&
                `Deactivating ${confirmAction.member.name} will immediately block dashboard access and reject all server-side Firestore mutations from their account until reactivated.`}
              {confirmAction.type === 'activate' &&
                `Reactivating ${confirmAction.member.name} restores their assigned ${ROLE_METADATA[confirmAction.member.role].label} permissions immediately.`}
              {confirmAction.type === 'revoke' &&
                `Revoking access for ${confirmAction.member.name} immediately terminates their active session and blocks all protected Firestore operations. All portfolio content and audit records they created will be preserved.`}
              {confirmAction.type === 'remove' &&
                `Remove the revoked team record for ${confirmAction.member.email}? Historical audit logs and published content will remain untouched.`}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 ${
                  confirmAction.type === 'activate'
                    ? 'bg-[#10B981] hover:bg-[#059669]'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isConfirmLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
