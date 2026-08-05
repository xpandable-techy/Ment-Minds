import React, { useState } from 'react';
import { MENTMINDS_BRAND } from '../constants/brand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MentmindsLogo } from './MentmindsLogo';
import {
  ShieldAlert, CheckCircle2, KeyRound, Eye, EyeOff, ArrowLeftCircle, Users, BookOpen, Award, Loader2
} from 'lucide-react';

interface ResetPasswordPageProps {
  onDone: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onDone }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
      }
      setDone(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white text-[#0C1836] border border-slate-300 focus:border-[#0B6291] focus:ring-2 focus:ring-[#0B6291]/15 rounded-lg text-sm outline-none transition-all placeholder:text-slate-400';

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen grid lg:grid-cols-[42%_58%]">
        
        {/* ============ BRAND PANEL ============ */}
        <div className="relative bg-[#0B6291] text-white px-6 sm:px-10 py-8 lg:py-12 flex flex-col overflow-hidden">
          <div className="circles-wrapper opacity-30" aria-hidden="true">
            <div className="circle-ring"></div>
            <div className="circle-ring"></div>
            <div className="circle-ring"></div>
            <div className="circle-ring"></div>
          </div>

          <div className="relative z-10">
            <button onClick={onDone} className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-10 lg:mb-16">
              <ArrowLeftCircle className="w-4 h-4" />
              Back to home
            </button>

            <MentmindsLogo size="md" showText={true} />

            <h1 className="mt-8 lg:mt-12 text-2xl sm:text-3xl font-bold leading-snug max-w-md">
              Free mentorship and certification for every young person who wants to grow.
            </h1>
            <p className="mt-4 text-sm text-white/70 max-w-sm leading-relaxed">
              {MENTMINDS_BRAND.fullTitle} &middot; {MENTMINDS_BRAND.registrationNumber}
            </p>
          </div>

          {/* STAT STRIP */}
          <div className="relative z-10 mt-10 lg:mt-auto grid grid-cols-3 gap-3 pt-8 border-t border-white/15">
            <div>
              <div className="flex items-center gap-1.5 text-[#B87E13]">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1">{MENTMINDS_BRAND.stats.mentorsCount}</p>
              <p className="text-[11px] text-white/60 font-medium">Mentors</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#3D781D]">
                <BookOpen className="w-4 h-4" />
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1">{MENTMINDS_BRAND.stats.menteesCount}</p>
              <p className="text-[11px] text-white/60 font-medium">Mentees</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#E091A8]">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1">100%</p>
              <p className="text-[11px] text-white/60 font-medium">Free, always</p>
            </div>
          </div>
        </div>

        {/* ============ FORM PANEL ============ */}
        <div className="flex items-start lg:items-center justify-center px-6 sm:px-10 py-10 lg:py-12">
          <div className="w-full max-w-[420px]">
            {done ? (
              <div className="py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-[#0C1836] mb-1">Password updated</h1>
                <p className="text-sm text-slate-500 mb-6">Your password has been successfully reset. Please sign in with your new password.</p>
                <button
                  onClick={onDone}
                  className="w-full py-3 bg-[#0B6291] hover:bg-[#095176] text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#0B6291]/10 flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6 text-[#0B6291]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#0C1836]">Set a new password</h1>
                  <p className="text-sm text-slate-500 mt-1">Choose a strong password with at least 6 characters.</p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0B6291] hover:bg-[#095176] text-white font-semibold text-sm rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Updating password…</span>
                      </>
                    ) : (
                      <span>Update password</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
