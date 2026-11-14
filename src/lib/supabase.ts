/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { INITIAL_FLYERS, INITIAL_NEWS, INITIAL_MENTORS } from '../data/mockData';
import { Flyer, MentorRequest, NewsArticle, Session, UserProfile } from '../types';

// Environment variables for Supabase
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase Client instance (will only connect if credentials exist)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Storage bucket used for mentee/mentor profile photos ("passports").
 * Create this bucket in Supabase Dashboard -> Storage (see the deployment guide).
 */
export const AVATAR_BUCKET = 'avatars';

/**
 * Uploads a profile photo to Supabase Storage and returns its public URL.
 * Returns null when Supabase isn't configured, so callers can fall back to
 * a local (base64) preview during offline/local development.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  try {
    if (!isSupabaseConfigured || !supabase || !supabase.storage || typeof (supabase.storage as any).from !== 'function') {
      return null;
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const path = `${userId}/${Date.now()}.${fileExt}`;

    const storageClient = supabase.storage;
    if (!storageClient || typeof storageClient.from !== 'function') return null;

    const { error } = await storageClient.from(AVATAR_BUCKET).upload(path, file, {
      upsert: true,
      cacheControl: '3600',
    });

    if (error) {
      console.warn('Avatar upload warning:', error.message);
      return null;
    }

    const { data } = storageClient.from(AVATAR_BUCKET).getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (err) {
    console.warn('Avatar upload catch error:', err);
    return null;
  }
}

/**
 * Real Supabase Auth session helpers. The rest of this file's `storeManager`
 * is a local-preview data layer used when Supabase isn't configured (or as an
 * offline cache); these functions talk to the real `auth.users` + `profiles`
 * tables and are what the app should trust for "is someone actually logged in".
 */
export const authHelpers = {
  async getSession() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('getSession warning:', error.message);
      return null;
    }
    return data.session;
  },

  onAuthStateChange(callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void) {
    if (!isSupabaseConfigured || !supabase) return { data: { subscription: { unsubscribe() {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  },

  /** Fetches a row from `profiles` for a given auth user id. profiles.role is authoritative. */
  async fetchProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error || !data) {
      if (error) console.warn('fetchProfile warning:', error?.message);
      return null;
    }

    // profiles.role is the single source of truth once an account exists.
    // registered_emails only decides the role assigned at signup time (via
    // the handle_new_user trigger) — it must never be re-applied here, or
    // a role change made afterwards (e.g. promoting someone to admin) would
    // get silently reverted on their very next login.
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      dateOfBirth: data.date_of_birth || '',
      phoneWhatsApp: data.phone_whatsapp || '',
      role: data.role,
      status: data.status,
      interests: data.interests || [],
      bio: data.bio || '',
      avatarUrl: data.avatar_url || '',
      socialLinks: data.social_links || {},
      expertise: data.expertise || [],
      coursesTaught: data.courses_taught || [],
      assignedTopic: data.assigned_topic,
      createdAt: data.created_at,
    };
  },
};

/**
 * Helper to generate valid UUID v4 string
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Local Storage State Keys for interactive preview mode
 */
const STORAGE_KEYS = {
  CURRENT_USER: 'mentminds_current_user',
  ALL_PROFILES: 'mentminds_all_profiles',
  REQUESTS: 'mentminds_mentor_requests',
  SESSIONS: 'mentminds_sessions',
  FLYERS: 'mentminds_flyers',
  NEWS: 'mentminds_news',
  NEWSLETTER_EMAILS: 'mentminds_newsletter_emails',
};

/**
 * Helper to initialize local storage mock DB
 */
export function initLocalDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.ALL_PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.ALL_PROFILES, JSON.stringify(INITIAL_MENTORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FLYERS)) {
    localStorage.setItem(STORAGE_KEYS.FLYERS, JSON.stringify(INITIAL_FLYERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
  }
}

/**
 * Local Data Access Methods
 */
export const storeManager = {
  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      this.upsertProfile(user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getAllProfiles(): UserProfile[] {
    initLocalDatabase();
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_PROFILES);
    return raw ? JSON.parse(raw) : [];
  },

  upsertProfile(profile: UserProfile) {
    const list = this.getAllProfiles();
    const cleanEmail = (profile.email || '').toLowerCase().trim();
    
    const idx = list.findIndex(
      (p) => (profile.id && p.id === profile.id) || (cleanEmail && p.email?.toLowerCase() === cleanEmail)
    );

    if (idx >= 0) {
      const existing = list[idx];
      // Merge non-null and non-empty values
      list[idx] = {
        ...existing,
        ...profile,
        id: profile.id || existing.id,
        fullName: profile.fullName || existing.fullName || cleanEmail.split('@')[0],
        dateOfBirth: profile.dateOfBirth || existing.dateOfBirth || '',
        phoneWhatsApp: profile.phoneWhatsApp || existing.phoneWhatsApp || '',
        avatarUrl: profile.avatarUrl || existing.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || cleanEmail.split('@')[0])}&background=0B6291&color=fff`,
        interests: (profile.interests && profile.interests.length > 0) ? profile.interests : existing.interests || [],
        bio: profile.bio || existing.bio || '',
        status: profile.status || existing.status || 'Active Member',
        socialLinks: { ...(existing.socialLinks || {}), ...(profile.socialLinks || {}) },
      };
    } else {
      list.push({
        ...profile,
        avatarUrl: profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || cleanEmail.split('@')[0])}&background=0B6291&color=fff`,
      });
    }

    localStorage.setItem(STORAGE_KEYS.ALL_PROFILES, JSON.stringify(list));

    // Async sync to Supabase Cloud Database if configured
    if (isSupabaseConfigured && supabase && profile.id) {
      const dbProfile = {
        id: profile.id,
        email: cleanEmail,
        full_name: profile.fullName || cleanEmail.split('@')[0],
        date_of_birth: profile.dateOfBirth ? profile.dateOfBirth : null,
        phone_whatsapp: profile.phoneWhatsApp ? profile.phoneWhatsApp : null,
        role: profile.role || 'mentee',
        status: profile.status || 'Active Member',
        interests: profile.interests || [],
        bio: profile.bio ? profile.bio : null,
        avatar_url: profile.avatarUrl || null,
        social_links: profile.socialLinks || {},
        updated_at: new Date().toISOString(),
      };

      supabase.from('profiles').upsert(dbProfile).then(({ error }) => {
        if (error) console.warn('Supabase DB sync warning:', error.message || error);
      }, (e) => console.warn('Supabase DB sync catch warning:', e));

      // Also sync user_metadata in Supabase Auth session
      if (profile.avatarUrl) {
        supabase.auth.updateUser({ data: { avatar_url: profile.avatarUrl, full_name: profile.fullName } }).catch(() => {});
      }
    }
  },

  getMentors(): UserProfile[] {
    return this.getAllProfiles().filter((p) => p.role === 'mentor');
  },

  getRequests(): MentorRequest[] {
    initLocalDatabase();
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return raw ? JSON.parse(raw) : [];
  },

  saveRequests(requests: MentorRequest[]) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  },

  addRequest(req: MentorRequest) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.id);
    const validId = isUUID ? req.id : generateUUID();
    req.id = validId;

    const list = this.getRequests();
    const idx = list.findIndex((r) => r.id === req.id);
    if (idx >= 0) {
      list[idx] = req;
    } else {
      list.unshift(req);
    }
    this.saveRequests(list);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mentor_requests').insert({
        id: validId,
        mentee_id: req.menteeId,
        mentee_name: req.menteeName,
        mentee_avatar: req.menteeAvatar,
        mentee_email: req.menteeEmail,
        mentee_whatsapp: req.menteeWhatsApp,
        mentee_interest: req.menteeInterest,
        mentee_message: req.menteeMessage,
        mentor_id: req.mentorId,
        mentor_name: req.mentorName,
        mentor_avatar: req.mentorAvatar,
        mentor_email: req.mentorEmail,
        status: req.status,
      }).then(({ error }) => {
        if (error) console.warn('Supabase add request warning:', error.message || error);
      }, (e) => console.warn('Supabase add request catch warning:', e));
    }
  },

  updateRequestStatus(requestId: string, status: MentorRequest['status'], adminNote?: string) {
    const list = this.getRequests();
    const idx = list.findIndex((r) => r.id === requestId);
    if (idx >= 0) {
      list[idx].status = status;
      if (adminNote !== undefined) list[idx].adminNote = adminNote;
      list[idx].updatedAt = new Date().toISOString();
      this.saveRequests(list);
    }

    if (isSupabaseConfigured && supabase) {
      const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (adminNote !== undefined) update.admin_note = adminNote;
      supabase.from('mentor_requests').update(update).eq('id', requestId).then(({ error }) => {
        if (error) console.warn('Supabase update request warning:', error.message || error);
      }, (e) => console.warn('Supabase update request catch warning:', e));
    }
  },

  getSessions(): Session[] {
    initLocalDatabase();
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  },

  addSession(session: Session) {
    const list = this.getSessions();
    list.unshift(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      supabase.from('sessions').insert({
        id: session.id,
        title: session.title,
        description: session.description,
        mentor_id: session.mentorId,
        mentor_name: session.mentorName,
        mentor_avatar: session.mentorAvatar,
        meet_url: session.meetUrl,
        date_time: session.dateTime,
        audience: session.audience,
        specific_mentee_ids: session.specificMenteeIds || [],
        status: session.status,
        topic_assigned_by_admin: session.topicAssignedByAdmin || false,
        flyer_url: session.flyerUrl,
      }).then(({ error }) => {
        if (error) console.warn('Supabase add session warning:', error.message || error);
      }, (e) => console.warn('Supabase add session catch warning:', e));
    }
  },

  getFlyers(): Flyer[] {
    initLocalDatabase();
    const raw = localStorage.getItem(STORAGE_KEYS.FLYERS);
    const storedList: Flyer[] = raw ? JSON.parse(raw) : [];

    const updated = INITIAL_FLYERS.map((initF) => {
      const existing = storedList.find((item) => item.id === initF.id || item.title === initF.title);
      return existing
        ? { ...existing, imageUrl: initF.imageUrl, featured: initF.featured }
        : initF;
    });

    for (const f of storedList) {
      if (!updated.some((item) => item.id === f.id || item.title === f.title)) {
        updated.push(f);
      }
    }
    return updated;
  },

  addFlyer(flyer: Flyer) {
    const list = this.getFlyers();
    list.unshift(flyer);
    localStorage.setItem(STORAGE_KEYS.FLYERS, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      supabase.from('flyers').insert({
        id: flyer.id,
        title: flyer.title,
        speaker: flyer.speaker,
        date: flyer.date,
        time: flyer.time,
        image_url: flyer.imageUrl,
        meet_link: flyer.meetLink,
        category: flyer.category,
        featured: flyer.featured,
        description: flyer.description,
      }).then(({ error }) => {
        if (error) console.warn('Supabase add flyer warning:', error.message || error);
      }, (e) => console.warn('Supabase add flyer catch warning:', e));
    }
  },

  deleteFlyer(flyerId: string) {
    const list = this.getFlyers().filter((f) => f.id !== flyerId);
    localStorage.setItem(STORAGE_KEYS.FLYERS, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      supabase.from('flyers').delete().eq('id', flyerId).then(({ error }) => {
        if (error) console.warn('Supabase delete flyer warning:', error.message || error);
      }, (e) => console.warn('Supabase delete flyer catch warning:', e));
    }
  },

  getNews(): NewsArticle[] {
    initLocalDatabase();
    const raw = localStorage.getItem(STORAGE_KEYS.NEWS);
    const storedList: NewsArticle[] = raw ? JSON.parse(raw) : [];

    const updated = INITIAL_NEWS.map((initN) => {
      const existing = storedList.find((item) => item.id === initN.id || item.title === initN.title);
      return existing
        ? { ...existing, imageUrl: initN.imageUrl }
        : initN;
    });

    for (const n of storedList) {
      if (!updated.some((item) => item.id === n.id || item.title === n.title)) {
        updated.push(n);
      }
    }
    return updated;
  },

  addNews(article: NewsArticle) {
    const list = this.getNews();
    list.unshift(article);
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      // NOTE: table is `news_articles` (previously this pointed at a
      // nonexistent `news` table, so every publish silently failed).
      supabase.from('news_articles').insert({
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        category: article.category,
        date: article.date,
        image_url: article.imageUrl,
        author: article.author,
      }).then(({ error }) => {
        if (error) console.warn('Supabase add news warning:', error.message || error);
      }, (e) => console.warn('Supabase add news catch warning:', e));
    }
  },

  deleteNews(newsId: string) {
    const list = this.getNews().filter((n) => n.id !== newsId);
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      supabase.from('news_articles').delete().eq('id', newsId).then(({ error }) => {
        if (error) console.warn('Supabase delete news warning:', error.message || error);
      }, (e) => console.warn('Supabase delete news catch warning:', e));
    }
  },

  /**
   * Pulls the latest profiles, mentor requests, sessions, flyers, and news
   * from Supabase and refreshes the local cache that the synchronous
   * getters above read from. Call this before reading data whenever the
   * result needs to reflect what other people/devices have done — e.g. on
   * app load and after any dashboard action. No-ops when Supabase isn't
   * configured (local preview mode keeps working off the cache only).
   */
  async syncAllFromSupabase() {
    if (!isSupabaseConfigured || !supabase) return;

    const [profilesRes, requestsRes, sessionsRes, flyersRes, newsRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('mentor_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('sessions').select('*').order('created_at', { ascending: false }),
      supabase.from('flyers').select('*').order('created_at', { ascending: false }),
      supabase.from('news_articles').select('*').order('created_at', { ascending: false }),
    ]);

    if (!profilesRes.error && profilesRes.data) {
      const mapped: UserProfile[] = profilesRes.data.map((p: any) => ({
        id: p.id,
        email: p.email,
        fullName: p.full_name,
        dateOfBirth: p.date_of_birth || '',
        phoneWhatsApp: p.phone_whatsapp || '',
        role: p.role,
        status: p.status,
        interests: p.interests || [],
        bio: p.bio || '',
        avatarUrl: p.avatar_url || '',
        socialLinks: p.social_links || {},
        expertise: p.expertise || [],
        coursesTaught: p.courses_taught || [],
        assignedTopic: p.assigned_topic,
        createdAt: p.created_at,
      }));
      localStorage.setItem(STORAGE_KEYS.ALL_PROFILES, JSON.stringify(mapped));
    }

    if (!requestsRes.error && requestsRes.data) {
      const mappedFromSupabase: MentorRequest[] = requestsRes.data.map((r: any) => ({
        id: r.id,
        menteeId: r.mentee_id,
        menteeName: r.mentee_name,
        menteeAvatar: r.mentee_avatar,
        menteeEmail: r.mentee_email,
        menteeWhatsApp: r.mentee_whatsapp,
        menteeInterest: r.mentee_interest,
        menteeMessage: r.mentee_message,
        mentorId: r.mentor_id,
        mentorName: r.mentor_name,
        mentorAvatar: r.mentor_avatar,
        mentorEmail: r.mentor_email,
        status: r.status,
        adminNote: r.admin_note,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));

      // Merge local storage requests so offline / unauthenticated requests are preserved
      const localList = this.getRequests();
      const merged = [...mappedFromSupabase];
      for (const loc of localList) {
        if (!merged.some((item) => item.id === loc.id)) {
          merged.push(loc);
        }
      }
      this.saveRequests(merged);
    }

    if (!sessionsRes.error && sessionsRes.data) {
      const mapped: Session[] = sessionsRes.data.map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        mentorId: s.mentor_id,
        mentorName: s.mentor_name,
        mentorAvatar: s.mentor_avatar,
        meetUrl: s.meet_url,
        dateTime: s.date_time,
        audience: s.audience,
        specificMenteeIds: s.specific_mentee_ids || [],
        status: s.status,
        topicAssignedByAdmin: s.topic_assigned_by_admin,
        flyerUrl: s.flyer_url,
        createdAt: s.created_at,
      }));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(mapped));
    }

    if (!flyersRes.error && flyersRes.data) {
      const mapped: Flyer[] = flyersRes.data.map((f: any) => ({
        id: f.id,
        title: f.title,
        speaker: f.speaker,
        date: f.date,
        time: f.time,
        imageUrl: f.image_url,
        meetLink: f.meet_link,
        category: f.category,
        featured: f.featured,
        description: f.description,
      }));
      localStorage.setItem(STORAGE_KEYS.FLYERS, JSON.stringify(mapped));
    }

    if (!newsRes.error && newsRes.data) {
      const mapped: NewsArticle[] = newsRes.data.map((n: any) => ({
        id: n.id,
        title: n.title,
        summary: n.summary,
        content: n.content,
        category: n.category,
        date: n.date,
        imageUrl: n.image_url,
        author: n.author,
      }));
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(mapped));
    }
  },

  subscribeNewsletter(email: string) {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWSLETTER_EMAILS) || '[]';
    const emails: string[] = JSON.parse(raw);
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER_EMAILS, JSON.stringify(emails));
    }
  },
};
