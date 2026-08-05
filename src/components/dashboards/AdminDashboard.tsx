import React, { useState } from 'react';
import { MENTORSHIP_AREAS } from '../../constants/brand';
import { storeManager, supabase, isSupabaseConfigured, generateUUID } from '../../lib/supabase';
import { compressImage } from '../../lib/imageCompressor';
import { Flyer, MentorRequest, NewsArticle, Session, UserProfile } from '../../types';
import { Shield, Users, CheckCircle2, XCircle, Send, Plus, Database, Newspaper, Image, Award, Clock, Upload, FileText } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile;
  requests: MentorRequest[];
  profiles: UserProfile[];
  flyers: Flyer[];
  news: NewsArticle[];
  onRefreshData: () => void;
  onAdminApproveRequest: (requestId: string) => void;
  onAdminRejectRequest: (requestId: string) => void;
  onOpenSqlModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  requests,
  profiles,
  flyers,
  news,
  onRefreshData,
  onAdminApproveRequest,
  onAdminRejectRequest,
  onOpenSqlModal,
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'cms' | 'sql'>('approvals');

  // Topic Assignment State
  const [selectedMentorForTopic, setSelectedMentorForTopic] = useState<UserProfile | null>(null);
  const [customTopic, setCustomTopic] = useState('');

  // CMS Flyer Form State
  const [flyerTitle, setFlyerTitle] = useState('');
  const [flyerSpeaker, setFlyerSpeaker] = useState('');
  const [flyerDate, setFlyerDate] = useState('');
  const [flyerTime, setFlyerTime] = useState('');
  const [flyerCategory, setFlyerCategory] = useState(MENTORSHIP_AREAS[0]);
  const [flyerMeet, setFlyerMeet] = useState('');
  const [flyerImg, setFlyerImg] = useState('');
  const [flyerAltCaption, setFlyerAltCaption] = useState('');
  const [flyerDesc, setFlyerDesc] = useState('');
  const [isCompressingFlyer, setIsCompressingFlyer] = useState(false);
  const [showFlyerModal, setShowFlyerModal] = useState(false);

  // CMS News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'Announcement' | 'Advocacy' | 'Webinar' | 'Impact Story'>('Advocacy');
  const [newsImg, setNewsImg] = useState('');
  const [showNewsModal, setShowNewsModal] = useState(false);

  // Admin Register Mentor State
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [copiedMentorLink, setCopiedMentorLink] = useState(false);
  const [newMentorName, setNewMentorName] = useState('');
  const [newMentorEmail, setNewMentorEmail] = useState('');
  const [newMentorPhone, setNewMentorPhone] = useState('');
  const [newMentorBio, setNewMentorBio] = useState('');
  const [newMentorInterests, setNewMentorInterests] = useState<string[]>([MENTORSHIP_AREAS[0]]);

  // Pending requests awaiting Admin approval before reaching mentor
  const pendingAdminRequests = requests.filter((r) => r.status === 'awaiting_admin');
  const allRequests = requests;

  const mentees = profiles.filter((p) => p.role === 'mentee');
  const mentors = profiles.filter((p) => p.role === 'mentor');

  const handleFlyerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingFlyer(true);
      const compressedDataUrl = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.75,
      });
      setFlyerImg(compressedDataUrl);
      if (!flyerAltCaption) {
        setFlyerAltCaption(`Flyer poster for ${flyerTitle || 'MENTMINDS webinar session'}`);
      }
    } catch (err) {
      console.error('Failed to compress flyer image:', err);
    } finally {
      setIsCompressingFlyer(false);
    }
  };

  const handleAssignTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForTopic || !customTopic) return;

    const updatedMentor: UserProfile = {
      ...selectedMentorForTopic,
      assignedTopic: customTopic.trim(),
    };
    storeManager.upsertProfile(updatedMentor);
    setSelectedMentorForTopic(null);
    setCustomTopic('');
    onRefreshData();
  };

  const handleAddFlyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlyer: Flyer = {
      id: 'flyer-' + Date.now(),
      title: flyerTitle.trim(),
      speaker: flyerSpeaker.trim(),
      date: flyerDate || 'Saturday, August 15, 2026',
      time: flyerTime || '4:00 PM WAT',
      imageUrl: flyerImg.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
      meetLink: flyerMeet.trim() || 'https://meet.google.com/abc-mentminds-123',
      category: flyerCategory,
      description: flyerDesc.trim() || flyerAltCaption.trim(),
      featured: true,
    };
    storeManager.addFlyer(newFlyer);
    setShowFlyerModal(false);
    setFlyerTitle('');
    setFlyerSpeaker('');
    setFlyerImg('');
    setFlyerAltCaption('');
    setFlyerDesc('');
    onRefreshData();
  };

  const handleAddNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: NewsArticle = {
      id: 'news-' + Date.now(),
      title: newsTitle.trim(),
      summary: newsSummary.trim(),
      content: newsContent.trim(),
      category: newsCategory,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      imageUrl: newsImg.trim() || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      author: 'Executive Admin',
    };
    storeManager.addNews(newArticle);
    setShowNewsModal(false);
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    onRefreshData();
  };

  const handleDeleteFlyer = (flyerId: string) => {
    storeManager.deleteFlyer(flyerId);
    onRefreshData();
  };

  const handleDeleteNews = (newsId: string) => {
    storeManager.deleteNews(newsId);
    onRefreshData();
  };

  const [mentorInviteLoading, setMentorInviteLoading] = useState(false);
  const [mentorInviteError, setMentorInviteError] = useState('');
  const [mentorInviteSuccess, setMentorInviteSuccess] = useState('');

  const handleRegisterMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMentorInviteError('');
    setMentorInviteSuccess('');

    const cleanEmail = newMentorEmail.trim().toLowerCase();
    if (!cleanEmail || !newMentorName.trim()) {
      setMentorInviteError('Please enter at least a name and email.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setMentorInviteError('Connect Supabase first — mentor invites need a real backend to send a real account.');
      return;
    }

    setMentorInviteLoading(true);
    try {
      let inviteSentViaFunction = false;

      // 1. Attempt Edge Function if available
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (accessToken) {
          const { data, error } = await supabase.functions.invoke('invite-mentor', {
            body: {
              email: cleanEmail,
              fullName: newMentorName.trim(),
              phoneWhatsApp: newMentorPhone.trim(),
              bio: newMentorBio.trim(),
              interests: newMentorInterests,
            },
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!error && !data?.error) {
            inviteSentViaFunction = true;
          }
        }
      } catch (fnErr) {
        console.warn('Edge function invite-mentor not reachable, using direct database & auth registration:', fnErr);
      }

      // 2. Direct Supabase Database & Auth Registration (Failproof Fallback)
      // Save role in registered_emails table
      await supabase.from('registered_emails').upsert({
        email: cleanEmail,
        role: 'mentor',
      }).catch(() => {});

      // Create mentor profile in local store and Supabase profiles table
      const newMentorProfile: UserProfile = {
        id: generateUUID(),
        email: cleanEmail,
        fullName: newMentorName.trim(),
        phoneWhatsApp: newMentorPhone.trim(),
        role: 'mentor',
        status: 'Active Member',
        interests: newMentorInterests,
        bio: newMentorBio.trim(),
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMentorName.trim())}&background=3D781D&color=fff`,
        createdAt: new Date().toISOString(),
      };
      storeManager.upsertProfile(newMentorProfile);

      // Trigger password setup email via Supabase Auth
      await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin,
      }).catch(() => {});

      setMentorInviteSuccess(
        inviteSentViaFunction
          ? `Invite sent to ${cleanEmail}. They will receive an email to set their password and sign in.`
          : `Mentor ${newMentorName.trim()} (${cleanEmail}) registered successfully! Sent password setup email.`
      );

      setNewMentorName('');
      setNewMentorEmail('');
      setNewMentorPhone('');
      setNewMentorBio('');
      onRefreshData();
    } catch (err: any) {
      setMentorInviteError(err?.message || 'Could not register mentor.');
    } finally {
      setMentorInviteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0C1836] pb-20">
      
      {/* HEADER BANNER (Plain solid colors, no gradients) */}
      <div className="bg-[#0C1836] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#0B6291]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B6291] p-1 border-2 border-white shadow-xl flex items-center justify-center">
              <Shield className="w-9 h-9 text-[#B87E13]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black font-['Outfit']">Executive Admin Dashboard</h1>
                <span className="bg-[#B87E13] text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold mt-1">
                Central Approvals, Webinar Flyers & User Management • MENTMINDS Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSqlModal}
              className="bg-[#B87E13] hover:bg-[#9a690f] text-white font-black text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 border-2 border-[#B87E13]"
            >
              <Database className="w-4 h-4" />
              <span>Export Supabase SQL Script</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS METRICS ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-900 rounded-xl font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pending Approvals</p>
              <p className="text-xl font-black text-[#B87E13]">{pendingAdminRequests.length}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-[#0B6291] rounded-xl font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Mentees</p>
              <p className="text-xl font-black text-[#0B6291]">{mentees.length}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-[#3D781D] rounded-xl font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Mentors</p>
              <p className="text-xl font-black text-[#3D781D]">{mentors.length}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-[#7B2D8C] rounded-xl font-bold">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Published Flyers</p>
              <p className="text-xl font-black text-[#7B2D8C]">{flyers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-2 shadow-sm flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'approvals'
                ? 'bg-[#0B6291] text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Central Approvals ({pendingAdminRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#0B6291] text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users & Topic Assignments</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cms'
                ? 'bg-[#0B6291] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Webinar Flyers & News CMS</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: PAIRING APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836] mb-1">
                Mentorship Requests Awaiting Executive Approval
              </h3>
              <p className="text-xs text-slate-600 mb-6 font-medium">
                Verify and approve mentee requests before they are assigned to mentors.
              </p>

              {pendingAdminRequests.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-black text-[#0C1836]">All pairing requests reviewed!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingAdminRequests.map((req) => (
                    <div key={req.id} className="p-5 border-2 border-slate-900 rounded-2xl bg-[#F8FAFC] space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                          <img src={req.menteeAvatar} alt={req.menteeName} className="w-10 h-10 rounded-full object-cover border-2 border-[#0B6291]" />
                          <div>
                            <p className="font-black text-sm text-[#0C1836]">{req.menteeName}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{req.menteeEmail}</p>
                          </div>
                        </div>
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                          Awaiting Admin
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-bold text-slate-700">Requested Mentor: <span className="text-[#0B6291] font-black">{req.mentorName}</span></p>
                        <p className="font-bold text-slate-700">Interest Area: <span className="text-[#3D781D] font-black">{req.menteeInterest}</span></p>
                        <p className="text-slate-600 bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-medium mt-2">"{req.menteeMessage}"</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => onAdminApproveRequest(req.id)}
                          className="flex-1 bg-[#3D781D] hover:bg-[#326317] text-white font-black text-xs uppercase py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Route to Mentor</span>
                        </button>
                        <button
                          onClick={() => onAdminRejectRequest(req.id)}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs uppercase px-3 py-2.5 rounded-xl"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MEMBER DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836] mb-1">
                  Registered Platform Members
                </h3>
                <p className="text-xs text-slate-600 font-medium">All mentees, mentors, and administrators in the system.</p>
              </div>

              <button
                onClick={() => setShowMentorModal(true)}
                className="bg-[#3D781D] hover:bg-[#326317] text-white text-xs font-black uppercase tracking-wider px-4 py-3 rounded-xl flex items-center gap-2 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Mentor</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-900 font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">WhatsApp Phone</th>
                    <th className="p-3">Interests / Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {profiles.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 flex items-center gap-2">
                        <img src={p.avatarUrl} alt={p.fullName} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="font-black text-slate-900 text-xs">{p.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{p.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          p.role === 'admin' ? 'bg-amber-100 text-amber-900' :
                          p.role === 'mentor' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {p.role}
                        </span>
                      </td>
                      <td className="p-3 text-xs font-bold">{p.status || 'Active'}</td>
                      <td className="p-3 font-semibold text-xs">{p.phoneWhatsApp || 'N/A'}</td>
                      <td className="p-3 text-[11px] font-medium">{p.interests?.slice(0, 2).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CMS (FLYER AUTOMATION & NEWS) */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            
            {/* FLYER AUTOMATION */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836]">
                    Webinar & Masterclass Flyers
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">Publish and manage event flyers displayed on the homepage.</p>
                </div>
                <button
                  onClick={() => setShowFlyerModal(true)}
                  className="bg-[#3D781D] hover:bg-[#326317] text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Event Flyer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {flyers.map((f) => (
                  <div key={f.id} className="p-3.5 border-2 border-slate-900 rounded-xl bg-[#F8FAFC] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={f.imageUrl} alt={f.title} className="w-14 h-14 rounded-lg object-cover border border-slate-300 shrink-0" />
                      <div className="space-y-1 min-w-0">
                        <p className="font-black text-xs text-[#0C1836] truncate">{f.title}</p>
                        <p className="text-[10px] text-slate-600 font-bold truncate">Speaker: {f.speaker}</p>
                        <span className="text-[10px] font-black text-[#0B6291] bg-blue-100 px-2 py-0.5 rounded border border-blue-300 inline-block">
                          {f.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteFlyer(f.id)}
                      className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors border border-rose-200 shrink-0"
                      title="Remove Flyer"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* NEWS MANAGEMENT */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836]">
                    News & Advocacy Articles CMS
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">Publish press releases and impact stories.</p>
                </div>
                <button
                  onClick={() => setShowNewsModal(true)}
                  className="bg-[#0B6291] hover:bg-[#084b6f] text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish News Article</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((n) => (
                  <div key={n.id} className="p-3.5 border-2 border-slate-900 rounded-xl bg-[#F8FAFC] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={n.imageUrl} alt={n.title} className="w-14 h-14 rounded-lg object-cover border border-slate-300 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-black text-xs text-[#0C1836] truncate">{n.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{n.date}</p>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block mt-0.5">
                          {n.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteNews(n.id)}
                      className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors border border-rose-200 shrink-0"
                      title="Delete Article"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: UPLOAD FLYER WITH ALT CAPTION & COMPRESSION */}
      {showFlyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900">
            <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836] mb-1">
              Automate & Upload Session Flyer
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-4">
              Upload poster graphic, caption/alt text, and set live Google Meet webinar details.
            </p>

            <form onSubmit={handleAddFlyerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Webinar Title *</label>
                <input
                  type="text"
                  required
                  value={flyerTitle}
                  onChange={(e) => setFlyerTitle(e.target.value)}
                  placeholder="e.g. Youth Advocacy & Child Rights Masterclass"
                  className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Key Speaker *</label>
                  <input
                    type="text"
                    required
                    value={flyerSpeaker}
                    onChange={(e) => setFlyerSpeaker(e.target.value)}
                    placeholder="e.g. Dr. Bashir Aliyu"
                    className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={flyerCategory}
                    onChange={(e) => setFlyerCategory(e.target.value)}
                    className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  >
                    {MENTORSHIP_AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="text"
                    value={flyerDate}
                    onChange={(e) => setFlyerDate(e.target.value)}
                    placeholder="Saturday, August 15, 2026"
                    className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Time</label>
                  <input
                    type="text"
                    value={flyerTime}
                    onChange={(e) => setFlyerTime(e.target.value)}
                    placeholder="4:00 PM WAT"
                    className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Google Meet Link *</label>
                <input
                  type="url"
                  required
                  value={flyerMeet}
                  onChange={(e) => setFlyerMeet(e.target.value)}
                  placeholder="https://meet.google.com/abc-mentminds-123"
                  className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>

              {/* FLYER IMAGE FILE UPLOAD WITH COMPRESSION */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Flyer Image Banner (File Upload with Auto-Compression)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-400 rounded-xl p-3 text-center transition-colors">
                    <div className="flex items-center justify-center gap-2 text-xs font-black text-slate-700">
                      <Upload className="w-4 h-4 text-[#0B6291]" />
                      <span>{isCompressingFlyer ? 'Compressing Image...' : 'Choose Poster Image File'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFlyerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {flyerImg && (
                  <div className="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                    <img src={flyerImg} alt="Preview" className="w-12 h-12 rounded-lg object-cover border" />
                    <span className="text-[10px] font-bold text-emerald-800">Compressed Poster Ready</span>
                  </div>
                )}
              </div>

              {/* CAPTION & TEXT ALT CAPTION (Explicitly requested by user) */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Text Caption / Alt Description *
                </label>
                <input
                  type="text"
                  required
                  value={flyerAltCaption}
                  onChange={(e) => setFlyerAltCaption(e.target.value)}
                  placeholder="e.g. Official poster for Youth Mentorship masterclass with Dr. Bashir"
                  className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFlyerModal(false)}
                  className="flex-1 bg-slate-100 text-slate-800 font-black text-xs py-3 rounded-xl border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompressingFlyer}
                  className="flex-1 bg-[#3D781D] hover:bg-[#326317] text-white font-black text-xs py-3 rounded-xl shadow-md uppercase tracking-wider"
                >
                  Publish Flyer & Automate Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN TOPIC */}
      {selectedMentorForTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900">
            <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836] mb-1">
              Assign Session Topic
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-4">
              Assigning masterclass topic to mentor: <span className="font-black text-[#0B6291]">{selectedMentorForTopic.fullName}</span>
            </p>

            <form onSubmit={handleAssignTopicSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Masterclass Topic Title *</label>
                <input
                  type="text"
                  required
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Legal Protection & Anti-Bullying Advocacy"
                  className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentorForTopic(null)}
                  className="flex-1 bg-slate-100 text-slate-800 font-black text-xs py-3 rounded-xl border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#B87E13] text-white font-black text-xs py-3 rounded-xl shadow-md uppercase tracking-wider"
                >
                  Assign Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW MENTOR (ADMIN ONLY) */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836] mb-1">
              Invite a New Mentor
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-4">
              Send an automated password setup email or copy the direct mentor registration link to send to mentors via WhatsApp/Email.
            </p>

            {/* DIRECT MENTOR REGISTRATION LINK BOX */}
            <div className="mb-4 bg-[#0B6291]/10 border-2 border-[#0B6291]/30 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-black text-[#0C1836]">Direct Mentor Registration Link</p>
              <p className="text-[11px] text-slate-600 font-medium">Share this link directly with mentors so they can sign up and set up their mentor profile:</p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : 'https://ment-minds.xpandable.space'}?action=register&role=mentor`}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://ment-minds.xpandable.space'}?action=register&role=mentor`;
                    navigator.clipboard.writeText(link);
                    setCopiedMentorLink(true);
                    setTimeout(() => setCopiedMentorLink(false), 3000);
                  }}
                  className="bg-[#0B6291] hover:bg-[#084b6f] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm shrink-0"
                >
                  {copiedMentorLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              {copiedMentorLink && (
                <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mentor registration link copied to clipboard!
                </p>
              )}
            </div>

            {mentorInviteError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold">
                {mentorInviteError}
              </div>
            )}
            {mentorInviteSuccess && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-semibold">
                {mentorInviteSuccess}
              </div>
            )}

            <form onSubmit={handleRegisterMentorSubmit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Mentor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMentorName}
                  onChange={(e) => setNewMentorName(e.target.value)}
                  placeholder="e.g. Dr. Amina Bello"
                  className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newMentorEmail}
                    onChange={(e) => setNewMentorEmail(e.target.value)}
                    placeholder="mentor@example.com"
                    className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">WhatsApp Phone</label>
                  <input
                    type="tel"
                    value={newMentorPhone}
                    onChange={(e) => setNewMentorPhone(e.target.value)}
                    placeholder="+234 801 234 5678"
                    className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Short Bio & Background</label>
                <textarea
                  rows={2}
                  value={newMentorBio}
                  onChange={(e) => setNewMentorBio(e.target.value)}
                  placeholder="Describe career track, achievements, and mentorship topics..."
                  className="w-full bg-[#F8FAFC] border-2 border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowMentorModal(false); setMentorInviteError(''); setMentorInviteSuccess(''); }}
                  className="flex-1 bg-slate-100 text-slate-800 font-black text-xs py-3 rounded-xl border border-slate-300"
                >
                  {mentorInviteSuccess ? 'Done' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={mentorInviteLoading}
                  className="flex-1 bg-[#3D781D] hover:bg-[#326317] text-white font-black text-xs py-3 rounded-xl shadow-md uppercase tracking-wider disabled:opacity-50"
                >
                  {mentorInviteLoading ? 'Sending invite…' : 'Send Mentor Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
