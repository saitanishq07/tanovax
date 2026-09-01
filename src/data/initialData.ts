import { ServiceItem, Project, ProcessStep, FAQItem } from '../types';

export const servicesData: ServiceItem[] = [
  // CATEGORY 1: WEBSITE DEVELOPMENT
  {
    id: 'business-websites',
    category: 'WEBSITE DEVELOPMENT',
    name: 'Business Websites',
    description: 'Professional websites designed to establish an online presence and generate enquiries.',
    iconName: 'Briefcase',
    features: [
      'High-converting landing page design',
      'Lead generation forms & WhatsApp integration',
      'Mobile responsive layout',
      'SEO & performance optimization',
      'CMS for easy updates'
    ],
    suitableFor: ['Small Businesses', 'Service Providers', 'Consultants', 'Local Merchants']
  },
  {
    id: 'company-websites',
    category: 'WEBSITE DEVELOPMENT',
    name: 'Company Websites',
    description: 'Modern corporate websites for businesses, organizations and growing companies.',
    iconName: 'Building2',
    features: [
      'Multi-page corporate architecture',
      'Company vision & team showcase',
      'Investor & stakeholder information',
      'Career portal & inquiry management',
      'Enterprise security & fast global hosting'
    ],
    suitableFor: ['Growing Companies', 'Corporate Entities', 'Agencies', 'Enterprises']
  },
  {
    id: 'portfolio-websites',
    category: 'WEBSITE DEVELOPMENT',
    name: 'Portfolio Websites',
    description: 'Professional personal and creative portfolios designed to showcase work, skills and achievements.',
    iconName: 'Layout',
    features: [
      'Interactive case study showcases',
      'Media galleries & video embeds',
      'Personal branding & credentials',
      'Contact & booking integration',
      'Custom animations & modern aesthetics'
    ],
    suitableFor: ['Architects', 'Designers', 'Engineers', 'Executives', 'Freelancers']
  },
  {
    id: 'real-estate-websites',
    category: 'WEBSITE DEVELOPMENT',
    name: 'Real-Estate Websites',
    description: 'Property and project websites with project details, galleries, enquiry forms, locations and lead-generation features.',
    iconName: 'Home',
    features: [
      'Property listing & plot layout maps',
      'High-res photo galleries & floor plans',
      'Interactive location & neighborhood maps',
      'Instant lead capture & CRM syncing',
      'Schedule site-visit booking form'
    ],
    suitableFor: ['Property Developers', 'Real Estate Agencies', 'Builders', 'Architectural Firms']
  },
  {
    id: 'restaurant-hotel-websites',
    category: 'WEBSITE DEVELOPMENT',
    name: 'Restaurant / Hotel Websites',
    description: 'Modern hospitality websites with menus, services, galleries, booking/enquiry options and contact information.',
    iconName: 'UtensilsCrossed',
    features: [
      'Digital interactive food & room menus',
      'Direct table reservation & room enquiry',
      'High-impact visual ambiance gallery',
      'Google Maps & location navigation',
      'Special events & offers banner'
    ],
    suitableFor: ['Restaurants', 'Hotels', 'Boutique Resorts', 'Cafes & Bars']
  },

  // CATEGORY 2: BUSINESS APPLICATIONS
  {
    id: 'crm',
    category: 'BUSINESS APPLICATIONS',
    name: 'CRM',
    description: 'Custom CRM systems for managing leads, customers, follow-ups, sales activities and business operations.',
    iconName: 'Users',
    features: [
      'Visual sales funnel & lead pipeline',
      'Customer profile & activity history',
      'Automated follow-up reminders',
      'Team role permissions & activity logs',
      'Sales analytics & conversion metrics'
    ],
    suitableFor: ['Sales Teams', 'Real Estate Firms', 'Agencies', 'B2B Companies']
  },
  {
    id: 'billing',
    category: 'BUSINESS APPLICATIONS',
    name: 'Billing',
    description: 'Custom billing and invoicing applications with invoice generation, PDF export and reporting.',
    iconName: 'Receipt',
    features: [
      'Instant PDF invoice creation & download',
      'Client ledger & payment tracking',
      'Tax / GST / VAT calculation rules',
      'Recurring invoice automation',
      'Revenue & outstanding payment reports'
    ],
    suitableFor: ['Retail Stores', 'Service Providers', 'Wholesalers', 'Freelancers']
  },
  {
    id: 'inventory',
    category: 'BUSINESS APPLICATIONS',
    name: 'Inventory',
    description: 'Inventory management systems for tracking products, stock, purchases, sales and reports.',
    iconName: 'Package',
    features: [
      'Real-time stock level monitoring',
      'Low stock alert notifications',
      'Purchase order & supplier records',
      'Barcode / SKU management',
      'Multi-warehouse / multi-category filtering'
    ],
    suitableFor: ['Retail Outlets', 'E-commerce Brands', 'Manufacturing Units', 'Distributors']
  },
  {
    id: 'employee-management',
    category: 'BUSINESS APPLICATIONS',
    name: 'Employee Management',
    description: 'Employee management systems for maintaining employee records, departments, attendance, leave and related information.',
    iconName: 'UserCheck',
    features: [
      'Centralized employee profiles & documents',
      'Department structure & organogram',
      'Daily attendance & clock-in records',
      'Leave application & manager approvals',
      'Performance notes & directory'
    ],
    suitableFor: ['Small to Medium Companies', 'HR Teams', 'Office Managers', 'Startups']
  },
  {
    id: 'dashboards',
    category: 'BUSINESS APPLICATIONS',
    name: 'Dashboards',
    description: 'Business dashboards that convert operational data into clear, actionable insights.',
    iconName: 'BarChart3',
    features: [
      'Real-time key performance indicators (KPIs)',
      'Interactive charts & data filtering',
      'Executive financial summaries',
      'Data aggregation from multiple sources',
      'Role-based dashboard views'
    ],
    suitableFor: ['Business Owners', 'Operations Managers', 'Executives', 'Analysts']
  },
  {
    id: 'customer-portals',
    category: 'BUSINESS APPLICATIONS',
    name: 'Customer Portals',
    description: 'Secure portals where customers can access their information, documents, services, requests and updates.',
    iconName: 'ShieldCheck',
    features: [
      'Secure client login & password authentication',
      'Document sharing & download center',
      'Support ticket submission & tracking',
      'Order / Project progress timeline',
      'Profile & subscription management'
    ],
    suitableFor: ['Client-facing Agencies', 'Law Firms', 'Accounting Services', 'SaaS Platforms']
  }
];

export const initialProjects: Project[] = [
  {
    id: 'project-01',
    title: 'Real Estate Project Website',
    slug: 'real-estate-project-website',
    category: 'Real Estate / Website',
    description: 'A modern lead-focused real estate project website with plot layout views, gallery, location highlights, and interactive enquiry forms.',
    overview: 'This project showcase demonstrates a sleek, high-converting digital experience designed for property developers and real estate firms looking to showcase housing projects or plots to prospective buyers.',
    businessProblem: 'Real estate businesses often rely on static brochures or slow PDF downloads, missing out on immediate buyer enquiries and mobile-friendly project exploration.',
    solution: 'Built an interactive, mobile-optimized property web portal equipped with instant plot overview cards, high-res galleries, Google map integrations, and direct lead routing.',
    features: [
      'Project overview & plot layout maps',
      'High-resolution photo & video galleries',
      'Interactive location map with nearby amenities',
      'Instant lead generation enquiry form',
      'Direct WhatsApp tour booking integration'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase Firestore', 'Vite'],
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    projectStatus: 'Concept Project',
    published: true,
    createdAt: '2026-08-15',
    objective: 'Establish a benchmark digital property showcase that converts visitors into qualified sales leads for property developers.'
  },
  {
    id: 'project-02',
    title: 'Business CRM System',
    slug: 'business-crm',
    category: 'Business Application',
    description: 'A streamlined web CRM designed for managing leads, customer pipelines, follow-ups, and sales team activities.',
    overview: 'A lightweight yet powerful customer relationship management system tailored for small businesses and sales teams who need a clean, structured tool without enterprise complexity.',
    businessProblem: 'Businesses tracking leads across spreadsheets experience missed follow-ups, low conversion visibility, and disjointed team communication.',
    solution: 'Created a centralized cloud CRM featuring a drag-and-drop pipeline board, lead activity timelines, status badges, and automated task reminders.',
    features: [
      'Visual sales funnel & lead status pipeline',
      'Comprehensive customer profile & history',
      'Follow-up schedule & reminder alerts',
      'Interactive executive dashboard metrics',
      'User role access controls'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase Auth', 'Firestore'],
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    ],
    projectStatus: 'Demo Project',
    published: true,
    createdAt: '2026-08-18',
    objective: 'Demonstrate how custom CRMs replace messy Excel sheets with structured, error-free sales workflows.'
  },
  {
    id: 'project-03',
    title: 'Billing Management System',
    slug: 'billing-management-system',
    category: 'Business Application',
    description: 'A clean billing and invoicing application supporting PDF generation, customer ledgers, tax calculation, and payment status tracking.',
    overview: 'An intuitive web application built to streamline invoice creation, payment status tracking, and financial summary reporting for service providers and retailers.',
    businessProblem: 'Manual invoicing leads to formatting inconsistencies, delayed payments, and unorganized paper trails.',
    solution: 'Engineered a modern web billing platform that generates branded PDF invoices in one click, calculates applicable taxes automatically, and tracks payment statuses.',
    features: [
      'Customer database & itemized invoice builder',
      'Instant PDF invoice rendering & download',
      'Automated GST/tax & discount calculation',
      'Paid vs Pending invoice status tracking',
      'Monthly sales & revenue overview reports'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'jsPDF', 'Firebase Firestore'],
    images: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80'
    ],
    projectStatus: 'Demo Project',
    published: true,
    createdAt: '2026-08-20',
    objective: 'Provide businesses with a fast, professional invoice generation tool that simplifies billing workflows.'
  },
  {
    id: 'project-04',
    title: 'Inventory Management System',
    slug: 'inventory-management-system',
    category: 'Business Application',
    description: 'A stock management application for product catalog tracking, low-stock warnings, purchase logs, and sales summaries.',
    overview: 'A robust web inventory solution engineered for retail businesses and distributors needing clear visibility over stock movements and purchase orders.',
    businessProblem: 'Stockouts, overstocking, and unrecorded inventory adjustments result in lost profit and operational friction.',
    solution: 'Developed a real-time inventory tracking dashboard with instant low-stock indicators, product category management, and supplier records.',
    features: [
      'Product catalog with SKU & category organization',
      'Real-time stock level monitoring & low-stock alerts',
      'Purchase order creation & supplier logs',
      'Sales movement tracking',
      'Stock evaluation & report exports'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase Firestore'],
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'
    ],
    projectStatus: 'Demo Project',
    published: true,
    createdAt: '2026-08-22',
    objective: 'Help businesses maintain optimal stock levels and prevent inventory leakage.'
  },
  {
    id: 'project-05',
    title: 'Employee Management System',
    slug: 'employee-management-system',
    category: 'Business Application',
    description: 'A digital HR directory for managing employee profiles, department organization, daily attendance, and leave requests.',
    overview: 'An internal company dashboard designed to digitize HR records, track attendance records, and simplify leave management for growing teams.',
    businessProblem: 'Scattered employee files and paper leave requests slow down HR operations and create administrative overhead.',
    solution: 'Built a clean employee portal combining employee directories, department charts, clock-in tracking, and digital leave approval workflows.',
    features: [
      'Centralized employee records & contact profiles',
      'Departmental organization chart',
      'Daily attendance tracking',
      'Leave application & approval status board',
      'Exportable attendance & leave summary reports'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase Firestore'],
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'
    ],
    projectStatus: 'Demo Project',
    published: true,
    createdAt: '2026-08-25',
    objective: 'Provide growing businesses with an efficient, central platform for team management.'
  },
  {
    id: 'project-06',
    title: 'Restaurant Website & Reservation Portal',
    slug: 'restaurant-website',
    category: 'Hospitality / Website',
    description: 'A modern hospitality web solution featuring interactive menus, food photography galleries, and table booking enquiry forms.',
    overview: 'An elegant web application created for dining establishments and hospitality venues looking to attract food lovers and simplify direct table reservations.',
    businessProblem: 'Outdated static menus and lack of online reservation options drive prospective guests toward third-party aggregators with high commissions.',
    solution: 'Designed an immersive restaurant web portal featuring structured categorized menus, vibrant food galleries, direct booking forms, and location guidance.',
    features: [
      'Categorized digital menu (Appetizers, Mains, Desserts, Drinks)',
      'High-resolution food & ambiance photo gallery',
      'Table reservation & event booking enquiry form',
      'Google Maps directions & opening hours display',
      'WhatsApp direct ordering integration'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    ],
    projectStatus: 'Concept Project',
    published: true,
    createdAt: '2026-08-28',
    objective: 'Showcase how hospitality businesses can drive direct table bookings and present an inviting digital presence.'
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Understand',
    description: 'We understand the business, requirements and workflow.',
    details: [
      'In-depth discussion on business objectives',
      'Identifying operational bottlenecks & user needs',
      'Mapping technical scope & integrations'
    ]
  },
  {
    step: '02',
    title: 'Plan',
    description: 'We define the features, technology and project structure.',
    details: [
      'Creating feature roadmaps & technical specifications',
      'Selecting optimal frontend & backend stack',
      'Setting realistic timelines & milestones'
    ]
  },
  {
    step: '03',
    title: 'Design',
    description: 'We create a clean and intuitive user experience.',
    details: [
      'Wireframing user flows & key screens',
      'Crafting clean, accessible component UIs',
      'Ensuring responsive layout across all device sizes'
    ]
  },
  {
    step: '04',
    title: 'Develop',
    description: 'We build and integrate the solution.',
    details: [
      'Writing clean, type-safe TypeScript code',
      'Integrating database schemas & Firebase cloud APIs',
      'Implementing secure authentication & validation'
    ]
  },
  {
    step: '05',
    title: 'Test',
    description: 'We test functionality, responsiveness and usability.',
    details: [
      'Cross-browser & cross-device responsive testing',
      'Form validation & error recovery testing',
      'Performance audit & speed optimization'
    ]
  },
  {
    step: '06',
    title: 'Launch',
    description: 'We deploy the project and provide handover/support.',
    details: [
      'Production deployment on fast cloud infrastructure',
      'Comprehensive admin documentation & handover',
      'Ongoing maintenance & future enhancement readiness'
    ]
  }
];

export const trustPillars = [
  {
    number: '01',
    title: 'Business-Focused Development',
    description: "We don't just build software. We build solutions around actual business requirements."
  },
  {
    number: '02',
    title: 'Custom Solutions',
    description: 'Every business works differently. Our applications are designed around your workflow.'
  },
  {
    number: '03',
    title: 'Modern Technology',
    description: 'Build responsive, scalable and maintainable digital products with industry-standard stacks.'
  },
  {
    number: '04',
    title: 'Simple User Experience',
    description: 'Complex business processes should feel simple to the people using them daily.'
  }
];

export const faqsData: FAQItem[] = [
  {
    question: 'What types of solutions does TanovaX build?',
    answer: 'TanovaX develops modern, responsive websites (Business, Corporate, Real Estate, Hospitality, Portfolios) as well as custom business web applications (CRMs, Billing systems, Inventory management, Employee tools, Customer Portals, and Executive Dashboards).'
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Timeline depends on project scope. A modern business website typically takes 1 to 2 weeks, while a custom business application or CRM usually takes 2 to 4 weeks from planning to deployment.'
  },
  {
    question: 'Can TanovaX build custom software tailored to our exact workflow?',
    answer: 'Yes! Custom business applications are our specialty. Instead of forcing your business into rigid off-the-shelf software, we design software around your exact daily processes.'
  },
  {
    question: 'Do you provide ongoing support after project launch?',
    answer: 'Absolutely. We provide full deployment, system handover, documentation, and optional maintenance packages to keep your platform updated, secure, and running smoothly.'
  },
  {
    question: 'How do we get started on a project?',
    answer: 'You can submit your project details through our "Start a Project" contact form or reach out directly via WhatsApp or email. We will review your requirements and schedule an initial discussion.'
  }
];
