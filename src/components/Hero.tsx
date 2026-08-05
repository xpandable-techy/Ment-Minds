import React from 'react';
import { MENTMINDS_BRAND } from '../constants/brand';
import { Shield, MessageCircle, Award, Users, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SocialIcon } from './SocialIcons';

interface HeroProps {
  onOpenAuthModal: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAuthModal, onNavigate }) => {
  return (
    <section id="hero" className="relative bg-[#0C1836] text-white pt-12 pb-20 overflow-hidden border-b-4 border-[#0B6291]">
      
      {/* REVOLVING WORLD NETWORK / GLOBE VECTOR IN CONTINUOUS MOTION */}
      <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center overflow-hidden">
        {/* Layer 1: Clockwise Revolving Outer Globe Ring */}
        <svg
          viewBox="0 0 1000 1000"
          className="w-[1250px] h-[1250px] text-[#0B6291] fill-current animate-globe-spin shrink-0"
          style={{ animation: 'spinClockwise 24s linear infinite' }}
        >
          <circle cx="500" cy="500" r="450" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="16 16" />
          <circle cx="500" cy="500" r="350" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M 100 500 Q 500 200 900 500 Q 500 800 100 500 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 500 100 Q 200 500 500 900 Q 800 500 500 100 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="500" cy="150" r="16" fill="#3D781D" />
          <circle cx="850" cy="500" r="16" fill="#B87E13" />
          <circle cx="500" cy="850" r="16" fill="#0B6291" />
          <circle cx="150" cy="500" r="16" fill="#3D781D" />
        </svg>

        {/* Layer 2: Counter-Clockwise Revolving Inner Orbit */}
        <svg
          viewBox="0 0 1000 1000"
          className="absolute w-[880px] h-[880px] text-[#3D781D] fill-current animate-globe-spin-reverse shrink-0"
          style={{ animation: 'spinCounterClockwise 16s linear infinite' }}
        >
          <circle cx="500" cy="500" r="260" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
          <circle cx="300" cy="300" r="14" fill="#B87E13" />
          <circle cx="700" cy="700" r="14" fill="#0B6291" />
          <circle cx="300" cy="700" r="14" fill="#3D781D" />
          <circle cx="700" cy="300" r="14" fill="#B87E13" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO TITLE & TAGLINE (Clean high contrast without gradients) */}
        <div className="max-w-4xl space-y-5 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black font-['Outfit'] tracking-tight leading-[1.1] text-white">
            Touching the Future: <br />
            <span className="text-[#3D781D]">Empowering Youth,</span> <br />
            <span className="text-[#B87E13]">Defending Rights.</span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl">
            MENTMINDS is a non-profit dedicated to capacity building, skills training for out-of-school & Almajiri children, anti-bullying advocacy, and 100% free leadership mentorship across Africa.
          </p>

          {/* ADVOCACY PROOF BADGES WITH FILLED PROTECTION ICONS */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <Shield className="w-4 h-4 fill-emerald-500 text-emerald-950 shrink-0" />
              <span>100% Free Capacity Training</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-600/60 text-blue-300 text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 fill-blue-500 text-blue-950 shrink-0" />
              <span>Verified Mentor Network</span>
            </div>
          </div>

          {/* ACTION BUTTONS (Clean solid high contrast styling) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto bg-[#0B6291] hover:bg-[#084b6f] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(61,120,29,1)] border-2 border-[#0B6291] flex items-center justify-center gap-2.5 transition-transform active:scale-95"
            >
              <span>Get Started as Mentee</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl transition-colors text-center"
            >
              Join as Mentor
            </button>

            <a
              href={MENTMINDS_BRAND.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <SocialIcon platform="whatsapp" size="sm" className="w-4 h-4 p-0 shadow-none bg-transparent" />
              <span>Join WhatsApp Hub</span>
            </a>
          </div>
        </div>

        {/* IMPACT METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t-2 border-slate-800">
          
          <div className="bg-slate-900 border-2 border-slate-800 border-l-4 border-l-[#0B6291] p-4 sm:p-5 rounded-xl flex items-center gap-3.5 shadow-sm">
            <div className="p-2.5 sm:p-3 bg-[#0B6291]/20 rounded-xl text-[#0B6291] shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] text-white truncate">
                {MENTMINDS_BRAND.stats.mentorsCount}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Verified Mentors</p>
            </div>
          </div>

          <div className="bg-slate-900 border-2 border-slate-800 border-l-4 border-l-[#3D781D] p-4 sm:p-5 rounded-xl flex items-center gap-3.5 shadow-sm">
            <div className="p-2.5 sm:p-3 bg-[#3D781D]/20 rounded-xl text-[#3D781D] shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] text-white truncate">
                {MENTMINDS_BRAND.stats.menteesCount}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Mentees Empowered</p>
            </div>
          </div>

          <div className="bg-slate-900 border-2 border-slate-800 border-l-4 border-l-[#B87E13] p-4 sm:p-5 rounded-xl flex items-center gap-3.5 shadow-sm">
            <div className="p-2.5 sm:p-3 bg-[#B87E13]/20 rounded-xl text-[#B87E13] shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] text-white truncate">
                {MENTMINDS_BRAND.stats.coursesCost}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Free Certificates</p>
            </div>
          </div>

          <div className="bg-slate-900 border-2 border-slate-800 border-l-4 border-l-[#7B2D8C] p-4 sm:p-5 rounded-xl flex items-center gap-3.5 shadow-sm">
            <div className="p-2.5 sm:p-3 bg-[#7B2D8C]/20 rounded-xl text-[#7B2D8C] shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] text-white truncate">
                100%
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Free Access</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
