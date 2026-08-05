import { Flyer, NewsArticle } from '../types';

/**
 * Real MentMinds content: webinar flyers and news/impact articles shown
 * on the public home page. These are genuine organizational content, not
 * placeholder data — unlike the mentor/team/admin mock records that used
 * to live in this file, which have been removed now that the platform is
 * live and mentors/admins are real Supabase accounts.
 */
export const INITIAL_FLYERS: Flyer[] = [
  {
    id: 'flyer-alamin',
    title: 'Navigating Mental Health as a Student, Leader, and Dreamer – Staying Mentally Healthy Amidst the Pressures',
    speaker: 'Dr. Alamin Usman',
    date: 'This Saturday',
    time: '9:00 PM - 10:00 PM WAT',
    imageUrl: '/flyers/alamin.jpg',
    meetLink: 'https://meet.google.com/mentminds-mental-health',
    category: 'Mental Health & Wellbeing',
    featured: true,
    description: 'Medical Doctor & Advocate for Regulation of Doctors Working Hours in Nigeria. Learn how to stay mentally healthy amidst high student pressures, overcome burnout, and manage ambition with resilience. Contact: 09078976717 | Instagram: @ment.minds',
  },
  {
    id: 'flyer-ibrahim',
    title: 'From Passion to Impact: Building a Life of Purpose Through Advocacy',
    speaker: 'Rt. Hon. Ibrahim Zanna Sunoma',
    date: 'This Saturday',
    time: '9:00 PM - 10:00 PM WAT',
    imageUrl: '/flyers/ibrahim.jpg',
    meetLink: 'https://meet.google.com/mentminds-advocacy-impact',
    category: 'Child Rights & Youth Advocacy',
    featured: true,
    description: 'Child Rights and Youth Advocate. Learn how to transform personal passion into structured community advocacy, defend child rights, and build a purpose-driven life. Contact: 09078976717 | Instagram: @ment.minds',
  },
  {
    id: 'flyer-ameer',
    title: 'SPEAK WITH PURPOSE: The Art of Public Speaking – How to Speak with Confidence Anywhere',
    speaker: 'Ameer Saeed',
    date: 'This Saturday',
    time: '9:00 AM - 10:00 AM WAT',
    imageUrl: '/flyers/ameer_flyer.jpg',
    meetLink: 'https://meet.google.com/mentminds-public-speaking',
    category: 'Public Speaking & Communication',
    featured: true,
    description: 'Youth Leader, Advocate, Public Speaker & Communicator. Communication skills every changemaker needs. Great speakers aren\'t born; they\'re built with practice, purpose, and courage. Contact: 09078976717 | Instagram: @ment.minds | mentminds@gmail.com',
  },
  {
    id: 'flyer-1',
    title: 'Weekly Masterclass: Defending Child Rights & Anti-Bullying Advocacy',
    speaker: 'Dr. Bashir Aliyu & Dr. Zainab Farouk',
    date: 'Saturday, August 8, 2026',
    time: '4:00 PM WAT',
    imageUrl: '/flyers/dr bashir and dr xainab farouk.jpg',
    meetLink: 'https://meet.google.com/abc-mentminds-123',
    category: 'Advocacy & Child Rights',
    featured: true,
    description: 'Learn legal channels to report child abuse, stand up against bullying, and collaborate with child protection authorities.',
  },
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-kawo-wardhead',
    title: 'MENTMINDS Partners with Ward Head of Kawo to Empower 20 Almajiri Children in Local & Digital Skills',
    summary: 'Historic community engagement in Kawo, Kaduna State to train Almajiri children in Computer Design, Woodwork, Tailoring, Mechanic, Welding, and Aluminum Works.',
    content: 'MENTMINDS team held an inspiring high-level meeting with the Ward Head of Kawo, Kaduna State, to launch a comprehensive initiative empowering 20 Almajiri children with local vocational and digital skills. The Ward Head commended the team for their sincerity and community-first structure. Key local industry partners include: 1) Ahmad Graphix Design LTD (Computer training, printing & design), 2) Black Bature Company (Woodwork, furniture & carpentry), and 3) Sani Aluminum LTD (Glass doors, windows & aluminum fabrication).',
    category: 'Impact Story',
    date: 'July 5, 2025',
    imageUrl: '/outreach/ward_head_meeting.jpg',
    author: 'Amb. Yusuf A. Khalil',
  },
  {
    id: 'news-tsangaya-outreach',
    title: 'MENTMINDS Team Visits 3 Tsangaya Schools in Kawo to Integrate Vocational & Digital Skills into Almajiri Education',
    summary: 'Productive engagements with Malams Yakubu, Garzali, Badamasi, and Jafar to roll out tailoring, welding, mechanics, barbing, soap making, and tech training.',
    content: 'Our dedicated outreach team visited 3 Tsangaya schools in Kawo, engaging in warm and productive discussions with respected community teachers Malam Yakubu, Malam Garzali, Malam Badamasi, and Malam Jafar. All leaders expressed strong support for combining traditional Almajiri learning with hands-on vocational trade skills (tailoring, welding, mechanics, barbing, soap making) and digital literacy, building futures of dignity, hope, and self-reliance.',
    category: 'Advocacy',
    date: 'July 5, 2025',
    imageUrl: '/outreach/kawo_outreach.jpg',
    author: 'MENTMINDS Community Outreach Team',
  },
  {
    id: 'news-1',
    title: 'MENTMINDS Partners with Child Rights Authorities to Rescue 120 Out-of-School Children',
    summary: 'Through grassroots intervention and legal advocacy, MENTMINDS successfully enrolled 120 Almajiri children into formal skill acquisition centers.',
    content: 'MENTMINDS (RC8946867) has reached another major milestone in its advocacy campaign. In collaboration with local child protection authorities and legal partners, 120 out-of-school youth have been placed in structured vocational programs covering tailoring, solar installation, and computer literacy.',
    category: 'Advocacy',
    date: 'July 24, 2026',
    imageUrl: '/flyers/rescued out of school children.jpg',
    author: 'MENTMINDS Press Office',
  },
  {
    id: 'news-2',
    title: 'Over 600 Mentees Graduate from 100% Free Leadership & Tech Bootcamps',
    summary: 'The 2026 Cohort celebrated graduation with certified skills in public speaking, digital rights, and web development.',
    content: 'Our commitment to providing 100% free education remains unwavering. MENTMINDS celebrated the passing out of 600 mentees who completed 3 months of rigorous weekend mentorship classes.',
    category: 'Impact Story',
    date: 'July 10, 2026',
    imageUrl: '/flyers/children.jpg',
    author: 'Amina Bello, Lead Coordinator',
  },
  {
    id: 'news-3',
    title: 'Anti-Bullying Task Force Launched Across High Schools & Youth Hubs',
    summary: 'A direct reporting hotline and peer counselling network established to hand over oppressors to enforcement agencies.',
    content: 'Bullying strips young people of their dignity and academic potential. MENTMINDS has officially deployed its Anti-Bullying Task Force equipped with legal aid and mental health counselors.',
    category: 'Announcement',
    date: 'June 28, 2026',
    imageUrl: '/flyers/anti bulying task force.jpg',
    author: 'Dr. Zainab Farouk',
  }
];
