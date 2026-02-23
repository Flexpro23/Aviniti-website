export interface CaseStudyMetric {
  value: string;
  label: { en: string; ar: string };
  description: { en: string; ar: string };
}

export interface CaseStudyDetail {
  slug: string;
  title: { en: string; ar: string };
  client: string;
  industry: { en: string; ar: string };
  industryKey: string;
  duration: string;
  excerpt: { en: string; ar: string };
  heroDescription: { en: string; ar: string };
  heroImage: string;
  accentColor: string;
  challenge: {
    description: { en: string; ar: string };
    points: { en: string; ar: string }[];
  };
  solution: {
    description: { en: string; ar: string };
    points: { en: string; ar: string }[];
  };
  results: {
    description: { en: string; ar: string };
    metrics: CaseStudyMetric[];
  };
  technologies: string[];
  testimonial: {
    quote: { en: string; ar: string };
    author: string;
    role: { en: string; ar: string };
  };
  listingMetrics: { value: string; label: { en: string; ar: string } }[];
  tags: { en: string; ar: string }[];
}

export const caseStudies: CaseStudyDetail[] = [
  {
    slug: 'delivery-platform-amman',
    title: {
      en: 'Building a Multi-Vendor Delivery Ecosystem for Amman Logistics',
      ar: 'بناء نظام توصيل متعدد البائعين لشركة لوجستيات عمّان'
    },
    client: 'Regional Logistics Provider',
    industry: {
      en: 'Logistics',
      ar: 'اللوجستيات'
    },
    industryKey: 'logistics',
    duration: '8 Weeks',
    excerpt: {
      en: 'A mid-size Amman-based logistics company transformed from manual phone-based dispatch to a fully automated multi-vendor delivery ecosystem. By implementing a custom 3-app platform with real-time tracking and route optimization, the company now handles 75+ daily orders with 100+ active users, while reducing average delivery times by 40%.',
      ar: 'حوّلت شركة لوجستيات متوسطة الحجم في عمّان عملياتها من نظام توزيع يدوي عبر الهاتف إلى نظام توصيل متعدد البائعين مؤتمت بالكامل. من خلال تطبيق منصة مخصصة بثلاث تطبيقات مع تتبع فوري وتحسين المسارات، تتعامل الشركة الآن مع أكثر من 75 طلب يومي مع 100+ مستخدم نشط، مع تقليل متوسط أوقات التسليم بنسبة 40٪.'
    },
    heroDescription: {
      en: 'From spreadsheets and phone calls to 75+ daily orders with 100+ active users and real-time tracking across Amman',
      ar: 'من جداول البيانات والاتصالات الهاتفية إلى أكثر من 75 طلب يومي مع 100+ مستخدم نشط وتتبع فوري في جميع أنحاء عمّان'
    },
    heroImage: '/images/case-studies/delivery-platform-amman.webp',
    accentColor: '#F97316',
    challenge: {
      description: {
        en: 'The client operated a traditional logistics business with significant operational bottlenecks. With 15–20 drivers managed entirely through phone calls and spreadsheets, the company faced scaling constraints that cost them contracts to tech-enabled competitors.',
        ar: 'كانت الشركة تدير عمليات لوجستية تقليدية مع اختناقات تشغيلية كبيرة. مع 15-20 سائق تم إدارتهم بالكامل من خلال المكالمات الهاتفية والجداول، واجهت الشركة قيودًا على النمو أدت إلى فقدان العقود لصالح المنافسين الذين يتمتعون بحلول تكنولوجية.'
      },
      points: [
        {
          en: 'Manual dispatch system: all orders received via phone calls and communicated verbally to drivers, with no digital record or optimization',
          ar: 'نظام توزيع يدوي: تم استقبال جميع الطلبات عبر المكالمات الهاتفية وإبلاغ السائقين شفويًا، بدون سجل رقمي أو تحسين'
        },
        {
          en: 'No real-time visibility: vendors, dispatchers, and drivers operated in silos with no way to track delivery status or optimize routes',
          ar: 'عدم وجود رؤية فورية: عملت البائعون والموظفون والسائقون بشكل منفصل دون طريقة لتتبع حالة التسليم أو تحسين المسارات'
        },
        {
          en: 'Unscalable payment reconciliation: cash-on-delivery settlements took 3–5 days, tying up working capital and delaying vendor payouts',
          ar: 'تسوية الدفع غير قابلة للتوسع: استغرقت تسويات الدفع عند الاستلام 3-5 أيام، مما أدى إلى تجميد رأس المال العامل وتأخير دفعات البائعين'
        },
        {
          en: 'Vendor onboarding friction: new vendors required 2+ weeks of training on how to place orders, limiting business growth',
          ar: 'احتكاك الإضافة: كانت البائعون الجدد بحاجة إلى تدريب لمدة أسبوعين أو أكثر على كيفية تقديم الطلبات، مما يحد من نمو الأعمال'
        },
        {
          en: 'Driver accountability gaps: no attendance system, no proof of delivery, and no data on driver performance metrics',
          ar: 'فجوات المسؤولية: لا يوجد نظام حضور، ولا إثبات توصيل، ولا بيانات عن مقاييس أداء السائق'
        }
      ]
    },
    solution: {
      description: {
        en: 'Aviniti built a custom three-application ecosystem tailored for the Jordanian logistics market. The platform integrated real-time Google Maps tracking, AI-powered route optimization, multi-delivery batching, and local payment processing to create a seamless end-to-end delivery workflow.',
        ar: 'بنت Aviniti نظام بيئي مخصص من ثلاث تطبيقات مصمم خصيصًا لسوق اللوجستيات الأردني. دمجت المنصة تتبع خرائط Google في الوقت الفعلي وتحسين المسارات المدعوم بالذكاء الاصطناعي وتجميع التسليمات المتعددة ومعالجة الدفع المحلية لإنشاء سير عمل توصيل سلس من البداية إلى النهاية.'
      },
      points: [
        {
          en: 'Owner Dashboard: complete visibility into all active deliveries, driver locations, vendor metrics, and daily revenue with drill-down analytics for performance optimization',
          ar: 'لوحة تحكم المالك: رؤية كاملة لجميع التسليمات النشطة ومواقع السائقين ومقاييس البائعين والإيرادات اليومية مع تحليلات متقدمة لتحسين الأداء'
        },
        {
          en: 'Vendor Mobile App: one-tap order placement, live delivery tracking, automated payment settlement, and vendor analytics showing order history and ratings',
          ar: 'تطبيق البائع للهاتف: تقديم الطلبات بنقرة واحدة وتتبع التسليم المباشر وتسوية الدفع الآلية وتحليلات البائع التي تعرض سجل الطلبات والتقييمات'
        },
        {
          en: 'Driver Mobile App: navigation-ready delivery batches with auto-optimized routes, geofence-triggered notifications, proof-of-delivery photos, and earned ratings feedback',
          ar: 'تطبيق السائق للهاتف: مجموعات توصيل جاهزة للملاحة مع مسارات محسّنة تلقائيًا وإشعارات محفزة بالحدود الجغرافية وصور إثبات التسليم وملاحظات التقييمات المكتسبة'
        },
        {
          en: 'Multi-Delivery Batching Algorithm: intelligently groups orders by geographic proximity and delivery windows, reducing fleet miles by 35% and enabling faster deliveries',
          ar: 'خوارزمية تجميع التسليمات المتعددة: تجميع ذكي للطلبات حسب القرب الجغرافي ونوافذ التسليم، مما يقلل مسافة الأسطول بنسبة 35٪ ويسمح بتسليمات أسرع'
        },
        {
          en: 'Arabic-English Bilingual Interface: built natively for Jordanian users with full RTL support, culturally appropriate terminology, and localized payment gateways (eFAWATEERcom)',
          ar: 'الواجهة الثنائية اللغة (العربية والإنجليزية): مبنية بشكل أصلي للمستخدمين الأردنيين مع دعم RTL كامل ومصطلحات ثقافية مناسبة وبوابات دفع محلية (eFAWATEERcom)'
        },
        {
          en: 'Real-Time Tracking & Notifications: all stakeholders (vendor, dispatcher, customer) receive live GPS updates and delivery status changes via push notifications',
          ar: 'التتبع الفوري والإشعارات: يتلقى جميع أصحاب المصلحة (البائع والموزّع والعميل) تحديثات GPS مباشرة وتغييرات حالة التسليم عبر إشعارات الدفع'
        },
        {
          en: 'Automated Vendor Onboarding: self-service sign-up flow with instant verification, reducing vendor onboarding from 14 days to under 3 days',
          ar: 'إضافة البائع الآلية: تدفق التسجيل الذاتي مع التحقق الفوري، مما يقلل إضافة البائع من 14 يومًا إلى أقل من 3 أيام'
        }
      ]
    },
    results: {
      description: {
        en: 'The platform went live in Week 6 and achieved full-scale adoption within 8 weeks. The company experienced dramatic improvements across operational, commercial, and user satisfaction metrics.',
        ar: 'أطلقت المنصة في الأسبوع السادس وحققت اعتمادًا على نطاق كامل في غضون 8 أسابيع. شهدت الشركة تحسينات درامية في جميع مقاييس التشغيل والتجارة والرضا عن المستخدمين.'
      },
      metrics: [
        {
          value: '40%',
          label: { en: 'Faster Deliveries', ar: 'توصيل أسرع' },
          description: { en: 'Average delivery time reduced from 55 minutes to 33 minutes through route optimization and multi-batching', ar: 'تم تقليل متوسط وقت التسليم من 55 دقيقة إلى 33 دقيقة من خلال تحسين المسارات وتجميع التسليمات' }
        },
        {
          value: '75+',
          label: { en: 'Daily Orders', ar: 'الطلبات اليومية' },
          description: { en: 'Scaled from manual phone-based dispatch to 75+ daily orders processed through the automated platform', ar: 'توسعت من التوزيع اليدوي عبر الهاتف إلى 75+ طلب يومي تمت معالجتها من خلال المنصة الآلية' }
        },
        {
          value: '100+',
          label: { en: 'Active Daily Users', ar: 'المستخدمون النشطون يوميًا' },
          description: { en: 'Across all three apps (owner, vendor, driver), with consistent daily engagement and retention', ar: 'عبر جميع التطبيقات الثلاثة (المالك والبائع والسائق)، مع مشاركة واحتفاظ يومي متسق' }
        },
        {
          value: '3 Days',
          label: { en: 'Vendor Onboarding', ar: 'إضافة البائع' },
          description: { en: 'Reduced from 2 weeks of manual training to self-service onboarding in under 3 days', ar: 'تم تقليلها من أسبوعين من التدريب اليدوي إلى الإضافة الذاتية في أقل من 3 أيام' }
        },
        {
          value: '35%',
          label: { en: 'Fleet Mile Reduction', ar: 'تقليل أميال الأسطول' },
          description: { en: 'Route optimization cut vehicle miles by 35%, reducing fuel costs and carbon footprint', ar: 'قللت تحسينات المسارات أميال المركبات بنسبة 35٪، مما يقلل تكاليف الوقود وبصمة الكربون' }
        },
        {
          value: '92%',
          label: { en: 'On-Time Delivery Rate', ar: 'معدل التسليم في الموعد' },
          description: { en: 'Consistent delivery window adherence, up from unmeasurable baseline with phone-based dispatch', ar: 'الالتزام المستمر بنافذة التسليم، بارتفاع من الأساس غير القابل للقياس مع التوزيع القائم على الهاتف' }
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
      quote: {
        en: "Before Aviniti, we were losing contracts to bigger players because we couldn't offer real-time tracking or scale beyond manual operations. Within 8 weeks, we had a platform that made us competitive—and then some. Our vendors actually want to work with us now because they can track their orders and get paid automatically. This platform is the backbone of our business now.",
        ar: 'قبل Aviniti، كنا نفقد العقود للاعبين الأكبر لأننا لم نتمكن من توفير التتبع الفوري أو التوسع بما يتجاوز العمليات اليدوية. في غضون 8 أسابيع، كان لدينا منصة جعلتنا تنافسية - وأكثر من ذلك. البائعون الآن يريدون حقًا العمل معنا لأنهم يمكنهم تتبع طلباتهم والحصول على أموالهم تلقائيًا. هذه المنصة هي العمود الفقري لأعمالنا الآن.'
      },
      author: 'Jamal Al-Rashid',
      role: { en: 'Operations Director', ar: 'مدير العمليات' }
    },
    listingMetrics: [
      { value: '100+', label: { en: 'Active Users', ar: 'المستخدمون النشطون' } },
      { value: '40%', label: { en: 'Faster Deliveries', ar: 'توصيل أسرع' } },
      { value: '75+', label: { en: 'Daily Orders', ar: 'الطلبات اليومية' } }
    ],
    tags: [
      { en: 'Real-Time Tracking', ar: 'التتبع الفوري' },
      { en: 'Route Optimization', ar: 'تحسين المسارات' },
      { en: 'Multi-Vendor', ar: 'متعدد البائعين' },
      { en: 'Payment Integration', ar: 'تكامل الدفع' },
      { en: 'Scaling', ar: 'التوسع' }
    ]
  },
  {
    slug: 'nay-nursery-management',
    title: {
      en: 'How Nay Nursery Digitized Operations and Achieved 90% Parent Satisfaction',
      ar: 'كيف حققت روضة ناي رقمنة العمليات ورضا الوالدين بنسبة 90٪'
    },
    client: 'Nay Nursery',
    industry: {
      en: 'Education',
      ar: 'التعليم'
    },
    industryKey: 'education',
    duration: '6 Weeks',
    excerpt: {
      en: 'Nay Nursery, a growing childcare center in Amman, replaced paper records and WhatsApp chaos with a comprehensive digital management platform. Aviniti built a 3-app ecosystem featuring geofencing-based attendance, real-time activity sharing, and automated billing. Within weeks, the nursery achieved 90% parent satisfaction and eliminated 60% of daily administrative overhead.',
      ar: 'استبدلت روضة ناي، وهي مركز رعاية أطفال متنامي في عمّان، السجلات الورقية وفوضى الواتس آب بمنصة إدارة رقمية شاملة. بنت Aviniti نظام بيئي بثلاث تطبيقات يتضمن الحضور بناءً على الحدود الجغرافية ومشاركة الأنشطة في الوقت الفعلي والفواتير الآلية. في غضون أسابيع، حققت الروضة رضا الوالدين بنسبة 90٪ والقضاء على 60٪ من النفقات الإدارية اليومية.'
    },
    heroDescription: {
      en: 'From paper records and WhatsApp to a modern, mobile-first nursery management platform trusted by parents and staff',
      ar: 'من السجلات الورقية والواتس آب إلى منصة إدارة روضة حديثة وموجهة للهاتف الذكي يثق بها الوالدان والموظفون'
    },
    heroImage: '/images/case-studies/nay-nursery-management.webp',
    accentColor: '#60A5FA',
    challenge: {
      description: {
        en: 'Nay Nursery was a professionally run childcare facility, but their operations were held back by paper-based processes and informal communication channels. Without a centralized system, critical information flowed inconsistently across staff, parents, and management.',
        ar: 'كانت روضة ناي مركز رعاية أطفال يدار بشكل احترافي، لكن عملياتها كانت مقيدة بالعمليات القائمة على الورق وقنوات الاتصال غير الرسمية. بدون نظام مركزي، تدفقت المعلومات الحرجة بشكل غير متسق بين الموظفين والوالدين والإدارة.'
      },
      points: [
        {
          en: 'Paper-based attendance and records: staff manually wrote attendance in notebooks, with no automated backup or data integrity, leading to occasional lost records and disputes',
          ar: 'الحضور والسجلات القائمة على الورق: كتب الموظفون الحضور يدويًا في دفاتر الملاحظات، بدون نسخة احتياطية آلية أو سلامة البيانات، مما أدى إلى فقدان سجلات عرضية ونزاعات'
        },
        {
          en: 'Uncontrolled parent communication: staff communicated with parents via personal WhatsApp groups, mixing professional updates with casual chat, creating confusion and accountability gaps',
          ar: 'الاتصال غير المنضبط مع الوالدين: تواصل الموظفون مع الوالدين عبر مجموعات WhatsApp الشخصية، مما يخلط بين التحديثات المهنية والدردشة العابرة، مما يخلق التباسًا وفجوات المسؤولية'
        },
        {
          en: 'Time-consuming daily administration: taking attendance for 8+ classes took 30+ minutes each morning, pulling staff away from childcare duties',
          ar: 'الإدارة اليومية المستهلكة للوقت: استغرق تسجيل الحضور لـ 8+ فصول دراسية 30+ دقيقة كل صباح، مما جعل الموظفين بعيدين عن واجبات رعاية الأطفال'
        },
        {
          en: 'No parent visibility into daily activities: parents had no way to see what their children did at nursery, creating anxiety and reducing perceived value of the service',
          ar: 'عدم وضوح الوالدين للأنشطة اليومية: لم يكن للوالدين طريقة لرؤية ما فعله أطفالهم في الروضة، مما خلق القلق وقلل من القيمة المدركة للخدمة'
        },
        {
          en: 'Manual fee management: invoicing and fee collection were spreadsheet-based with inconsistent follow-up, resulting in only 65% on-time payment rates',
          ar: 'إدارة الرسوم اليدوية: كانت الفواتير وتحصيل الرسوم قائمة على جداول البيانات مع متابعة غير متسقة، مما أدى إلى معدل دفع في الموعد بنسبة 65٪ فقط'
        }
      ]
    },
    solution: {
      description: {
        en: 'Aviniti designed a purpose-built kindergarten management platform with three integrated applications: an admin dashboard for management, a staff mobile app for daily operations, and a parent-facing app for engagement and communication.',
        ar: 'صممت Aviniti منصة إدارة روضة مخصصة بثلاث تطبيقات متكاملة: لوحة تحكم إدارية للإدارة وتطبيق جوال للموظفين للعمليات اليومية وتطبيق موجه للوالدين للمشاركة والاتصال.'
      },
      points: [
        {
          en: 'Admin Dashboard: centralized hub for managing staff accounts, class schedules, parent records, fee invoicing, activity templates, and analytics on enrollment and payments',
          ar: 'لوحة تحكم الإدارة: مركز مركزي لإدارة حسابات الموظفين وجداول الفصول وسجلات الوالدين وفواتير الرسوم وقوالب الأنشطة والتحليلات حول التسجيل والدفع'
        },
        {
          en: 'Staff Mobile App: geofence-enabled automatic check-in/check-out, digital attendance marking via app tap, activity logging with photo uploads, and incident reporting with instant parent notification',
          ar: 'تطبيق الموظفين على الهاتف: تسجيل الدخول / الخروج التلقائي المفعل بالحدود الجغرافية، وتحديد الحضور الرقمي عبر نقرة التطبيق، وتسجيل الأنشطة مع تحميل الصور، وتقارير الحوادث مع إخطار الوالدين الفوري'
        },
        {
          en: 'Parent Mobile App: real-time notifications when child arrives and leaves (geofence-triggered), photo gallery of daily activities updated by staff, fee invoices and payment collection, child development milestones and progress notes',
          ar: 'تطبيق الوالدين على الهاتف: إشعارات فورية عند وصول الطفل والمغادرة (محفزة بالحدود الجغرافية) وعرض صور للأنشطة اليومية التي يحدثها الموظفون وفواتير الرسوم وتحصيل الدفع ومحطات نمو الطفل وملاحظات التقدم'
        },
        {
          en: 'Geofencing Attendance System: GPS-based automatic check-in when staff arrives at nursery, eliminating manual attendance logs and providing precise attendance records with zero friction',
          ar: 'نظام الحضور بالحدود الجغرافية: تسجيل دخول تلقائي قائم على GPS عند وصول الموظف إلى الروضة، مما يلغي سجلات الحضور اليدوية ويوفر سجلات حضور دقيقة بدون احتكاك'
        },
        {
          en: 'Activity Sharing Workflow: staff photographs daily activities (snack time, playtime, learning sessions) and upload them to the parent app with one tap, creating a narrative of the child\'s day',
          ar: 'سير عمل مشاركة الأنشطة: يصور الموظفون الأنشطة اليومية (وقت الوجبات الخفيفة ووقت اللعب وجلسات التعلم) ويحملونها إلى تطبيق الوالدين بنقرة واحدة، مما يخلق سردًا ليوم الطفل'
        },
        {
          en: 'Arabic-First Design: fully native Arabic interface built for Jordanian families, with right-to-left layout, local holiday calendar, and culturally appropriate content',
          ar: 'تصميم يركز على العربية أولاً: واجهة عربية أصلية بالكامل مبنية للعائلات الأردنية، مع تخطيط RTL ورزنامة العطل المحلية والمحتوى المناسب ثقافيًا'
        },
        {
          en: 'Automated Billing & Payments: recurring monthly invoices generated automatically, integrated payment link sent via app, with payment tracking and overdue reminders reducing manual follow-up',
          ar: 'الفواتير والدفع الآلية: فواتير شهرية متكررة تم إنشاؤها تلقائيًا وتم إرسال رابط الدفع المتكامل عبر التطبيق، مع تتبع الدفع وتذكيرات التأخير التي تقلل المتابعة اليدوية'
        }
      ]
    },
    results: {
      description: {
        en: 'The platform launched in Week 4 with a soft rollout to one classroom, then scaled to all 8 classes by Week 6. Adoption was remarkably smooth—staff used the system intuitively without formal training, and parent feedback was overwhelmingly positive.',
        ar: 'تم إطلاق المنصة في الأسبوع الرابع برفع تدريجي إلى فصل واحد، ثم توسعت إلى جميع الفصول الثمانية بحلول الأسبوع السادس. كان الاعتماد سلسًا بشكل ملحوظ - استخدم الموظفون النظام بشكل حدسي دون تدريب رسمي، وكانت ردود فعل الوالدين إيجابية للغاية.'
      },
      metrics: [
        {
          value: '90%',
          label: { en: 'Parent Satisfaction', ar: 'رضا الوالدين' },
          description: { en: 'Post-launch survey showed 90% of parents reported improved communication and daily visibility into their child\'s activities', ar: 'أظهر استطلاع ما بعد الإطلاق أن 90٪ من الوالدين أبلغوا عن تحسن في التواصل والرؤية اليومية لأنشطة أطفالهم' }
        },
        {
          value: '60%',
          label: { en: 'Admin Overhead Reduction', ar: 'تقليل النفقات الإدارية' },
          description: { en: 'Daily administrative tasks (attendance, invoicing, parent communication) reduced from 2+ hours to under 45 minutes', ar: 'تم تقليل المهام الإدارية اليومية (الحضور والفواتير والاتصال مع الوالدين) من ساعتين أو أكثر إلى أقل من 45 دقيقة' }
        },
        {
          value: '100%',
          label: { en: 'Staff Adoption Rate', ar: 'معدل اعتماد الموظفين' },
          description: { en: 'All 24 staff members adopted the system within 2 weeks with zero formal training required—intuitive design drove organic adoption', ar: 'اعتمد جميع الموظفين الـ 24 النظام في غضون أسبوعين بدون أي تدريب رسمي - أدى التصميم الحدسي إلى اعتماد عضوي' }
        },
        {
          value: '94%',
          label: { en: 'On-Time Fee Collection', ar: 'تحصيل الرسوم في الموعد' },
          description: { en: 'Payment timeliness improved from 65% to 94% through automated invoicing and mobile payment options', ar: 'تحسنت دقة الدفع من 65٪ إلى 94٪ من خلال الفواتير الآلية وخيارات الدفع عبر الهاتف الذكي' }
        },
        {
          value: '450+',
          label: { en: 'Daily Activity Photos Shared', ar: 'صور الأنشطة اليومية المشاركة' },
          description: { en: 'Staff now share 450+ photos daily across all classes, creating a living record of nursery life for parents', ar: 'يشارك الموظفون الآن 450+ صورة يوميًا عبر جميع الفصول، مما يخلق سجلًا حيًا لحياة الروضة للوالدين' }
        },
        {
          value: '0%',
          label: { en: 'Data Loss Incidents', ar: 'حوادث فقدان البيانات' },
          description: { en: 'Shift from paper records to cloud-based system eliminated all attendance record disputes and data loss', ar: 'أدى التحول من السجلات الورقية إلى نظام قائم على السحابة إلى إزالة جميع نزاعات سجلات الحضور وفقدان البيانات' }
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
      quote: {
        en: "Parents are happier because they can see their kids throughout the day. Staff are happier because they don't have to do manual attendance anymore—it just happens. We have better data than we ever did with paper, and invoicing is finally consistent. The best part? Our staff used it immediately without asking for help. It just felt natural to them. This has absolutely transformed how we run Nay Nursery.",
        ar: 'الوالدون أسعد لأنهم يمكنهم رؤية أطفالهم طوال اليوم. الموظفون أسعد لأنهم لا يضطرون إلى القيام بالحضور اليدوي بعد الآن - يحدث فقط. لدينا بيانات أفضل مما كانت لدينا على الورق، والفواتير أخيراً متسقة. أفضل جزء؟ استخدم موظفونا على الفور دون طلب المساعدة. شعروا فقط أنه طبيعي بالنسبة لهم. لقد غير هذا بشكل مطلق كيفية تشغيل روضة ناي.'
      },
      author: 'Maryam Odat',
      role: { en: 'Founder & Owner', ar: 'المؤسس والمالك' }
    },
    listingMetrics: [
      { value: '90%', label: { en: 'Parent Satisfaction', ar: 'رضا الوالدين' } },
      { value: '60%', label: { en: 'Admin Time Saved', ar: 'الوقت الإداري المحفوظ' } },
      { value: '100%', label: { en: 'Staff Adoption', ar: 'اعتماد الموظفين' } }
    ],
    tags: [
      { en: 'Parent Portal', ar: 'بوابة الوالدين' },
      { en: 'Geofencing', ar: 'الحدود الجغرافية' },
      { en: 'Real-Time Updates', ar: 'التحديثات الفورية' },
      { en: 'Automated Billing', ar: 'الفواتير الآلية' },
      { en: 'Staff Efficiency', ar: 'كفاءة الموظفين' }
    ]
  },
  {
    slug: 'skinverse-ai-skincare',
    title: {
      en: 'SkinVerse: Building an AI Skincare Coach That Analyzes 12 Skin Attributes from a Selfie',
      ar: 'SkinVerse: بناء مدرب العناية بالبشرة بالذكاء الاصطناعي الذي يحلل 12 سمات من صورة ذاتية'
    },
    client: 'SkinVerse',
    industry: {
      en: 'Health & Beauty',
      ar: 'الصحة والجمال'
    },
    industryKey: 'beauty',
    duration: '10 Weeks',
    excerpt: {
      en: 'SkinVerse founder Duaa Theeb had a vision: give every person a dermatologist-grade skin analysis in their pocket. Aviniti built an AI-powered iOS and Android app that analyzes 12 distinct skin attributes from a single selfie, generates personalized skincare routines, and tracks skin health progress over time — all without sharing data to the cloud.',
      ar: 'كانت لدى مؤسسة SkinVerse دعاء ظيب رؤية: إعطاء كل شخص تحليل الجلد بدرجة الأمراض الجلدية في جيبه. بنت Aviniti تطبيق iOS و Android مدعوم بالذكاء الاصطناعي يحلل 12 سمات جلدية مختلفة من صورة ذاتية واحدة، وينتج روتين العناية بالبشرة الشخصي، ويتتبع تقدم صحة الجلد بمرور الوقت - كل ذلك دون مشاركة البيانات مع السحابة.'
    },
    heroDescription: {
      en: 'Dermatologist-grade skin analysis from a selfie — 12 attributes, personalized routines, and privacy-first AI',
      ar: 'تحليل الجلد بدرجة الأمراض الجلدية من صورة ذاتية - 12 سمة وروتين شخصي وذكاء اصطناعي يركز على الخصوصية'
    },
    heroImage: '/images/case-studies/skinverse-ai-skincare.webp',
    accentColor: '#A78BFA',
    challenge: {
      description: {
        en: 'Duaa came to Aviniti with a validated idea and a clear gap in the market: affordable, accurate, and private skin analysis. The challenge was building AI that was both clinically meaningful and accessible to everyday users — on a mobile device, without requiring an internet connection for analysis.',
        ar: 'جاءت دعاء إلى Aviniti برؤية مثبتة وفجوة واضحة في السوق: تحليل الجلد بأسعار معقولة ودقيق وخاص. كان التحدي هو بناء ذكاء اصطناعي ذا مغزى سريري وفي نفس الوقت يمكن الوصول إليه للمستخدمين العاديين - على جهاز محمول، دون الحاجة إلى اتصال بالإنترنت للتحليل.'
      },
      points: [
        {
          en: 'Clinical accuracy on-device: dermatology-grade skin assessment typically requires lab equipment or specialist visits — translating this to a smartphone camera without sacrificing precision was the core technical challenge',
          ar: 'الدقة السريرية على الجهاز: عادة ما يتطلب تقييم الجلد بدرجة الأمراض الجلدية معدات المختبر أو زيارات متخصصة - ترجمة هذا إلى كاميرا الهاتف الذكي دون التضحية بالدقة كان التحدي التقني الأساسي'
        },
        {
          en: 'Privacy by design: users are deeply sensitive about facial data — the AI analysis had to run on-device with no photos uploaded to servers, requiring a fully local computer vision pipeline',
          ar: 'الخصوصية حسب التصميم: المستخدمون حساسون جداً بشأن البيانات الوجهية - كان يجب أن يعمل تحليل الذكاء الاصطناعي على الجهاز بدون تحميل الصور على الخوادم، مما يتطلب خط أنابيب رؤية حاسوبية محلي بالكامل'
        },
        {
          en: 'Multi-attribute complexity: analyzing 12 separate skin attributes (hydration, texture, pores, pigmentation, wrinkles, and more) from a single selfie required distinct model layers and confidence scoring',
          ar: 'تعقيد المتعددة: تحليل 12 سمة جلدية منفصلة (الترطيب والملمس والمسام والتصبغ والتجاعيد والمزيد) من صورة ذاتية واحدة يتطلب طبقات نموذج مميزة وتسجيل الثقة'
        },
        {
          en: 'Personalization at scale: translating raw skin analysis into actionable, product-specific routines that adapt over time based on tracked progress required a recommendation engine beyond simple rule sets',
          ar: 'التخصيص على نطاق واسع: ترجمة تحليل الجلد الخام إلى روتين قابل للتنفيذ وخاص بالمنتج يتكيف بمرور الوقت بناءً على التقدم المتابع يتطلب محرك توصيات يتجاوز مجموعات القواعد البسيطة'
        },
        {
          en: 'User experience for non-technical users: skin science is complex — presenting 12 metrics meaningfully to everyday users without overwhelming them required intensive UX research and iterative testing',
          ar: 'تجربة المستخدم للمستخدمين غير التقنيين: علم الجلد معقد - تقديم 12 مقياس بشكل ذي معنى للمستخدمين العاديين دون إرهاقهم يتطلب بحث تجربة مستخدم مكثف واختبار متكرر'
        }
      ]
    },
    solution: {
      description: {
        en: 'Aviniti built SkinVerse as a privacy-first, on-device AI application using custom-trained computer vision models optimized for mobile inference. The app delivers a full dermatology-inspired skin report from a selfie in under 10 seconds, with no data ever leaving the device.',
        ar: 'بنت Aviniti SkinVerse كتطبيق ذكاء اصطناعي يركز على الخصوصية أولاً باستخدام نماذج رؤية حاسوبية مدربة مخصصة محسّنة للاستدلال على الهاتف الذكي. يوفر التطبيق تقريرًا كاملًا عن الجلد مستوحى من الأمراض الجلدية من صورة ذاتية في أقل من 10 ثوان، مع عدم مغادرة أي بيانات الجهاز.'
      },
      points: [
        {
          en: 'On-Device AI Pipeline: custom-trained computer vision models run entirely on-device using CoreML (iOS) and TensorFlow Lite (Android), analyzing 12 skin attributes with clinical confidence scoring — no photos stored or uploaded',
          ar: 'خط أنابيب الذكاء الاصطناعي على الجهاز: نماذج رؤية حاسوبية مدربة مخصصة تعمل بالكامل على الجهاز باستخدام CoreML (iOS) و TensorFlow Lite (Android)، تحليل 12 سمة جلدية مع تسجيل الثقة السريري - لا توجد صور مخزنة أو محملة'
        },
        {
          en: '12-Attribute Skin Report: the AI analyzes hydration levels, texture uniformity, pore visibility, pigmentation evenness, fine lines, wrinkle depth, redness, oiliness, dark circles, elasticity, UV damage indicators, and sensitivity markers — each scored and visualized clearly',
          ar: 'تقرير الجلد من 12 سمة: يحلل الذكاء الاصطناعي مستويات الترطيب وتجانس الملمس وظهور المسام وتوحيد التصبغ والخطوط الدقيقة وعمق التجاعيد والاحمرار والدهنية والهالات السوداء والمرونة ومؤشرات الأضرار فوق البنفسجية وعلامات الحساسية - كل منها مسجلة وموضحة بوضوح'
        },
        {
          en: 'Progress Tracking: users build a longitudinal skin health record with trend charts across all 12 attributes, enabling them to see measurable improvement from routine changes over weeks and months',
          ar: 'تتبع التقدم: يقوم المستخدمون ببناء سجل صحة جلد طولي مع رسوم بيانية للاتجاهات عبر جميع السمات الـ 12، مما يتيح لهم رؤية تحسن قابل للقياس من تغييرات الروتين على مدار أسابيع وأشهر'
        },
        {
          en: 'Personalized Routine Engine: based on skin analysis results and user-reported preferences, the app generates a morning and evening skincare routine with specific product type recommendations and application order',
          ar: 'محرك الروتين الشخصي: بناءً على نتائج تحليل الجلد والتفضيلات التي أبلغ عنها المستخدم، يولد التطبيق روتين العناية بالبشرة الصباحي والمسائي مع توصيات نوع المنتج المحددة وترتيب التطبيق'
        },
        {
          en: 'Product Conflict Detection: users can log their existing skincare products; the app flags ingredient conflicts (e.g., retinol + vitamin C) and explains why certain combinations harm rather than help their specific skin profile',
          ar: 'كشف تضارب المنتج: يمكن للمستخدمين تسجيل منتجات العناية بالبشرة الموجودة لديهم؛ يوضح التطبيق تضاربات المكونات (مثل الريتينول + فيتامين C) ويشرح لماذا تضر بعض التركيبات بدلاً من مساعدة ملف تعريف جلدهم المحدد'
        },
        {
          en: 'Style DNA Onboarding: a guided selfie capture flow with positioning assistance, lighting feedback, and automatic quality validation ensures consistent, accurate analysis across different environments and skin tones',
          ar: 'إضافة Style DNA: تدفق التقاط صورة ذاتية موجه مع مساعدة الموضع وملاحظات الإضاءة والتحقق من الجودة التلقائي يضمن تحليلاً متسقًا ودقيقًا عبر بيئات مختلفة وألوان البشرة'
        }
      ]
    },
    results: {
      description: {
        en: 'SkinVerse launched on both the App Store and Google Play and has earned consistent 5-star reviews. Users report measurable skin improvements tracked within the app, and the privacy-first positioning has become a key differentiator in the crowded beauty-tech space.',
        ar: 'تم إطلاق SkinVerse على متجر التطبيقات و Google Play وحقق تقييمات 5 نجوم متسقة. يبلغ المستخدمون عن تحسينات جلد قابلة للقياس يتم تتبعها في التطبيق، وأصبح الموقف الذي يركز على الخصوصية أولاً مختلفًا رئيسيًا في سوق الجمال والتكنولوجيا المكتظة.'
      },
      metrics: [
        {
          value: '5★',
          label: { en: 'App Store Rating', ar: 'تقييم متجر التطبيقات' },
          description: { en: 'Consistent 5-star rating on both iOS App Store and Google Play since launch', ar: 'تقييم 5 نجوم متسق على متجر iOS App Store و Google Play منذ الإطلاق' }
        },
        {
          value: '12',
          label: { en: 'Skin Attributes', ar: 'سمات الجلد' },
          description: { en: 'Comprehensive analysis across 12 distinct skin health markers from a single selfie', ar: 'تحليل شامل عبر 12 علامة صحة جلد مميزة من صورة ذاتية واحدة' }
        },
        {
          value: '<10s',
          label: { en: 'Analysis Time', ar: 'وقت التحليل' },
          description: { en: 'Full 12-attribute skin report generated on-device in under 10 seconds with no internet required', ar: 'تقرير الجلد الكامل من 12 سمة تم إنشاؤه على الجهاز في أقل من 10 ثوان بدون الحاجة إلى الإنترنت' }
        },
        {
          value: '0 bytes',
          label: { en: 'Data Uploaded', ar: 'البيانات المرفوعة' },
          description: { en: 'Strictly on-device AI — no facial photos, skin data, or personal information ever leaves the user\'s device', ar: 'ذكاء اصطناعي صارم على الجهاز - لا تغادر صور الوجه أو بيانات الجلد أو المعلومات الشخصية جهاز المستخدم أبداً' }
        },
        {
          value: '10 Weeks',
          label: { en: 'Time to Market', ar: 'الوقت للسوق' },
          description: { en: 'From initial brief to live App Store and Google Play listings, including AI model training and UX testing', ar: 'من الملخص الأولي إلى قوائم متجر التطبيقات و Google Play المباشرة، بما في ذلك تدريب نموذج الذكاء الاصطناعي واختبار تجربة المستخدم' }
        },
        {
          value: '2 Platforms',
          label: { en: 'iOS + Android', ar: 'iOS + Android' },
          description: { en: 'Fully native performance on both platforms with platform-specific AI inference (CoreML + TF Lite)', ar: 'أداء أصلي كامل على كلا النظامين مع استدلال ذكاء اصطناعي خاص بالنظام الأساسي (CoreML + TF Lite)' }
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
      quote: {
        en: "I came to Aviniti with a vision that most people said was too ambitious for a mobile app — AI skin analysis without sending photos to a server. Not only did they build it, they built it beautifully. The on-device AI is fast, the results are genuinely accurate, and users trust it because their data stays private. SkinVerse is exactly what I imagined, and then some.",
        ar: 'جئت إلى Aviniti برؤية قال معظم الناس إنها طموحة جداً لتطبيق جوال - تحليل جلد بالذكاء الاصطناعي دون إرسال الصور إلى الخادم. لم يقوموا فقط ببنائه، بل بنوه بشكل جميل. ذكاء الاصطناعي على الجهاز سريع والنتائج دقيقة حقاً ويثق المستخدمون به لأن بياناتهم تبقى خاصة. SkinVerse هو بالضبط ما تخيلته وأكثر.'
      },
      author: 'Duaa Theeb',
      role: { en: 'Founder & CEO, SkinVerse', ar: 'المؤسس والرئيس التنفيذي لشركة SkinVerse' }
    },
    listingMetrics: [
      { value: '5★', label: { en: 'App Store Rating', ar: 'تقييم متجر التطبيقات' } },
      { value: '12', label: { en: 'Skin Attributes Analyzed', ar: 'سمات الجلد المحللة' } },
      { value: '<10s', label: { en: 'On-Device Analysis', ar: 'التحليل على الجهاز' } }
    ],
    tags: [
      { en: 'AI', ar: 'الذكاء الاصطناعي' },
      { en: 'Computer Vision', ar: 'رؤية الحاسوب' },
      { en: 'On-Device ML', ar: 'التعلم الآلي على الجهاز' },
      { en: 'iOS', ar: 'iOS' },
      { en: 'Android', ar: 'Android' },
      { en: 'Privacy-First', ar: 'الخصوصية أولاً' },
      { en: 'Health & Beauty', ar: 'الصحة والجمال' }
    ]
  },
  {
    slug: 'hairvision-jarwan-clinic',
    title: {
      en: 'HairVision: AI-Powered Hair Transplant Planning for Jarwan Transplant Clinic',
      ar: 'HairVision: تخطيط زراعة الشعر المدعوم بالذكاء الاصطناعي عيادة جروان'
    },
    client: 'Jarwan Transplant Clinic',
    industry: {
      en: 'Medical',
      ar: 'الطب'
    },
    industryKey: 'medical',
    duration: '4 Weeks',
    excerpt: {
      en: 'Jarwan Transplant Clinic founder Sami Jarwan needed a way to automate the painstaking process of manually counting follicles and mapping donor areas for hair transplant procedures. Aviniti built HairVision — an AI clinical tool that counts follicles from photos, maps donor density, estimates grafts, and tracks post-op progress at clinical intervals.',
      ar: 'احتاج مؤسس عيادة جروان لزراعة الشعر سامي جروان إلى طريقة لأتمتة العملية المرهقة للعد اليدوي للبصيلات ورسم خريطة مناطق المانح لإجراءات زراعة الشعر. بنت Aviniti HairVision - أداة سريرية بالذكاء الاصطناعي تحسب البصيلات من الصور وترسم خريطة كثافة المانح وتقدر الطعوم وتتبع تقدم ما بعد الجراحة في فترات سريرية.'
    },
    heroDescription: {
      en: 'From manual follicle counting to AI-powered transplant planning — giving clinicians precision at a fraction of the time',
      ar: 'من عد البصيلات اليدوي إلى تخطيط الزراعة المدعوم بالذكاء الاصطناعي - إعطاء الأطباء الدقة بجزء من الوقت'
    },
    heroImage: '/images/case-studies/hairvision-jarwan-clinic.webp',
    accentColor: '#34D399',
    challenge: {
      description: {
        en: 'Hair transplant planning is a precision-intensive process. Before HairVision, Jarwan Clinic\'s doctors spent hours manually counting follicular units under magnification, estimating graft counts from experience rather than data, and tracking post-op progress through inconsistent before/after photos stored in WhatsApp or email.',
        ar: 'تخطيط زراعة الشعر هو عملية مكثفة بالدقة. قبل HairVision، كان أطباء عيادة جروان يقضون ساعات في العد اليدوي للوحدات البصيلية تحت التكبير وتقدير عدد الطعوم من الخبرة وليس من البيانات وتتبع تقدم ما بعد الجراحة من خلال صور قبل وبعد غير متسقة مخزنة في WhatsApp أو البريد الإلكتروني.'
      },
      points: [
        {
          en: 'Manual follicle counting: doctors manually examined scalp photos or live scalp with magnification to estimate follicular density — a process that took 1–2 hours per patient and introduced significant inter-clinician variability',
          ar: 'عد البصيلات اليدوي: فحص الأطباء يدويًا صور فروة الرأس أو فروة الرأس المباشرة مع التكبير لتقدير كثافة البصيلات - عملية استغرقت 1-2 ساعة لكل مريض وأدخلت تباينًا كبيرًا بين الأطباء'
        },
        {
          en: 'Imprecise graft estimation: total graft count estimates were based on clinical experience and rough density approximations, leading to over-ordering or under-ordering of grafts with costly implications',
          ar: 'تقدير الطعم غير الدقيق: كانت تقديرات عدد الطعوم الإجمالية تستند إلى الخبرة السريرية والتقريبات الكثافة الخشنة، مما أدى إلى الإفراط في الطلب أو نقص الطلب من الطعوم بآثار مكلفة'
        },
        {
          en: 'No standardized donor area mapping: donor zone assessment was visual and undocumented — no consistent framework for recording which zones could be harvested and at what density',
          ar: 'عدم وجود خريطة منطقة المانح الموحدة: تقييم منطقة المانح كان بصريًا وغير موثق - لا توجد إطار عمل متسق لتسجيل المناطق التي يمكن حصادها وبأي كثافة'
        },
        {
          en: 'Inconsistent progress tracking: post-operative follow-ups relied on informal patient selfies sent via WhatsApp, with no standardized comparison, lighting control, or clinical documentation',
          ar: 'تتبع التقدم غير المتسق: اعتمدت المتابعات بعد الجراحة على صور ذاتية غير رسمية للمريض تم إرسالها عبر WhatsApp، بدون مقارنة موحدة أو التحكم في الإضاءة أو التوثيق السريري'
        },
        {
          en: 'No digital patient record for transplant planning: all case data lived in paper files or personal notes — no searchable database, no outcome analytics, no learning system across cases',
          ar: 'عدم وجود سجل المريض الرقمي لتخطيط الزراعة: جميع بيانات الحالة عاشت في ملفات ورقية أو ملاحظات شخصية - لا توجد قاعدة بيانات قابلة للبحث أو تحليلات النتائج أو نظام التعلم عبر الحالات'
        }
      ]
    },
    solution: {
      description: {
        en: 'Aviniti built HairVision as a specialized clinical AI tool — a dual-product system for doctors and receptionists. The AI analyzes high-resolution scalp photos to count follicular units, map donor density zones, estimate grafts, and generate clinical reports — all within a secured web and mobile platform.',
        ar: 'بنت Aviniti HairVision كأداة سريرية متخصصة بالذكاء الاصطناعي - نظام ثنائي المنتج للأطباء والموظفين الإداريين. يحلل الذكاء الاصطناعي صور فروة الرأس عالية الدقة لعد الوحدات البصيلية وتعيين مناطق كثافة المانح وتقدير الطعوم وإنشاء التقارير السريرية - كل ذلك داخل منصة ويب وجوال آمنة.'
      },
      points: [
        {
          en: 'AI Follicle Counting: computer vision model trained on clinical scalp photography detects and counts individual follicular units across the scalp with region-level granularity, reducing a 2-hour manual process to under 60 seconds',
          ar: 'عد البصيلات بالذكاء الاصطناعي: يكتشف نموذج رؤية الحاسوب المدرب على التصوير السريري لفروة الرأس الوحدات البصيلية الفردية عبر فروة الرأس بحبيبات على مستوى المنطقة، مما يقلل من عملية يدوية لمدة ساعتين إلى أقل من 60 ثانية'
        },
        {
          en: 'Donor Area Density Mapping: the system divides the donor zone into a standardized grid and assigns follicular density scores per region, giving surgeons a visual map of optimal harvest zones and zones to avoid',
          ar: 'خريطة كثافة منطقة المانح: يقسم النظام منطقة المانح إلى شبكة موحدة ويخصص درجات كثافة البصيلات لكل منطقة، مما يعطي الجراحين خريطة بصرية لمناطق الحصاد المثلى والمناطق التي يجب تجنبها'
        },
        {
          en: 'Graft Estimation Engine: based on follicle density, coverage area, and recipient zone measurements entered by the doctor, the system calculates an accurate graft estimate with a confidence range — replacing subjective guesswork',
          ar: 'محرك تقدير الطعم: بناءً على كثافة البصيلات ومنطقة التغطية وقياسات منطقة المستقبل التي أدخلها الطبيب، يحسب النظام تقدير طعم دقيق بنطاق ثقة - يحل محل التخمين الذاتي'
        },
        {
          en: 'Post-Op Progress Tracking: structured follow-up captures at 7, 30, and 90 days post-transplant with standardized positioning guides ensure consistent, comparable progress photos — automatically overlaid for side-by-side comparison',
          ar: 'تتبع تقدم ما بعد الجراحة: التقاط المتابعة المنظمة في اليوم 7 و 30 و 90 بعد الزراعة مع أدلة التموضع الموحدة تضمن صور تقدم متسقة وقابلة للمقارنة - يتم فرضها تلقائيًا للمقارنة جنبًا إلى جنب'
        },
        {
          en: 'Receptionist Dashboard: a separate web interface for non-clinical staff handles appointment booking, patient history management, file organization, and scheduling — keeping the doctor\'s tool focused purely on clinical decision support',
          ar: 'لوحة تحكم الموظف الإداري: واجهة ويب منفصلة لموظفي غير سريريين للتعامل مع حجوزات المواعيد وإدارة سجل المريض وتنظيم الملفات والجدولة - مما يحافظ على أداة الطبيب مركزة بحتة على دعم القرار السريري'
        },
        {
          en: 'Clinical Report Generation: each consultation generates a structured PDF report with follicle counts, density maps, graft estimates, and planning notes — shareable with patients and archivable in the clinic\'s records system',
          ar: 'إنشاء التقرير السريري: كل استشارة تنتج تقريرًا PDF منظمًا مع عد البصيلات وخرائط الكثافة وتقديرات الطعوم وملاحظات التخطيط - قابلة للمشاركة مع المرضى وقابلة للأرشفة في نظام سجلات العيادة'
        }
      ]
    },
    results: {
      description: {
        en: 'HairVision transformed how Jarwan Clinic plans and documents transplant procedures. What once required hours of manual work now happens in minutes — with greater consistency, better documentation, and a professional patient experience that sets the clinic apart.',
        ar: 'حول HairVision طريقة عيادة جروان في التخطيط والتوثيق لإجراءات الزراعة. ما كان يتطلب ساعات من العمل اليدوي الآن يحدث في دقائق - مع اتساق أكبر وتوثيق أفضل وتجربة المريض المهنية التي تميز العيادة.'
      },
      metrics: [
        {
          value: '60x',
          label: { en: 'Faster Follicle Count', ar: 'عد البصيلات أسرع' },
          description: { en: 'AI counts follicular units in under 60 seconds vs. 1–2 hours of manual magnification assessment', ar: 'يحسب الذكاء الاصطناعي الوحدات البصيلية في أقل من 60 ثانية مقابل 1-2 ساعة من التقييم اليدوي بالتكبير' }
        },
        {
          value: '5★',
          label: { en: 'Client Rating', ar: 'تقييم العميل' },
          description: { en: 'Sami Jarwan rated the project 5/5 — the tool is now central to every new patient consultation', ar: 'قيّم سامي جروان المشروع 5/5 - الأداة الآن مركزية لكل استشارة مريض جديد' }
        },
        {
          value: '4 Weeks',
          label: { en: 'Delivery Time', ar: 'وقت الإسليم' },
          description: { en: 'Full clinical AI platform — doctor tool + receptionist dashboard — delivered in 4 weeks', ar: 'منصة ذكاء اصطناعي سريري كامل - أداة الطبيب + لوحة تحكم الموظف الإداري - تم تسليمها في 4 أسابيع' }
        },
        {
          value: '3 Stages',
          label: { en: 'Progress Tracking', ar: 'تتبع التقدم' },
          description: { en: 'Standardized post-op follow-up at 7, 30, and 90 days with comparable photo overlays', ar: 'متابعة ما بعد الجراحة الموحدة في اليوم 7 و 30 و 90 مع تراكب الصور القابلة للمقارنة' }
        },
        {
          value: '100%',
          label: { en: 'Digital Records', ar: 'السجلات الرقمية' },
          description: { en: 'All patient cases, follicle counts, and transplant plans now stored in a searchable digital system', ar: 'يتم تخزين جميع حالات المرضى وعد البصيلات وخطط الزراعة الآن في نظام رقمي قابل للبحث' }
        },
        {
          value: '2 Apps',
          label: { en: 'Products Delivered', ar: 'المنتجات المسلمة' },
          description: { en: 'Doctor AI Analysis Tool + Receptionist Dashboard — purpose-built for each clinical role', ar: 'أداة تحليل الذكاء الاصطناعي للطبيب + لوحة تحكم الموظف الإداري - مبنية خصيصًا لكل دور سريري' }
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
      quote: {
        en: "The follicle counting alone saved me hours every week. Before HairVision, I was doing this by eye — experienced, but still manual. Now I get an accurate density map and graft estimate in under a minute, and I can show patients exactly what we're working with. The clinical reports have also improved how we communicate with patients. It's become a core part of how we operate.",
        ar: 'وحده عد البصيلات وفر لي ساعات كل أسبوع. قبل HairVision، كنت أفعل هذا بالعين - ذو خبرة، لكن لا يزال يدويًا. الآن أحصل على خريطة كثافة دقيقة وتقدير طعم في أقل من دقيقة، ويمكنني إظهار المرضى بالضبط ما نحن نعمل معه. حسّنت التقارير السريرية أيضًا طريقة تواصلنا مع المرضى. أصبح جزءًا أساسيًا من طريقة عملنا.'
      },
      author: 'Sami Jarwan',
      role: { en: 'Founder, Jarwan Transplant Clinic', ar: 'المؤسس، عيادة جروان لزراعة الشعر' }
    },
    listingMetrics: [
      { value: '60x', label: { en: 'Faster Follicle Count', ar: 'عد البصيلات أسرع' } },
      { value: '4 Weeks', label: { en: 'Delivery Time', ar: 'وقت الإسليم' } },
      { value: '5★', label: { en: 'Client Rating', ar: 'تقييم العميل' } }
    ],
    tags: [
      { en: 'Medical AI', ar: 'الذكاء الاصطناعي الطبي' },
      { en: 'Computer Vision', ar: 'رؤية الحاسوب' },
      { en: 'Clinical Tools', ar: 'الأدوات السريرية' },
      { en: 'Hair Transplant', ar: 'زراعة الشعر' },
      { en: 'PDF Reports', ar: 'تقارير PDF' }
    ]
  },
  {
    slug: 'calibre-barbershop-ai',
    title: {
      en: 'Calibre: AI Hairstyle Analysis and Barbershop Management for the Modern Grooming Studio',
      ar: 'Calibre: تحليل تسريحات الشعر بالذكاء الاصطناعي وإدارة محل الحلاقة للاستوديو الحديث'
    },
    client: 'Calibre',
    industry: {
      en: 'Health & Beauty',
      ar: 'الصحة والجمال'
    },
    industryKey: 'beauty',
    duration: '12 Weeks',
    excerpt: {
      en: 'Ibrahim Alia, founder of Calibre, wanted to bring AI to the barbershop — not as a gimmick, but as a genuine tool that helps clients discover their style and barbers run a smarter business. Aviniti built a dual-product ecosystem: a consumer app with AI hairstyle try-on and a comprehensive barbershop management system — both live on the App Store and Google Play.',
      ar: 'أراد إبراهيم آليا، مؤسس Calibre، إحضار الذكاء الاصطناعي إلى محل الحلاقة - ليس كحيلة، بل كأداة حقيقية تساعد العملاء على اكتشاف أسلوبهم والحلاقين على إدارة عمل أذكى. بنت Aviniti نظام بيئي ثنائي المنتج: تطبيق مستهلك مع تجربة تسريحة شعر بالذكاء الاصطناعي ونظام إدارة شامل لمحل الحلاقة - كليهما مباشر على App Store و Google Play.'
    },
    heroDescription: {
      en: 'AI hairstyle try-on meets professional barbershop management — two connected apps, one ecosystem',
      ar: 'تجربة تسريحة شعر بالذكاء الاصطناعي تلتقي بإدارة محل حلاقة احترافية - تطبيقان متصلان، نظام بيئي واحد'
    },
    heroImage: '/images/case-studies/calibre-barbershop-ai.webp',
    accentColor: '#F59E0B',
    challenge: {
      description: {
        en: 'The traditional barbershop experience is surprisingly disconnected — clients struggle to communicate what they want, barbers work from verbal descriptions, and shop owners manage everything through WhatsApp and cash. Ibrahim wanted to close this gap with technology that felt premium, not clinical.',
        ar: 'تجربة محل الحلاقة التقليدية منفصلة بشكل مفاجئ - يكافح العملاء للتواصل بما يريدون، والحلاقون يعملون من الأوصاف اللفظية، وأصحاب المتاجر يديرون كل شيء من خلال WhatsApp والنقد. أراد إبراهيم إغلاق هذه الفجوة بتكنولوجيا بدت متطورة وليس سريرية.'
      },
      points: [
        {
          en: 'Style communication gap: clients typically arrive at a barber with vague descriptions or saved photos from Pinterest — no way to virtually see how a style would look on their own face before committing',
          ar: 'فجوة الاتصال بأسلوب: يصل العملاء عادة إلى حلاق برسائل غامضة أو صور محفوظة من Pinterest - لا توجد طريقة لرؤية كيف ستبدو تسريحة على وجههم الخاص قبل الالتزام'
        },
        {
          en: 'No CRM or client history: barbers had no record of past styles, product preferences, or visit history — every appointment started from scratch, making it impossible to build on previous work',
          ar: 'لا إدارة علاقات العملاء أو سجل العميل: لم يكن لدى الحلاقين سجل لأنماط سابقة أو تفضيلات المنتجات أو سجل الزيارات - بدأت كل موعد من الصفر، مما جعل من المستحيل البناء على العمل السابق'
        },
        {
          en: 'Manual appointment management: bookings were handled through WhatsApp messages and paper calendars, leading to double-bookings, no-shows without deposits, and wasted chair time',
          ar: 'إدارة المواعيد اليدوية: تم التعامل مع الحجوزات من خلال رسائل WhatsApp والتقاويم الورقية، مما أدى إلى حجوزات مزدوجة وعدم ظهور بدون رواسب ووقت مضيع على الكرسي'
        },
        {
          en: 'Product cabinet chaos: clients using multiple grooming products had no way to check ingredient compatibility or get personalized recommendations based on their hair type and scalp condition',
          ar: 'فوضى خزانة المنتج: لم يكن لدى العملاء الذين يستخدمون عدة منتجات للعناية طريقة للتحقق من توافق المكونات أو الحصول على توصيات شخصية بناءً على نوع الشعر وحالة فروة الرأس'
        },
        {
          en: 'Disconnected consumer and business layers: even shops with booking apps had no connection to the client\'s personal grooming profile — the two worlds were completely siloed',
          ar: 'طبقات المستهلك والعمل المنفصلة: حتى المتاجر التي تحتوي على تطبيقات الحجز لم يكن لديها اتصال بملف تعريف العناية الشخصية للعميل - كان العالمان منفصلان تماماً'
        }
      ]
    },
    solution: {
      description: {
        en: 'Aviniti architected Calibre as two deeply connected products: a consumer-facing grooming app (available to everyone) and a business management platform for barbershops. The consumer app creates demand and builds client profiles; the business platform captures that demand and runs the operation.',
        ar: 'صممت Aviniti Calibre كمنتجين متصلين بعمق: تطبيق العناية الموجه للمستهلك (متاح للجميع) ومنصة إدارة الأعمال لمحلات الحلاقة. يقوم تطبيق المستهلك بإنشاء الطلب وبناء ملفات تعريف العملاء؛ تقبل منصة الأعمال هذا الطلب وتدير التشغيل.'
      },
      points: [
        {
          en: 'AI Hairstyle Try-On: computer vision maps facial geometry and simulates realistic hairstyle overlays in real-time — clients can explore dozens of cuts and styles on their own face before a single snip is made',
          ar: 'تجربة تسريحة الشعر بالذكاء الاصطناعي: رسائل رؤية الحاسوب الهندسة الوجهية وتحاكي تراكب تسريحة شعر واقعية في الوقت الفعلي - يمكن للعملاء استكشاف عشرات القطع والأنماط على وجههم الخاص قبل قص واحد'
        },
        {
          en: 'Style DNA Profiling: a guided questionnaire combined with AI analysis of existing photos builds a personal "Style DNA" — a profile of hair type, face shape, lifestyle, and aesthetic preferences that drives all recommendations',
          ar: 'ملف تعريف Style DNA: استبيان موجه مقترن بتحليل الذكاء الاصطناعي للصور الموجودة يبني "Style DNA" شخصي - ملف تعريف نوع الشعر وشكل الوجه ونمط الحياة وتفضيلات جمالية تدفع جميع التوصيات'
        },
        {
          en: 'AI Grooming Mirror: the app\'s live camera mode provides real-time style suggestions and product application guidance, turning the phone into an interactive grooming assistant',
          ar: 'مرآة العناية بالذكاء الاصطناعي: يوفر وضع الكاميرا المباشر للتطبيق اقتراحات أسلوب في الوقت الفعلي وتوجيه تطبيق المنتج، مما يحول الهاتف إلى مساعد عناية تفاعلي'
        },
        {
          en: 'Product Cabinet with Conflict Detection: users log their grooming products; the AI checks ingredient compatibility across the cabinet and flags combinations that damage hair or cancel each other out',
          ar: 'خزانة المنتج مع كشف الصراع: يسجل المستخدمون منتجات العناية الخاصة بهم؛ يتحقق الذكاء الاصطناعي من توافق المكونات عبر الخزانة ويعلم التركيبات التي تضر بالشعر أو تلغي بعضها البعض'
        },
        {
          en: 'Owner & Receptionist Dashboard: barbershop owners get full business visibility — daily/weekly revenue, chair utilization, staff performance, top services, and client retention analytics',
          ar: 'لوحة تحكم المالك والموظف الإداري: يحصل أصحاب محلات الحلاقة على رؤية عمل كاملة - الإيرادات اليومية / الأسبوعية واستخدام الكرسي وأداء الموظفين والخدمات الأولى وتحليلات الاحتفاظ بالعميل'
        },
        {
          en: 'Barber App: individual barbers see their daily schedule, client history with past cuts and notes, upcoming appointments, and client style preferences — giving every visit context',
          ar: 'تطبيق الحلاق: يرى الحلاقون الأفراد جدولهم اليومي وسجل العميل مع القطع السابقة والملاحظات والمواعيد القادمة وتفضيلات أسلوب العميل - مما يعطي كل زيارة سياق'
        },
        {
          en: 'Integrated Booking Flow: clients book directly through the consumer app, selecting barber, service, and time — with automated deposit collection and no-show protection built in',
          ar: 'سير عمل الحجز المتكامل: يحجز العملاء مباشرة من خلال تطبيق المستهلك، واختيار الحلاق والخدمة والوقت - مع جمع الإيداع الآلي وحماية عدم الظهور المدمجة'
        }
      ]
    },
    results: {
      description: {
        en: 'Calibre launched on both platforms and has earned a perfect 5-star rating. The dual-product approach created a flywheel: consumer app users discover local Calibre-powered barbershops, driving foot traffic and bookings directly into the business management system.',
        ar: 'تم إطلاق Calibre على كلا النظامين وحقق تقييمًا مثاليًا بـ 5 نجوم. خلق النهج ثنائي المنتج عجلة دوارة: يكتشف مستخدمو تطبيق المستهلك محلات حلاقة محلية مدعومة بـ Calibre، مما يحرك حركة السير والحجوزات مباشرة في نظام إدارة الأعمال.'
      },
      metrics: [
        {
          value: '5★',
          label: { en: 'App Store Rating', ar: 'تقييم متجر التطبيقات' },
          description: { en: 'Perfect rating on both App Store and Google Play since launch', ar: 'تقييم مثالي على App Store و Google Play منذ الإطلاق' }
        },
        {
          value: '2 Apps',
          label: { en: 'Products Delivered', ar: 'المنتجات المسلمة' },
          description: { en: 'Consumer grooming app + business management platform — one integrated ecosystem', ar: 'تطبيق العناية للمستهلك + منصة إدارة الأعمال - نظام بيئي متكامل واحد' }
        },
        {
          value: 'Real-Time',
          label: { en: 'AI Try-On', ar: 'تجربة الذكاء الاصطناعي' },
          description: { en: 'Live camera hairstyle overlay with instant style switching — no rendering wait time', ar: 'تراكب تسريحة الكاميرا المباشرة مع تحويل النمط الفوري - بدون وقت انتظار العرض' }
        },
        {
          value: '12 Weeks',
          label: { en: 'Time to Market', ar: 'الوقت للسوق' },
          description: { en: 'Full dual-app ecosystem from concept to App Store and Google Play listings', ar: 'النظام البيئي الكامل ثنائي التطبيق من المفهوم إلى قوائم App Store و Google Play' }
        },
        {
          value: '0',
          label: { en: 'Double-Bookings', ar: 'الحجوزات المزدوجة' },
          description: { en: 'Automated scheduling with conflict detection eliminated all double-bookings from day one', ar: 'الجدولة الآلية مع كشف الصراع القضاء على جميع الحجوزات المزدوجة من اليوم الأول' }
        },
        {
          value: '100%',
          label: { en: 'Client History Tracked', ar: 'سجل العميل المتابع' },
          description: { en: 'Every visit, style, product, and barber note logged automatically — complete client relationship history', ar: 'يتم تسجيل كل زيارة وأسلوب وملاحظة المنتج والحلاق تلقائيًا - سجل علاقة العميل الكامل' }
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
      quote: {
        en: "I wanted Calibre to feel like the Apple of barbershop apps — premium, intelligent, and seamless. Aviniti got that from day one. The AI hairstyle try-on is genuinely impressive — clients use it in the chair to decide their cut. The business side tracks everything automatically. It's not just an app; it's changed how my shop operates and how clients experience the whole thing.",
        ar: 'أردت أن تشعر Calibre بأنها Apple من تطبيقات محل الحلاقة - متطورة وذكية وسلسة. حققت Aviniti ذلك من اليوم الأول. تجربة تسريحة الشعر بالذكاء الاصطناعي رائعة حقاً - يستخدمها العملاء على الكرسي لتقرير قطعهم. تتبع الجانب التجاري كل شيء تلقائياً. إنه ليس مجرد تطبيق؛ لقد غير طريقة عمل متجري وكيفية تجربة العملاء للشيء كله.'
      },
      author: 'Ibrahim Alia',
      role: { en: 'Founder & CEO, Calibre', ar: 'المؤسس والرئيس التنفيذي لـ Calibre' }
    },
    listingMetrics: [
      { value: '5★', label: { en: 'App Store Rating', ar: 'تقييم متجر التطبيقات' } },
      { value: '2 Apps', label: { en: 'Consumer + Business', ar: 'المستهلك + الأعمال' } },
      { value: 'Real-Time', label: { en: 'AI Hairstyle Try-On', ar: 'تجربة تسريحة الشعر بالذكاء الاصطناعي' } }
    ],
    tags: [
      { en: 'AI', ar: 'الذكاء الاصطناعي' },
      { en: 'Augmented Reality', ar: 'الواقع المعزز' },
      { en: 'Computer Vision', ar: 'رؤية الحاسوب' },
      { en: 'Barbershop', ar: 'محل الحلاقة' },
      { en: 'iOS', ar: 'iOS' },
      { en: 'Android', ar: 'Android' },
      { en: 'Health & Beauty', ar: 'الصحة والجمال' }
    ]
  },
  {
    slug: 'secretary-office-management',
    title: {
      en: 'Secretary: From WhatsApp Chaos to a Complete Office Management System',
      ar: 'Secretary: من فوضى الواتس آب إلى نظام إدارة مكتب كامل'
    },
    client: 'Secretary (Saber Al Obaidi)',
    industry: {
      en: 'Business Operations',
      ar: 'العمليات التجارية'
    },
    industryKey: 'business',
    duration: '6 Weeks',
    excerpt: {
      en: 'Saber Al Obaidi needed a way to run his appointment-based business without losing track of clients, bookings, and payments across multiple WhatsApp threads and paper notes. Aviniti built Secretary — a full office management suite with CRM, appointment scheduling, staff management, and payment tracking — now used by medical clinics, makeup artists, consultancies, and professional service providers.',
      ar: 'احتاج صابر العبيدي إلى طريقة لإدارة عمله القائم على المواعيد دون فقدان تتبع العملاء والحجوزات والدفع عبر خيوط Whatsapp المتعددة والملاحظات الورقية. بنت Aviniti Secretary - مجموعة إدارة مكتب كاملة مع CRM وجدولة المواعيد وإدارة الموظفين وتتبع الدفع - يتم استخدامها الآن من قبل العيادات الطبية وفنانات الماكياج والاستشارات ومقدمي الخدمات المهنية.'
    },
    heroDescription: {
      en: 'One dashboard to manage appointments, clients, staff, and payments — built for any appointment-based business',
      ar: 'لوحة تحكم واحدة لإدارة المواعيد والعملاء والموظفين والدفع - مبنية لأي عمل قائم على المواعيد'
    },
    heroImage: '/images/case-studies/secretary-office-management.webp',
    accentColor: '#38BDF8',
    challenge: {
      description: {
        en: 'Saber ran a professional services business that had outgrown informal tools. Bookings lived in WhatsApp, client notes were in a personal notebook, payments were tracked in a spreadsheet, and staff scheduling happened over phone calls. The system worked at small scale — but as the business grew, cracks appeared everywhere.',
        ar: 'كان صابر يدير عمل خدمات احترافية كان قد تجاوز الأدوات غير الرسمية. عاشت الحجوزات في WhatsApp، وكانت ملاحظات العميل في دفتر شخصي، وتم تتبع الدفع في جدول بيانات، والجدولة للموظفين حدثت عبر مكالمات هاتفية. عمل النظام على نطاق صغير - لكن مع نمو العمل، ظهرت شقوق في كل مكان.'
      },
      points: [
        {
          en: 'Booking chaos: appointments were confirmed over WhatsApp with no formal record — double-bookings were common, no-shows went untracked, and follow-up reminders required manual effort for every client',
          ar: 'فوضى الحجز: تم تأكيد المواعيد عبر WhatsApp بدون سجل رسمي - كانت الحجوزات المزدوجة شائعة والمشاركون بلا مقابل ظلوا غير متتبعين وتذكيرات المتابعة تتطلب جهودًا يدوية لكل عميل'
        },
        {
          en: 'No client history or CRM: every new interaction started from scratch — there was no centralized record of past appointments, services rendered, notes, preferences, or payment history for any client',
          ar: 'لا سجل العميل أو CRM: بدأت كل تفاعل جديد من الصفر - لم يكن هناك سجل مركزي للمواعيد السابقة والخدمات المقدمة والملاحظات والتفضيلات أو سجل الدفع لأي عميل'
        },
        {
          en: 'Manual payment tracking: invoices were issued informally, payments were tracked in a spreadsheet with no automation, and overdue balances required uncomfortable personal follow-up',
          ar: 'تتبع الدفع اليدوي: تم إصدار الفواتير بشكل غير رسمي وتم تتبع الدفع في جدول بيانات بدون أتمتة وأرصدة التأخير تتطلب متابعة شخصية غير مريحة'
        },
        {
          en: 'Staff scheduling by text: coordinating staff availability, assigning appointments, and tracking hours happened through group chats — no visibility into who was working when or how busy each staff member was',
          ar: 'جدولة الموظفين حسب النص: تنسيق توفر الموظفين وتعيين المواعيد وتتبع الساعات حدث من خلال الدردشات الجماعية - لا رؤية حول من كان يعمل متى أو مدى انشغال كل موظف'
        },
        {
          en: 'No business analytics: the owner had no clear picture of revenue trends, busiest hours, most popular services, or client retention — decisions were made on gut feel rather than data',
          ar: 'لا توجد تحليلات الأعمال: لم يكن لدى المالك صورة واضحة عن اتجاهات الإيرادات والساعات المزدحمة أو الخدمات الأكثر شعبية أو الاحتفاظ بالعملاء - تم اتخاذ القرارات على أساس الإحساس بدلاً من البيانات'
        }
      ]
    },
    solution: {
      description: {
        en: 'Aviniti built Secretary as a web-based management dashboard designed for any appointment-driven business. The system is deliberately flexible — the same platform works for a medical clinic, a makeup studio, a legal consultancy, or a hair salon — with configurable service types, staff roles, and billing flows.',
        ar: 'بنت Aviniti Secretary كلوحة تحكم إدارية قائمة على الويب مصممة لأي عمل يعتمد على المواعيد. النظام مرن عن قصد - نفس النظام الأساسي يعمل لعيادة طبية أو استوديو ماكياج أو استشارة قانونية أو صالون حلاقة - مع أنواع خدمات قابلة للتكوين وأدوار الموظفين والتدفقات التي يتم الفواتير عليها.'
      },
      points: [
        {
          en: 'Appointment Calendar: visual drag-and-drop booking calendar with time slot management, staff assignment, service duration configuration, and automated confirmation messages sent to clients',
          ar: 'تقويم المواعيد: تقويم الحجز المرئي والسحب والإسقاط مع إدارة الفترات الزمنية وتعيين الموظفين وتكوين مدة الخدمة والرسائل تأكيد آلية يتم إرسالها للعملاء'
        },
        {
          en: 'Client CRM: complete client profiles with appointment history, service notes, payment records, preferences, and communication log — every interaction stored and searchable from a single view',
          ar: 'CRM العميل: ملفات تعريف العميل الكاملة مع سجل المواعيد وملاحظات الخدمة وسجلات الدفع والتفضيلات وسجل الاتصالات - كل تفاعل مخزن وقابل للبحث من عرض واحد'
        },
        {
          en: 'Staff Management: staff accounts with individual schedules, appointment assignments, working hours tracking, and performance visibility for the business owner',
          ar: 'إدارة الموظفين: حسابات الموظفين مع جداول فردية وتعيينات المواعيد وتتبع ساعات العمل ورؤية الأداء لمالك العمل'
        },
        {
          en: 'Payment & Invoicing: invoices generated automatically at booking or appointment completion, with payment tracking, overdue flagging, and partial payment support — all visible in a unified financial dashboard',
          ar: 'الدفع والفواتير: فواتير يتم إنشاؤها تلقائيًا عند الحجز أو اكتمال الموعد، مع تتبع الدفع والعلم بالتأخير ودعم الدفع الجزئي - كل شيء مرئي في لوحة تحكم مالية موحدة'
        },
        {
          en: 'Business Analytics Dashboard: real-time metrics on revenue, bookings, no-show rates, busiest time slots, most popular services, and staff utilization — enabling data-driven scheduling and pricing decisions',
          ar: 'لوحة تحكم تحليلات الأعمال: مقاييس في الوقت الفعلي على الإيرادات والحجوزات ومعدلات عدم الظهور والفترات الزمنية المزدحمة والخدمات الأكثر شعبية واستخدام الموظفين - تمكين قرارات الجدولة والتسعير التي تعتمد على البيانات'
        },
        {
          en: 'Configurable for Any Service Business: service types, durations, pricing, staff roles, and business hours are all configurable without code — making Secretary deployable to any appointment-based business without customization',
          ar: 'قابل للتكوين لأي عمل خدمة: أنواع الخدمات والمدة والتسعير وأدوار الموظفين وساعات العمل - كل شيء قابل للتكوين بدون رمز - جعل Secretary قابل للنشر لأي عمل قائم على المواعيد بدون تخصيص'
        }
      ]
    },
    results: {
      description: {
        en: 'Secretary is now actively used across multiple business types — from medical clinics to beauty studios to professional consultancies. The platform eliminated operational chaos and gave Saber (and subsequent users) real control over their businesses for the first time.',
        ar: 'يتم استخدام Secretary الآن بنشاط عبر أنواع عمل متعددة - من العيادات الطبية إلى استوديوهات الجمال إلى الاستشارات المهنية. ألغت المنصة الفوضى التشغيلية وأعطت صابر (والمستخدمين اللاحقين) السيطرة الحقيقية على أعمالهم للمرة الأولى.'
      },
      metrics: [
        {
          value: '0',
          label: { en: 'Double-Bookings', ar: 'الحجوزات المزدوجة' },
          description: { en: 'Automated scheduling with conflict detection has eliminated all double-bookings since launch', ar: 'ألغت الجدولة الآلية مع كشف الصراع جميع الحجوزات المزدوجة منذ الإطلاق' }
        },
        {
          value: '4★',
          label: { en: 'Client Rating', ar: 'تقييم العميل' },
          description: { en: 'Saber rated the project 4/5 — live and actively used by his business', ar: 'قيّم صابر المشروع 4/5 - مباشر ويستخدم بنشاط من قبل عمله' }
        },
        {
          value: '6 Weeks',
          label: { en: 'Delivery Time', ar: 'وقت الإسليم' },
          description: { en: 'Complete office management suite from brief to live deployment in 6 weeks', ar: 'مجموعة إدارة مكتب كاملة من الملخص إلى النشر المباشر في 6 أسابيع' }
        },
        {
          value: '100%',
          label: { en: 'Client History Tracked', ar: 'سجل العميل المتابع' },
          description: { en: 'All client interactions, past appointments, payments, and notes centralized in one searchable CRM', ar: 'يتم تركيز جميع تفاعلات العميل والمواعيد السابقة والدفع والملاحظات في CRM واحد قابل للبحث' }
        },
        {
          value: 'Multi-Industry',
          label: { en: 'Deployable', ar: 'قابل للنشر' },
          description: { en: 'Same platform deployed for clinics, beauty studios, consultancies, and service providers without code changes', ar: 'نفس النظام الأساسي المنتشر للعيادات واستوديوهات الجمال والاستشارات ومقدمي الخدمات بدون تغييرات رمز' }
        },
        {
          value: 'Real-Time',
          label: { en: 'Business Analytics', ar: 'تحليلات الأعمال' },
          description: { en: 'Revenue, booking trends, staff utilization, and no-show rates visible on a live dashboard at all times', ar: 'الإيرادات واتجاهات الحجز واستخدام الموظفين ومعدلات عدم الظهور مرئية على لوحة تحكم مباشرة في جميع الأوقات' }
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
      quote: {
        en: "Before Secretary, I was running my business from WhatsApp and a notebook. I knew I needed something better but I didn't want a complicated system that my staff wouldn't use. Secretary hit exactly the right balance — it covers everything I need, it's easy to navigate, and it actually gets used every day. No more double bookings, no more chasing payments manually. It just works.",
        ar: 'قبل Secretary، كنت أدير عملي من WhatsApp وملفة ملاحظات. كنت أعرف أنني بحاجة إلى شيء أفضل لكنني لم أرغب في نظام معقد لن يستخدمه موظفي. حقق Secretary بالضبط التوازن الصحيح - فهو يغطي كل ما أحتاجه وسهل التنقل فيه وفي الواقع يتم استخدامه كل يوم. لا مزيد من الحجوزات المزدوجة بلا المزيد من متابعة الدفع يدويًا. إنه يعمل فقط.'
      },
      author: 'Saber Al Obaidi',
      role: { en: 'Owner', ar: 'المالك' }
    },
    listingMetrics: [
      { value: '0', label: { en: 'Double-Bookings', ar: 'الحجوزات المزدوجة' } },
      { value: '6 Weeks', label: { en: 'Delivery Time', ar: 'وقت الإسليم' } },
      { value: '4★', label: { en: 'Client Rating', ar: 'تقييم العميل' } }
    ],
    tags: [
      { en: 'CRM', ar: 'إدارة علاقات العملاء' },
      { en: 'Appointment Scheduling', ar: 'جدولة المواعيد' },
      { en: 'Business Operations', ar: 'العمليات التجارية' },
      { en: 'SaaS', ar: 'SaaS' },
      { en: 'Multi-Industry', ar: 'متعدد الصناعات' },
      { en: 'Payments', ar: 'المدفوعات' }
    ]
  }
];

export function getCaseStudyBySlug(slug: string): CaseStudyDetail | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
