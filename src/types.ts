/**
 * MENTMINDS Platform Type Definitions
 */

export type UserRole = 'mentee' | 'mentor' | 'admin';

export type MenteeStatus = 'Fresh Mentee' | 'Active Mentee' | 'Alumni';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth?: string;
  phoneWhatsApp?: string;
  role: UserRole;
  interests: string[];
  bio: string;
  avatarUrl: string;
  status?: MenteeStatus | string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  expertise?: string[];
  coursesTaught?: string[];
  assignedTopic?: string;
  createdAt: string;
}

export type RequestStatus = 'awaiting_admin' | 'sent_to_mentor' | 'approved' | 'rejected';

export interface MentorRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  menteeEmail: string;
  menteeWhatsApp: string;
  menteeInterest: string;
  menteeMessage: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorEmail: string;
  mentorWhatsApp?: string;
  status: RequestStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  meetUrl: string;
  dateTime: string;
  audience: 'all' | 'specific';
  specificMenteeIds?: string[];
  status: 'pending_admin' | 'approved' | 'completed';
  topicAssignedByAdmin?: boolean;
  flyerUrl?: string;
  createdAt: string;
}

export interface Flyer {
  id: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  imageUrl: string;
  meetLink: string;
  category: string;
  featured?: boolean;
  description?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Announcement' | 'Advocacy' | 'Webinar' | 'Impact Story';
  date: string;
  imageUrl: string;
  author: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
