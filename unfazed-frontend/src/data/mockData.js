// Mock Data Store for Unfazed Therapist SaaS

export const initialTherapist = {
  id: 'th-1',
  name: 'Dr. Aditi Sharma',
  prefix: 'Dr.',
  title: 'Senior Clinical Psychologist & Psychotherapist',
  qualification: 'Psy.D (Clin Psych), M.Phil (NIMHANS), RCI #A48921',
  experience: '8+ years clinical experience',
  email: 'dr.aditi@unfazed.in',
  phone: '+91 98450 12345',
  slug: 'dr-aditi-sharma',
  bio: 'Warm, trauma-informed clinical psychologist committed to non-judgmental, evidence-based care. Specializing in anxiety disorders, relational patterns, and high-functioning burnout for young adults and couples.',
  avatar: 'https://images.unsplash.com/photo-1594824813501-48ac9161a0f8?w=300&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&auto=format&fit=crop&q=80',
  location: 'Indiranagar, Bengaluru / Pan-India Online',
  languages: ['English', 'Hindi', 'Kannada'],
  specializations: [
    'Anxiety & Panic Disorders',
    'High-Functioning Burnout',
    'Trauma & Inner Child Work',
    'Couples & Relational Dynamics',
    'Adult ADHD Management',
    'Depression & Life Transitions'
  ],
  services: [
    {
      id: 'srv-1',
      title: 'Individual Psychotherapy',
      duration: 50,
      price: 2200,
      type: 'individual',
      description: 'One-on-one evidence-based therapy integrating CBT, ACT, and psychodynamic approaches.',
      badge: 'Most Popular'
    },
    {
      id: 'srv-2',
      title: 'Couples & Relationship Therapy',
      duration: 75,
      price: 3500,
      type: 'couples',
      description: 'Joint sessions focused on communication, attachment wounds, and rebuilding emotional safety.',
      badge: 'Joint Session'
    },
    {
      id: 'srv-3',
      title: 'Initial Consultation & Diagnostic Intake',
      duration: 45,
      price: 1500,
      type: 'intake',
      description: 'Comprehensive initial evaluation, symptom screening, and customized treatment planning.',
      badge: 'First Time'
    },
    {
      id: 'srv-4',
      title: 'Quick Check-in & Crisis Stabilization',
      duration: 30,
      price: 1200,
      type: 'checkin',
      description: 'Focused 30-minute support session for existing clients navigating acute situational stressors.',
      badge: 'Existing Clients'
    }
  ],
  availability: {
    timezone: 'Asia/Kolkata (IST)',
    bufferTime: 15,
    weeklySchedule: {
      monday: { active: true, start: '10:00', end: '19:00' },
      tuesday: { active: true, start: '10:00', end: '19:00' },
      wednesday: { active: true, start: '10:00', end: '19:00' },
      thursday: { active: true, start: '10:00', end: '19:00' },
      friday: { active: true, start: '10:00', end: '18:00' },
      saturday: { active: true, start: '10:00', end: '14:00' },
      sunday: { active: false, start: '10:00', end: '14:00' },
    },
    blockedDates: ['2026-09-15', '2026-09-24']
  },
  subscription: {
    tier: 'pro', // starter | pro | practice
    tierName: 'Growth Practice Tier',
    renewalDate: '2026-10-15',
    activeClientsCount: 8,
    activeClientsLimit: 35,
    storageUsedGb: 1.8,
    storageLimitGb: 10,
    features: {
      soap_notes: true,
      dap_notes: true,
      deep_analytics: true,
      whatsapp_notifications: true,
      custom_branding: true,
      multi_therapist: false
    }
  }
};

export const initialClients = [
  {
    id: 'cl-1',
    name: 'Ananya Sen',
    email: 'ananya.sen@gmail.com',
    phone: '+91 98201 54321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    age: 28,
    gender: 'Female',
    occupation: 'Lead Product Designer at Swiggy',
    location: 'Bengaluru, KA',
    status: 'Active',
    tags: ['Anxiety', 'Burnout', 'CBT', 'Perfectionism'],
    joinedDate: '2026-06-12',
    totalSessions: 8,
    lastSession: '2026-09-02',
    nextSession: '2026-09-10T11:00:00',
    package: {
      id: 'pkg-6',
      title: '6-Session Deep-Dive',
      total: 6,
      used: 4,
      remaining: 2,
      expiryDate: '2026-11-20',
      status: 'Active'
    },
    paymentStatus: 'Paid',
    consentSigned: true,
    consentDate: '2026-06-12T10:15:00',
    intakeSummary: {
      primaryConcern: 'Chronic work-related panic spikes, imposter syndrome, difficulty sleeping before major launches.',
      medicalHistory: 'No current medication. Mild iron deficiency.',
      emergencyContact: 'Dev Sen (Brother) - +91 98201 98765',
      preferredMode: 'Online Video (Google Meet)'
    }
  },
  {
    id: 'cl-2',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@outlook.com',
    phone: '+91 97112 33445',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    age: 34,
    gender: 'Male',
    occupation: 'Director of Growth, FinTech',
    location: 'Mumbai, MH',
    status: 'Active',
    tags: ['Panic Disorder', 'GAD', 'ACT', 'Somatic'],
    joinedDate: '2026-04-18',
    totalSessions: 14,
    lastSession: '2026-09-04',
    nextSession: '2026-09-11T16:00:00',
    package: {
      id: 'pkg-12',
      title: '12-Session Transformation',
      total: 12,
      used: 7,
      remaining: 5,
      expiryDate: '2026-12-15',
      status: 'Active'
    },
    paymentStatus: 'Paid',
    consentSigned: true,
    consentDate: '2026-04-18T14:30:00',
    intakeSummary: {
      primaryConcern: 'Agoraphobic panic reactions in crowded transport, physical palpitations.',
      medicalHistory: 'Prescribed Escitalopram 10mg by consulting psychiatrist Dr. Varma.',
      emergencyContact: 'Shalini Mehra (Spouse) - +91 97112 99887',
      preferredMode: 'Online Video'
    }
  },
  {
    id: 'cl-3',
    name: 'Priya & Varun Nair',
    email: 'priya.nair@craftstudio.in',
    phone: '+91 98455 77661',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&auto=format&fit=crop&q=80',
    age: 31,
    gender: 'Couple',
    occupation: 'Architect & Creative Director',
    location: 'Bengaluru, KA',
    status: 'Active',
    tags: ['Couples Therapy', 'Communication', 'Attachment'],
    joinedDate: '2026-07-05',
    totalSessions: 5,
    lastSession: '2026-08-28',
    nextSession: '2026-09-12T17:30:00',
    package: {
      id: 'pkg-3',
      title: '3-Session Booster',
      total: 3,
      used: 2,
      remaining: 1,
      expiryDate: '2026-10-01',
      status: 'Active'
    },
    paymentStatus: 'Paid',
    consentSigned: true,
    consentDate: '2026-07-05T18:00:00',
    intakeSummary: {
      primaryConcern: 'Recurring demand-withdraw conflict cycles regarding family boundaries and career prioritization.',
      medicalHistory: 'N/A',
      emergencyContact: 'Sunita Nair (Mother) - +91 98455 11223',
      preferredMode: 'In-Person Clinic'
    }
  },
  {
    id: 'cl-4',
    name: 'Devika Sundaram',
    email: 'devika.sundaram@gmail.com',
    phone: '+91 94440 88219',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    age: 42,
    gender: 'Female',
    occupation: 'Professor of Literature',
    location: 'Chennai, TN',
    status: 'Active',
    tags: ['Grief & Loss', 'Depression', 'Psychodynamic'],
    joinedDate: '2026-05-10',
    totalSessions: 9,
    lastSession: '2026-09-01',
    nextSession: '2026-09-14T14:00:00',
    package: null,
    paymentStatus: 'Paid',
    consentSigned: true,
    consentDate: '2026-05-10T11:00:00',
    intakeSummary: {
      primaryConcern: 'Complicated bereavement following the loss of mother in late 2025; persistent anhedonia.',
      medicalHistory: 'Hypothyroidism under regular endocrinologist management.',
      emergencyContact: 'Karthik Sundaram (Husband) - +91 94440 12903',
      preferredMode: 'Online Video'
    }
  },
  {
    id: 'cl-5',
    name: 'Kabir Verma',
    email: 'kabir.v@engineers.co',
    phone: '+91 99881 22334',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    age: 24,
    gender: 'Male',
    occupation: 'Full Stack Engineer',
    location: 'Pune, MH',
    status: 'Active',
    tags: ['Social Anxiety', 'Self-Esteem', 'CBT'],
    joinedDate: '2026-08-01',
    totalSessions: 3,
    lastSession: '2026-09-03',
    nextSession: '2026-09-15T15:00:00',
    package: {
      id: 'pkg-6',
      title: '6-Session Deep-Dive',
      total: 6,
      used: 3,
      remaining: 3,
      expiryDate: '2026-11-01',
      status: 'Active'
    },
    paymentStatus: 'Pending',
    consentSigned: true,
    consentDate: '2026-08-01T16:00:00',
    intakeSummary: {
      primaryConcern: 'Acute anxiety in team standups, fear of negative evaluation, avoidance of social gatherings.',
      medicalHistory: 'None reported.',
      emergencyContact: 'Rajesh Verma (Father) - +91 99881 55667',
      preferredMode: 'Online Video'
    }
  },
  {
    id: 'cl-6',
    name: 'Meera Kapoor',
    email: 'meera@themindfulbrand.in',
    phone: '+91 98100 45678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    age: 31,
    gender: 'Female',
    occupation: 'D2C Brand Founder',
    location: 'New Delhi, DL',
    status: 'Paused',
    tags: ['ADHD', 'Executive Dysfunction', 'Stress'],
    joinedDate: '2026-02-14',
    totalSessions: 11,
    lastSession: '2026-08-10',
    nextSession: null,
    package: null,
    paymentStatus: 'Paid',
    consentSigned: true,
    consentDate: '2026-02-14T10:00:00',
    intakeSummary: {
      primaryConcern: 'Adult ADHD diagnosis support, building systems for emotional regulation and task initiation.',
      medicalHistory: 'Methylphenidate 20mg PRN.',
      emergencyContact: 'Aakash Kapoor (Partner) - +91 98100 99881',
      preferredMode: 'Online Video'
    }
  },
  {
    id: 'cl-7',
    name: 'Arjun Singhania',
    email: 'arjun.singhania@bcg.com',
    phone: '+91 91760 99881',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    age: 29,
    gender: 'Male',
    occupation: 'Strategy Consultant',
    location: 'Hyderabad, TS',
    status: 'Completed',
    tags: ['Depression Remission', 'Relational', 'Graduated'],
    joinedDate: '2025-11-04',
    totalSessions: 16,
    lastSession: '2026-07-20',
    nextSession: null,
    package: null,
    paymentStatus: 'Paid',
    consentSigned: true,
    consentDate: '2025-11-04T12:00:00',
    intakeSummary: {
      primaryConcern: 'Episodes of dysthymia after relocation; successfully achieved therapeutic goals and graduated.',
      medicalHistory: 'None.',
      emergencyContact: 'Maya Singhania (Sister) - +91 91760 11223',
      preferredMode: 'Online Video'
    }
  },
  {
    id: 'cl-8',
    name: 'Tanya Joshi',
    email: 'tanya.joshi@creatorclub.xyz',
    phone: '+91 99002 88441',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    age: 26,
    gender: 'Female',
    occupation: 'Content Producer & Podcaster',
    location: 'Bengaluru, KA',
    status: 'Lead',
    tags: ['Intake Received', 'ADHD Screening', 'New Client'],
    joinedDate: '2026-09-08',
    totalSessions: 0,
    lastSession: null,
    nextSession: '2026-09-16T12:00:00',
    package: null,
    paymentStatus: 'Pending',
    consentSigned: true,
    consentDate: '2026-09-08T19:20:00',
    intakeSummary: {
      primaryConcern: 'Booked initial diagnostic session through public link. High sensory overload and chronic overwhelm.',
      medicalHistory: 'None reported.',
      emergencyContact: 'Kavita Joshi (Mother) - +91 99002 00112',
      preferredMode: 'In-Person Clinic'
    }
  }
];

export const initialAppointments = [
  {
    id: 'apt-1',
    clientId: 'cl-1',
    clientName: 'Ananya Sen',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Individual Psychotherapy',
    serviceId: 'srv-1',
    date: '2026-09-10',
    startTime: '11:00',
    endTime: '11:50',
    duration: 50,
    status: 'Confirmed',
    mode: 'Video Meet',
    meetLink: 'https://meet.google.com/unf-zkda-wqe',
    fee: 2200,
    paymentStatus: 'Paid',
    notesRecorded: false
  },
  {
    id: 'apt-2',
    clientId: 'cl-2',
    clientName: 'Rohan Mehra',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Individual Psychotherapy',
    serviceId: 'srv-1',
    date: '2026-09-10',
    startTime: '16:00',
    endTime: '16:50',
    duration: 50,
    status: 'Confirmed',
    mode: 'Video Meet',
    meetLink: 'https://meet.google.com/unf-mhr-rohn',
    fee: 2200,
    paymentStatus: 'Paid',
    notesRecorded: false
  },
  {
    id: 'apt-3',
    clientId: 'cl-3',
    clientName: 'Priya & Varun Nair',
    clientAvatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Couples & Relationship Therapy',
    serviceId: 'srv-2',
    date: '2026-09-11',
    startTime: '17:30',
    endTime: '18:45',
    duration: 75,
    status: 'Confirmed',
    mode: 'In-Person Clinic',
    meetLink: null,
    fee: 3500,
    paymentStatus: 'Paid',
    notesRecorded: false
  },
  {
    id: 'apt-4',
    clientId: 'cl-4',
    clientName: 'Devika Sundaram',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Individual Psychotherapy',
    serviceId: 'srv-1',
    date: '2026-09-12',
    startTime: '14:00',
    endTime: '14:50',
    duration: 50,
    status: 'Scheduled',
    mode: 'Video Meet',
    meetLink: 'https://meet.google.com/unf-dvk-sndm',
    fee: 2200,
    paymentStatus: 'Paid',
    notesRecorded: false
  },
  {
    id: 'apt-5',
    clientId: 'cl-5',
    clientName: 'Kabir Verma',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Individual Psychotherapy',
    serviceId: 'srv-1',
    date: '2026-09-14',
    startTime: '15:00',
    endTime: '15:50',
    duration: 50,
    status: 'Scheduled',
    mode: 'Video Meet',
    meetLink: 'https://meet.google.com/unf-kbr-vrma',
    fee: 2200,
    paymentStatus: 'Pending',
    notesRecorded: false
  },
  {
    id: 'apt-6',
    clientId: 'cl-8',
    clientName: 'Tanya Joshi',
    clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Initial Consultation & Diagnostic Intake',
    serviceId: 'srv-3',
    date: '2026-09-16',
    startTime: '12:00',
    endTime: '12:45',
    duration: 45,
    status: 'Upcoming',
    mode: 'In-Person Clinic',
    meetLink: null,
    fee: 1500,
    paymentStatus: 'Pending',
    notesRecorded: false
  },
  // Past sessions
  {
    id: 'apt-7',
    clientId: 'cl-1',
    clientName: 'Ananya Sen',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Individual Psychotherapy',
    serviceId: 'srv-1',
    date: '2026-09-02',
    startTime: '11:00',
    endTime: '11:50',
    duration: 50,
    status: 'Completed',
    mode: 'Video Meet',
    fee: 2200,
    paymentStatus: 'Paid',
    notesRecorded: true
  },
  {
    id: 'apt-8',
    clientId: 'cl-2',
    clientName: 'Rohan Mehra',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Individual Psychotherapy',
    serviceId: 'srv-1',
    date: '2026-09-04',
    startTime: '16:00',
    endTime: '16:50',
    duration: 50,
    status: 'Completed',
    mode: 'Video Meet',
    fee: 2200,
    paymentStatus: 'Paid',
    notesRecorded: true
  }
];

export const initialClinicalNotes = [
  {
    id: 'note-1',
    clientId: 'cl-1',
    clientName: 'Ananya Sen',
    sessionDate: '2026-09-02',
    title: 'Session #8: Addressing Product Launch Anticipatory Anxiety & Restructuring "All-or-Nothing" Beliefs',
    templateType: 'SOAP', // SOAP, DAP, General
    isShared: false, // PRIVATE THERAPIST NOTE!
    createdAt: '2026-09-02T12:15:00',
    updatedAt: '2026-09-02T12:45:00',
    content: {
      subjective: 'Client reports feeling "on edge constantly" over the upcoming Q3 Swiggy release. Noted waking up at 4 AM ruminating over edge-case design flaws. GAD-7 self-score 12 (Moderate).',
      objective: 'Client was alert, oriented, spoke with rapid speech cadence, frequent sighing. Affect was anxious but responsive to somatic grounding exercises (5-4-3-2-1 technique).',
      assessment: 'Generalized anxiety symptoms aggravated by perfectionist core beliefs ("If something goes wrong, it reflects on my core competence"). Good insight, receptive to behavioral experiments.',
      plan: 'Assigned thought record worksheet: identifying catastrophizing cognitive distortions. Recommended 10-minute physiological sigh breathing prior to standup meetings. Next session scheduled for Sep 10.'
    }
  },
  {
    id: 'note-2',
    clientId: 'cl-1',
    clientName: 'Ananya Sen',
    sessionDate: '2026-09-02',
    title: 'Shared Reflection & Takeaways: Nervous System Grounding & De-catastrophizing',
    templateType: 'General',
    isShared: true, // SHARED NOTE ACCESSIBLE BY CLIENT!
    createdAt: '2026-09-02T13:00:00',
    updatedAt: '2026-09-02T13:00:00',
    content: {
      text: `Hello Ananya! Here are our collaborative anchors from today's session:

1. **The 3-Step Reality Check**: When the urge to check Figma at 11 PM strikes, pause and ask: "Is this urgent tonight, or is my nervous system seeking control?"
2. **Physiological Sigh**: Double inhale through the nose, long extended sigh through the mouth (repeat 3-4 times). This activates your parasympathetic brake.
3. **Weekly Reflection Anchor**: Notice where "good enough" was actually 100% sufficient this week.

Take gentle care, and we will reconnect on Wednesday! 🌿`
    }
  },
  {
    id: 'note-3',
    clientId: 'cl-2',
    clientName: 'Rohan Mehra',
    sessionDate: '2026-09-04',
    title: 'Session #14: Somatic Interoceptive Exposure to Elevated Heart Rate',
    templateType: 'DAP',
    isShared: false, // PRIVATE NOTE
    createdAt: '2026-09-04T17:15:00',
    updatedAt: '2026-09-04T17:40:00',
    content: {
      data: 'Conducted 90-second step exercise in session to safely elicit tachycardia. Peak Subjective Units of Distress (SUDS) reached 65/100, dropping to 20/100 within 4 minutes with guided mindful acceptance.',
      assessment: 'Significant progress in de-coupling physical sensations from catastrophic misinterpretation (heart attack fears). Neurobiological tolerance to adrenaline is steadily improving.',
      plan: 'Client agreed to self-administer 60-second stair climbing at home twice this week while refraining from taking radial pulse.'
    }
  },
  {
    id: 'note-4',
    clientId: 'cl-3',
    clientName: 'Priya & Varun Nair',
    sessionDate: '2026-08-28',
    title: 'Session #5: De-escalating Negative Interaction Cycles (Gottman Four Horsemen)',
    templateType: 'SOAP',
    isShared: false, // PRIVATE NOTE
    createdAt: '2026-08-28T19:00:00',
    updatedAt: '2026-08-28T19:30:00',
    content: {
      subjective: 'Both partners reported a calm week overall, with one heated argument over weekend dinner plans triggering Priya\'s withdrawal and Varun\'s criticism.',
      objective: 'Both partners were punctual. Interpersonal body language softened after joint check-in. Able to reflect on emotional triggers without interrupting.',
      assessment: 'Classic Pursuer-Distancer dynamic. Varun feels unacknowledged; Priya feels flooded and shuts down. Both demonstrated improved ability to call a 20-minute time-out.',
      plan: 'Practice the "Softened Startup" protocol when raising sensitive topics. Assigned daily 10-minute appreciation ritual.'
    }
  },
  {
    id: 'note-5',
    clientId: 'cl-3',
    clientName: 'Priya & Varun Nair',
    sessionDate: '2026-08-28',
    title: 'Couple Shared Agreement: Softened Startups & Fair Fighting Rules',
    templateType: 'General',
    isShared: true, // SHARED NOTE
    createdAt: '2026-08-28T19:45:00',
    updatedAt: '2026-08-28T19:45:00',
    content: {
      text: `Warm takeaways for Priya & Varun:

- **The "I Feel" formula**: "I feel [emotion] about [specific situation], and I need [concrete positive action]" instead of starting with "You always..."
- **Calling a Time-Out**: Either partner can declare a 20-minute reset if heart rate exceeds 100 bpm. Return to the conversation at the agreed time.
- **Micro-Appreciations**: Share one small thing you appreciated about each other before bed.`
    }
  }
];

export const initialPackages = [
  {
    id: 'pkg-3',
    name: '3-Session Booster Pack',
    sessionCount: 3,
    price: 6000,
    pricePerSession: 2000,
    savingsPercent: 10,
    validityDays: 45,
    description: 'Ideal for short-term goal alignment, situational stress, or follow-up tune-ups.',
    features: ['3 x 50-minute sessions', '45 days validity', 'Free rescheduling (24h notice)', 'Shared therapy notes & worksheets'],
    activeClientsCount: 4,
    status: 'Active'
  },
  {
    id: 'pkg-6',
    name: '6-Session Deep-Dive',
    sessionCount: 6,
    price: 11400,
    pricePerSession: 1900,
    savingsPercent: 15,
    validityDays: 90,
    popular: true,
    description: 'Our most comprehensive package for sustained cognitive & behavioural transformation.',
    features: ['6 x 50-minute sessions', '90 days validity', 'Priority weekend booking', 'Continuous asynchronous check-in chat', 'Audio meditation guides'],
    activeClientsCount: 11,
    status: 'Active'
  },
  {
    id: 'pkg-12',
    name: '12-Session Transformation',
    sessionCount: 12,
    price: 21000,
    pricePerSession: 1750,
    savingsPercent: 20,
    validityDays: 180,
    description: 'Comprehensive long-term clinical care for chronic anxiety, complex trauma, and deep relational work.',
    features: ['12 x 50-minute sessions', '180 days validity', 'Dedicated emergency slot hold', 'Full psychometric re-assessments', 'WhatsApp emergency priority'],
    activeClientsCount: 3,
    status: 'Active'
  }
];

export const initialTransactions = [
  {
    id: 'tx-101',
    invoiceNumber: 'INV-2026-0089',
    clientId: 'cl-1',
    clientName: 'Ananya Sen',
    packageTitle: '6-Session Deep-Dive',
    amount: 11400,
    taxGst: 2052,
    totalAmount: 13452,
    date: '2026-08-15',
    method: 'UPI (Google Pay)',
    status: 'Completed',
    receiptUrl: '#'
  },
  {
    id: 'tx-102',
    invoiceNumber: 'INV-2026-0090',
    clientId: 'cl-2',
    clientName: 'Rohan Mehra',
    packageTitle: '12-Session Transformation',
    amount: 21000,
    taxGst: 3780,
    totalAmount: 24780,
    date: '2026-08-20',
    method: 'Net Banking (HDFC)',
    status: 'Completed',
    receiptUrl: '#'
  },
  {
    id: 'tx-103',
    invoiceNumber: 'INV-2026-0091',
    clientId: 'cl-3',
    clientName: 'Priya & Varun Nair',
    packageTitle: '3-Session Booster',
    amount: 6000,
    taxGst: 1080,
    totalAmount: 7080,
    date: '2026-08-25',
    method: 'Razorpay (Credit Card)',
    status: 'Completed',
    receiptUrl: '#'
  },
  {
    id: 'tx-104',
    invoiceNumber: 'INV-2026-0092',
    clientId: 'cl-4',
    clientName: 'Devika Sundaram',
    packageTitle: 'Individual Psychotherapy (Single)',
    amount: 2200,
    taxGst: 396,
    totalAmount: 2596,
    date: '2026-09-01',
    method: 'UPI (PhonePe)',
    status: 'Completed',
    receiptUrl: '#'
  },
  {
    id: 'tx-105',
    invoiceNumber: 'INV-2026-0093',
    clientId: 'cl-5',
    clientName: 'Kabir Verma',
    packageTitle: 'Individual Psychotherapy (Single)',
    amount: 2200,
    taxGst: 396,
    totalAmount: 2596,
    date: '2026-09-03',
    method: 'Pending UPI Link',
    status: 'Pending',
    receiptUrl: '#'
  }
];

export const initialMessages = [
  {
    id: 'msg-1',
    clientId: 'cl-1',
    sender: 'client',
    text: 'Good evening Dr. Sharma! Just wanted to share that the 4-7-8 breathing really helped before my design critique today.',
    timestamp: '2026-09-08T18:30:00',
    read: true
  },
  {
    id: 'msg-2',
    clientId: 'cl-1',
    sender: 'therapist',
    text: 'That is wonderful to hear, Ananya! Proud of you for putting the grounding tool into real-time practice. See you on Wednesday!',
    timestamp: '2026-09-08T18:45:00',
    read: true
  },
  {
    id: 'msg-3',
    clientId: 'cl-2',
    sender: 'client',
    text: 'Hi, should I complete the interoceptive exercise before or after work tomorrow?',
    timestamp: '2026-09-09T09:15:00',
    read: true
  },
  {
    id: 'msg-4',
    clientId: 'cl-2',
    sender: 'therapist',
    text: 'Ideally mid-afternoon when you have 15 minutes of quiet time, Rohan. Remember: discomfort is safe and temporary.',
    timestamp: '2026-09-09T09:30:00',
    read: true
  }
];

export const analyticsData = {
  monthlyRevenue: [
    { month: 'Apr', revenue: 74000, sessions: 38 },
    { month: 'May', revenue: 86000, sessions: 44 },
    { month: 'Jun', revenue: 98000, sessions: 52 },
    { month: 'Jul', revenue: 112000, sessions: 58 },
    { month: 'Aug', revenue: 134000, sessions: 67 },
    { month: 'Sep (P)', revenue: 148000, sessions: 72 }
  ],
  sessionTypeBreakdown: [
    { name: 'Individual Psychotherapy', value: 68, color: '#B46A72' },
    { name: 'Couples Therapy', value: 20, color: '#A8B58A' },
    { name: 'Initial Consultations', value: 12, color: '#A9B7C6' }
  ],
  clientGrowth: [
    { month: 'Apr', newClients: 5, activeClients: 16 },
    { month: 'May', newClients: 7, activeClients: 20 },
    { month: 'Jun', newClients: 8, activeClients: 25 },
    { month: 'Jul', newClients: 9, activeClients: 29 },
    { month: 'Aug', newClients: 11, activeClients: 33 },
    { month: 'Sep', newClients: 8, activeClients: 36 }
  ],
  kpis: {
    totalRevenueMonthly: 134000,
    activeClients: 36,
    sessionsCompletedMonth: 67,
    noShowRate: '3.8%',
    bookingConversion: '78%',
    pendingPayments: 4796
  }
};
