import React, { useState } from 'react';
import { MENTORSHIP_AREAS } from '../../constants/brand';
import { storeManager, uploadAvatar, isSupabaseConfigured } from '../../lib/supabase';
import { compressImage } from '../../lib/imageCompressor';
import { MentorRequest, Session, UserProfile } from '../../types';
import { User, Video, CheckCircle2, Plus, Send, Clock, BookOpen, MessageCircle, Award, Edit3, Camera, Upload, Loader2, Save } from 'lucide-react';

interface MentorDashboardProps {
  currentUser: UserProfile;
  requests: MentorRequest[];
  sessions: Session[];
  onRefreshData: () => void;
  onMentorApproveRequest: (request: MentorRequest) => void;
  onMentorRejectRequest: (requestId: string) => void;
  onCreateSession: (session: Session) => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  currentUser,
  requests,
  sessions,
  onRefreshData,
  onMentorApproveRequest,
  onMentorRejectRequest,
  onCreateSession,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'sessions' | 'profile'>('requests');
  
  // New Session Form
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDesc, setSessionDesc] = useState('');
  const [meetUrl, setMeetUrl] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Profile Edit State
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState(currentUser.phoneWhatsApp || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUser.interests || []);
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || '');
  const [twitter, setTwitter] = useState(currentUser.socialLinks?.twitter || '');
  const [instagram, setInstagram] = useState(currentUser.socialLinks?.instagram || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
      onRefreshData();
    } catch (err) {
      console.warn('Avatar upload error:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      ...currentUser,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneWhatsApp: phoneWhatsApp.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3D781D&color=fff`,
      interests: selectedInterests,
      socialLinks: {
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
        instagram: instagram.trim(),
      },
      updatedAt: new Date().toISOString(),
    };

    storeManager.setCurrentUser(updatedProfile);
    setProfileSaved(true);
    setIsEditingProfile(false);
    setTimeout(() => setProfileSaved(false), 3000);
    onRefreshData();
  };

  // Incoming requests sent to this mentor (matched by mentorId or mentor email)
  const incomingRequests = requests.filter(
    (r) =>
      (r.mentorId === currentUser.id ||
        (r.mentorEmail && r.mentorEmail.toLowerCase() === currentUser.email.toLowerCase())) &&
      (r.status === 'sent_to_mentor' || r.status === 'approved')
  );

  const activeMentees = incomingRequests.filter((r) => r.status === 'approved');

  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: Session = {
      id: 'sess-' + Date.now(),
      title: sessionTitle.trim(),
      description: sessionDesc.trim(),
      mentorId: currentUser.id,
      mentorName: currentUser.fullName,
      mentorAvatar: currentUser.avatarUrl,
      meetUrl: meetUrl.trim(),
      dateTime: dateTime || new Date().toISOString(),
      audience: 'all',
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    onCreateSession(newSession);
    setShowSessionModal(false);
    setSessionTitle('');
    setSessionDesc('');
    setMeetUrl('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0C1836] pb-20">
      
      {/* HEADER BANNER */}
      <div className="bg-[#0C1836] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#3D781D]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-[#3D781D]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold font-['Outfit']">{currentUser.fullName}</h1>
                <span className="bg-[#3D781D]/30 text-emerald-300 border border-[#3D781D]/50 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Verified Mentor
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Mentor Portal • MENTMINDS (RC8946867)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <p className="text-xs text-slate-400 font-medium">Active Mentees</p>
              <p className="text-lg font-bold text-[#3D781D]">{activeMentees.length}</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <p className="text-xs text-slate-400 font-medium">Incoming Requests</p>
              <p className="text-lg font-bold text-[#B87E13]">
                {incomingRequests.filter((r) => r.status === 'sent_to_mentor').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN ASSIGNED TOPIC NOTIFICATION */}
      {currentUser.assignedTopic && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6">
          <div className="bg-[#B87E13]/20 border-2 border-[#B87E13] rounded-2xl p-4 text-slate-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-[#B87E13] shrink-0" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-[#B87E13]">
                  Admin Assigned Masterclass Topic
                </p>
                <p className="text-sm font-bold text-[#0C1836]">{currentUser.assignedTopic}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSessionTitle(`Masterclass: ${currentUser.assignedTopic}`);
                setShowSessionModal(true);
              }}
              className="bg-[#B87E13] hover:bg-[#9a690f] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-colors whitespace-nowrap"
            >
              Post Google Meet Link
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-md flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'requests'
                ? 'bg-[#3D781D] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Admin-Approved Mentee Requests ({incomingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sessions'
                ? 'bg-[#3D781D] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Google Meet Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#3D781D] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Active Mentees ({activeMentees.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: INCOMING REQUESTS */}
        {activeTab === 'requests' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836]">
                Incoming Mentee Connection Requests
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                These requests have been pre-screened and approved by MENTMINDS Executive Admin. Review and Accept to establish connection.
              </p>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                No pending requests awaiting your review.
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 border border-slate-200 rounded-2xl bg-[#F8FAFC] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={req.menteeAvatar}
                        alt={req.menteeName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0B6291]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#0C1836]">{req.menteeName}</h4>
                          <span className="text-[10px] font-bold bg-[#0B6291]/10 text-[#0B6291] px-2 py-0.5 rounded">
                            {req.menteeInterest}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 bg-white p-3 border border-slate-200 rounded-xl max-w-xl">
                          "{req.menteeMessage}"
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Email: {req.menteeEmail} • WhatsApp: {req.menteeWhatsApp}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'sent_to_mentor' ? (
                        <>
                          <button
                            onClick={() => onMentorApproveRequest(req)}
                            className="bg-[#3D781D] hover:bg-[#326317] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept & Connect</span>
                          </button>
                          <button
                            onClick={() => onMentorRejectRequest(req.id)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3 py-2.5 rounded-xl"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Connection Active
                          </span>
                          <a
                            href={`https://wa.me/${req.menteeWhatsApp}?text=Hello%20${encodeURIComponent(req.menteeName)},%20I%20accepted%20your%20MENTMINDS%20mentorship%20request!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#25D366] text-white rounded-xl hover:brightness-110 shadow-sm"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-white" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GOOGLE MEET SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836]">
                  Google Meet Masterclasses & Sessions
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast Google Meet links to all mentees or host weekly webinars.
                </p>
              </div>

              <button
                onClick={() => setShowSessionModal(true)}
                className="bg-[#3D781D] hover:bg-[#326317] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Session Link</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {sessions
                .filter((s) => s.mentorId === currentUser.id)
                .map((sess) => (
                  <div key={sess.id} className="p-5 border border-slate-200 rounded-2xl bg-[#F8FAFC] space-y-3">
                    <h4 className="font-bold text-base text-[#0C1836]">{sess.title}</h4>
                    <p className="text-xs text-slate-600">{sess.description}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Date: {new Date(sess.dateTime).toLocaleString()}</span>
                      <a
                        href={sess.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-bold underline"
                      >
                        Launch Meet &rarr;
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE & ACTIVE MENTEES */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* EDITABLE PROFILE CARD & FORM */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black font-['Outfit'] text-[#0C1836]">Mentor Profile</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs font-black text-[#0B6291] hover:underline flex items-center gap-1 bg-[#0B6291]/10 px-3 py-1.5 rounded-lg"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>

              {profileSaved && (
                          <div className="p-3 bg-emerald-100 border border-emerald-400 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-success">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Profile updated live across MENTMINDS!</span>
                          </div>
                        )}

              {!isEditingProfile ? (
                /* READ-ONLY VIEW */
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-[#3D781D]"
                    />
                    <div>
                      <h4 className="font-black text-base text-[#0C1836] font-['Outfit']">{currentUser.fullName}</h4>
                      <p className="text-xs font-bold text-[#0B6291]">{currentUser.email}</p>
                      <p className="text-xs font-bold text-emerald-600 font-mono mt-0.5">{currentUser.phoneWhatsApp || 'No WhatsApp set'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-black uppercase tracking-wider text-slate-400 block text-[10px]">Short Bio & Background</span>
                    <p className="text-slate-700 font-medium bg-slate-50 border border-slate-200 p-3 rounded-xl leading-relaxed">
                      {currentUser.bio || 'No bio specified yet.'}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="font-black uppercase tracking-wider text-slate-400 block text-[10px]">Key Expertise Areas</span>
                    <div className="flex flex-wrap gap-1">
                      {(currentUser.interests || []).map((i) => (
                        <span key={i} className="bg-white border border-slate-300 text-slate-900 font-bold px-2.5 py-1 rounded-md text-[10px]">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SOCIAL MEDIA LINKS */}
                  <div className="pt-2 border-t text-xs space-y-1">
                    <span className="font-black uppercase tracking-wider text-slate-400 block text-[10px] mb-1">Social Media Links</span>
                    {currentUser.socialLinks?.linkedin && (
                      <p className="truncate text-slate-600"><strong className="text-slate-900">LinkedIn:</strong> {currentUser.socialLinks.linkedin}</p>
                    )}
                    {currentUser.socialLinks?.twitter && (
                      <p className="truncate text-slate-600"><strong className="text-slate-900">X/Twitter:</strong> {currentUser.socialLinks.twitter}</p>
                    )}
                    {currentUser.socialLinks?.instagram && (
                      <p className="truncate text-slate-600"><strong className="text-slate-900">Instagram:</strong> {currentUser.socialLinks.instagram}</p>
                    )}
                  </div>
                </div>
              ) : (
                /* EDIT FORM */
                <form onSubmit={handleSaveProfileSubmit} className="space-y-3.5 text-left text-xs">
                  <div>
                    <label className="block font-black text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phoneWhatsApp}
                      onChange={(e) => setPhoneWhatsApp(e.target.value)}
                      placeholder="+234..."
                      className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>

                  {/* UPLOAD PROFILE PHOTO CARD */}
                  <div className="bg-[#F8FAFC] border-2 border-[#3D781D]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={avatarUrl || currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3D781D&color=fff`}
                        alt={fullName}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-[#3D781D]"
                      />
                      <label className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        {uploadingAvatar ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5 text-white" />
                        )}
                        <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                      </label>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <p className="font-black text-xs text-[#0C1836]">Upload New Profile Photo</p>
                      <p className="text-[11px] text-slate-500 font-medium">Tap photo or click button to pick an image.</p>
                      <label className="inline-flex items-center gap-1.5 bg-[#3D781D] hover:bg-[#326317] text-white font-black text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer transition-all shadow-md mt-1">
                        {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>{uploadingAvatar ? 'Uploading…' : 'Upload New Photo'}</span>
                        <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 mb-1">Short Bio & Mentorship Summary</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 mb-1">Areas of Expertise</label>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-[#F8FAFC] border-2 border-slate-300 rounded-xl">
                      {MENTORSHIP_AREAS.map((area) => {
                        const isSelected = selectedInterests.includes(area);
                        return (
                          <button
                            type="button"
                            key={area}
                            onClick={() => toggleInterest(area)}
                            className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${
                              isSelected
                                ? 'bg-[#3D781D] text-white'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <label className="block font-black text-slate-700">Social Media Links</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn URL"
                      className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    />
                    <input
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="X / Twitter URL"
                      className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    />
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram URL"
                      className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#3D781D] hover:bg-[#326317] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md flex items-center justify-center gap-2 mt-3"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Update Profile Live</span>
                  </button>
                </form>
              )}
            </div>

            {/* ACTIVE MENTEES LIST */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-['Outfit'] text-[#0C1836]">
                Active Connected Mentees ({activeMentees.length})
              </h3>
              {activeMentees.length === 0 ? (
                <p className="text-xs text-slate-400">No active mentees connected yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeMentees.map((m) => (
                    <div key={m.id} className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img loading="lazy" src={m.menteeAvatar} alt={m.menteeName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-xs text-[#0C1836]">{m.menteeName}</p>
                          <p className="text-[10px] text-slate-500">{m.menteeInterest}</p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${m.menteeWhatsApp}?text=Hello%20${encodeURIComponent(m.menteeName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#25D366] text-white rounded-lg"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* CREATE SESSION MODAL */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900">
            <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836] mb-1">
              Post Google Meet Session
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Broadcast session details & video link to MENTMINDS mentees.
            </p>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Youth Advocacy & Public Speaking"
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Meet URL *</label>
                <input
                  type="url"
                  required
                  value={meetUrl}
                  onChange={(e) => setMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/abc-mentminds-xyz"
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={sessionDesc}
                  onChange={(e) => setSessionDesc(e.target.value)}
                  placeholder="Key takeaways and outline..."
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#3D781D] hover:bg-[#326317] text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  Post Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
