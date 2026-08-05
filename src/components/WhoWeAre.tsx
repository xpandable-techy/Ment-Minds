import React from 'react';
import { MENTMINDS_BRAND } from '../constants/brand';
import { ShieldAlert, BookMarked, Scale, Heart, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const WhoWeAre: React.FC = () => {
  return (
    <section id="who-we-are" className="py-20 bg-white text-[#0C1836] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-1 bg-[#0B6291]"></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0B6291]">
              Who We Are & Our Advocacy Mission
            </h4>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] mt-3 text-[#0C1836] tracking-tight leading-[1.1]">
            Protecting the Vulnerable, <br />
            <span className="text-[#3D781D]">Empowering the Unreached.</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg mt-4 font-medium leading-relaxed">
            MENTMINDS (RC8946867) operates at the intersection of youth empowerment, technical literacy, and human rights advocacy. We bridge the gap for children who have been systematically left behind.
          </p>
        </div>

        {/* 3 CORE ADVOCACY PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PILLAR 1 */}
          <div className="bg-[#F8FAFC] border-2 border-slate-900 border-l-8 border-l-[#0B6291] rounded-2xl p-5 sm:p-8 transition-all shadow-[6px_6px_0px_0px_rgba(12,24,54,0.06)] hover:shadow-[8px_8px_0px_0px_rgba(11,98,145,0.25)] flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#0B6291] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                <BookMarked className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836]">
                Almajiri & Out-of-School Children
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                We provide hands-on vocational, IT, and literacy skills training to Almajiri youth and out-of-school children, transforming vulnerability into sustainable self-reliance.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-800 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3D781D]" />
                  <span>Free Vocational & Coding Bootcamps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3D781D]" />
                  <span>Basic Literacy & English Skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3D781D]" />
                  <span>Community Shelter Partnerships</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t-2 border-slate-200 mt-6 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#0B6291]">
              <span>Learn About Almajiri Outreach</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* PILLAR 2 */}
          <div className="bg-[#F8FAFC] border-2 border-slate-900 border-l-8 border-l-[#9E1B4E] rounded-2xl p-5 sm:p-8 transition-all shadow-[6px_6px_0px_0px_rgba(12,24,54,0.06)] hover:shadow-[8px_8px_0px_0px_rgba(158,27,78,0.25)] flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#9E1B4E] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836]">
                Anti-Bullying & Peer Protection
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Active school-level anti-bullying campaigns, rapid intervention networks, and psychological counseling to eliminate intimidation in schools and communities.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-800 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9E1B4E]" />
                  <span>24/7 Peer Helpline & Counseling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9E1B4E]" />
                  <span>School Workshops & Safe Hubs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9E1B4E]" />
                  <span>Trauma & Mental Wellbeing Support</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t-2 border-slate-200 mt-6 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#9E1B4E]">
              <span>Report Bullying Incidents</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* PILLAR 3 */}
          <div className="bg-[#F8FAFC] border-2 border-slate-900 border-l-8 border-l-[#7B2D8C] rounded-2xl p-5 sm:p-8 transition-all shadow-[6px_6px_0px_0px_rgba(12,24,54,0.06)] hover:shadow-[8px_8px_0px_0px_rgba(123,45,140,0.25)] flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#7B2D8C] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836]">
                Child Rights Legal Protection
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Handing over child oppressors, abusers, and perpetrators to official child protection authorities and enforcing legal protection for minors.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-800 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7B2D8C]" />
                  <span>Legal Aid & Prosecution Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7B2D8C]" />
                  <span>Child Protection Authority Liaison</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7B2D8C]" />
                  <span>Rights Awareness Campaigns</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t-2 border-slate-200 mt-6 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#7B2D8C]">
              <span>Legal Protection Framework</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
