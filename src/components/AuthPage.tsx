import React, { useState } from 'react';
import { MENTMINDS_BRAND, MENTORSHIP_AREAS } from '../constants/brand';
import { supabase, storeManager, isSupabaseConfigured, generateUUID, uploadAvatar, authHelpers } from '../lib/supabase';
import { compressImage } from '../lib/imageCompressor';
import { UserProfile } from '../types';
import { MentmindsLogo } from './MentmindsLogo';
import Animate from './Animate';
import {
  ShieldAlert, CheckCircle2, Upload, Camera, ArrowRight, ArrowLeft, ArrowLeftCircle, Mail,
  Eye, EyeOff, Users, BookOpen, Award, Loader2,
} from 'lucide-react';

interface AuthPageProps {
  onClose: () => void;
  onSuccessLogin: (user: UserProfile, needsOnboarding: boolean) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'check-email';

export const AuthPage: React.FC<AuthPageProps> = ({ onClose, onSuccessLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(() => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      if (search.get('action') === 'register' || search.get('role') === 'mentor') {
        return 'signup';
      }
    }
    return 'login';
  });

  const [requestedRole, setRequestedRole] = useState<'mentor' | 'mentee'>(() => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      if (search.get('role') === 'mentor' || search.get('action') === 'register') {
        return 'mentor';
      }
    }
    return 'mentee';
  });

  // Sign Up 3-step state (1: Credentials, 2: Personal Info, 3: Photo & Bio)
  const [signupSlide, setSignupSlide] = useState<1 | 2 | 3>(1);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setSignupSlide(1);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrorMsg('');
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleNextSlide = () => {
    setErrorMsg('');
    if (signupSlide === 1) {
      if (!fullName.trim()) return setErrorMsg('Please enter your full name.');
      if (!email.trim() || !email.includes('@')) return setErrorMsg('Please enter a valid email address.');
      if (!password || password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
      if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
      setSignupSlide(2);
    } else if (signupSlide === 2) {
      if (!dateOfBirth) return setErrorMsg('Please select your date of birth.');
      if (!phoneWhatsApp.trim()) return setErrorMsg('Please enter your WhatsApp phone number.');
      if (selectedInterests.length === 0) return setErrorMsg('Please select at least one area of interest.');
      setSignupSlide(3);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // A profile photo and a complete form are required before an account
    // (and its confirmation email) gets created at all.
    if (authMode === 'signup' && signupSlide === 3) {
      if (!avatarFile) {
        setErrorMsg('Please upload a profile photo to finish creating your account.');
        return;
      }
      if (!fullName.trim() || !email.trim() || !dateOfBirth || !phoneWhatsApp.trim() || selectedInterests.length === 0) {
        setErrorMsg('Please complete every step before submitting.');
        return;
      }
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // ---------- FORGOT PASSWORD ----------
      if (authMode === 'forgot') {
        if (!cleanEmail) {
          setErrorMsg('Please enter your email address.');
          setLoading(false);
          return;
        }
        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
            redirectTo: window.location.origin,
          });
          if (error) throw error;
        }
        setSuccessMsg('If that email has an account, a reset link is on its way.');
        setLoading(false);
        return;
      }

      // ---------- LOGIN ----------
      if (authMode === 'login') {
        if (!cleanEmail || !cleanPassword) {
          setErrorMsg('Please enter your email and password.');
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });

          if (error) {
            if (error.message.toLowerCase().includes('email not confirmed')) {
              setErrorMsg('Please confirm your email first. Check your inbox for the confirmation link.');
            } else {
              setErrorMsg('Incorrect email or password.');
            }
            setLoading(false);
            return;
          }

          if (data?.session) {
            const profile = await authHelpers.fetchProfile(data.user!.id);
            const userToSet: UserProfile = profile || {
              id: data.user!.id,
              email: cleanEmail,
              fullName: data.user!.user_metadata?.full_name || cleanEmail.split('@')[0],
              dateOfBirth: '',
              phoneWhatsApp: '',
              role: (data.user!.user_metadata?.role as any) || 'mentee',
              interests: [],
              bio: '',
              avatarUrl: data.user!.user_metadata?.avatar_url || '',
              socialLinks: {},
              createdAt: new Date().toISOString(),
            };
            storeManager.setCurrentUser(userToSet);
            onSuccessLogin(userToSet, false);
            setLoading(false);
            return;
          }
        }

        // Local preview fallback (no Supabase configured)
        if (/^(ceo|sec|cto)@mentminds\.org$/.test(cleanEmail)) {
          setErrorMsg('Leadership accounts require Supabase authentication. Configure the Supabase project before signing in.');
          setLoading(false);
          return;
        }

        const allProfiles = storeManager.getAllProfiles();
        const matched = allProfiles.find((p) => p.email.toLowerCase() === cleanEmail);
        if (matched) {
          storeManager.setCurrentUser(matched);
          onSuccessLogin(matched, false);
        } else {
          const isMentor = cleanEmail.includes('mentor') || ['salmabizi@gmail.com', 'abdulmalik.punsmith@gmail.com', 'idrisabba846@gmail.com', 'sajudamahmud@gmail.com', 'sumayyaabdullahi1010@gmail.com', 'saeedameer406@gmail.com', 'shettimahadiza88@gmail.com', 'elshams9794@gmail.com'].includes(cleanEmail);
          const isAdmin = cleanEmail.includes('admin') || cleanEmail.includes('ceo') || cleanEmail.includes('cto');
          const fallbackRole = isAdmin ? 'admin' : (isMentor ? 'mentor' : 'mentee');
          const localUser: UserProfile = {
            id: generateUUID(),
            email: cleanEmail,
            fullName: cleanEmail.split('@')[0],
            dateOfBirth: '',
            phoneWhatsApp: '',
            role: fallbackRole,
            status: fallbackRole === 'admin' ? 'Super Admin' : (fallbackRole === 'mentor' ? 'Active Mentor' : 'Fresh Mentee'),
            interests: [],
            bio: '',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail.split('@')[0])}&background=0B6291&color=fff`,
            socialLinks: {},
            createdAt: new Date().toISOString(),
          };
          storeManager.setCurrentUser(localUser);
          storeManager.upsertProfile(localUser);
          onSuccessLogin(localUser, false);
        }
        setLoading(false);
        return;
      }

      // ---------- SIGN UP ----------
      if (authMode === 'signup') {
        const displayFullName = fullName.trim() || cleanEmail.split('@')[0];
        let finalAvatarUrl = '';
        let userId = generateUUID();

        const assignedRole: 'mentor' | 'mentee' = requestedRole;
        const assignedStatus = requestedRole === 'mentor' ? 'Active Mentor' : 'Fresh Mentee';

        let compressedAvatar = '';
        if (avatarFile) {
          try {
            compressedAvatar = await compressImage(avatarFile, { maxWidth: 360, maxHeight: 360, quality: 0.7 });
          } catch (e) {
            console.warn('Avatar compression warning:', e);
          }
        }

        const placeholderAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayFullName)}&background=${requestedRole === 'mentor' ? '3D781D' : '0B6291'}&color=fff`;

        if (isSupabaseConfigured && supabase) {
          // Send lightweight user_metadata with assignedRole ('mentor' or 'mentee')
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
            options: {
              emailRedirectTo: window.location.origin,
              data: {
                full_name: displayFullName,
                role: assignedRole,
                date_of_birth: dateOfBirth || null,
                phone_whatsapp: phoneWhatsApp.trim() || null,
                interests: selectedInterests,
                bio: bio.trim() || null,
                social_links: { linkedin: linkedin.trim(), instagram: instagram.trim() },
                avatar_url: placeholderAvatarUrl,
              },
            },
          });

          if (error) {
            if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
              setErrorMsg('An account with this email already exists. Please sign in instead.');
            } else {
              setErrorMsg(error.message);
            }
            setLoading(false);
            return;
          }

          finalAvatarUrl = compressedAvatar || placeholderAvatarUrl;

          if (data?.user) {
            userId = data.user.id;

            // Explicitly upsert profile into public.profiles database table in Supabase
            if (isSupabaseConfigured && supabase) {
              try {
                await supabase.from('profiles').upsert({
                  id: userId,
                  email: cleanEmail,
                  full_name: displayFullName,
                  role: assignedRole,
                  status: assignedStatus,
                  interests: selectedInterests,
                  bio: bio.trim() || null,
                  avatar_url: finalAvatarUrl,
                });
              } catch (dbErr) {
                console.warn('Database upsert notice:', dbErr);
              }
            }

            // Upload photo to Supabase storage asynchronously
            if (avatarFile && data.session) {
              try {
                const uploaded = await uploadAvatar(avatarFile, userId);
                if (uploaded) {
                  finalAvatarUrl = uploaded;
                  if (isSupabaseConfigured && supabase) {
                    await supabase.from('profiles').update({ avatar_url: uploaded }).eq('id', userId);
                    await supabase.auth.updateUser({ data: { avatar_url: uploaded } });
                  }
                }
              } catch (upErr) {
                console.warn('Avatar upload notice:', upErr);
              }
            }
          }

          if (!data?.session) {
            setAuthMode('check-email');
            setLoading(false);
            return;
          }

          const stub: UserProfile = {
            id: userId,
            email: cleanEmail,
            fullName: displayFullName,
            dateOfBirth,
            phoneWhatsApp: phoneWhatsApp.trim(),
            role: assignedRole,
            status: assignedStatus,
            interests: selectedInterests,
            bio: bio.trim(),
            avatarUrl: finalAvatarUrl,
            socialLinks: { linkedin: linkedin.trim(), instagram: instagram.trim() },
            createdAt: new Date().toISOString(),
          };
          storeManager.upsertProfile(stub);
          onSuccessLogin(stub, false);
          setLoading(false);
          return;
        }

        // Local preview fallback (no Supabase configured)
        const newProfile: UserProfile = {
          id: userId,
          email: cleanEmail,
          fullName: displayFullName,
          dateOfBirth,
          phoneWhatsApp: phoneWhatsApp.trim(),
          role: assignedRole,
          status: assignedStatus,
          interests: selectedInterests,
          bio: bio.trim(),
          avatarUrl: compressedAvatar || avatarPreview || placeholderAvatarUrl,
          socialLinks: { linkedin: linkedin.trim(), instagram: instagram.trim() },
          createdAt: new Date().toISOString(),
        };
        storeManager.setCurrentUser(newProfile);
        storeManager.upsertProfile(newProfile);
        onSuccessLogin(newProfile, false);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
        setErrorMsg('Network error connecting to Supabase auth server. Please check your connection and try again.');
      } else {
        setErrorMsg(msg || 'An error occurred during account creation.');
      }
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);
    await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase() });
    setSuccessMsg('Confirmation email sent again.');
    setLoading(false);
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
            <button onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-10 lg:mb-16">
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

          {/* Stat strip, in the spirit of a bold goal statement */}
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

            {authMode === 'check-email' ? (
              <div className="py-4">
                <div className="w-12 h-12 rounded-full bg-[#0B6291]/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-[#0B6291]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0C1836] mb-2">Confirm your email</h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We sent a confirmation link to <span className="font-semibold text-[#0C1836]">{email}</span>.
                  Open it to activate your account, then come back and sign in.
                </p>
                <button
                  onClick={resendConfirmation}
                  disabled={loading}
                  className="mt-4 text-sm font-semibold text-[#0B6291] hover:underline disabled:opacity-50"
                >
                  Resend confirmation email
                </button>
                <div className="mt-8">
                  <button
                    onClick={() => { setAuthMode('login'); resetForm(); }}
                    className="w-full py-3 bg-[#0C1836] text-white font-semibold text-sm rounded-lg hover:bg-[#0C1836]/90 transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Tabs (Sign in / Create account) */}
                {authMode !== 'forgot' && (
                  <div className="flex items-center gap-6 border-b border-slate-200 mb-8">
                    <button
                      onClick={() => { setAuthMode('login'); resetForm(); }}
                      className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                        authMode === 'login' ? 'border-[#0B6291] text-[#0C1836]' : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Sign in
                    </button>
                    {/* CREATE ACCOUNT — disabled until registrations reopen */}
                    <span
                      title="Registrations are currently closed"
                      className="pb-3 text-sm font-semibold border-b-2 border-transparent text-slate-300 cursor-not-allowed select-none opacity-50"
                    >
                      Create account
                    </span>
                  </div>
                )}

                {/* ── REGISTRATION CLOSED NOTICE (signup & forgot) ── */}
                {(authMode === 'signup' || authMode === 'forgot') && (
                  <div className="mb-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 space-y-3 text-center">
                    <p className="text-lg font-black text-amber-800">🚫 Registrations Temporarily Closed</p>
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                      We are <strong>not currently accepting new members or mentors</strong>. Stay connected — join our WhatsApp community to be notified the moment registrations reopen!
                    </p>
                    <a
                      href="https://wa.me/2349038241892?text=Hello%20MENTMINDS!%20I%20want%20to%20join%20the%20community%20and%20be%20notified%20when%20registrations%20reopen."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Join Our WhatsApp Community
                    </a>
                    <button
                      onClick={() => { setAuthMode('login'); resetForm(); }}
                      className="block w-full text-xs text-slate-500 hover:text-[#0B6291] font-semibold mt-1 underline underline-offset-2"
                    >
                      Back to Sign In
                    </button>
                  </div>
                )}

                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-[#0C1836]">
                    {authMode === 'login' && 'Welcome back'}
                    {authMode === 'signup' && 'Create your account'}
                    {authMode === 'forgot' && 'Reset your password'}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {authMode === 'login' && 'Sign in to your account.'}
                    {authMode === 'signup' && `Step ${signupSlide} of 3`}
                    {authMode === 'forgot' && "We'll email you a link to set a new password."}
                  </p>
                </div>

                {authMode === 'signup' && (
                  <div className="flex gap-1.5 mb-6">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className={`h-1 flex-1 rounded-full ${n <= signupSlide ? 'bg-[#0B6291]' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className={authMode === 'signup' || authMode === 'forgot' ? 'opacity-30 pointer-events-none select-none' : ''}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <Animate variant="fade">
                  {/* LOGIN / FORGOT / SIGNUP SLIDE 1 */}
                  {(authMode === 'login' || authMode === 'forgot' || (authMode === 'signup' && signupSlide === 1)) && (
                    <>
                      {authMode === 'signup' && (
                        <>
                          <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Role
                            </label>
                            <select
                              value={requestedRole}
                              onChange={(e) => setRequestedRole(e.target.value as 'mentee' | 'mentor')}
                              className={inputClass}
                            >
                              <option value="mentee">Mentee</option>
                              <option value="mentor">Mentor</option>
                            </select>
                          </div>
                          <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className={inputClass} />
                        </>
                      )}
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputClass} />

                      {authMode !== 'forgot' && (
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
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
                      )}

                      {authMode === 'signup' && (
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
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
                      )}
                    </>
                  )}

                  {/* SIGNUP SLIDE 2: PERSONAL & CONTACT */}
                  {authMode === 'signup' && signupSlide === 2 && (
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-xs font-medium text-slate-500 mb-1.5 block">Date of birth</span>
                        <input type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
                      </label>
                      <input type="tel" required value={phoneWhatsApp} onChange={(e) => setPhoneWhatsApp(e.target.value)} placeholder="WhatsApp phone (+234...)" className={inputClass} />
                      <div>
                        <span className="text-xs font-medium text-slate-500 mb-2 block">Areas of interest</span>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          {MENTORSHIP_AREAS.map((area) => {
                            const isSel = selectedInterests.includes(area);
                            return (
                              <button
                                type="button"
                                key={area}
                                onClick={() => toggleInterest(area)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                                  isSel ? 'bg-[#0B6291] text-white border-[#0B6291]' : 'bg-white text-slate-600 border-slate-300 hover:border-[#0B6291]'
                                }`}
                              >
                                {area}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SIGNUP SLIDE 3: PHOTO & BIO */}
                  {authMode === 'signup' && signupSlide === 3 && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-medium text-slate-500 mb-2 block">Profile photo (required)</span>
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center shrink-0 ${avatarPreview ? 'border-[#0B6291]' : 'border-dashed border-slate-300 bg-slate-50'}`}>
                            {avatarPreview ? <img loading="lazy" src={avatarPreview} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="w-5 h-5 text-slate-400" />}
                          </div>
                          <label className="cursor-pointer bg-white border border-slate-300 hover:border-[#0B6291] text-[#0C1836] font-medium text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{avatarPreview ? 'Change photo' : 'Upload photo'}</span>
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio or learning goal" rows={3} className={inputClass} />
                      <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn profile (optional)" className={inputClass} />
                      <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram handle (optional)" className={inputClass} />
                    </div>
                  )}

                  {/* BUTTON CONTROLS */}
                  <div className="pt-1">
                    {authMode === 'signup' ? (
                      <div className="flex gap-2">
                        {signupSlide > 1 && (
                          <button type="button" onClick={() => setSignupSlide((signupSlide - 1) as 1 | 2)} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#0C1836] font-semibold text-sm rounded-lg flex items-center gap-1 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                        )}
                        {signupSlide < 3 ? (
                          <button type="button" onClick={handleNextSlide} className="flex-1 py-3 bg-[#0B6291] hover:bg-[#095176] text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#0C1836] hover:bg-[#0C1836]/90 text-white font-semibold text-sm rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                <span>Creating account…</span>
                              </>
                            ) : (
                              'Complete sign up'
                            )}
                          </button>
                        )}
                      </div>
                    ) : (
                      <button type="submit" disabled={loading} className="w-full py-3 bg-[#0B6291] hover:bg-[#095176] text-white font-semibold text-sm rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>{authMode === 'login' ? 'Signing in…' : 'Sending reset link…'}</span>
                          </>
                        ) : (
                          authMode === 'login' ? 'Sign in' : 'Send reset link'
                        )}
                      </button>
                    )}
                  </div>

                  {/* FOOTER LINKS */}
                  <div className="flex items-center justify-between text-sm pt-1">
                    {authMode === 'login' && (
                      <span
                        title="Password reset is currently unavailable"
                        className="text-slate-300 font-medium cursor-not-allowed line-through opacity-50 select-none"
                      >
                        Forgot password?
                      </span>
                    )}
                    {authMode === 'forgot' && (
                      <button type="button" onClick={() => { setAuthMode('login'); resetForm(); }} className="text-[#0B6291] hover:underline font-semibold mx-auto">
                        Back to sign in
                      </button>
                    )}
                  </div>
                  </Animate>
                </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
