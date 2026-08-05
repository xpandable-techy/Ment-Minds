import React from 'react';
import { MENTMINDS_BRAND } from '../constants/brand';
import { Mail, MessageCircle, Lock, Shield } from 'lucide-react';
import { MentmindsLogo } from './MentmindsLogo';
import { SocialIcon } from './SocialIcons';

interface FooterProps {
  onOpenAdminAuthModal: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminAuthModal, onNavigate }) => {
  return (
    <footer className="bg-[#0C1836] text-slate-300 pt-16 pb-12 border-t-4 border-[#0B6291] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* BRAND COL */}
          <div className="md:col-span-1 space-y-4">
            <MentmindsLogo size="md" />
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Empowering youth, providing 100% free capacity building, anti-bullying advocacy, and protecting child rights across Africa.
            </p>
            {/* REAL SOCIAL MEDIA ICONS */}
            <div className="flex items-center gap-2 pt-2">
              <SocialIcon platform="linkedin" url={MENTMINDS_BRAND.socials.linkedin} size="sm" />
              <SocialIcon platform="instagram" url={MENTMINDS_BRAND.socials.instagram} size="sm" />
              <SocialIcon platform="facebook" url={MENTMINDS_BRAND.socials.facebook} size="sm" />
              <SocialIcon platform="whatsapp" url={MENTMINDS_BRAND.whatsappCommunityUrl} size="sm" />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white font-black text-xs mb-4 font-['Outfit'] uppercase tracking-widest text-[#3D781D] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#3D781D] rounded-full inline-block"></span>
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold uppercase tracking-wider">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Our Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('who-we-are')} className="hover:text-white transition-colors">
                  Almajiri & Anti-Bullying Advocacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('webinars')} className="hover:text-white transition-colors">
                  Weekly Webinars & Flyers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mentors')} className="hover:text-white transition-colors">
                  Featured Mentors Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-white transition-colors">
                  News & Impact Stories
                </button>
              </li>
            </ul>
          </div>

          {/* ADVOCACY IMPACT */}
          <div>
            <h4 className="text-white font-black text-xs mb-4 font-['Outfit'] uppercase tracking-widest text-[#B87E13] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#B87E13] rounded-full inline-block"></span>
              Advocacy & Child Rights
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#3D781D] fill-current shrink-0 mt-0.5" />
                <span>100% Free Capacity Training & Certificates</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#9E1B4E] fill-current shrink-0 mt-0.5" />
                <span>Legal Defence Against Child Oppression</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#B87E13] fill-current shrink-0 mt-0.5" />
                <span>Direct Child Protection Intervention</span>
              </li>
            </ul>
          </div>

          {/* OFFICIAL CONTACT */}
          <div>
            <h4 className="text-white font-black text-xs mb-4 font-['Outfit'] uppercase tracking-widest text-[#9E1B4E] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#9E1B4E] rounded-full inline-block"></span>
              Get In Touch
            </h4>
            <div className="space-y-3 text-xs font-bold">
              <a
                href={`mailto:${MENTMINDS_BRAND.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white p-2.5 bg-slate-900 rounded-xl border-2 border-slate-700 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#0B6291]" />
                <span>{MENTMINDS_BRAND.email}</span>
              </a>
              <a
                href={MENTMINDS_BRAND.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-white p-2.5 bg-[#25D366] hover:bg-[#20ba5a] rounded-xl border-2 border-[#25D366] transition-colors font-black uppercase tracking-wider shadow-md"
              >
                <SocialIcon platform="whatsapp" size="sm" className="w-4 h-4 p-0 shadow-none bg-transparent" />
                <span>Join Official WhatsApp Hub</span>
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & HIDDEN ADMIN ENTRANCE */}
        <div className="pt-8 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-black uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span>MENTMINDS: Empowering Youth & Defending Rights Worldwide</span>
          </div>

          {/* HIDDEN ADMIN TRIGGER: Copyright text in footer */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdminAuthModal}
              title="Admin Portal Access"
              className="hover:text-amber-400 focus:outline-none transition-colors group cursor-pointer flex items-center gap-1.5"
            >
              <span>© 2026 MENTMINDS</span>
              <Lock className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors opacity-60 group-hover:opacity-100" />
            </button>
            <span className="text-slate-600">| All Rights Reserved</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
