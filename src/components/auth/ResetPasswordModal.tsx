import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordModal: React.FC = () => {
  const { isPasswordRecoveryMode, updatePassword, dismissPasswordRecovery } = useAuth();
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isPasswordRecoveryMode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await updatePassword(newPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        dismissPasswordRecovery();
      }, 2000);
    } else {
      setError(result.error || 'Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0A0E17] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismissPasswordRecovery}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xs p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          ✕
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Updated!</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-4">
              Your password has been successfully reset. Redirecting you to the platform...
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Set New Password
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Enter your new secure password below to regain full access to your Sabevia account.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  New Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)..."
                    required
                    className="w-full bg-[#070A11] border border-gray-800 rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Confirm New Password*
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password..."
                  required
                  className="w-full bg-[#070A11] border border-gray-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FACC15] to-[#84CC16] text-black font-semibold text-xs sm:text-sm hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-black" />}
                {isLoading ? 'Updating Password...' : 'Update Password & Access App'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
