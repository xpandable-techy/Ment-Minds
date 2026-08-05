/**
 * MENTMINDS (RC8946867) Platform Main Application Entry
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhoWeAre } from './components/WhoWeAre';
import { AlmajiriBootcampShowcase } from './components/AlmajiriBootcampShowcase';
import { FlyerShowcase } from './components/FlyerShowcase';
import { FeaturedMentors } from './components/FeaturedMentors';
import { NewsSection } from './components/NewsSection';
import { PartnersSection } from './components/PartnersSection';
import { Footer } from './components/Footer';

import { AuthPage } from './components/AuthPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { CompleteMentorProfilePage } from './components/CompleteMentorProfilePage';
import { OnboardingModal } from './components/OnboardingModal';
import { CelebrationModal } from './components/CelebrationModal';
import { SupabaseSqlModal } from './components/SupabaseSqlModal';

import { MenteeDashboard } from './components/dashboards/MenteeDashboard';
import { MentorDashboard } from './components/dashboards/MentorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

import { initLocalDatabase, storeManager, authHelpers, isSupabaseConfigured, generateUUID } from './lib/supabase';
import { Flyer, MentorRequest, NewsArticle, Session, UserProfile } from './types';

type ActiveView = 'home' | 'dashboard' | 'auth' | 'reset-password' | 'complete-mentor-profile';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [eyeComfort, setEyeComfort] = useState(() => {
    try {
      return localStorage.getItem('mentminds_eye_comfort') === 'true';
    } catch {
      return false;
    }
  });

  const toggleEyeComfort = () => {
    setEyeComfort((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mentminds_eye_comfort', String(next));
      } catch {
        // ignore storage errors (e.g. private browsing)
      }
      return next;
    });
  };

  // Modals state
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [stubUserForOnboarding, setStubUserForOnboarding] = useState<UserProfile | null>(null);
  const [celebrationRequest, setCelebrationRequest] = useState<MentorRequest | null>(null);

  // App Data
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);

  // Load store data on mount (mentors, requests, sessions, flyers, news)
  const refreshData = async () => {
    initLocalDatabase();
    await storeManager.syncAllFromSupabase();
    setAllProfiles(storeManager.getAllProfiles());
    setRequests(storeManager.getRequests());
    setSessions(storeManager.getSessions());
    setFlyers(storeManager.getFlyers());
    setNews(storeManager.getNews());
  };

  useEffect(() => {
    refreshData();

    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      if (search.get('action') === 'register' || search.get('role') === 'mentor') {
        setActiveView('auth');
      }
    }

    const isInviteLink = typeof window !== 'undefined' && window.location.hash.includes('type=invite');
    let inviteConsumed = false;

    if (!isSupabaseConfigured) {
      const localUser = storeManager.getCurrentUser();
      if (localUser) {
        setCurrentUser(localUser);
      }
      setAuthLoading(false);
      return;
    }

    (async () => {
      const session = await authHelpers.getSession();
      if (session?.user) {
        const profile = await authHelpers.fetchProfile(session.user.id);
        const cached = storeManager.getCurrentUser();
        const userToSet: UserProfile = profile || cached || {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          dateOfBirth: '',
          phoneWhatsApp: '',
          role: (session.user.user_metadata?.role as any) || 'mentee',
          status: 'Fresh Mentee',
          interests: [],
          bio: '',
          avatarUrl: session.user.user_metadata?.avatar_url || '',
          socialLinks: {},
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(userToSet);
        storeManager.setCurrentUser(userToSet);
        if (isInviteLink && !inviteConsumed) {
          inviteConsumed = true;
          setActiveView('complete-mentor-profile');
        }
      }
      setAuthLoading(false);
    })();

    const { data: listener } = authHelpers.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setActiveView('reset-password');
        return;
      }
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        storeManager.setCurrentUser(null);
        setActiveView('home');
        return;
      }
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await authHelpers.fetchProfile(session.user.id);
        const cached = storeManager.getCurrentUser();
        const userToSet: UserProfile = profile || cached || {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          dateOfBirth: '',
          phoneWhatsApp: '',
          role: (session.user.user_metadata?.role as any) || 'mentee',
          status: 'Fresh Mentee',
          interests: [],
          bio: '',
          avatarUrl: session.user.user_metadata?.avatar_url || '',
          socialLinks: {},
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(userToSet);
        storeManager.setCurrentUser(userToSet);
        if (isInviteLink && !inviteConsumed) {
          inviteConsumed = true;
          setActiveView('complete-mentor-profile');
        } else {
          setActiveView((prev) => (prev === 'complete-mentor-profile' ? prev : 'dashboard'));
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Smooth Navigation Helper
  const handleNavigate = (sectionId: string) => {
    setActiveView('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSuccessLogin = (user: UserProfile, needsOnboarding: boolean) => {
    if (needsOnboarding) {
      setStubUserForOnboarding(user);
      setIsOnboardingModalOpen(true);
    } else {
      setCurrentUser(user);
      storeManager.setCurrentUser(user);
      setActiveView('dashboard');
      refreshData();
    }
  };

  // Onboarding Complete Callback
  const handleCompleteOnboarding = (completeUser: UserProfile) => {
    setIsOnboardingModalOpen(false);
    setStubUserForOnboarding(null);
    setCurrentUser(completeUser);
    setActiveView('dashboard');
    refreshData();
  };

  // Mentee Request Mentor Handler (Pipeline Step 1)
  const handleMenteeRequestMentor = (mentor: UserProfile, message: string, interest: string) => {
    if (!currentUser) return;
    const newRequest: MentorRequest = {
      id: generateUUID(),
      menteeId: currentUser.id,
      menteeName: currentUser.fullName || currentUser.email.split('@')[0],
      menteeAvatar: currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName || 'Mentee')}&background=0B6291&color=fff`,
      menteeEmail: currentUser.email,
      menteeWhatsApp: currentUser.phoneWhatsApp || '',
      menteeInterest: interest,
      menteeMessage: message,
      mentorId: mentor.id,
      mentorName: mentor.fullName,
      mentorAvatar: mentor.avatarUrl,
      mentorEmail: mentor.email,
      mentorWhatsApp: mentor.phoneWhatsApp || '',
      status: 'awaiting_admin', // Step 1: Awaiting Admin Approval
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storeManager.addRequest(newRequest);
    refreshData();
  };

  // Admin Approve Handler (Pipeline Step 2)
  const handleAdminApproveRequest = (requestId: string) => {
    storeManager.updateRequestStatus(requestId, 'sent_to_mentor');
    refreshData();
  };

  // Admin Reject Handler
  const handleAdminRejectRequest = (requestId: string) => {
    storeManager.updateRequestStatus(requestId, 'rejected');
    refreshData();
  };

  // Mentor Approve Handler (Pipeline Step 3 -> Triggers Celebration Modal!)
  const handleMentorApproveRequest = (request: MentorRequest) => {
    storeManager.updateRequestStatus(request.id, 'approved');
    refreshData();
    setCelebrationRequest(request);
  };

  // Mentor Reject Handler
  const handleMentorRejectRequest = (requestId: string) => {
    storeManager.updateRequestStatus(requestId, 'rejected');
    refreshData();
  };

  // Mentor Post Session Handler
  const handleCreateSession = (session: Session) => {
    storeManager.addSession(session);
    refreshData();
  };

  // Logout Handler
  const handleLogout = async () => {
    await authHelpers.signOut();
    storeManager.setCurrentUser(null);
    setCurrentUser(null);
    setActiveView('home');
    refreshData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0B6291]/20 border-t-[#0B6291] rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">Loading MentMinds…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#0C1836] font-['Plus_Jakarta_Sans'] antialiased flex flex-col justify-between ${eyeComfort ? 'eye-comfort' : ''}`}>
      
      {/* GLOBAL HEADER */}
      <Header
        currentUser={currentUser}
        onOpenAuthModal={() => setActiveView('auth')}
        onOpenOnboarding={() => {
          if (currentUser) {
            setStubUserForOnboarding(currentUser);
            setIsOnboardingModalOpen(true);
          }
        }}
        onNavigate={handleNavigate}
        onGoToDashboard={() => setActiveView('dashboard')}
        onLogout={handleLogout}
        activeView={activeView}
        eyeComfort={eyeComfort}
        onToggleEyeComfort={toggleEyeComfort}
      />

      {/* VIEW ROUTER */}
      <main className="flex-1">
        {activeView === 'home' ? (
          <>
            <Hero
              onOpenAuthModal={() => setActiveView('auth')}
              onNavigate={handleNavigate}
            />
            <WhoWeAre />
            <AlmajiriBootcampShowcase />
            <FlyerShowcase flyers={flyers} />
            <FeaturedMentors
              mentors={allProfiles.filter((p) => p.role === 'mentor')}
              currentUser={currentUser}
              onRequestMentor={(mentor) => {
                if (!currentUser) {
                  setActiveView('auth');
                } else {
                  setActiveView('dashboard');
                }
              }}
              onOpenAuthModal={() => setActiveView('auth')}
            />
            <NewsSection news={news} />
            <PartnersSection />
          </>
        ) : (
          (() => {
            const user = currentUser || storeManager.getCurrentUser();
            const userRole = user?.role || 'mentee';

            if (!user) {
              return (
                <div className="max-w-xl mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B6291]/10 flex items-center justify-center mx-auto text-[#0B6291]">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-['Outfit'] text-[#0C1836]">Setting Up Dashboard…</h3>
                  <p className="text-xs text-slate-500">Your account data is synchronizing. Click below to continue into your portal.</p>
                  <button
                    onClick={() => refreshData()}
                    className="bg-[#0B6291] hover:bg-[#084b6f] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
                  >
                    Refresh Dashboard
                  </button>
                </div>
              );
            }

            return (
              <>
                {(userRole === 'mentee' || (!['mentor', 'admin'].includes(userRole))) && (
                  <MenteeDashboard
                    currentUser={user}
                    mentors={allProfiles.filter((p) => p.role === 'mentor')}
                    requests={requests}
                    sessions={sessions}
                    onRefreshData={refreshData}
                    onRequestMentorSubmit={handleMenteeRequestMentor}
                  />
                )}

                {userRole === 'mentor' && (
                  <MentorDashboard
                    currentUser={user}
                    requests={requests}
                    sessions={sessions}
                    onRefreshData={refreshData}
                    onMentorApproveRequest={handleMentorApproveRequest}
                    onMentorRejectRequest={handleMentorRejectRequest}
                    onCreateSession={handleCreateSession}
                  />
                )}

                {userRole === 'admin' && (
                  <AdminDashboard
                    currentUser={user}
                    requests={requests}
                    profiles={allProfiles}
                    flyers={flyers}
                    news={news}
                    onRefreshData={refreshData}
                    onAdminApproveRequest={handleAdminApproveRequest}
                    onAdminRejectRequest={handleAdminRejectRequest}
                    onOpenSqlModal={() => setIsSqlModalOpen(true)}
                  />
                )}
              </>
            );
          })()
        )}
      </main>

      {/* GLOBAL FOOTER — admin entrance now just opens the same real sign-in;
          whether the account lands on the admin dashboard is decided by its
          `role` in the database, never by a password shipped in the bundle. */}
      <Footer
        onOpenAdminAuthModal={() => setActiveView('auth')}
        onNavigate={handleNavigate}
      />

      {/* FULL-PAGE AUTH FLOWS */}
      {activeView === 'auth' && (
        <AuthPage
          onClose={() => setActiveView('home')}
          onSuccessLogin={handleSuccessLogin}
        />
      )}

      {activeView === 'reset-password' && (
        <ResetPasswordPage onDone={() => setActiveView('auth')} />
      )}

      {activeView === 'complete-mentor-profile' && currentUser && (
        <CompleteMentorProfilePage
          currentUser={currentUser}
          onComplete={(updated) => {
            setCurrentUser(updated);
            storeManager.setCurrentUser(updated);
            setActiveView('dashboard');
            refreshData();
          }}
        />
      )}

      {stubUserForOnboarding && (
        <OnboardingModal
          isOpen={isOnboardingModalOpen}
          stubUser={stubUserForOnboarding}
          onCompleteOnboarding={handleCompleteOnboarding}
        />
      )}

      <CelebrationModal
        isOpen={Boolean(celebrationRequest)}
        request={celebrationRequest}
        onClose={() => setCelebrationRequest(null)}
      />

      <SupabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

    </div>
  );
}
