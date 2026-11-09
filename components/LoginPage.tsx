'use client';

import React, { useState } from 'react';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '@/lib/firebase';
import { ArrowRight, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userEmail: string) => void;
  onGuestAccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGuestAccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const user = await registerWithEmail(email, password);
        if (user?.email) onLoginSuccess(user.email);
      } else {
        const user = await loginWithEmail(email, password);
        if (user?.email) onLoginSuccess(user.email);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setAuthError(msg.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user?.email) {
        onLoginSuccess(user.email);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setAuthError(msg.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 flex flex-col justify-between font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar */}
      <header className="border-b border-gray-800/80 bg-[#0B0F19]/90 backdrop-blur-md py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              13
            </div>
            <span className="text-base font-semibold text-gray-100 tracking-tight">
              13-Week Cash Forecast
            </span>
          </div>

          <button
            onClick={onGuestAccess}
            className="text-xs font-medium text-gray-300 hover:text-white bg-gray-900 border border-gray-700 hover:bg-gray-800 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
          >
            Launch Forecast
          </button>
        </div>
      </header>

      {/* Main Hero & Sales Split */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Frank Kern Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>13-Week Cash Lookahead</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Stop guessing if you&apos;ll have money in 3 weeks.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
            Look, here&apos;s the deal. Most money tools look backward at what you already spent. Spreadsheets break, and linking bank passwords is a headache.
          </p>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-medium text-emerald-400">
            What you actually need is a simple 13-week lookahead so you see cash gaps weeks before they happen.
          </p>

          {/* Core Benefit Bullets */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold text-gray-100 block">Automatic Cloud Backup</strong>
                <p className="text-xs text-gray-400 mt-0.5">Your forecast data is always saved and up to date across all your devices.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold text-gray-100 block">Early Shortfall Warnings</strong>
                <p className="text-xs text-gray-400 mt-0.5">Spot low weeks early so you can adjust before bills are due.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold text-gray-100 block">Fast 5-Category Setup</strong>
                <p className="text-xs text-gray-400 mt-0.5">Income, Expenses, Liabilities, Savings, and Spend.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In / Account Form */}
        <div className="lg:col-span-5">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">
                {isSignUp ? 'Create Your Account' : 'Sign In to Your Forecast'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isSignUp ? 'Enter your details to get instant access.' : 'Welcome back! Sign in to view your 13-week projection.'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                {authError}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition cursor-pointer mb-4"
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
              <span>Continue with Google</span>
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px bg-gray-800 flex-1" />
              <span className="text-[11px] text-gray-500 uppercase tracking-wider">Or Email</span>
              <div className="h-px bg-gray-800 flex-1" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>{loading ? 'Connecting...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px bg-gray-800 flex-1" />
              <span className="text-[11px] text-gray-500 uppercase tracking-wider">Or</span>
              <div className="h-px bg-gray-800 flex-1" />
            </div>

            <button
              onClick={onGuestAccess}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 font-medium py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Continue as Offline Guest</span>
            </button>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-gray-400 hover:text-emerald-400 transition cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Frank Kern Copyright Footer */}
      <footer className="border-t border-gray-800/80 bg-[#0B0F19] py-6 px-4 text-center text-xs text-gray-500 space-y-2">
        <div className="max-w-4xl mx-auto leading-relaxed">
          <p className="font-semibold text-gray-400">
            Copyright &copy; 2026 13-Week Cash Forecast. All rights reserved.
          </p>
          <p className="mt-1 text-gray-500 text-[11px]">
            Look, do not copy our code, text, or ideas without asking—that&apos;s just uncool and illegal. This tool is built to give real people simple 13-week clarity on their cash ahead of time. Results depend on you actually putting your numbers in. No magic, no corporate fluff, just honest math.
          </p>
        </div>
      </footer>
    </div>
  );
};
