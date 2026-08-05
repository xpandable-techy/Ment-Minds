import React, { useState } from 'react';
import { MENTORSHIP_AREAS } from '../constants/brand';
import { supabase, isSupabaseConfigured, uploadAvatar, storeManager } from '../lib/supabase';
import { compressImage } from '../lib/imageCompressor';
import { UserProfile } from '../types';
import { MentmindsLogo } from './MentmindsLogo';
import { ShieldAlert, Eye, EyeOff, Upload, Camera, CheckCircle2 } from 'lucide-react';

interface CompleteMentorProfilePageProps {
  currentUser: UserProfile;
  onComplete: (updated: UserProfile) => void;
}

export const CompleteMentorProfilePage: React.FC<CompleteMentorProfilePageProps> = ({ currentUser, onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [phoneWhatsApp, setPhoneWhatsApp] = useState(currentUser.phoneWhatsApp || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatarUrl || '');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
    if (!phoneWhatsApp.trim()) return setErrorMsg('Please add a WhatsApp phone number.');
    if (!avatarFile && !avatarPreview) return setErrorMsg('Please upload a profile photo.');
    if (interests.length === 0) return setErrorMsg('Please select at least one area of expertise.');

    setLoading(true);
    try {
      let finalAvatarUrl = avatarPreview;

      if (isSupabaseConfigured && supabase) {
        // Set their own password — this is the whole point of this screen;
        // nobody (including the admin who invited them) ever set or saw it.
        const { error: pwError } = await supabase.auth.updateUser({ password });
        if (pwError) {
          setErrorMsg(pwError.message);
          setLoading(false);
          return;
        }

        if (avatarFile) {
          const uploaded = await uploadAvatar(avatarFile, currentUser.id);
          if (uploaded) {
            finalAvatarUrl = uploaded;
          } else {
            finalAvatarUrl = await compressImage(avatarFile, { maxWidth: 360, maxHeight: 360, quality: 0.7 });
          }
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone_whatsapp: phoneWhatsApp.trim(),
            bio: bio.trim(),
            interests,
            avatar_url: finalAvatarUrl,
          })
          .eq('id', currentUser.id);

        if (profileError) {
          setErrorMsg(profileError.message);
          setLoading(false);
          return;
        }

        await supabase.auth.updateUser({ data: { avatar_url: finalAvatarUrl } });
      } else if (avatarFile) {
        finalAvatarUrl = await compressImage(avatarFile, { maxWidth: 360, maxHeight: 360, quality: 0.7 });
      }

      const updated: UserProfile = {
        ...currentUser,
        phoneWhatsApp: phoneWhatsApp.trim(),
        bio: bio.trim(),
        interests,
        avatarUrl: finalAvatarUrl,
      };
      storeManager.setCurrentUser(updated);

      // Clean the invite token out of the URL now that it's been used.
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', window.location.pathname);
      }

      onComplete(updated);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white text-[#0C1836] border border-slate-300 focus:border-[#0B6291] focus:ring-2 focus:ring-[#0B6291]/15 rounded-lg text-sm outline-none transition-all placeholder:text-slate-400';

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen grid lg:grid-cols-[42%_58%] animate-fadeIn">
        {/* BRAND PANEL */}
        <div className="relative bg-[#0B6291] text-white px-6 sm:px-10 py-8 lg:py-12 flex flex-col overflow-hidden">
          <div className="circles-wrapper opacity-30" aria-hidden="true">
            <div className="circle-ring"></div>
            <div className="circle-ring"></div>
            <div className="circle-ring"></div>
            <div className="circle-ring"></div>
          </div>
          <div className="relative z-10">
            <MentmindsLogo size="md" showText={true} />
            <h1 className="mt-8 lg:mt-12 text-2xl sm:text-3xl font-bold leading-snug max-w-md">
              Welcome to MentMinds, {currentUser.fullName.split(' ')[0]}.
            </h1>
            <p className="mt-4 text-sm text-white/70 max-w-sm leading-relaxed">
              You've been invited as a mentor. Set your password and finish your profile below.
              This is the one time you'll set a password — nobody else at MentMinds, including
              whoever invited you, can see or set it for you.
            </p>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="flex items-start lg:items-center justify-center px-6 sm:px-10 py-10 lg:py-12">
          <div className="w-full max-w-[440px]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0C1836]">Complete your mentor profile</h1>
              <p className="text-sm text-slate-500 mt-1">Signed in as {currentUser.email}</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">Set your password</span>
                <div className="relative mb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle password visibility">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">Profile photo (required)</span>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center shrink-0 ${avatarPreview ? 'border-[#0B6291]' : 'border-dashed border-slate-300 bg-slate-50'}`}>
                    {avatarPreview ? <img loading="lazy" src={avatarPreview} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="w-5 h-5 text-slate-400" />}
                  </div>
                  <label className="cursor-pointer bg-white border border-slate-300 hover:border-[#0B6291] text-[#0C1836] font-medium text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{avatarPreview ? 'Change photo' : 'Upload photo'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              </div>

              <input type="tel" required value={phoneWhatsApp} onChange={(e) => setPhoneWhatsApp(e.target.value)} placeholder="WhatsApp phone (+234...)" className={inputClass} />

              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio — your background and what you mentor on" rows={3} className={inputClass} />

              <div>
                <span className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wide">Areas of expertise</span>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  {MENTORSHIP_AREAS.map((area) => {
                    const isSel = interests.includes(area);
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

              <button type="submit" disabled={loading} className="w-full py-3 bg-[#0C1836] hover:bg-[#0C1836]/90 text-white font-semibold text-sm rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading ? 'Setting up your account…' : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finish and go to my dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
