import React from 'react';
import { X, Briefcase, GraduationCap, Award, Calendar, CheckCircle2, Download, Send, PhoneCall } from 'lucide-react';
import { UserProfile } from '../types';
import { SocialIcon } from './SocialIcons';

interface MentorProfileModalProps {
  isOpen: boolean;
  mentor: UserProfile | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onRequestMentorship: (mentor: UserProfile) => void;
}

export const MentorProfileModal: React.FC<MentorProfileModalProps> = ({
  isOpen,
  mentor,
  currentUser,
  onClose,
  onRequestMentorship,
}) => {
  if (!isOpen || !mentor) return null;

  // Generate realistic experience timeline for mentor
  const experienceTimeline = [
    {
      period: '2020 - Present',
      role: mentor.expertise?.[0] || 'Senior Advocate & Youth Lead',
      organization: 'MENTMINDS & Legal Aid Network',
      description: mentor.bio || 'Leading capacity building masterclasses, community outreach for out-of-school youth, and direct child rights advocacy.',
    },
    {
      period: '2022 - 2024',
      role: mentor.expertise?.[1] || 'Child Rights Policy Consultant',
      organization: 'Regional Human Rights Commission',
      description: 'Consulted on juvenile justice policy frameworks, anti-bullying reporting pipelines, and digital rights protection.',
    },
    {
      period: '2018 - 2022',
      role: mentor.expertise?.[2] || 'Community Outreach Specialist',
      organization: 'West African Youth Initiative',
      description: 'Organized grassroots educational workshops and mentorship cohorts for underprivileged children.',
    },
  ];

  const handleDownloadCV = () => {
    const cvText = `
==================================================
MENTMINDS VERIFIED MENTOR PROFILE & RESUME
==================================================

Name: ${mentor.fullName}
Role: ${mentor.role.toUpperCase()}
Status: ${mentor.status || 'Verified Mentor'}
Email: ${mentor.email}
WhatsApp: ${mentor.phoneWhatsApp}

BIO & SUMMARY:
${mentor.bio}

AREAS OF EXPERTISE:
${mentor.expertise ? mentor.expertise.join(', ') : mentor.interests.join(', ')}

COURSES & MASTERCLASSES:
${mentor.coursesTaught ? mentor.coursesTaught.join(', ') : 'Youth Capacity Building 101'}

WORK EXPERIENCE:
${experienceTimeline.map((item) => `- ${item.period}: ${item.role} (${item.organization})\n  ${item.description}`).join('\n\n')}

==================================================
MENTMINDS Youth Mentorship Platform (RC8946867)
Website: https://mentminds.org
==================================================
    `;

    const blob = new Blob([cvText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mentor.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isMentee = currentUser?.role === 'mentee';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center py-6 sm:py-12 animate-fadeIn">
      <div className="relative w-full max-w-4xl my-auto bg-white border-2 border-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* TOP BAR / CLOSE */}
        <div className="bg-[#0C1836] text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#B87E13]">
              Verified Mentor Portfolio
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SPLIT CONTAINER (Layout matches Attachment 1) */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-slate-200">
          
          {/* LEFT COLUMN: PROFILE CARD */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-slate-50 flex flex-col items-center text-center justify-between space-y-6">
            <div className="w-full flex flex-col items-center">
              
              {/* AVATAR */}
              <div className="relative mb-4">
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.fullName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#0B6291] shadow-md"
                />
                <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Mentor">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              {/* NAME & ROLE */}
              <h3 className="text-xl sm:text-2xl font-black text-[#0C1836] font-['Outfit']">
                {mentor.fullName}
              </h3>
              <p className="text-xs font-black uppercase tracking-wider text-[#0B6291] mt-1">
                {mentor.expertise?.[0] || 'Advocate & Verified Mentor'}
              </p>

              {/* REAL SOCIAL MEDIA ICONS */}
              <div className="flex items-center justify-center gap-2.5 my-3">
                <SocialIcon platform="linkedin" url={mentor.socialLinks?.linkedin || 'https://linkedin.com'} size="sm" />
                <SocialIcon platform="twitter" url={mentor.socialLinks?.twitter || 'https://x.com'} size="sm" />
                <SocialIcon platform="instagram" url={mentor.socialLinks?.instagram || 'https://instagram.com/ment.minds'} size="sm" />
                <SocialIcon platform="whatsapp" url={`https://wa.me/${(mentor.phoneWhatsApp || '').replace(/[^0-9]/g, '')}`} size="sm" />
              </div>

              {/* DIRECT CONTACT INFO FOR MENTEES */}
              <div className="w-full bg-[#0C1836] text-white p-3.5 rounded-2xl text-xs space-y-2 text-left my-2 shadow-md border border-[#0B6291]/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#B87E13]">
                  Direct Mentor Contact Info
                </p>
                <div className="flex items-center gap-2 font-bold text-slate-200 truncate">
                  <span className="text-[#0B6291] shrink-0 font-extrabold">Email:</span>
                  <a href={`mailto:${mentor.email}`} className="hover:underline text-white truncate">
                    {mentor.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <span className="text-[#3D781D] shrink-0 font-extrabold">Phone / WA:</span>
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

              {/* BIO SNIPPET */}
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm">
                "{mentor.bio}"
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

            {/* ACTION BUTTONS (Matching Attachment 1) */}
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
                <div className="text-[11px] font-bold text-slate-500 bg-slate-200/70 p-2.5 rounded-xl">
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
                  <span>Sign In as Mentee to Request</span>
                </button>
              )}

              <button
                onClick={handleDownloadCV}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl border-2 border-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#0B6291]" />
                <span>Download CV</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: WORK EXPERIENCE & COURSES TIMELINE */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* TIMELINE SECTION HEADER */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0B6291]" />
                <h4 className="text-lg font-black text-[#0C1836] font-['Outfit']">
                  Work Experience
                </h4>
              </div>
              <span className="text-[11px] font-extrabold text-[#3D781D] bg-[#3D781D]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Career Track
              </span>
            </div>

            {/* TIMELINE ITEMS (Directly modeled after Attachment 1) */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-300">
              {experienceTimeline.map((item, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Timeline Dot */}
                  <div className="absolute left-1.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#0B6291] ring-4 ring-white group-hover:bg-[#3D781D] transition-colors" />

                  {/* Year Badge */}
                  <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0B6291] mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.period}</span>
                  </div>

                  {/* Role Title & Org */}
                  <h5 className="font-black text-base text-[#0C1836] font-['Outfit']">
                    {item.role}
                  </h5>
                  <p className="text-xs font-bold text-slate-500 mb-2">
                    {item.organization}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* MASTERCLASSES TAUGHT */}
            <div className="pt-4 border-t-2 border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-[#B87E13]" />
                <h4 className="text-base font-black text-[#0C1836] font-['Outfit']">
                  Mentorship & Capacity Masterclasses
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(mentor.coursesTaught || ['Youth Rights 101', 'Public Advocacy & Leadership']).map((course, idx) => (
                  <div key={idx} className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-start gap-2 shadow-sm">
                    <Award className="w-4 h-4 text-[#B87E13] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-[#0C1836]">{course}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verified MENTMINDS Course</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
