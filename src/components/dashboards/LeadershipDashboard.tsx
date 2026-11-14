import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink, GraduationCap, Home, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import { MENTMINDS_BRAND } from '../../constants/brand';
import { UserProfile } from '../../types';

interface LeadershipDashboardProps {
  currentUser: UserProfile;
  profiles: UserProfile[];
  onVisitHome: () => void;
}

const roleDetails = {
  ceo: {
    title: 'Chief Executive Officer',
    responsibilities: [
      'Set the organization’s vision, strategy, and priorities.',
      'Guide organizational leadership, partnerships, and programme impact.',
      'Support the team in delivering MENTMINDS’ mission.',
    ],
  },
  sec: {
    title: 'Secretary General',
    responsibilities: [
      'Coordinate organizational administration and communication.',
      'Support programme planning, records, and follow-through.',
      'Strengthen coordination across the team and community.',
    ],
  },
  cto: {
    title: 'Chief Technology Officer',
    responsibilities: [
      'Oversee MENTMINDS’ technology platforms and digital infrastructure.',
      'Guide technology decisions that support mentors and mentees.',
      'Maintain reliable, secure, and accessible digital services.',
    ],
  },
} as const;

export const LeadershipDashboard: React.FC<LeadershipDashboardProps> = ({
  currentUser,
  profiles,
  onVisitHome,
}) => {
  const [now, setNow] = useState(() => new Date());
  const details = currentUser.role === 'ceo'
    ? roleDetails.ceo
    : currentUser.role === 'sec'
      ? roleDetails.sec
      : roleDetails.cto;
  const menteeCount = profiles.filter((profile) => profile.role === 'mentee').length;
  const mentorCount = profiles.filter((profile) => profile.role === 'mentor').length;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const date = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);
  const time = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0C1836] pb-16">
      <section className="bg-[#0C1836] text-white px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-b-4 border-[#0B6291]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=0B6291&color=fff`}
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 bg-[#0B6291]"
            />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7DC4E8]">
                MENTMINDS Leadership Portal
              </p>
              <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] mt-1">
                Welcome, {currentUser.fullName}
              </h1>
              <p className="text-sm text-slate-300 font-bold mt-1">{details.title}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={MENTMINDS_BRAND.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-[#0C1836] font-black text-sm px-5 py-3 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp Community
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onVisitHome}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm px-5 py-3 transition-colors"
            >
              <Home className="w-5 h-5" />
              Visit Home Page
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B6291] flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Registered Mentees</p>
              <p className="text-3xl font-black text-[#0C1836]">{menteeCount}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#3D781D] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Registered Mentors</p>
              <p className="text-3xl font-black text-[#0C1836]">{mentorCount}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-5 mt-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#B87E13] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black font-['Outfit']">Your Responsibilities</h2>
                <p className="text-sm text-slate-500">{details.title} · MENTMINDS</p>
              </div>
            </div>
            <ul className="space-y-4">
              {details.responsibilities.map((responsibility) => (
                <li key={responsibility} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#3D781D] shrink-0" />
                  {responsibility}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#0B6291] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black font-['Outfit']">Date & Time</h2>
                <p className="text-xs text-blue-100 font-bold">West Africa Time (WAT)</p>
              </div>
            </div>
            <p className="text-sm text-blue-100 font-bold">{date}</p>
            <p className="text-3xl sm:text-4xl font-black font-['Outfit'] mt-2 tabular-nums">{time}</p>
            <p className="text-xs text-blue-100 mt-2">Africa/Lagos</p>
          </section>
        </div>
      </div>
    </div>
  );
};
