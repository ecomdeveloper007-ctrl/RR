import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import type { TeamMemberItem, TeamPermissionKey } from '../types/portfolio';
import {
  canMemberDelete,
  canMemberWrite,
  getDefaultPermissionsForRole,
  hasMemberPermission,
  isMemberSuperAdmin,
  isPrimarySuperAdminEmail,
  normalizeEmail,
} from '../utils/rbac';

interface AuthContextType {
  user: User | null;
  teamMember: TeamMemberItem | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canWrite: boolean;
  canDelete: boolean;
  hasPermission: (perm: TeamPermissionKey) => boolean;
  needsEmailVerification: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerInvitedMember: (email: string, pass: string, displayName?: string) => Promise<{ verificationSent: boolean }>;
  completeEmailLinkIfPresent: (emailOverride?: string) => Promise<boolean>;
  sendInviteSignInLink: (email: string) => Promise<{ sent: boolean; message?: string }>;
  resendVerificationEmail: () => Promise<void>;
  refreshVerificationStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  teamMember: null,
  isAdmin: false,
  isSuperAdmin: false,
  canWrite: false,
  canDelete: false,
  hasPermission: () => false,
  needsEmailVerification: false,
  isLoading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerInvitedMember: async () => ({ verificationSent: false }),
  completeEmailLinkIfPresent: async () => false,
  sendInviteSignInLink: async () => ({ sent: false }),
  resendVerificationEmail: async () => {},
  refreshVerificationStatus: async () => false,
  logout: async () => {},
  authError: null,
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [teamMember, setTeamMember] = useState<TeamMemberItem | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [needsEmailVerification, setNeedsEmailVerification] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const accessLoggedUidRef = useRef<string | null>(null);

  useEffect(() => {
    let unsubMember: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (unsubMember) {
        unsubMember();
        unsubMember = null;
      }

      setUser(currentUser);

      if (!currentUser || !currentUser.email) {
        setTeamMember(null);
        setIsAdmin(false);
        setNeedsEmailVerification(false);
        accessLoggedUidRef.current = null;
        setIsLoading(false);
        return;
      }

      if (!currentUser.emailVerified) {
        setTeamMember(null);
        setIsAdmin(false);
        setNeedsEmailVerification(true);
        setIsLoading(false);
        return;
      }

      setNeedsEmailVerification(false);
      const emailLower = normalizeEmail(currentUser.email);
      const isOwner = isPrimarySuperAdminEmail(emailLower);

      const memberDocRef = doc(db, 'teamMembers', emailLower);

      unsubMember = onSnapshot(
        memberDocRef,
        async (snap) => {
          const nowIso = new Date().toISOString();

          if (!snap.exists()) {
            if (isOwner) {
              // Ensure primary owner always has a live Super Admin record in teamMembers
              const ownerRecord: TeamMemberItem = {
                uid: currentUser.uid,
                name: currentUser.displayName || 'Patricia (Owner)',
                email: emailLower,
                role: 'super_admin',
                status: 'active',
                permissions: getDefaultPermissionsForRole('super_admin'),
                invitedBy: emailLower,
                createdAt: nowIso,
                updatedAt: nowIso,
                activatedAt: nowIso,
                lastAccessAt: nowIso,
              };
              setTeamMember(ownerRecord);
              setIsAdmin(true);
              setIsLoading(false);
              try {
                await setDoc(memberDocRef, ownerRecord);
              } catch (err) {
                console.warn('Could not bootstrap primary owner team doc:', err);
              }
              return;
            }

            // User is not invited or was permanently removed
            setTeamMember(null);
            setIsAdmin(false);
            setIsLoading(false);
            setAuthError(
              'Access denied: Your email is not registered as an active team member. Please ask the Super Admin for an invitation.'
            );
            try {
              await fbSignOut(auth);
            } catch {
              // Ignore signout cleanup errors
            }
            return;
          }

          const memberData = { id: snap.id, ...(snap.data() as TeamMemberItem) };

          if (memberData.status === 'pending') {
            // Invited member just completed verified Firebase Authentication -> activate account securely
            try {
              await updateDoc(memberDocRef, {
                status: 'active',
                uid: currentUser.uid,
                activatedAt: nowIso,
                lastAccessAt: nowIso,
                updatedAt: nowIso,
                name: currentUser.displayName || memberData.name,
              });
              await addDoc(collection(db, 'auditLogs'), {
                adminEmail: emailLower,
                action: `Activated Team Account (${memberData.role})`,
                module: 'TeamManagement',
                recordId: emailLower,
                timestamp: nowIso,
              });
              accessLoggedUidRef.current = currentUser.uid;
            } catch (err) {
              console.error('Failed to activate pending invite:', err);
              setAuthError(
                'Unable to activate your team invitation. Please contact the Super Admin.'
              );
              setIsAdmin(false);
              setIsLoading(false);
            }
            return;
          }

          if (memberData.status === 'inactive' || memberData.status === 'revoked') {
            if (isOwner) {
              // Primary owner safeguard
              setTeamMember({ ...memberData, role: 'super_admin', status: 'active' });
              setIsAdmin(true);
              setIsLoading(false);
              return;
            }

            // Immediately terminate active session access if deactivated or revoked
            setTeamMember(null);
            setIsAdmin(false);
            setIsLoading(false);
            setAuthError(
              memberData.status === 'revoked'
                ? 'Your team access has been revoked by the Super Admin.'
                : 'Your team account has been deactivated by the Super Admin.'
            );
            try {
              await fbSignOut(auth);
            } catch {
              // Ignore
            }
            return;
          }

          // Status is 'active'
          setTeamMember(memberData);
          setIsAdmin(true);
          setAuthError(null);
          setIsLoading(false);

          // Record lastAccessAt once per session
          if (accessLoggedUidRef.current !== currentUser.uid) {
            accessLoggedUidRef.current = currentUser.uid;
            try {
              await updateDoc(memberDocRef, {
                lastAccessAt: nowIso,
                uid: currentUser.uid,
                updatedAt: nowIso,
              });
            } catch {
              // Non-blocking access timestamp update
            }
          }
        },
        (error) => {
          console.error('Team member auth listener error:', error);
          if (isOwner) {
            setTeamMember({
              id: emailLower,
              uid: currentUser.uid,
              name: currentUser.displayName || 'Patricia (Owner)',
              email: emailLower,
              role: 'super_admin',
              status: 'active',
              permissions: getDefaultPermissionsForRole('super_admin'),
              invitedBy: emailLower,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setIsAdmin(true);
          } else {
            setTeamMember(null);
            setIsAdmin(false);
            setAuthError('Unable to verify team permissions. Please try signing in again.');
          }
          setIsLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubMember) unsubMember();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err);
      setAuthError(err instanceof Error ? err.message : 'Google sign-in failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setAuthError(null);
      setIsLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (!cred.user.emailVerified) {
        setNeedsEmailVerification(true);
        throw new Error(
          'Your email address is not verified yet. Check your inbox for the verification link or sign in with Google.'
        );
      }
    } catch (err: unknown) {
      console.error('Email sign in error:', err);
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerInvitedMember = async (
    email: string,
    pass: string,
    displayName?: string
  ): Promise<{ verificationSent: boolean }> => {
    try {
      setAuthError(null);
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (displayName?.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      await sendEmailVerification(cred.user);
      setNeedsEmailVerification(true);
      return { verificationSent: true };
    } catch (err: unknown) {
      console.error('Invited account setup error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to create team account';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendInviteSignInLink = async (
    email: string
  ): Promise<{ sent: boolean; message?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const actionCodeSettings = {
        url: `${window.location.origin}/?invite=${encodeURIComponent(cleanEmail)}#pj-control`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
      return { sent: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { sent: false, message: msg };
    }
  };

  const completeEmailLinkIfPresent = async (emailOverride?: string): Promise<boolean> => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return false;
    const params = new URLSearchParams(window.location.search);
    const inviteEmail = emailOverride || params.get('invite') || '';
    if (!inviteEmail) return false;
    try {
      setIsLoading(true);
      await signInWithEmailLink(auth, inviteEmail.trim().toLowerCase(), window.location.href);
      return true;
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Email invitation link could not be verified.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error('No active user session found.');
    await sendEmailVerification(auth.currentUser);
  };

  const refreshVerificationStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    const verified = Boolean(auth.currentUser.emailVerified);
    setNeedsEmailVerification(!verified);
    if (verified) {
      // Trigger snapshot re-evaluation by forcing token refresh state
      setUser({ ...auth.currentUser } as User);
    }
    return verified;
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setIsAdmin(false);
      setTeamMember(null);
      setNeedsEmailVerification(false);
      setUser(null);
      accessLoggedUidRef.current = null;
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  };

  const clearError = () => setAuthError(null);

  const isSuperAdmin = isMemberSuperAdmin(teamMember, user?.email);
  const canWrite = canMemberWrite(teamMember, user?.email);
  const canDelete = canMemberDelete(teamMember, user?.email);
  const hasPermission = (perm: TeamPermissionKey) =>
    hasMemberPermission(teamMember, perm, user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        teamMember,
        isAdmin,
        isSuperAdmin,
        canWrite,
        canDelete,
        hasPermission,
        needsEmailVerification,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        registerInvitedMember,
        completeEmailLinkIfPresent,
        sendInviteSignInLink,
        resendVerificationEmail,
        refreshVerificationStatus,
        logout,
        authError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
