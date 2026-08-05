import React, { useState } from 'react';
import { MENTORSHIP_AREAS } from '../constants/brand';
import { supabase, isSupabaseConfigured, storeManager } from '../lib/supabase';
import { compressImage } from '../lib/imageCompressor';
import { UserProfile, UserRole } from '../types';
import { User, Calendar, Phone, CheckCircle2, HeartHandshake, Upload, Camera } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  stubUser: UserProfile;
  onCompleteOnboarding: (completeUser: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  stubUser,
  onCompleteOnboarding,
}) => {
  const [fullName, setFullName] = useState(stubUser.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(stubUser.dateOfBirth || '');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState(stubUser.phoneWhatsApp || '');
  const [role, setRole] = useState<UserRole>(stubUser.role || 'mentee');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(stubUser.interests || []);
  const [bio, setBio] = useState(stubUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(stubUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(stubUser.fullName)}&background=0B6291&color=fff`);
  const [isCompressing, setIsCompressing] = useState(false);
  const [linkedin, setLinkedin] = useState(stubUser.socialLinks?.linkedin || '');
  const [twitter, setTwitter] = useState(stubUser.socialLinks?.twitter || '');
  const [instagram, setInstagram] = useState(stubUser.socialLinks?.instagram || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // Immediately compress profile image on upload (low quality / low size)
      const compressedBase64 = await compressImage(file, {
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.6,
      });

      // Try uploading to Supabase Storage if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const fileExt = file.name.split('.').pop() || 'jpeg';
          const fileName = `${stubUser.id || Date.now()}-${Date.now()}.${fileExt}`;

          const res = await fetch(compressedBase64);
          const blob = await res.blob();

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, { contentType: blob.type, upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);

            if (publicUrlData?.publicUrl) {
              setAvatarUrl(publicUrlData.publicUrl);
              return;
            }
          }
        } catch (storageErr) {
          console.warn('Supabase storage fallback to compressed base64:', storageErr);
        }
      }

      // Fallback: Use client-side compressed Base64 string directly
      setAvatarUrl(compressedBase64);
    } catch (err) {
      console.error('Error compressing profile avatar:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const completeProfile: UserProfile = {
      ...stubUser,
      fullName: fullName.trim(),
      dateOfBirth,
      phoneWhatsApp: phoneWhatsApp.trim(),
      role,
      interests: selectedInterests,
      bio: bio.trim(),
      avatarUrl,
      status: role === 'mentor' ? 'Active Mentor' : 'Fresh Mentee',
      socialLinks: {
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
        instagram: instagram.trim(),
      },
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setSubmitting(false);
      storeManager.setCurrentUser(completeProfile);
      onCompleteOnboarding(completeProfile);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center py-6 sm:py-12 animate-fadeIn">
      <div className="relative w-full max-w-2xl my-auto bg-[#0C1836] border-2 border-[#0B6291] rounded-3xl p-5 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#0B6291] p-1 shadow-md flex items-center justify-center border border-white">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black font-['Outfit'] text-white">
            Mandatory Profile Onboarding
          </h2>
          <p className="text-xs text-slate-300 font-bold">
            Complete your MENTMINDS membership details and upload your profile photo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          {/* PROFILE PHOTO UPLOAD WITH IMMEDIATE CLIENT COMPRESSION */}
          <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-2xl">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#0B6291] shadow-md"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-[#3D781D] hover:bg-[#326317] text-white rounded-full cursor-pointer shadow-md border-2 border-white transition-transform active:scale-95">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-[#3D781D]">
                {isCompressing ? 'Compressing Profile Image...' : 'Upload Profile Picture'}
              </span>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                Uploaded images are immediately compressed to low quality for fast performance.
              </p>
            </div>
          </div>

          {/* MENTEE ROLE CONFIRMATION */}
          <div className="bg-slate-900 border-2 border-[#0B6291] rounded-2xl p-4 flex items-center gap-3 text-left">
            <User className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-black text-sm text-white">Mentee Membership Account</p>
              <p className="text-xs text-slate-300">
                Public self-registration is set for Mentees. Mentor accounts are assigned exclusively by MENTMINDS Executive Management.
              </p>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-300 mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sadiq Umar"
                className="w-full bg-slate-900 border-2 border-slate-700 focus:border-[#0B6291] rounded-xl p-3 text-sm text-white font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 mb-1 uppercase tracking-wider">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 focus:border-[#0B6291] rounded-xl p-3 text-sm text-white font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 mb-1 uppercase tracking-wider">
              Active WhatsApp Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phoneWhatsApp}
              onChange={(e) => setPhoneWhatsApp(e.target.value)}
              placeholder="e.g. +234 801 234 5678"
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-[#0B6291] rounded-xl p-3 text-sm text-white font-bold focus:outline-none"
            />
          </div>

          {/* INTERESTS / EXPERTISE */}
          <div>
            <label className="block text-xs font-black text-slate-300 mb-2 uppercase tracking-wider">
              Areas of Interest / Expertise
            </label>
            <div className="flex flex-wrap gap-2">
              {MENTORSHIP_AREAS.map((area) => {
                const isSelected = selectedInterests.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleInterest(area)}
                    className={`text-xs px-3 py-1.5 rounded-xl border-2 font-black uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'bg-[#0B6291] border-[#0B6291] text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-300" />}
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className="block text-xs font-black text-slate-300 mb-1 uppercase tracking-wider">
              Short Bio & Goals
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe your passion, career goals, or mentoring background..."
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-[#0B6291] rounded-xl p-3 text-sm text-white font-bold focus:outline-none"
            />
          </div>

          {/* SOCIAL LINKS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#0B6291] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">X / Twitter</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#0B6291] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Instagram</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#0B6291] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || isCompressing}
            className="w-full bg-[#0B6291] hover:bg-[#084b6f] text-white font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl shadow-xl transition-all border-2 border-[#0B6291]"
          >
            {submitting ? 'Saving Profile Details...' : 'Complete Profile Onboarding'}
          </button>

        </form>
      </div>
    </div>
  );
};
