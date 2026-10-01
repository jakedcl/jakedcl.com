export type ResumeLink = {
  label: string
  href: string
}

export type ResumeBullet = string

export type ResumeRole = {
  title: string
  organization: string
  organizationUrl?: string
  period: string
  bullets: ResumeBullet[]
}

export type ResumeSkillGroup = {
  label: string
  items: string[]
}

export type Resume = {
  legalName: string
  contact: ResumeLink[]
  summary: string
  skills: ResumeSkillGroup[]
  experience: ResumeRole[]
  education: ResumeRole[]
  certifications: ResumeRole[]
}

export const resume: Resume = {
  legalName: 'Jake DeCore-Lurker',
  contact: [
    { label: 'jakedecorelurker@gmail.com', href: 'mailto:jakedecorelurker@gmail.com' },
    { label: 'linkedin.com/in/jakedcl', href: 'https://www.linkedin.com/in/jakedcl' },
    { label: '347-733-1501', href: 'tel:+13477331501' },
  ],
  summary:
    'Computer science graduate and technical professional — full-stack web apps, MSP client environments, and hands-on cloud, identity, networking, and security. Builds production software and keeps business systems running.',
  skills: [
    {
      label: 'Languages & Data',
      items: [
        'JavaScript',
        'TypeScript',
        'C#',
        'Python',
        'PowerShell',
        'SQL',
        'HTML/CSS',
        'PostgreSQL',
        'Neon',
        'Excel',
      ],
    },
    {
      label: 'Web & Mobile',
      items: [
        'React',
        'Next.js',
        'ASP.NET Core',
        'Django',
        'Ruby on Rails',
        'React Native',
        'Expo',
        'REST APIs',
        'Drizzle ORM',
        'JWT',
        'Tailwind CSS',
        'MUI',
        'Vite',
        'Three.js',
        'React Three Fiber',
      ],
    },
    {
      label: 'Architecture',
      items: [
        'Multi-tenant SaaS',
        'PostgreSQL RLS',
        'SQL RBAC',
        'Authentication',
        'Audit logging',
      ],
    },
    {
      label: 'Cloud & Tools',
      items: [
        'Vercel',
        'Render',
        'Cloudflare',
        'Cloudflare R2',
        'AWS',
        'Docker',
        'Git',
        'GitHub',
        'DNS',
        'SSL/TLS',
      ],
    },
    {
      label: 'Content & Commerce',
      items: ['Sanity', 'Shopify', 'Stripe', 'Prodigi', 'Resend', 'Mapbox'],
    },
    {
      label: 'Systems & Endpoints',
      items: [
        'Windows',
        'macOS',
        'Microsoft 365',
        'Entra ID',
        'Google Workspace',
        'GAM',
        'CIPP',
        'Intune',
        'Autopilot',
        'Apple Business Manager',
        'Addigy',
        'NinjaOne',
      ],
    },
    {
      label: 'Networking & Security',
      items: [
        'SonicWall',
        'VPNs',
        'DNS',
        'DHCP',
        'Auvik',
        'SentinelOne',
        'Huntress',
        'Duo',
        'DNSFilter',
        'Avanan',
        'EasyDMARC',
        'SPF/DKIM/DMARC',
      ],
    },
    {
      label: 'Backup & Service Delivery',
      items: ['Cove', 'DropSuite', 'Autotask', 'Hudu', 'CloudRadial'],
    },
  ],
  experience: [
    {
      title: 'Freelance Product Development',
      organization: 'Independent',
      organizationUrl: 'https://jakedcl.com',
      period: '2025–Present',
      bullets: [
        'Build, deploy, and maintain custom websites and web apps for small-business clients using modern frameworks, CMS platforms, APIs, and cloud services',
        'Translate loosely defined client needs into technical requirements, implementation plans, and production solutions',
        'Deploy and maintain production apps on Vercel, Cloudflare, Render, and related platforms; troubleshoot app, DNS, and SSL/TLS issues',
        'Ongoing technical support for 6 recurring clients across hosting, domains, DNS, SSL, email, CMS, SaaS integrations, and production',
        'Document systems and support procedures; help nontechnical clients evaluate tools and vendor platforms',
      ],
    },
    {
      title: 'IT Systems Administrator',
      organization: 'KRNL Technology (MSP)',
      organizationUrl: 'https://krnltech.com',
      period: '10/2024–09/2025',
      bullets: [
        'Administered 5 client environments across Microsoft 365, Entra ID, and Google Workspace using CIPP and GAM',
        'Supported 250+ Windows and Apple endpoints with Intune, Addigy, NinjaOne, and Windows Autopilot',
        'Configured networks, firewalls, VPNs, and DNS; used Auvik for monitoring, discovery, and topology',
        'Supported endpoint, identity, and email security with SentinelOne, Huntress, Duo, DNSFilter, Avanan, and EasyDMARC',
        'Diagnosed email delivery and authentication issues involving SPF, DKIM, and DMARC',
        'Used Autotask PSA for tickets and workflows; automated onboarding and improved client portal delivery with CloudRadial and Hudu',
        'Administered Cove and DropSuite backups and maintained technical documentation',
      ],
    },
    {
      title: 'Audit Intern',
      organization: 'NYC Department of Investigation',
      organizationUrl: 'https://www.nyc.gov/site/doi',
      period: '06/2024–08/2024',
      bullets: [
        'Analyzed structured datasets with Excel and Python to support investigative work',
        'Produced reports from data analysis to support investigations',
      ],
    },
    {
      title: 'Technology Instructor',
      organization: 'NYC DYCD COMPASS STEM',
      organizationUrl: 'https://whizara.com',
      period: '09/2023–06/2024',
      bullets: [
        'Led weekly classes in introductory programming and digital literacy for elementary students using MIT Scratch',
      ],
    },
    {
      title: 'Logistics and Operations Associate',
      organization: 'NY Design & Construction',
      organizationUrl: 'https://nydacinc.com',
      period: '05/2022–05/2024',
      bullets: [
        'Managed company web systems and digital infrastructure while supporting event-production and logistics operations',
        'Coordinated crews, vendors, equipment, and inventory for large-scale events in a fast-moving, client-facing environment',
      ],
    },
    {
      title: 'Frontend Web Developer',
      organization: 'BandNada Social',
      organizationUrl: 'https://bandnada.com',
      period: '01/2023–06/2023',
      bullets: [
        'Contributed to web and mobile app development with Ruby on Rails, React Native, and Expo',
        'Participated in collaborative Git/GitHub workflows including pull requests and code review',
      ],
    },
    {
      title: 'Helpdesk Technician',
      organization: 'Oneonta IT Services',
      organizationUrl: 'https://suny.oneonta.edu',
      period: '08/2022–12/2022',
      bullets: [
        'Provided helpdesk support for student accounts and devices',
        'Supported school printers, projectors, and related campus technology',
      ],
    },
  ],
  education: [
    {
      title: 'Bachelor of Science in Computer Science',
      organization: 'CUNY College of Staten Island',
      organizationUrl: 'https://cs.csi.cuny.edu',
      period: 'May 2026',
      bullets: [],
    },
  ],
  certifications: [
    {
      title: 'Associate Google Workspace Administrator',
      organization: 'View credential',
      organizationUrl:
        'https://www.credly.com/badges/9e258fee-2bde-4253-9dd5-a10250454644',
      period: '',
      bullets: [],
    },
  ],
}
