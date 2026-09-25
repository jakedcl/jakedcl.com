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
}

export const resume: Resume = {
  legalName: 'Jake DeCore-Lurker',
  contact: [
    { label: 'jakedecorelurker@gmail.com', href: 'mailto:jakedecorelurker@gmail.com' },
    { label: 'linkedin.com/in/jakedcl', href: 'https://www.linkedin.com/in/jakedcl' },
    { label: '347-733-1501', href: 'tel:+13477331501' },
  ],
  summary:
    'IT systems admin and web developer — MSP experience managing endpoints and cloud tenants, plus shipping production apps and sites for business clients.',
  skills: [
    {
      label: 'Support & Admin',
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
      label: 'Security & Network',
      items: [
        'VPNs',
        'DNS',
        'MFA',
        'Auvik',
        'DNSFilter',
        'SentinelOne',
        'Huntress',
        'Duo',
        'SonicWall',
      ],
    },
    {
      label: 'Service Delivery',
      items: ['Autotask', 'Hudu', 'CloudRadial'],
    },
    {
      label: 'Development & Cloud',
      items: [
        'JavaScript',
        'TypeScript',
        'C#',
        'Python',
        'PowerShell',
        'SQL',
        'React',
        'Next.js',
        'ASP.NET Core',
        'Tailwind',
        'Drizzle',
        'Three.js',
        'React Three Fiber',
        'PostgreSQL',
        'Stripe',
        'Git',
        'Docker',
        'Cloudflare',
        'Vercel',
        'Render',
        'Railway',
        'Sanity',
      ],
    },
  ],
  experience: [
    {
      title: 'IT Systems Administrator',
      organization: 'KRNL Technology (MSP)',
      organizationUrl: 'https://krnltech.com',
      period: '10/2024–9/2025',
      bullets: [
        'Administered 5 client Microsoft 365, Entra ID, and Google Workspace environments with CIPP and GAM',
        'Supported 250+ Windows and Apple endpoints with Intune, Addigy, NinjaOne, and Autopilot',
        'Configured firewalls, VPNs, and DNS, and used Auvik for monitoring',
        'Diagnosed email delivery issues involving SPF, DKIM, and DMARC',
        'Automated client onboarding with Autotask, CloudRadial, and Hudu, and administered Cove and DropSuite backups',
        'Associate Google Workspace Administrator',
      ],
    },
    {
      title: 'Freelance Product Development',
      organization: 'jakedcl.com',
      organizationUrl: 'https://jakedcl.com',
      period: '2025–Present',
      bullets: [
        'Build, deploy, and maintain custom web apps for small-business clients',
        'Ongoing support for 6 recurring clients across hosting, DNS, SSL, CMS, and production',
      ],
    },
    {
      title: 'Audit Intern',
      organization: 'NYC Department of Investigation',
      organizationUrl: 'https://www.nyc.gov/site/doi',
      period: '6/2024–8/2024',
      bullets: [
        'Analyzed structured datasets in Excel and Python for investigative reports',
      ],
    },
    {
      title: 'Logistics & Operations Associate',
      organization: 'NY Design & Construction',
      organizationUrl: 'https://nydacinc.com',
      period: '5/2022–5/2024',
      bullets: [
        'Supported event ops while managing company systems and digital infrastructure',
      ],
    },
    {
      title: 'Technology Instructor',
      organization: 'NYC DYCD COMPASS STEM Program',
      period: '9/2023–6/2024',
      bullets: [
        'Taught introductory programming and digital literacy with MIT Scratch',
      ],
    },
    {
      title: 'Frontend Web Developer',
      organization: 'BandNada Social',
      organizationUrl: 'https://bandnada.com',
      period: '1/2023–6/2023',
      bullets: [
        'Contributed to web and mobile apps with Ruby on Rails, React Native, and Expo',
      ],
    },
  ],
  education: [
    {
      title: 'Bachelor of Science in Computer Science',
      organization: 'CUNY College of Staten Island',
      organizationUrl: 'https://www.cs.csi.cuny.edu/',
      period: 'May 2026',
      bullets: [],
    },
  ],
}
