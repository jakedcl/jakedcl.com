export type ResumeLink = {
  label: string
  href: string
}

export type ResumeBullet = string

export type ResumeRole = {
  title: string
  organization: string
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
}

export const resume: Resume = {
  legalName: 'Jake DeCore-Lurker',
  contact: [
    { label: 'jakedcl.com', href: 'https://jakedcl.com' },
    { label: 'jakedecorelurker@gmail.com', href: 'mailto:jakedecorelurker@gmail.com' },
    { label: '347-733-1501', href: 'tel:+13477331501' },
  ],
  summary:
    'Systems-oriented software and infrastructure professional with experience building and maintaining web applications and operational systems in business environments.',
  skills: [
    {
      label: 'Web & Backend',
      items: [
        'Next.js',
        'React',
        'C#',
        'PostgreSQL',
        'Tailwind CSS',
        'REST APIs',
        'Sanity',
        'Shopify',
      ],
    },
    {
      label: 'Cloud & Deployment',
      items: [
        'Vercel',
        'DNS management',
        'web hosting',
        'AWS',
        'Cloudflare',
        'environment configuration',
      ],
    },
    {
      label: 'DevOps & Tooling',
      items: ['Git', 'Docker', 'Bash/Python (basic)', 'deployment workflows'],
    },
    {
      label: 'Systems & Administration',
      items: [
        'Microsoft 365',
        'Google Workspace (Google Cloud Certified)',
        'Azure AD/Entra ID',
        'Intune',
        'Autopilot',
        'Addigy',
        'NinjaOne',
        'Duo',
        'identity & access management',
      ],
    },
    {
      label: 'Infrastructure & Security',
      items: [
        'Auvik (network monitoring)',
        'SentinelOne and Huntress (EDR)',
        'DNSFilter',
        'SonicWall firewall configuration',
        'backups (DropSuite, Cove)',
        'email security (Avanan, DMARC/DKIM/SPF)',
      ],
    },
  ],
  experience: [
    {
      title: 'Freelance Web Developer',
      organization: 'DCL DEV',
      period: '2024–Present',
      bullets: [
        'Design and develop production web applications for client organizations',
        'Manage deployment environments, integrated services, domains, and existing client systems',
        'Build out and assist with commerce and content management systems',
        'Use Docker for local development consistency and environment replication',
      ],
    },
    {
      title: 'IT Support Technician',
      organization: 'KRNL Technology (MSP)',
      period: '10/2024–9/2025',
      bullets: [
        'Managed Microsoft 365, Azure AD, Google Workspace, and Duo across multiple client organizations',
        'Provisioned and administered devices using MDM enrollment using Intune, Addigy, AutoPilot and NinjaOne',
        'Monitored infrastructure and endpoint security using Auvik, SentinelOne, Huntress, and DNSFilter',
        'Configured DNS, networking, firewall, and security policies using Cloudflare and SonicWall',
        'Maintained backup and recovery systems including DropSuite and Cove',
        'Worked as help desk in ticket environment, troubleshooting hardware and software',
        'Created internal documentation and SOPs, automated repetitive administrative tasks (e.g. on/offboarding)',
      ],
    },
    {
      title: 'Logistics & Operations Associate',
      organization: 'NYDAC',
      period: '2022–2024',
      bullets: [
        'Built and improved internal systems supporting logistics, scheduling, inventory, and operational workflows',
        'Coordinated crews, vendors, equipment, and inventory for large-scale event operations',
        'Acted as liaison between field operations and clients to improve reliability and workflow efficiency',
      ],
    },
    {
      title: 'Technical Intern',
      organization: 'NYC Department of Investigation',
      period: '6/2024–8/2024',
      bullets: [
        'Analyzed structured datasets using Excel and Python and produced reports to support investigations',
      ],
    },
    {
      title: 'Technology Instructor (Part-time)',
      organization: 'NYC Public Schools',
      period: '9/2023–6/2024',
      bullets: [
        'Led weekly classes teaching basic programming and digital literacy to elementary school students',
      ],
    },
  ],
  education: [
    {
      title: 'Bachelor of Science in Computer Science',
      organization: 'CUNY College of Staten Island',
      period: 'May 2026',
      bullets: [],
    },
  ],
}
