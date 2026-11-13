import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState<string>(initialEmail);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await resetPassword(email.trim());
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to send password recovery instructions.');
    }
  };

  const handleResetState = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0A0E17] border border-gray-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleResetState}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xs p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          ✕
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              We've sent a password reset link to <span className="font-semibold text-amber-300">{email}</span>. Click the link in the email to choose a new password.
            </p>
            <button
              type="button"
              onClick={handleResetState}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FACC15] to-[#84CC16] text-black font-semibold text-xs sm:text-sm hover:opacity-95 transition-opacity"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <button
                type="button"
                onClick={handleResetState}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Enter your registered email address and we'll send you a secure link to reset your password.
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    required
                    className="w-full bg-[#070A11] border border-gray-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FACC15] to-[#84CC16] text-black font-semibold text-xs sm:text-sm hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-black" />}
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
