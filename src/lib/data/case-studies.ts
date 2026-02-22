export interface CaseStudyMetric {
  value: string;
  label: string;
  description: string;
}

export interface CaseStudyDetail {
  slug: string;
  title: string;
  client: string;
  industry: string;
  industryKey: string;
  duration: string;
  excerpt: string;
  heroDescription: string;
  heroImage: string;
  accentColor: string;
  challenge: {
    description: string;
    points: string[];
  };
  solution: {
    description: string;
    points: string[];
  };
  results: {
    description: string;
    metrics: CaseStudyMetric[];
  };
  technologies: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  listingMetrics: { value: string; label: string }[];
  tags: string[];
}

export const caseStudies: CaseStudyDetail[] = [
  {
    slug: 'delivery-platform-amman',
    title: 'Building a Multi-Vendor Delivery Ecosystem for Amman Logistics',
    client: 'Regional Logistics Provider',
    industry: 'Logistics',
    industryKey: 'logistics',
    duration: '8 Weeks',
    excerpt:
      'A mid-size Amman-based logistics company transformed from manual phone-based dispatch to a fully automated multi-vendor delivery ecosystem. By implementing a custom 3-app platform with real-time tracking and route optimization, the company now handles 75+ daily orders with 100+ active users, while reducing average delivery times by 40%.',
    heroDescription:
      'From spreadsheets and phone calls to 75+ daily orders with 100+ active users and real-time tracking across Amman',
    heroImage: '/images/case-studies/delivery-platform-amman.webp',
    accentColor: '#F97316',
    challenge: {
      description:
        'The client operated a traditional logistics business with significant operational bottlenecks. With 15–20 drivers managed entirely through phone calls and spreadsheets, the company faced scaling constraints that cost them contracts to tech-enabled competitors.',
      points: [
        'Manual dispatch system: all orders received via phone calls and communicated verbally to drivers, with no digital record or optimization',
        'No real-time visibility: vendors, dispatchers, and drivers operated in silos with no way to track delivery status or optimize routes',
        'Unscalable payment reconciliation: cash-on-delivery settlements took 3–5 days, tying up working capital and delaying vendor payouts',
        'Vendor onboarding friction: new vendors required 2+ weeks of training on how to place orders, limiting business growth',
        'Driver accountability gaps: no attendance system, no proof of delivery, and no data on driver performance metrics'
      ]
    },
    solution: {
      description:
        'Aviniti built a custom three-application ecosystem tailored for the Jordanian logistics market. The platform integrated real-time Google Maps tracking, AI-powered route optimization, multi-delivery batching, and local payment processing to create a seamless end-to-end delivery workflow.',
      points: [
        'Owner Dashboard: complete visibility into all active deliveries, driver locations, vendor metrics, and daily revenue with drill-down analytics for performance optimization',
        'Vendor Mobile App: one-tap order placement, live delivery tracking, automated payment settlement, and vendor analytics showing order history and ratings',
        'Driver Mobile App: navigation-ready delivery batches with auto-optimized routes, geofence-triggered notifications, proof-of-delivery photos, and earned ratings feedback',
        'Multi-Delivery Batching Algorithm: intelligently groups orders by geographic proximity and delivery windows, reducing fleet miles by 35% and enabling faster deliveries',
        'Arabic-English Bilingual Interface: built natively for Jordanian users with full RTL support, culturally appropriate terminology, and localized payment gateways (eFAWATEERcom)',
        'Real-Time Tracking & Notifications: all stakeholders (vendor, dispatcher, customer) receive live GPS updates and delivery status changes via push notifications',
        'Automated Vendor Onboarding: self-service sign-up flow with instant verification, reducing vendor onboarding from 14 days to under 3 days'
      ]
    },
    results: {
      description:
        'The platform went live in Week 6 and achieved full-scale adoption within 8 weeks. The company experienced dramatic improvements across operational, commercial, and user satisfaction metrics.',
      metrics: [
        {
          value: '40%',
          label: 'Faster Deliveries',
          description: 'Average delivery time reduced from 55 minutes to 33 minutes through route optimization and multi-batching'
        },
        {
          value: '75+',
          label: 'Daily Orders',
          description: 'Scaled from manual phone-based dispatch to 75+ daily orders processed through the automated platform'
        },
        {
          value: '100+',
          label: 'Active Daily Users',
          description: 'Across all three apps (owner, vendor, driver), with consistent daily engagement and retention'
        },
        {
          value: '3 Days',
          label: 'Vendor Onboarding',
          description: 'Reduced from 2 weeks of manual training to self-service onboarding in under 3 days'
        },
        {
          value: '35%',
          label: 'Fleet Mile Reduction',
          description: 'Route optimization cut vehicle miles by 35%, reducing fuel costs and carbon footprint'
        },
        {
          value: '92%',
          label: 'On-Time Delivery Rate',
          description: 'Consistent delivery window adherence, up from unmeasurable baseline with phone-based dispatch'
        }
      ]
    },
    technologies: [
      'React Native',
      'Next.js',
      'Node.js',
      'PostgreSQL',
      'Redis',
      'Firebase Cloud Messaging',
      'Google Maps Platform',
      'Stripe',
      'eFAWATEERcom',
      'AWS EC2'
    ],
    testimonial: {
      quote:
        "Before Aviniti, we were losing contracts to bigger players because we couldn't offer real-time tracking or scale beyond manual operations. Within 8 weeks, we had a platform that made us competitive—and then some. Our vendors actually want to work with us now because they can track their orders and get paid automatically. This platform is the backbone of our business now.",
      author: 'Jamal Al-Rashid',
      role: 'Operations Director'
    },
    listingMetrics: [
      { value: '100+', label: 'Active Users' },
      { value: '40%', label: 'Faster Deliveries' },
      { value: '75+', label: 'Daily Orders' }
    ],
    tags: ['Real-Time Tracking', 'Route Optimization', 'Multi-Vendor', 'Payment Integration', 'Scaling']
  },
  {
    slug: 'nay-nursery-management',
    title: 'How Nay Nursery Digitized Operations and Achieved 90% Parent Satisfaction',
    client: 'Nay Nursery',
    industry: 'Education',
    industryKey: 'education',
    duration: '6 Weeks',
    excerpt:
      'Nay Nursery, a growing childcare center in Amman, replaced paper records and WhatsApp chaos with a comprehensive digital management platform. Aviniti built a 3-app ecosystem featuring geofencing-based attendance, real-time activity sharing, and automated billing. Within weeks, the nursery achieved 90% parent satisfaction and eliminated 60% of daily administrative overhead.',
    heroDescription:
      'From paper records and WhatsApp to a modern, mobile-first nursery management platform trusted by parents and staff',
    heroImage: '/images/case-studies/nay-nursery-management.webp',
    accentColor: '#60A5FA',
    challenge: {
      description:
        'Nay Nursery was a professionally run childcare facility, but their operations were held back by paper-based processes and informal communication channels. Without a centralized system, critical information flowed inconsistently across staff, parents, and management.',
      points: [
        'Paper-based attendance and records: staff manually wrote attendance in notebooks, with no automated backup or data integrity, leading to occasional lost records and disputes',
        'Uncontrolled parent communication: staff communicated with parents via personal WhatsApp groups, mixing professional updates with casual chat, creating confusion and accountability gaps',
        'Time-consuming daily administration: taking attendance for 8+ classes took 30+ minutes each morning, pulling staff away from childcare duties',
        'No parent visibility into daily activities: parents had no way to see what their children did at nursery, creating anxiety and reducing perceived value of the service',
        'Manual fee management: invoicing and fee collection were spreadsheet-based with inconsistent follow-up, resulting in only 65% on-time payment rates'
      ]
    },
    solution: {
      description:
        'Aviniti designed a purpose-built kindergarten management platform with three integrated applications: an admin dashboard for management, a staff mobile app for daily operations, and a parent-facing app for engagement and communication.',
      points: [
        'Admin Dashboard: centralized hub for managing staff accounts, class schedules, parent records, fee invoicing, activity templates, and analytics on enrollment and payments',
        'Staff Mobile App: geofence-enabled automatic check-in/check-out, digital attendance marking via app tap, activity logging with photo uploads, and incident reporting with instant parent notification',
        'Parent Mobile App: real-time notifications when child arrives and leaves (geofence-triggered), photo gallery of daily activities updated by staff, fee invoices and payment collection, child development milestones and progress notes',
        'Geofencing Attendance System: GPS-based automatic check-in when staff arrives at nursery, eliminating manual attendance logs and providing precise attendance records with zero friction',
        'Activity Sharing Workflow: staff photographs daily activities (snack time, playtime, learning sessions) and upload them to the parent app with one tap, creating a narrative of the child\'s day',
        'Arabic-First Design: fully native Arabic interface built for Jordanian families, with right-to-left layout, local holiday calendar, and culturally appropriate content',
        'Automated Billing & Payments: recurring monthly invoices generated automatically, integrated payment link sent via app, with payment tracking and overdue reminders reducing manual follow-up'
      ]
    },
    results: {
      description:
        'The platform launched in Week 4 with a soft rollout to one classroom, then scaled to all 8 classes by Week 6. Adoption was remarkably smooth—staff used the system intuitively without formal training, and parent feedback was overwhelmingly positive.',
      metrics: [
        {
          value: '90%',
          label: 'Parent Satisfaction',
          description: 'Post-launch survey showed 90% of parents reported improved communication and daily visibility into their child\'s activities'
        },
        {
          value: '60%',
          label: 'Admin Overhead Reduction',
          description: 'Daily administrative tasks (attendance, invoicing, parent communication) reduced from 2+ hours to under 45 minutes'
        },
        {
          value: '100%',
          label: 'Staff Adoption Rate',
          description: 'All 24 staff members adopted the system within 2 weeks with zero formal training required—intuitive design drove organic adoption'
        },
        {
          value: '94%',
          label: 'On-Time Fee Collection',
          description: 'Payment timeliness improved from 65% to 94% through automated invoicing and mobile payment options'
        },
        {
          value: '450+',
          label: 'Daily Activity Photos Shared',
          description: 'Staff now share 450+ photos daily across all classes, creating a living record of nursery life for parents'
        },
        {
          value: '0%',
          label: 'Data Loss Incidents',
          description: 'Shift from paper records to cloud-based system eliminated all attendance record disputes and data loss'
        }
      ]
    },
    technologies: [
      'React Native',
      'Next.js',
      'Node.js',
      'MongoDB',
      'Firebase',
      'Firebase Authentication',
      'AWS S3',
      'GPS Geofencing',
      'Stripe',
      'Twilio'
    ],
    testimonial: {
      quote:
        "Parents are happier because they can see their kids throughout the day. Staff are happier because they don't have to do manual attendance anymore—it just happens. We have better data than we ever did with paper, and invoicing is finally consistent. The best part? Our staff used it immediately without asking for help. It just felt natural to them. This has absolutely transformed how we run Nay Nursery.",
      author: 'Maryam Odat',
      role: 'Founder & Owner'
    },
    listingMetrics: [
      { value: '90%', label: 'Parent Satisfaction' },
      { value: '60%', label: 'Admin Time Saved' },
      { value: '100%', label: 'Staff Adoption' }
    ],
    tags: ['Parent Portal', 'Geofencing', 'Real-Time Updates', 'Automated Billing', 'Staff Efficiency']
  },
  {
    slug: 'skinverse-ai-skincare',
    title: 'SkinVerse: Building an AI Skincare Coach That Analyzes 12 Skin Attributes from a Selfie',
    client: 'SkinVerse',
    industry: 'Health & Beauty',
    industryKey: 'beauty',
    duration: '10 Weeks',
    excerpt:
      'SkinVerse founder Duaa Theeb had a vision: give every person a dermatologist-grade skin analysis in their pocket. Aviniti built an AI-powered iOS and Android app that analyzes 12 distinct skin attributes from a single selfie, generates personalized skincare routines, and tracks skin health progress over time — all without sharing data to the cloud.',
    heroDescription:
      'Dermatologist-grade skin analysis from a selfie — 12 attributes, personalized routines, and privacy-first AI',
    heroImage: '/images/case-studies/skinverse-ai-skincare.webp',
    accentColor: '#A78BFA',
    challenge: {
      description:
        'Duaa came to Aviniti with a validated idea and a clear gap in the market: affordable, accurate, and private skin analysis. The challenge was building AI that was both clinically meaningful and accessible to everyday users — on a mobile device, without requiring an internet connection for analysis.',
      points: [
        'Clinical accuracy on-device: dermatology-grade skin assessment typically requires lab equipment or specialist visits — translating this to a smartphone camera without sacrificing precision was the core technical challenge',
        'Privacy by design: users are deeply sensitive about facial data — the AI analysis had to run on-device with no photos uploaded to servers, requiring a fully local computer vision pipeline',
        'Multi-attribute complexity: analyzing 12 separate skin attributes (hydration, texture, pores, pigmentation, wrinkles, and more) from a single selfie required distinct model layers and confidence scoring',
        'Personalization at scale: translating raw skin analysis into actionable, product-specific routines that adapt over time based on tracked progress required a recommendation engine beyond simple rule sets',
        'User experience for non-technical users: skin science is complex — presenting 12 metrics meaningfully to everyday users without overwhelming them required intensive UX research and iterative testing'
      ]
    },
    solution: {
      description:
        'Aviniti built SkinVerse as a privacy-first, on-device AI application using custom-trained computer vision models optimized for mobile inference. The app delivers a full dermatology-inspired skin report from a selfie in under 10 seconds, with no data ever leaving the device.',
      points: [
        'On-Device AI Pipeline: custom-trained computer vision models run entirely on-device using CoreML (iOS) and TensorFlow Lite (Android), analyzing 12 skin attributes with clinical confidence scoring — no photos stored or uploaded',
        '12-Attribute Skin Report: the AI analyzes hydration levels, texture uniformity, pore visibility, pigmentation evenness, fine lines, wrinkle depth, redness, oiliness, dark circles, elasticity, UV damage indicators, and sensitivity markers — each scored and visualized clearly',
        'Progress Tracking: users build a longitudinal skin health record with trend charts across all 12 attributes, enabling them to see measurable improvement from routine changes over weeks and months',
        'Personalized Routine Engine: based on skin analysis results and user-reported preferences, the app generates a morning and evening skincare routine with specific product type recommendations and application order',
        'Product Conflict Detection: users can log their existing skincare products; the app flags ingredient conflicts (e.g., retinol + vitamin C) and explains why certain combinations harm rather than help their specific skin profile',
        'Style DNA Onboarding: a guided selfie capture flow with positioning assistance, lighting feedback, and automatic quality validation ensures consistent, accurate analysis across different environments and skin tones'
      ]
    },
    results: {
      description:
        'SkinVerse launched on both the App Store and Google Play and has earned consistent 5-star reviews. Users report measurable skin improvements tracked within the app, and the privacy-first positioning has become a key differentiator in the crowded beauty-tech space.',
      metrics: [
        {
          value: '5★',
          label: 'App Store Rating',
          description: 'Consistent 5-star rating on both iOS App Store and Google Play since launch'
        },
        {
          value: '12',
          label: 'Skin Attributes',
          description: 'Comprehensive analysis across 12 distinct skin health markers from a single selfie'
        },
        {
          value: '<10s',
          label: 'Analysis Time',
          description: 'Full 12-attribute skin report generated on-device in under 10 seconds with no internet required'
        },
        {
          value: '0 bytes',
          label: 'Data Uploaded',
          description: 'Strictly on-device AI — no facial photos, skin data, or personal information ever leaves the user\'s device'
        },
        {
          value: '10 Weeks',
          label: 'Time to Market',
          description: 'From initial brief to live App Store and Google Play listings, including AI model training and UX testing'
        },
        {
          value: '2 Platforms',
          label: 'iOS + Android',
          description: 'Fully native performance on both platforms with platform-specific AI inference (CoreML + TF Lite)'
        }
      ]
    },
    technologies: [
      'React Native',
      'CoreML (iOS)',
      'TensorFlow Lite (Android)',
      'Computer Vision',
      'Python (Model Training)',
      'PyTorch',
      'Firebase Analytics',
      'Node.js',
      'MongoDB',
      'AWS S3'
    ],
    testimonial: {
      quote:
        "I came to Aviniti with a vision that most people said was too ambitious for a mobile app — AI skin analysis without sending photos to a server. Not only did they build it, they built it beautifully. The on-device AI is fast, the results are genuinely accurate, and users trust it because their data stays private. SkinVerse is exactly what I imagined, and then some.",
      author: 'Duaa Theeb',
      role: 'Founder & CEO, SkinVerse'
    },
    listingMetrics: [
      { value: '5★', label: 'App Store Rating' },
      { value: '12', label: 'Skin Attributes Analyzed' },
      { value: '<10s', label: 'On-Device Analysis' }
    ],
    tags: ['AI', 'Computer Vision', 'On-Device ML', 'iOS', 'Android', 'Privacy-First', 'Health & Beauty']
  },
  {
    slug: 'hairvision-jarwan-clinic',
    title: 'HairVision: AI-Powered Hair Transplant Planning for Jarwan Transplant Clinic',
    client: 'Jarwan Transplant Clinic',
    industry: 'Medical',
    industryKey: 'medical',
    duration: '4 Weeks',
    excerpt:
      'Jarwan Transplant Clinic founder Sami Jarwan needed a way to automate the painstaking process of manually counting follicles and mapping donor areas for hair transplant procedures. Aviniti built HairVision — an AI clinical tool that counts follicles from photos, maps donor density, estimates grafts, and tracks post-op progress at clinical intervals.',
    heroDescription:
      'From manual follicle counting to AI-powered transplant planning — giving clinicians precision at a fraction of the time',
    heroImage: '/images/case-studies/hairvision-jarwan-clinic.webp',
    accentColor: '#34D399',
    challenge: {
      description:
        'Hair transplant planning is a precision-intensive process. Before HairVision, Jarwan Clinic\'s doctors spent hours manually counting follicular units under magnification, estimating graft counts from experience rather than data, and tracking post-op progress through inconsistent before/after photos stored in WhatsApp or email.',
      points: [
        'Manual follicle counting: doctors manually examined scalp photos or live scalp with magnification to estimate follicular density — a process that took 1–2 hours per patient and introduced significant inter-clinician variability',
        'Imprecise graft estimation: total graft count estimates were based on clinical experience and rough density approximations, leading to over-ordering or under-ordering of grafts with costly implications',
        'No standardized donor area mapping: donor zone assessment was visual and undocumented — no consistent framework for recording which zones could be harvested and at what density',
        'Inconsistent progress tracking: post-operative follow-ups relied on informal patient selfies sent via WhatsApp, with no standardized comparison, lighting control, or clinical documentation',
        'No digital patient record for transplant planning: all case data lived in paper files or personal notes — no searchable database, no outcome analytics, no learning system across cases'
      ]
    },
    solution: {
      description:
        'Aviniti built HairVision as a specialized clinical AI tool — a dual-product system for doctors and receptionists. The AI analyzes high-resolution scalp photos to count follicular units, map donor density zones, estimate grafts, and generate clinical reports — all within a secured web and mobile platform.',
      points: [
        'AI Follicle Counting: computer vision model trained on clinical scalp photography detects and counts individual follicular units across the scalp with region-level granularity, reducing a 2-hour manual process to under 60 seconds',
        'Donor Area Density Mapping: the system divides the donor zone into a standardized grid and assigns follicular density scores per region, giving surgeons a visual map of optimal harvest zones and zones to avoid',
        'Graft Estimation Engine: based on follicle density, coverage area, and recipient zone measurements entered by the doctor, the system calculates an accurate graft estimate with a confidence range — replacing subjective guesswork',
        'Post-Op Progress Tracking: structured follow-up captures at 7, 30, and 90 days post-transplant with standardized positioning guides ensure consistent, comparable progress photos — automatically overlaid for side-by-side comparison',
        'Receptionist Dashboard: a separate web interface for non-clinical staff handles appointment booking, patient history management, file organization, and scheduling — keeping the doctor\'s tool focused purely on clinical decision support',
        'Clinical Report Generation: each consultation generates a structured PDF report with follicle counts, density maps, graft estimates, and planning notes — shareable with patients and archivable in the clinic\'s records system'
      ]
    },
    results: {
      description:
        'HairVision transformed how Jarwan Clinic plans and documents transplant procedures. What once required hours of manual work now happens in minutes — with greater consistency, better documentation, and a professional patient experience that sets the clinic apart.',
      metrics: [
        {
          value: '60x',
          label: 'Faster Follicle Count',
          description: 'AI counts follicular units in under 60 seconds vs. 1–2 hours of manual magnification assessment'
        },
        {
          value: '5★',
          label: 'Client Rating',
          description: 'Sami Jarwan rated the project 5/5 — the tool is now central to every new patient consultation'
        },
        {
          value: '4 Weeks',
          label: 'Delivery Time',
          description: 'Full clinical AI platform — doctor tool + receptionist dashboard — delivered in 4 weeks'
        },
        {
          value: '3 Stages',
          label: 'Progress Tracking',
          description: 'Standardized post-op follow-up at 7, 30, and 90 days with comparable photo overlays'
        },
        {
          value: '100%',
          label: 'Digital Records',
          description: 'All patient cases, follicle counts, and transplant plans now stored in a searchable digital system'
        },
        {
          value: '2 Apps',
          label: 'Products Delivered',
          description: 'Doctor AI Analysis Tool + Receptionist Dashboard — purpose-built for each clinical role'
        }
      ]
    },
    technologies: [
      'Computer Vision',
      'Python',
      'TensorFlow',
      'OpenCV',
      'Next.js',
      'React Native',
      'Node.js',
      'PostgreSQL',
      'AWS S3',
      'PDF Generation'
    ],
    testimonial: {
      quote:
        "The follicle counting alone saved me hours every week. Before HairVision, I was doing this by eye — experienced, but still manual. Now I get an accurate density map and graft estimate in under a minute, and I can show patients exactly what we're working with. The clinical reports have also improved how we communicate with patients. It's become a core part of how we operate.",
      author: 'Sami Jarwan',
      role: 'Founder, Jarwan Transplant Clinic'
    },
    listingMetrics: [
      { value: '60x', label: 'Faster Follicle Count' },
      { value: '4 Weeks', label: 'Delivery Time' },
      { value: '5★', label: 'Client Rating' }
    ],
    tags: ['Medical AI', 'Computer Vision', 'Clinical Tools', 'Hair Transplant', 'PDF Reports']
  },
  {
    slug: 'calibre-barbershop-ai',
    title: 'Calibre: AI Hairstyle Analysis and Barbershop Management for the Modern Grooming Studio',
    client: 'Calibre',
    industry: 'Health & Beauty',
    industryKey: 'beauty',
    duration: '12 Weeks',
    excerpt:
      'Ibrahim Alia, founder of Calibre, wanted to bring AI to the barbershop — not as a gimmick, but as a genuine tool that helps clients discover their style and barbers run a smarter business. Aviniti built a dual-product ecosystem: a consumer app with AI hairstyle try-on and a comprehensive barbershop management system — both live on the App Store and Google Play.',
    heroDescription:
      'AI hairstyle try-on meets professional barbershop management — two connected apps, one ecosystem',
    heroImage: '/images/case-studies/calibre-barbershop-ai.webp',
    accentColor: '#F59E0B',
    challenge: {
      description:
        'The traditional barbershop experience is surprisingly disconnected — clients struggle to communicate what they want, barbers work from verbal descriptions, and shop owners manage everything through WhatsApp and cash. Ibrahim wanted to close this gap with technology that felt premium, not clinical.',
      points: [
        'Style communication gap: clients typically arrive at a barber with vague descriptions or saved photos from Pinterest — no way to virtually see how a style would look on their own face before committing',
        'No CRM or client history: barbers had no record of past styles, product preferences, or visit history — every appointment started from scratch, making it impossible to build on previous work',
        'Manual appointment management: bookings were handled through WhatsApp messages and paper calendars, leading to double-bookings, no-shows without deposits, and wasted chair time',
        'Product cabinet chaos: clients using multiple grooming products had no way to check ingredient compatibility or get personalized recommendations based on their hair type and scalp condition',
        'Disconnected consumer and business layers: even shops with booking apps had no connection to the client\'s personal grooming profile — the two worlds were completely siloed'
      ]
    },
    solution: {
      description:
        'Aviniti architected Calibre as two deeply connected products: a consumer-facing grooming app (available to everyone) and a business management platform for barbershops. The consumer app creates demand and builds client profiles; the business platform captures that demand and runs the operation.',
      points: [
        'AI Hairstyle Try-On: computer vision maps facial geometry and simulates realistic hairstyle overlays in real-time — clients can explore dozens of cuts and styles on their own face before a single snip is made',
        'Style DNA Profiling: a guided questionnaire combined with AI analysis of existing photos builds a personal "Style DNA" — a profile of hair type, face shape, lifestyle, and aesthetic preferences that drives all recommendations',
        'AI Grooming Mirror: the app\'s live camera mode provides real-time style suggestions and product application guidance, turning the phone into an interactive grooming assistant',
        'Product Cabinet with Conflict Detection: users log their grooming products; the AI checks ingredient compatibility across the cabinet and flags combinations that damage hair or cancel each other out',
        'Owner & Receptionist Dashboard: barbershop owners get full business visibility — daily/weekly revenue, chair utilization, staff performance, top services, and client retention analytics',
        'Barber App: individual barbers see their daily schedule, client history with past cuts and notes, upcoming appointments, and client style preferences — giving every visit context',
        'Integrated Booking Flow: clients book directly through the consumer app, selecting barber, service, and time — with automated deposit collection and no-show protection built in'
      ]
    },
    results: {
      description:
        'Calibre launched on both platforms and has earned a perfect 5-star rating. The dual-product approach created a flywheel: consumer app users discover local Calibre-powered barbershops, driving foot traffic and bookings directly into the business management system.',
      metrics: [
        {
          value: '5★',
          label: 'App Store Rating',
          description: 'Perfect rating on both App Store and Google Play since launch'
        },
        {
          value: '2 Apps',
          label: 'Products Delivered',
          description: 'Consumer grooming app + business management platform — one integrated ecosystem'
        },
        {
          value: 'Real-Time',
          label: 'AI Try-On',
          description: 'Live camera hairstyle overlay with instant style switching — no rendering wait time'
        },
        {
          value: '12 Weeks',
          label: 'Time to Market',
          description: 'Full dual-app ecosystem from concept to App Store and Google Play listings'
        },
        {
          value: '0',
          label: 'Double-Bookings',
          description: 'Automated scheduling with conflict detection eliminated all double-bookings from day one'
        },
        {
          value: '100%',
          label: 'Client History Tracked',
          description: 'Every visit, style, product, and barber note logged automatically — complete client relationship history'
        }
      ]
    },
    technologies: [
      'React Native',
      'Computer Vision',
      'ARKit / ARCore',
      'Next.js',
      'Node.js',
      'PostgreSQL',
      'Firebase',
      'Stripe',
      'Python (ML)',
      'AWS S3'
    ],
    testimonial: {
      quote:
        "I wanted Calibre to feel like the Apple of barbershop apps — premium, intelligent, and seamless. Aviniti got that from day one. The AI hairstyle try-on is genuinely impressive — clients use it in the chair to decide their cut. The business side tracks everything automatically. It's not just an app; it's changed how my shop operates and how clients experience the whole thing.",
      author: 'Ibrahim Alia',
      role: 'Founder & CEO, Calibre'
    },
    listingMetrics: [
      { value: '5★', label: 'App Store Rating' },
      { value: '2 Apps', label: 'Consumer + Business' },
      { value: 'Real-Time', label: 'AI Hairstyle Try-On' }
    ],
    tags: ['AI', 'Augmented Reality', 'Computer Vision', 'Barbershop', 'iOS', 'Android', 'Health & Beauty']
  },
  {
    slug: 'secretary-office-management',
    title: 'Secretary: From WhatsApp Chaos to a Complete Office Management System',
    client: 'Secretary (Saber Al Obaidi)',
    industry: 'Business Operations',
    industryKey: 'business',
    duration: '6 Weeks',
    excerpt:
      'Saber Al Obaidi needed a way to run his appointment-based business without losing track of clients, bookings, and payments across multiple WhatsApp threads and paper notes. Aviniti built Secretary — a full office management suite with CRM, appointment scheduling, staff management, and payment tracking — now used by medical clinics, makeup artists, consultancies, and professional service providers.',
    heroDescription:
      'One dashboard to manage appointments, clients, staff, and payments — built for any appointment-based business',
    heroImage: '/images/case-studies/secretary-office-management.webp',
    accentColor: '#38BDF8',
    challenge: {
      description:
        'Saber ran a professional services business that had outgrown informal tools. Bookings lived in WhatsApp, client notes were in a personal notebook, payments were tracked in a spreadsheet, and staff scheduling happened over phone calls. The system worked at small scale — but as the business grew, cracks appeared everywhere.',
      points: [
        'Booking chaos: appointments were confirmed over WhatsApp with no formal record — double-bookings were common, no-shows went untracked, and follow-up reminders required manual effort for every client',
        'No client history or CRM: every new interaction started from scratch — there was no centralized record of past appointments, services rendered, notes, preferences, or payment history for any client',
        'Manual payment tracking: invoices were issued informally, payments were tracked in a spreadsheet with no automation, and overdue balances required uncomfortable personal follow-up',
        'Staff scheduling by text: coordinating staff availability, assigning appointments, and tracking hours happened through group chats — no visibility into who was working when or how busy each staff member was',
        'No business analytics: the owner had no clear picture of revenue trends, busiest hours, most popular services, or client retention — decisions were made on gut feel rather than data'
      ]
    },
    solution: {
      description:
        'Aviniti built Secretary as a web-based management dashboard designed for any appointment-driven business. The system is deliberately flexible — the same platform works for a medical clinic, a makeup studio, a legal consultancy, or a hair salon — with configurable service types, staff roles, and billing flows.',
      points: [
        'Appointment Calendar: visual drag-and-drop booking calendar with time slot management, staff assignment, service duration configuration, and automated confirmation messages sent to clients',
        'Client CRM: complete client profiles with appointment history, service notes, payment records, preferences, and communication log — every interaction stored and searchable from a single view',
        'Staff Management: staff accounts with individual schedules, appointment assignments, working hours tracking, and performance visibility for the business owner',
        'Payment & Invoicing: invoices generated automatically at booking or appointment completion, with payment tracking, overdue flagging, and partial payment support — all visible in a unified financial dashboard',
        'Business Analytics Dashboard: real-time metrics on revenue, bookings, no-show rates, busiest time slots, most popular services, and staff utilization — enabling data-driven scheduling and pricing decisions',
        'Configurable for Any Service Business: service types, durations, pricing, staff roles, and business hours are all configurable without code — making Secretary deployable to any appointment-based business without customization'
      ]
    },
    results: {
      description:
        'Secretary is now actively used across multiple business types — from medical clinics to beauty studios to professional consultancies. The platform eliminated operational chaos and gave Saber (and subsequent users) real control over their businesses for the first time.',
      metrics: [
        {
          value: '0',
          label: 'Double-Bookings',
          description: 'Automated scheduling with conflict detection has eliminated all double-bookings since launch'
        },
        {
          value: '4★',
          label: 'Client Rating',
          description: 'Saber rated the project 4/5 — live and actively used by his business'
        },
        {
          value: '6 Weeks',
          label: 'Delivery Time',
          description: 'Complete office management suite from brief to live deployment in 6 weeks'
        },
        {
          value: '100%',
          label: 'Client History Tracked',
          description: 'All client interactions, past appointments, payments, and notes centralized in one searchable CRM'
        },
        {
          value: 'Multi-Industry',
          label: 'Deployable',
          description: 'Same platform deployed for clinics, beauty studios, consultancies, and service providers without code changes'
        },
        {
          value: 'Real-Time',
          label: 'Business Analytics',
          description: 'Revenue, booking trends, staff utilization, and no-show rates visible on a live dashboard at all times'
        }
      ]
    },
    technologies: [
      'Next.js',
      'React',
      'Node.js',
      'PostgreSQL',
      'Firebase Authentication',
      'Stripe',
      'Twilio (SMS)',
      'AWS EC2',
      'Vercel',
      'Chart.js'
    ],
    testimonial: {
      quote:
        "Before Secretary, I was running my business from WhatsApp and a notebook. I knew I needed something better but I didn't want a complicated system that my staff wouldn't use. Secretary hit exactly the right balance — it covers everything I need, it's easy to navigate, and it actually gets used every day. No more double bookings, no more chasing payments manually. It just works.",
      author: 'Saber Al Obaidi',
      role: 'Owner'
    },
    listingMetrics: [
      { value: '0', label: 'Double-Bookings' },
      { value: '6 Weeks', label: 'Delivery Time' },
      { value: '4★', label: 'Client Rating' }
    ],
    tags: ['CRM', 'Appointment Scheduling', 'Business Operations', 'SaaS', 'Multi-Industry', 'Payments']
  }
];

export function getCaseStudyBySlug(slug: string): CaseStudyDetail | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
