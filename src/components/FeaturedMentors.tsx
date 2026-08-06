import React, { useEffect, useMemo, useState } from 'react';
import { UserProfile } from '../types';
import { CheckCircle2, User, Eye } from 'lucide-react';
import { MentorProfileModal } from './MentorProfileModal';
import { SocialIcon } from './SocialIcons';

interface FeaturedMentorsProps {
  mentors: UserProfile[];
  currentUser: UserProfile | null;
  onRequestMentor: (mentor: UserProfile) => void;
  onOpenAuthModal: () => void;
}

export const FeaturedMentors: React.FC<FeaturedMentorsProps> = ({
  mentors,
  currentUser,
  onRequestMentor,
  onOpenAuthModal,
}) => {
  const [activeModalMentor, setActiveModalMentor] = useState<UserProfile | null>(null);
  const [rotationStep, setRotationStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRotationStep((prev) => prev + 1);
    }, 10000);
    return () => window.clearInterval(interval);
  }, []);

  // Rotate a batch of 4 featured mentors every 10 seconds.
  const displayedMentors = useMemo(() => {
    if (!mentors || mentors.length === 0) return [];

    // Deduplicate mentors by ID / Email safely
    const uniqueMentors = Array.from(
      new Map(mentors.map((m) => [m.id || (m.email ? m.email.toLowerCase() : 'unknown'), m])).values()
    );

    const BATCH_SIZE = 4;
    if (uniqueMentors.length <= BATCH_SIZE) {
      return uniqueMentors;
    }

    const ordered = [...uniqueMentors].sort((a, b) => (a.id || '').localeCompare(b.id || ''));
    const start = (rotationStep * BATCH_SIZE) % ordered.length;

    const slice: UserProfile[] = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      slice.push(ordered[(start + i) % ordered.length]);
    }
    return slice;
  }, [mentors, rotationStep]);

  return (
    <section id="mentors" className="py-20 bg-white text-[#0C1836] border-b-4 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-1 bg-[#B87E13]"></div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#B87E13]">
                Rotating Mentor Spotlight (4 Mentors / 10 seconds)
              </h4>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#0C1836] tracking-tight mt-1">
              Featured Youth Mentors
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium max-w-2xl">
              Next four after 10 secs.
            </p>
          </div>
        </div>

        {/* MENTORS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedMentors.length === 0 ? (
            <div className="col-span-full bg-[#F8FAFC] border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center space-y-3">
              <User className="w-12 h-12 text-[#0B6291] mx-auto" />
              <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836]">No Registered Mentors Yet</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                Be the first verified mentor to join MENTMINDS! Create an account to guide youth and lead weekly masterclasses.
              </p>
              <button
                onClick={onOpenAuthModal}
                className="bg-[#0B6291] hover:bg-[#084b6f] text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl inline-block mt-2 shadow-md border-2 border-[#0B6291]"
              >
                Register as Mentor
              </button>
            </div>
          ) : (
            displayedMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-[#F8FAFC] border-2 border-slate-900 border-t-8 border-t-[#0B6291] rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(12,24,54,0.08)] hover:shadow-[8px_8px_0px_0px_rgba(11,98,145,0.25)] flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* AVATAR & STATUS */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={mentor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.fullName)}&background=0B6291&color=fff`}
                      alt={mentor.fullName}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-[#0B6291]/20 group-hover:ring-[#0B6291] transition-all shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-black text-base text-[#0C1836] font-['Outfit'] leading-tight truncate">
                        {mentor.fullName}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#3D781D] bg-[#3D781D]/10 px-2.5 py-0.5 rounded-full mt-1">
                        <CheckCircle2 className="w-3 h-3 fill-emerald-600 text-white shrink-0" />
                        <span className="truncate">{mentor.status || 'Verified Mentor'}</span>
                      </span>
                    </div>
                  </div>

                  {/* REAL SOCIAL MEDIA ICONS */}
                  <div className="flex items-center gap-2 pt-1">
                    <SocialIcon platform="linkedin" url={mentor.socialLinks?.linkedin || 'https://linkedin.com'} size="sm" />
                    <SocialIcon platform="twitter" url={mentor.socialLinks?.twitter || 'https://x.com'} size="sm" />
                    <SocialIcon platform="instagram" url={mentor.socialLinks?.instagram || 'https://instagram.com/ment.minds'} size="sm" />
                    <SocialIcon platform="whatsapp" url={`https://wa.me/${mentor.phoneWhatsApp.replace(/[^0-9]/g, '')}`} size="sm" />
                  </div>

                  {/* BIO */}
                  <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed font-medium">
                    {mentor.bio}
                  </p>

                  {/* EXPERTISE TAGS */}
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1.5">Expertise Focus</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(mentor.expertise || mentor.interests).slice(0, 2).map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-black uppercase tracking-wider bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ACTION BUTTON (READ MORE / PORTFOLIO) */}
                <div className="pt-6 border-t-2 border-slate-200 mt-6">
                  <button
                    onClick={() => setActiveModalMentor(mentor)}
                    className="w-full bg-[#0C1836] hover:bg-[#0B6291] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 border-2 border-slate-900"
                  >
                    <Eye className="w-4 h-4 text-[#B87E13]" />
                    <span>Read Portfolio</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* PORTFOLIO MODAL */}
        <MentorProfileModal
          isOpen={Boolean(activeModalMentor)}
          mentor={activeModalMentor}
          currentUser={currentUser}
          onClose={() => setActiveModalMentor(null)}
          onRequestMentorship={(m) => {
            if (!currentUser) {
              onOpenAuthModal();
            } else {
              onRequestMentor(m);
            }
          }}
        />

      </div>
    </section>
  );
};
