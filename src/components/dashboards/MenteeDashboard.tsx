import React, { useState } from 'react';
import { MENTORSHIP_AREAS } from '../../constants/brand';
import { storeManager, isSupabaseConfigured, uploadAvatar } from '../../lib/supabase';
import { compressImage } from '../../lib/imageCompressor';
import { MentorRequest, Session, UserProfile } from '../../types';
import { User, Send, Clock, CheckCircle2, Video, MessageCircle, Filter, Upload, ShieldCheck, HeartHandshake, Camera, Loader2 } from 'lucide-react';

interface MenteeDashboardProps {
  currentUser: UserProfile;
  mentors: UserProfile[];
  requests: MentorRequest[];
  sessions: Session[];
  onRefreshData: () => void;
  onRequestMentorSubmit: (mentor: UserProfile, message: string, interest: string) => void;
}

export const MenteeDashboard: React.FC<MenteeDashboardProps> = ({
  currentUser,
  mentors,
  requests,
  sessions,
  onRefreshData,
  onRequestMentorSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'discover' | 'pipeline' | 'profile'>('hub');
  
  // Mentor Filter
  const [interestFilter, setInterestFilter] = useState<string>('All');
  const [selectedMentorForReq, setSelectedMentorForReq] = useState<UserProfile | null>(null);
  const [requestInterest, setRequestInterest] = useState<string>(MENTORSHIP_AREAS[0]);
  const [requestMessage, setRequestMessage] = useState<string>('');

  // Profile Edit State
  const [bio, setBio] = useState(currentUser.bio || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.phoneWhatsApp || '');
  const [status, setStatus] = useState(currentUser.status || 'Fresh Mentee');
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || '');
  const [twitter, setTwitter] = useState(currentUser.socialLinks?.twitter || '');
  const [instagram, setInstagram] = useState(currentUser.socialLinks?.instagram || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('Profile updated successfully!');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      let finalUrl = '';
      if (isSupabaseConfigured && currentUser.id) {
        const uploaded = await uploadAvatar(file, currentUser.id);
        if (uploaded) finalUrl = uploaded;
      }
      if (!finalUrl) {
        finalUrl = await compressImage(file, { maxWidth: 360, maxHeight: 360, quality: 0.7 });
      }

      setAvatarUrl(finalUrl);
      const updated: UserProfile = {
        ...currentUser,
        avatarUrl: finalUrl,
      };
      storeManager.setCurrentUser(updated);
      setProfileUpdated(true);
      setSuccessModalMessage('Profile picture updated successfully!');
      setShowSuccessModal(true);
      onRefreshData();
    } catch (err) {
      console.warn('Avatar upload error:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Filter requests for current mentee
  const myRequests = requests.filter((r) => r.menteeId === currentUser.id);

  // Filter mentors
  const filteredMentors = mentors.filter((m) => {
    if (interestFilter === 'All') return true;
    return m.interests.includes(interestFilter);
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      bio,
      phoneWhatsApp: whatsapp,
      status,
      avatarUrl: avatarUrl || currentUser.avatarUrl,
      socialLinks: { linkedin, twitter, instagram },
    };
    storeManager.setCurrentUser(updated);
    setProfileUpdated(true);
    setSuccessModalMessage('Profile details saved successfully!');
    setShowSuccessModal(true);
    onRefreshData();
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForReq) return;
    onRequestMentorSubmit(selectedMentorForReq, requestMessage, requestInterest);
    setSelectedMentorForReq(null);
    setRequestMessage('');
    setActiveTab('pipeline');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0C1836] pb-20">
      
      {/* HEADER BANNER */}
      <div className="bg-[#0C1836] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#0B6291]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" title="Click edit icon to change profile photo">
              <img
                src={avatarUrl || currentUser.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'}
                alt={currentUser.fullName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-[#0B6291]"
              />
              <label className="absolute inset-0 bg-slate-950/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
                <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
              </label>
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0C1836]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold font-['Outfit']">{currentUser.fullName}</h1>
                <span className="bg-[#3D781D]/30 text-emerald-300 border border-[#3D781D]/50 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {currentUser.status || 'Fresh Mentee'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Mentee Dashboard • MENTMINDS (RC8946867)
              </p>
            </div>
          </div>

          {/* QUICK METRICS */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <p className="text-xs text-slate-400 font-medium">Active Requests</p>
              <p className="text-lg font-bold text-[#0B6291]">{myRequests.length}</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <p className="text-xs text-slate-400 font-medium">Approved Connections</p>
              <p className="text-lg font-bold text-[#3D781D]">
                {myRequests.filter((r) => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-md flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hub'
                ? 'bg-[#0B6291] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Learning Hub & Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('discover')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'discover'
                ? 'bg-[#0B6291] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Find & Request Mentor</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'bg-[#0B6291] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pairing Request Pipeline ({myRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#0B6291] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Management</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: LEARNING HUB */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836] mb-1">
                Google Meet Masterclass Sessions
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Access free live sessions posted by assigned mentors and lead advocacy coordinators.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 hover:border-[#0B6291] transition-all space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sess.mentorAvatar}
                        alt={sess.mentorName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0B6291]"
                      />
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Instructor</p>
                        <p className="text-sm font-bold text-slate-900">{sess.mentorName}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-[#0C1836]">{sess.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sess.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Date: {new Date(sess.dateTime).toLocaleString()}
                      </span>

                      <a
                        href={sess.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Google Meet</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DISCOVER & REQUEST MENTOR */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-[#0C1836]">
                  Filter Mentors by Interest Area
                </h3>
                <p className="text-xs text-slate-500">
                  Find mentors matching your career, advocacy, or technical goals.
                </p>
              </div>

              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                className="bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="All">All Interests</option>
                {MENTORSHIP_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white border border-slate-200 hover:border-[#0B6291] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={mentor.avatarUrl}
                        alt={mentor.fullName}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-[#0B6291]"
                      />
                      <div>
                        <h4 className="font-bold text-base text-[#0C1836]">{mentor.fullName}</h4>
                        <p className="text-xs text-[#3D781D] font-bold">{mentor.status}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{mentor.bio}</p>

                    <div className="flex flex-wrap gap-1">
                      {mentor.interests.map((i) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedMentorForReq(mentor)}
                      className="w-full bg-[#0B6291] hover:bg-[#084b6f] text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Mentor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAIRING REQUEST PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836]">
                Mentor Connection Approval Pipeline
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Track status: <span className="font-bold text-[#B87E13]">1. Awaiting Admin Approval</span> &rarr; <span className="font-bold text-[#0B6291]">2. Sent to Mentor</span> &rarr; <span className="font-bold text-[#3D781D]">3. Approved & Connection Established</span>.
              </p>
            </div>

            {myRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                You have not submitted any mentor connection requests yet. Explore the 'Find & Request Mentor' tab to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 border border-slate-200 rounded-2xl bg-[#F8FAFC] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={req.mentorAvatar}
                        alt={req.mentorName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0B6291]"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-[#0C1836]">
                          Mentor: {req.mentorName}
                        </h4>
                        <p className="text-xs text-slate-500">Focus: {req.menteeInterest}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#0B6291] mt-1">
                          <span>📧 {req.mentorEmail}</span>
                          <span>📞 {req.mentorWhatsApp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* STATUS INDICATOR */}
                    <div className="flex items-center gap-3">
                      {req.status === 'awaiting_admin' && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          Awaiting Admin Approval
                        </span>
                      )}

                      {req.status === 'sent_to_mentor' && (
                        <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-blue-600" />
                          Sent to Mentor for Final Review
                        </span>
                      )}

                      {req.status === 'approved' && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Approved & Active
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${req.mentorEmail}`}
                              className="px-2.5 py-1.5 bg-[#0B6291] text-white rounded-xl text-[11px] font-bold hover:bg-[#084b6f]"
                              title="Email Mentor"
                            >
                              Email Mentor
                            </a>
                            <a
                              href={`https://wa.me/${(req.mentorWhatsApp || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.mentorName)},%20I%20am%20your%20MENTMINDS%20mentee!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-[#25D366] text-white rounded-xl hover:brightness-110 shadow-sm flex items-center gap-1 text-[11px] font-bold"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 fill-white" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {req.status === 'rejected' && (
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-3 py-1.5 rounded-full">
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836]">
                Edit Profile & Status
              </h3>
              <p className="text-xs text-slate-500">
                Update your contact channels, status (Fresh Mentee vs Alumni), and passport avatar.
              </p>
            </div>

            {profileUpdated && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* 1. PROFILE PHOTO EDITOR CARD (FIRST ITEM) */}
              <div className="bg-[#F8FAFC] border-2 border-[#0B6291]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <img
                    src={avatarUrl || currentUser.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'}
                    alt={currentUser.fullName}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-[#0B6291]"
                  />
                  <label className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {uploadingAvatar ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                    <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                  </label>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <p className="text-sm font-bold text-[#0C1836]">Upload New Profile Photo</p>
                  <p className="text-xs text-slate-500 max-w-md">Tap or hover on your avatar to change it, or click below to select an image file.</p>
                  <div className="pt-1">
                    <label className="inline-flex items-center gap-2 bg-[#0B6291] hover:bg-[#084b6f] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-md">
                      {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{uploadingAvatar ? 'Uploading Image…' : 'Upload New Photo'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. OTHER PROFILE DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Level</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Fresh Mentee">Fresh Mentee</option>
                    <option value="Active Mentee">Active Mentee</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">X / Twitter</label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#0B6291] hover:bg-[#084b6f] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all uppercase tracking-wider"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

      </div>

      {/* MODAL: REQUEST MENTOR FORM */}
      {selectedMentorForReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900">
            <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836] mb-1">
              Request Mentorship
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Sending request to mentor: <span className="font-bold text-[#0B6291]">{selectedMentorForReq.fullName}</span>
            </p>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Interest Area *</label>
                <select
                  value={requestInterest}
                  onChange={(e) => setRequestInterest(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                >
                  {selectedMentorForReq.interests.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Personal Goal & Message *</label>
                <textarea
                  rows={3}
                  required
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Explain why you want to connect and what skills you hope to gain..."
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentorForReq(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0B6291] hover:bg-[#084b6f] text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CENTERED GREEN SUCCESS POP-UP MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-center text-slate-900 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-['Outfit'] text-[#0C1836]">
                Successful!
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {successModalMessage}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#3D781D] hover:bg-[#326317] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              Great, Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
