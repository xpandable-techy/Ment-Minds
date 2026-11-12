import React from 'react';
import { X, GraduationCap, Award, CheckCircle2, Send, Home } from 'lucide-react';
import { UserProfile } from '../types';
import { SocialIcon } from './SocialIcons';

interface MentorProfileModalProps {
  isOpen: boolean;
  mentor: UserProfile | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onRequestMentorship: (mentor: UserProfile) => void;
  onGoHome?: () => void;
}

export const MentorProfileModal: React.FC<MentorProfileModalProps> = ({
  isOpen,
  mentor,
  currentUser,
  onClose,
  onRequestMentorship,
  onGoHome,
}) => {
  if (!isOpen || !mentor) return null;

  const isMentee = currentUser?.role === 'mentee';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center py-6 sm:py-12 animate-fadeIn">
      <div className="relative w-full max-w-3xl my-auto bg-white border-2 border-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* TOP BAR */}
        <div className="bg-[#0C1836] text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#B87E13]">
              Mentor Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SPLIT CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-slate-200 overflow-y-auto">

          {/* LEFT COLUMN: PROFILE CARD */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-slate-50 flex flex-col items-center text-center justify-between space-y-6">
            <div className="w-full flex flex-col items-center">

              {/* AVATAR */}
              <div className="relative mb-4">
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.fullName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#0B6291] shadow-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.fullName)}&background=0B6291&color=fff&size=112`;
                  }}
                />
                <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Mentor">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              {/* NAME & SPECIALTY */}
              <h3 className="text-xl sm:text-2xl font-black text-[#0C1836] font-['Outfit']">
                {mentor.fullName}
              </h3>
              <p className="text-xs font-black uppercase tracking-wider text-[#0B6291] mt-1">
                {mentor.expertise?.[0] || 'Verified Mentor'}
              </p>

              {/* SOCIAL ICONS */}
              <div className="flex items-center justify-center gap-2.5 my-3">
                <SocialIcon platform="linkedin" url={mentor.socialLinks?.linkedin || 'https://linkedin.com'} size="sm" />
                <SocialIcon platform="twitter" url={mentor.socialLinks?.twitter || 'https://x.com'} size="sm" />
                <SocialIcon platform="instagram" url={mentor.socialLinks?.instagram || 'https://instagram.com/ment.minds'} size="sm" />
                <SocialIcon platform="whatsapp" url={`https://wa.me/${(mentor.phoneWhatsApp || '').replace(/[^0-9]/g, '')}`} size="sm" />
              </div>

              {/* BIO */}
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm">
                {mentor.bio}
              </p>

              {/* EXPERTISE BADGES */}
              <div className="w-full mt-4 text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                  Key Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(mentor.expertise || mentor.interests).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-black uppercase tracking-wider bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="w-full space-y-2.5 pt-4 border-t border-slate-200">
              {isMentee ? (
                <button
                  onClick={() => {
                    onClose();
                    onRequestMentorship(mentor);
                  }}
                  className="w-full bg-[#0B6291] hover:bg-[#084b6f] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 border-2 border-[#0B6291]"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Mentorship</span>
                </button>
              ) : currentUser ? (
                <div className="text-[11px] font-bold text-slate-500 bg-slate-200/70 p-2.5 rounded-xl text-center">
                  Logged in as {currentUser.role.toUpperCase()}
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onRequestMentorship(mentor);
                  }}
                  className="w-full bg-[#0C1836] hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all border-2 border-slate-900"
                >
                  <Send className="w-4 h-4" />
                  <span>Sign In to Request Mentorship</span>
                </button>
              )}

              {/* HOME BUTTON */}
              <button
                onClick={() => { onClose(); onGoHome?.(); }}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl border-2 border-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4 text-[#0B6291]" />
                <span>Home</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: MASTERCLASSES ONLY */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">

            <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-3">
              <GraduationCap className="w-5 h-5 text-[#B87E13]" />
              <h4 className="text-lg font-black text-[#0C1836] font-['Outfit']">
                Mentorship &amp; Masterclasses
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(mentor.coursesTaught || [
                'Youth Capacity Building',
                'Public Speaking & Advocacy',
                'Leadership Development',
                'Community Storytelling',
              ]).map((course, idx) => (
                <div key={idx} className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-start gap-2 shadow-sm">
                  <Award className="w-4 h-4 text-[#B87E13] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-[#0C1836]">{course}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MENTMINDS Masterclass</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTACT INFO */}
            <div className="bg-[#0C1836] text-white p-4 rounded-2xl text-xs space-y-2 shadow-md border border-[#0B6291]/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#B87E13] mb-1">
                Direct Contact
              </p>
              <div className="flex items-center gap-2 font-bold text-slate-200 truncate">
                <span className="text-[#0B6291] shrink-0 font-extrabold">Email:</span>
                <a href={`mailto:${mentor.email}`} className="hover:underline text-white truncate">
                  {mentor.email}
                </a>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="text-[#3D781D] shrink-0 font-extrabold">WhatsApp:</span>
                <a
                  href={`https://wa.me/${(mentor.phoneWhatsApp || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-emerald-300 font-mono"
                >
                  {mentor.phoneWhatsApp || 'Available via Dashboard'}
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
