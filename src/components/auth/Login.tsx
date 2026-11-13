import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onContinueAsGuest }) => {
  const { signIn, signUp, signInWithGoogle, signInAsDemo, rememberMe, setRememberMe } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSocialNotice(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must accept the Terms of Service to create an account.');
        return;
      }

      setIsLoading(true);
      const res = await signUp(email, password, fullName, rememberMe);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to sign up.');
      } else {
        setSuccessMessage(res.message || 'Account created successfully!');
        if (onSuccess) onSuccess();
      }
    } else {
      setIsLoading(true);
      const res = await signIn(email, password, rememberMe);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Invalid credentials. Please check your email and password.');
      } else {
        if (onSuccess) onSuccess();
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSocialNotice(null);
    setIsLoading(true);
    const res = await signInWithGoogle();
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Google authentication failed.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleSocialClick = (provider: string) => {
    setSocialNotice(
      `${provider} OAuth is not currently enabled in your Supabase Auth dashboard. Use Google or Email/Password to sign in.`
    );
  };

  const handleDemoSignIn = () => {
    signInAsDemo();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-[#05080E] text-white flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center z-10">
        
        {/* Left Section – Authentication */}
        <div className="w-full max-w-md mx-auto py-4 sm:py-6 flex flex-col justify-center">
          
          {/* Colorful Sabevia Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
              <img
                src="/assets/sabevia_login_s_logo.png"
                alt="Sabevia Logo"
                className="w-9 h-9 object-contain"
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center tracking-tight text-white mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 text-center mb-6">
            {mode === 'login'
              ? 'Enter your email and password to access your account'
              : 'Sign up to start your technical interview preparation'}
          </p>

          {/* Login / Sign Up Toggle Pill */}
          <div className="bg-[#0B101C] p-1 rounded-xl flex items-center border border-gray-800/80 mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
                setSocialNotice(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#FACC15] to-[#84CC16] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
                setSocialNotice(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-[#FACC15] to-[#84CC16] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alerts / Error feedback */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {socialNotice && (
            <div className="mb-4 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{socialNotice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name*
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter Your Full Name..."
                  required
                  className="w-full bg-[#080C16] border border-gray-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email*
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email..."
                required
                className="w-full bg-[#080C16] border border-gray-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
              />
            </div>

            {/* Password Input with eye toggle */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Your Passwords.."
                  required
                  className="w-full bg-[#080C16] border border-gray-800 rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Confirm Password*
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Your Password.."
                  required
                  className="w-full bg-[#080C16] border border-gray-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                />
              </div>
            )}

            {/* Row: Remember Me & Forgot Password */}
            {mode === 'login' ? (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-gray-900 border-gray-700 text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            ) : (
              <div className="text-xs pt-0.5">
                <label className="flex items-start gap-2 text-gray-400 hover:text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 rounded bg-gray-900 border-gray-700 text-amber-400 focus:ring-0 cursor-pointer accent-amber-400"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </div>
            )}

            {/* Main Yellow-to-Green Gradient Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FACC15] to-[#84CC16] hover:brightness-105 active:scale-[0.99] text-black font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-black" />}
              <span>{mode === 'login' ? 'Sign in' : 'Create Account'}</span>
            </button>
          </form>

          {/* Divider: "Or" */}
          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-gray-800/90 w-full" />
            <span className="bg-[#05080E] px-3 text-xs text-gray-500 uppercase tracking-wider font-mono">
              Or
            </span>
            <div className="border-t border-gray-800/90 w-full" />
          </div>

          {/* Social Auth Buttons: Google, Facebook, Instagram, Twitter */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              title="Sign in with Google"
              className="h-11 rounded-xl bg-[#090D18] border border-gray-800 hover:border-gray-700 hover:bg-[#0E1526] transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
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
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleSocialClick('Facebook')}
              title="Sign in with Facebook"
              className="h-11 rounded-xl bg-[#090D18] border border-gray-800 hover:border-gray-700 hover:bg-[#0E1526] transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            {/* Instagram */}
            <button
              type="button"
              onClick={() => handleSocialClick('Instagram')}
              title="Sign in with Instagram"
              className="h-11 rounded-xl bg-[#090D18] border border-gray-800 hover:border-gray-700 hover:bg-[#0E1526] transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#ig-grad)"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </button>

            {/* Twitter / X */}
            <button
              type="button"
              onClick={() => handleSocialClick('Twitter / X')}
              title="Sign in with Twitter / X"
              className="h-11 rounded-xl bg-[#090D18] border border-gray-800 hover:border-gray-700 hover:bg-[#0E1526] transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              <svg className="w-4 h-4 fill-[#1DA1F2]" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
              </svg>
            </button>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-4 border-t border-gray-900/80 flex items-center justify-between text-xs text-gray-500">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span> Quick Demo Sign In (Alex Brown)
            </button>
            {onContinueAsGuest && (
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="hover:text-white transition-colors cursor-pointer underline"
              >
                Browse as Guest
              </button>
            )}
          </div>
        </div>

        {/* Right Section – Visual Panel matching reference */}
        <div className="hidden lg:flex flex-col items-center justify-center p-2">
          <div className="w-full max-w-[440px] rounded-3xl overflow-hidden border border-gray-800/80 bg-[#0B0F19] shadow-2xl relative group">
            {/* AI Cyborg Panel Image with embedded Welcome to Smart Access glass overlay */}
            <img
              src="/assets/smart_access_panel.png"
              alt="Welcome to Smart Access"
              className="w-full h-auto object-cover select-none transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
      />
    </div>
  );
};
