import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  X,
  Loader2,
  KeyRound,
  UserPlus,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onSuccess }) => {
  const {
    user,
    isAdmin,
    needsEmailVerification,
    loginWithGoogle,
    loginWithEmail,
    registerInvitedMember,
    completeEmailLinkIfPresent,
    resendVerificationEmail,
    refreshVerificationStatus,
    logout,
    authError,
    clearError,
  } = useAuth();

  const initialInviteEmail =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('invite') || ''
      : '';

  const [mode, setMode] = useState<'signin' | 'activate'>(
    initialInviteEmail ? 'activate' : 'signin'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialInviteEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  // Automatically open dashboard once RBAC verification resolves isAdmin === true
  useEffect(() => {
    if (isAdmin && !needsEmailVerification) {
      onSuccess();
    }
  }, [isAdmin, needsEmailVerification, onSuccess]);

  // Handle Firebase passwordless email invitation links if present
  useEffect(() => {
    completeEmailLinkIfPresent(initialInviteEmail || undefined).catch(() => {});
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      clearError();
      await loginWithGoogle();
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setLocalError('Please enter both your registered email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setLocalError(null);
      clearError();
      await loginWithEmail(email.trim(), password);
    } catch (err: unknown) {
      setLocalError(
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify your credentials or use authorized Google sign-in.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    if (!email.trim()) {
      setLocalError('Please enter the email address that was invited.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Please choose a strong password (at least 8 characters).');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await registerInvitedMember(email.trim(), password, name.trim() || undefined);
      setVerificationMessage(
        `Account created! A verification email was sent to ${email.trim()}. Click the link in your inbox, then press "I've Verified — Continue".`
      );
    } catch (err: unknown) {
      setLocalError(
        err instanceof Error
          ? err.message
          : 'Could not complete invite setup. If you already have an account, switch to Sign In or Continue with Google.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setLocalError('Please enter your email above to receive a password reset link.');
      return;
    }

    try {
      setIsResetting(true);
      setLocalError(null);
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to send password reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsLoading(true);
    setLocalError(null);
    try {
      const ok = await refreshVerificationStatus();
      if (!ok) {
        setLocalError('Email is still unverified. Please click the verification link in your email inbox first.');
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Could not refresh verification status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">PJ Admin CMS Control</h3>
              <p className="text-[11px] text-slate-500">Role-Based Team &amp; Admin Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close admin login"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
          {needsEmailVerification && user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>Verify Your Email to Activate Access</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Signed in as <strong>{user.email}</strong>. Server security requires email verification before activating your team role.
                </p>
              </div>

              {verificationMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{verificationMessage}</span>
                </div>
              )}

              {(localError || authError) && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{localError || authError}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleCheckVerification}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>I&apos;ve Verified — Continue</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await resendVerificationEmail();
                      setVerificationMessage('Verification link re-sent to your email inbox.');
                    } catch (err: unknown) {
                      setLocalError(err instanceof Error ? err.message : 'Failed to resend email.');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                >
                  Resend Verification Email
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Sign Out &amp; Use Another Account
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mode Switcher */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setLocalError(null);
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('activate');
                    setLocalError(null);
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    mode === 'activate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Activate Team Invite
                </button>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-xl font-bold text-slate-900">
                  {mode === 'signin' ? 'Sign In to Dashboard' : 'Complete Invited Setup'}
                </h4>
                <p className="text-xs text-slate-500">
                  {mode === 'signin'
                    ? 'Enter your authorized team or administrator credentials.'
                    : 'Invited by the Super Admin? Verify your email with Google or create your own personal password.'}
                </p>
              </div>

              {(localError || authError) && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{localError || authError}</span>
                </div>
              )}

              {resetSent && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <KeyRound className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Password reset email dispatched to {email}. Check your inbox.</span>
                </div>
              )}

              {/* Google Sign In option (instant verification) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-95 disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {mode === 'activate'
                    ? 'Activate Invite with Google'
                    : 'Continue with Google'}
                </span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold uppercase text-slate-400">
                  {mode === 'signin' ? 'Or Email & Password' : 'Or Create Personal Password'}
                </span>
              </div>

              {mode === 'signin' ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Team / Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="Enter authorized email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isResetting}
                        className="text-[11px] font-semibold text-[#10B981] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#111827] text-white font-semibold text-xs hover:bg-[#10B981] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>Verify &amp; Access Dashboard</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleActivateInvite} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Invited Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#10B981] text-white font-semibold text-xs hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>Create Account &amp; Verify Email</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
