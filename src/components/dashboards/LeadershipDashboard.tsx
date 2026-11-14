import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink, GraduationCap, Home, Mail, MessageCircle, Phone, Search, ShieldCheck, Users } from 'lucide-react';
import { MENTMINDS_BRAND } from '../../constants/brand';
import { INITIAL_MENTORS } from '../../data/mockData';
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
  const [mentorSearch, setMentorSearch] = useState('');
  const details = currentUser.role === 'ceo'
    ? roleDetails.ceo
    : currentUser.role === 'sec'
      ? roleDetails.sec
      : roleDetails.cto;
  const mentorsByEmail = new Map(INITIAL_MENTORS.map((mentor) => [mentor.email.toLowerCase(), mentor]));
  profiles
    .filter((profile) => profile.role === 'mentor')
    .forEach((profile) => mentorsByEmail.set(profile.email.toLowerCase(), profile));
  const mentors = Array.from(mentorsByEmail.values());
  const menteeCount = profiles.filter((profile) => profile.role === 'mentee').length;
  const mentorCount = mentors.length;
  const normalizedSearch = mentorSearch.trim().toLowerCase();
  const visibleMentors = mentors.filter((mentor) => [
    mentor.fullName,
    mentor.email,
    mentor.bio,
    ...(mentor.interests || []),
    ...(mentor.expertise || []),
  ].some((value) => value?.toLowerCase().includes(normalizedSearch)));

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

        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3D781D]">Leadership Directory</p>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] mt-1">Mentor Profiles</h2>
              <p className="text-sm text-slate-600 mt-1">Full profiles and direct contact details for the MENTMINDS mentors.</p>
            </div>
            <label className="relative block w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={mentorSearch}
                onChange={(event) => setMentorSearch(event.target.value)}
                placeholder="Search name, expertise, or interest"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0B6291] focus:ring-2 focus:ring-[#0B6291]/15"
              />
            </label>
          </div>

          {visibleMentors.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleMentors.map((mentor) => {
                const whatsappNumber = mentor.phoneWhatsApp?.replace(/\D/g, '');
                const socialLinks = Object.entries(mentor.socialLinks || {}).filter(([, url]) => Boolean(url));

                return (
                  <article key={mentor.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={mentor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.fullName)}&background=0B6291&color=fff`}
                          alt={`${mentor.fullName} profile`}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                        />
                        <div className="min-w-0">
                          <h3 className="text-lg font-black font-['Outfit'] truncate">{mentor.fullName}</h3>
                          <p className="text-xs font-bold text-[#3D781D]">{mentor.status || 'Mentor'}</p>
                          <a href={`mailto:${mentor.email}`} className="text-xs text-[#0B6291] hover:underline break-all">
                            {mentor.email}
                          </a>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-slate-600 mt-4">{mentor.bio || 'MENTMINDS mentor.'}</p>

                      {mentor.expertise && mentor.expertise.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Expertise</p>
                          <div className="flex flex-wrap gap-1.5">
                            {mentor.expertise.map((item) => (
                              <span key={item} className="rounded-full bg-blue-50 text-[#0B6291] px-2.5 py-1 text-[11px] font-bold">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {mentor.interests.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Mentorship Interests</p>
                          <p className="text-xs text-slate-600">{mentor.interests.join(' · ')}</p>
                        </div>
                      )}

                      {mentor.coursesTaught && mentor.coursesTaught.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">Courses</p>
                          <p className="text-xs text-slate-600">{mentor.coursesTaught.join(' · ')}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 p-4">
                      <a
                        href={`mailto:${mentor.email}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B6291] px-3 py-2 text-xs font-black text-white hover:bg-[#084b6f]"
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                      {mentor.phoneWhatsApp && (
                        <>
                          <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-black text-[#0C1836] hover:bg-[#20ba5a]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          <a
                            href={`tel:${mentor.phoneWhatsApp}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-black text-slate-700 hover:bg-white"
                          >
                            <Phone className="w-3.5 h-3.5" /> {mentor.phoneWhatsApp}
                          </a>
                        </>
                      )}
                      {socialLinks.map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${mentor.fullName} on ${platform}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold capitalize text-slate-700 hover:bg-white"
                        >
                          {platform} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No mentors match “{mentorSearch}”.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
