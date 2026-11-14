import React, { useState } from 'react';
import { MENTMINDS_BRAND } from '../constants/brand';
import { UserProfile } from '../types';
import { ShieldCheck, LogOut, LayoutDashboard, MessageCircle, Menu, X, User, Eye, EyeOff } from 'lucide-react';
import { MentmindsLogo } from './MentmindsLogo';
import { SocialIcon } from './SocialIcons';

interface HeaderProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenOnboarding: () => void;
  onNavigate: (sectionId: string) => void;
  onGoToDashboard: () => void;
  onLogout: () => void;
  activeView: 'home' | 'dashboard';
  eyeComfort: boolean;
  onToggleEyeComfort: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuthModal,
  onNavigate,
  onGoToDashboard,
  onLogout,
  activeView,
  eyeComfort,
  onToggleEyeComfort,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0C1836] border-b-4 border-[#0B6291] text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* LOGO & BRAND */}
        <button 
          onClick={() => handleNavClick('hero')} 
          className="flex items-center gap-2 sm:gap-3 group text-left focus:outline-none shrink-0"
        >
          <MentmindsLogo size="sm" className="sm:hidden" />
          <MentmindsLogo size="md" className="hidden sm:flex" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-2xl tracking-tight text-white font-['Outfit']">
                MENT<span className="text-[#3D781D]">MINDS</span>
              </span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-300 font-extrabold tracking-wider uppercase hidden xs:block">
              Youth Mentorship & Advocacy
            </p>
          </div>
        </button>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-black tracking-wider uppercase text-slate-200">
          <button onClick={() => handleNavClick('about')} className="hover:text-[#0B6291] transition-colors">
            About Us
          </button>
          <button onClick={() => handleNavClick('webinars')} className="hover:text-[#3D781D] transition-colors">
            Webinars & Flyers
          </button>
          <button onClick={() => handleNavClick('mentors')} className="hover:text-[#B87E13] transition-colors">
            Featured Mentors
          </button>
          <button onClick={onOpenAuthModal} className="text-[#0B6291] hover:underline font-black transition-colors">
            Get Involved
          </button>
          <a
            href="https://wa.me/2349038241892?text=Hello%20MENTMINDS%20Team!%20%F0%9F%A4%9D%0A%0AI%20would%20like%20to%20make%20a%20donation%20to%20support%20the%20MENTMINDS%20Youth%20Mentorship%20Initiative%20(RC8946867).%0A%0APlease%20let%20me%20know%20how%20I%20can%20contribute%20to%20empowering%20youth%20and%20Almajiri%20children.%0A%0AThank%20you!"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-black transition-colors"
          >
            Donate Now
          </a>
          <a
            href="https://wa.me/2349038241892?text=Hello%20MENTMINDS%20Team!%20%F0%9F%8C%9F%0A%0AI%20am%20interested%20in%20partnering%20with%20MENTMINDS%20(RC8946867)%20to%20support%20youth%20empowerment%20and%20mentorship%20initiatives%20in%20Nigeria.%0A%0AKindly%20share%20more%20details%20on%20how%20we%20can%20collaborate.%0A%0AThank%20you!"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 font-black transition-colors"
          >
            Partner With Us
          </a>
          <a
            href={MENTMINDS_BRAND.whatsappCommunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#25D366] hover:text-[#20ba5a] font-black transition-colors bg-[#25D366]/10 px-3 py-1.5 rounded-lg border border-[#25D366]/30"
          >
            <SocialIcon platform="whatsapp" size="sm" className="w-4 h-4 p-0 shadow-none bg-transparent hover:scale-100" />
            <span>WhatsApp Hub</span>
          </a>
        </nav>

        {/* USER / DASHBOARD ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onToggleEyeComfort}
            title={eyeComfort ? 'Turn off eye comfort mode' : 'Turn on eye comfort mode'}
            aria-label={eyeComfort ? 'Turn off eye comfort mode' : 'Turn on eye comfort mode'}
            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-colors ${
              eyeComfort
                ? 'bg-[#B87E13]/20 border-[#B87E13]/50 text-[#E8A33D]'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {eyeComfort ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {activeView === 'home' ? (
                <button
                  onClick={onGoToDashboard}
                  className="bg-[#3D781D] hover:bg-[#326317] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md flex items-center gap-1.5 transition-all border sm:border-2 border-[#3D781D]"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
                  <span>Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('hero')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-700 transition-colors"
                >
                  Home
                </button>
              )}

              <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-700 pl-1.5 sm:pl-3">
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 sm:p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="text-slate-300 hover:text-white text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:underline px-2 py-1"
              title="Member Sign In"
            >
              <User className="w-3.5 h-3.5 text-[#0B6291]" />
              <span>Login</span>
            </button>
          )}

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg sm:rounded-xl border border-slate-700"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0C1836] border-t-2 border-[#0B6291] px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left text-xs font-black uppercase tracking-wider text-slate-200 hover:text-[#0B6291] py-2 border-b border-slate-800"
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('webinars')}
            className="w-full text-left text-xs font-black uppercase tracking-wider text-slate-200 hover:text-[#3D781D] py-2 border-b border-slate-800"
          >
            Webinars & Flyers
          </button>
          <button
            onClick={() => handleNavClick('mentors')}
            className="w-full text-left text-xs font-black uppercase tracking-wider text-slate-200 hover:text-[#B87E13] py-2 border-b border-slate-800"
          >
            Featured Mentors
          </button>
          <button
            onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
            className="w-full text-left text-xs font-black uppercase tracking-wider text-[#0B6291] py-2 border-b border-slate-800"
          >
            Get Involved
          </button>
          <a
            href="https://wa.me/2349038241892?text=Hello%20MENTMINDS%20Team!%20%F0%9F%A4%9D%0A%0AI%20would%20like%20to%20make%20a%20donation%20to%20support%20the%20MENTMINDS%20Youth%20Mentorship%20Initiative%20(RC8946867).%0A%0APlease%20let%20me%20know%20how%20I%20can%20contribute%20to%20empowering%20youth%20and%20Almajiri%20children.%0A%0AThank%20you!"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-left text-xs font-black uppercase tracking-wider text-emerald-400 py-2 border-b border-slate-800"
          >
            Donate Now
          </a>
          <a
            href="https://wa.me/2349038241892?text=Hello%20MENTMINDS%20Team!%20%F0%9F%8C%9F%0A%0AI%20am%20interested%20in%20partnering%20with%20MENTMINDS%20(RC8946867)%20to%20support%20youth%20empowerment%20and%20mentorship%20initiatives%20in%20Nigeria.%0A%0AKindly%20share%20more%20details%20on%20how%20we%20can%20collaborate.%0A%0AThank%20you!"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-left text-xs font-black uppercase tracking-wider text-amber-400 py-2 border-b border-slate-800"
          >
            Partner With Us
          </a>
          <a
            href={MENTMINDS_BRAND.whatsappCommunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-[#25D366] font-black text-xs uppercase tracking-wider py-2.5 bg-[#25D366]/10 rounded-xl border border-[#25D366]/40"
          >
            <SocialIcon platform="whatsapp" size="sm" className="w-4 h-4 p-0 shadow-none bg-transparent" />
            <span>Join Official WhatsApp Hub</span>
          </a>
        </div>
      )}
    </header>
  );
};
