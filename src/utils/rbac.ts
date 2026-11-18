import type { TeamMemberItem, TeamPermissionKey, TeamPermissions, TeamRole, TeamStatus } from '../types/portfolio';

export const PRIMARY_SUPER_ADMIN_EMAIL = 'prakashinfosys1234@gmail.com';

export const ALL_PERMISSION_KEYS: TeamPermissionKey[] = [
  'view_dashboard',
  'manage_portfolio',
  'manage_videos',
  'manage_case_studies',
  'manage_services',
  'manage_testimonials',
  'manage_website_settings',
  'manage_media',
  'manage_team_members',
];

export const PERMISSION_METADATA: Record<
  TeamPermissionKey,
  { label: string; description: string; sensitive?: boolean }
> = {
  view_dashboard: {
    label: 'View Dashboard',
    description: 'Access the CMS overview and read permitted workspace sections.',
  },
  manage_portfolio: {
    label: 'Manage Portfolio',
    description: 'Edit Hero, About, Portfolio Projects, Paid Ads, Creative Process & Starter Guide.',
  },
  manage_videos: {
    label: 'Manage Videos',
    description: 'Create and update video showcases, thumbnails, and video uploads.',
  },
  manage_case_studies: {
    label: 'Manage Case Studies',
    description: 'Create and update Verified Case Studies and campaign performance metrics.',
  },
  manage_services: {
    label: 'Manage Services',
    description: 'Create and update Core Services and Commercial Fiverr Gigs.',
  },
  manage_testimonials: {
    label: 'Manage Testimonials',
    description: 'Add and edit verified client testimonials and ratings.',
  },
  manage_website_settings: {
    label: 'Manage Website Settings',
    description: 'Update Global Website Settings, Navigation & Footer, and SEO Metadata.',
    sensitive: true,
  },
  manage_media: {
    label: 'Manage Media',
    description: 'Upload and organize images, videos, and files in Firebase Storage & Media Library.',
  },
  manage_team_members: {
    label: 'Manage Team Members',
    description: 'Invite, assign roles/permissions, deactivate, and revoke team access.',
    sensitive: true,
  },
};

export const ROLE_METADATA: Record<
  TeamRole,
  {
    label: string;
    shortDesc: string;
    badgeClass: string;
  }
> = {
  super_admin: {
    label: 'Super Admin',
    shortDesc: 'Full dashboard control, all permissions, team management, and security settings.',
    badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-700/70',
  },
  admin: {
    label: 'Admin',
    shortDesc: 'Manage all website content & projects. Cannot modify Super Admin or team access.',
    badgeClass: 'bg-teal-950 text-teal-300 border-teal-700/70',
  },
  editor: {
    label: 'Editor',
    shortDesc: 'Add/edit permitted content & upload media. Cannot delete records or change settings.',
    badgeClass: 'bg-cyan-950 text-cyan-300 border-cyan-700/70',
  },
  viewer: {
    label: 'Viewer',
    shortDesc: 'Read-only access to permitted dashboard sections. Cannot create, edit, or delete.',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
};

export const STATUS_METADATA: Record<
  TeamStatus,
  {
    label: string;
    badgeClass: string;
  }
> = {
  pending: {
    label: 'Pending Invite',
    badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-700/60',
  },
  active: {
    label: 'Active',
    badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60',
  },
  inactive: {
    label: 'Deactivated',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-600',
  },
  revoked: {
    label: 'Revoked',
    badgeClass: 'bg-rose-950/70 text-rose-300 border-rose-700/60',
  },
};

export function getDefaultPermissionsForRole(role: TeamRole): TeamPermissions {
  switch (role) {
    case 'super_admin':
      return {
        view_dashboard: true,
        manage_portfolio: true,
        manage_videos: true,
        manage_case_studies: true,
        manage_services: true,
        manage_testimonials: true,
        manage_website_settings: true,
        manage_media: true,
        manage_team_members: true,
      };
    case 'admin':
      return {
        view_dashboard: true,
        manage_portfolio: true,
        manage_videos: true,
        manage_case_studies: true,
        manage_services: true,
        manage_testimonials: true,
        manage_website_settings: true,
        manage_media: true,
        manage_team_members: false,
      };
    case 'editor':
      return {
        view_dashboard: true,
        manage_portfolio: true,
        manage_videos: true,
        manage_case_studies: true,
        manage_services: true,
        manage_testimonials: true,
        manage_website_settings: false,
        manage_media: true,
        manage_team_members: false,
      };
    case 'viewer':
    default:
      return {
        view_dashboard: true,
        manage_portfolio: false,
        manage_videos: false,
        manage_case_studies: false,
        manage_services: false,
        manage_testimonials: false,
        manage_website_settings: false,
        manage_media: false,
        manage_team_members: false,
      };
  }
}

export function normalizePermissionsForRole(
  role: TeamRole,
  custom?: Partial<TeamPermissions>
): TeamPermissions {
  const base = getDefaultPermissionsForRole(role);
  if (role === 'super_admin') {
    return getDefaultPermissionsForRole('super_admin');
  }
  if (role === 'viewer') {
    return {
      ...getDefaultPermissionsForRole('viewer'),
      view_dashboard: custom?.view_dashboard !== false,
    };
  }
  const merged: TeamPermissions = { ...base };
  for (const key of ALL_PERMISSION_KEYS) {
    if (typeof custom?.[key] === 'boolean') {
      merged[key] = custom[key] as boolean;
    }
  }
  // Security guards: non-super-admins never get manage_team_members, and editors never get sensitive website settings
  merged.manage_team_members = false;
  if (role === 'editor') {
    merged.manage_website_settings = false;
  }
  merged.view_dashboard = true;
  return merged;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isPrimarySuperAdminEmail(email?: string | null): boolean {
  return Boolean(email && normalizeEmail(email) === PRIMARY_SUPER_ADMIN_EMAIL);
}

export function hasMemberPermission(
  member: TeamMemberItem | null,
  permission: TeamPermissionKey,
  userEmail?: string | null
): boolean {
  if (isPrimarySuperAdminEmail(userEmail)) return true;
  if (!member || member.status !== 'active') return false;
  if (member.role === 'super_admin') return true;
  return Boolean(member.permissions?.[permission]);
}

export function canMemberWrite(
  member: TeamMemberItem | null,
  userEmail?: string | null
): boolean {
  if (isPrimarySuperAdminEmail(userEmail)) return true;
  if (!member || member.status !== 'active') return false;
  return member.role !== 'viewer';
}

export function canMemberDelete(
  member: TeamMemberItem | null,
  userEmail?: string | null
): boolean {
  if (isPrimarySuperAdminEmail(userEmail)) return true;
  if (!member || member.status !== 'active') return false;
  return member.role === 'super_admin' || member.role === 'admin';
}

export function isMemberSuperAdmin(
  member: TeamMemberItem | null,
  userEmail?: string | null
): boolean {
  if (isPrimarySuperAdminEmail(userEmail)) return true;
  return Boolean(member && member.status === 'active' && member.role === 'super_admin');
}
