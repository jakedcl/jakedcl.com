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
    'IT systems admin and web developer — MSP experience managing endpoints and cloud tenants, plus shipping production apps and sites for small-business clients.',
  skills: [
    {
      label: 'Support & Admin',
      items: [
        'Windows',
        'macOS',
        'Microsoft 365',
        'Entra ID',
        'Google Workspace',
        'Intune',
        'Autopilot',
        'NinjaOne',
      ],
    },
    {
      label: 'Security & Network',
      items: ['VPNs', 'DNS', 'MFA', 'SentinelOne', 'Huntress', 'Duo', 'SonicWall'],
    },
    {
      label: 'Development & Cloud',
      items: [
        'React',
        'Next.js',
        'ASP.NET Core',
        'PostgreSQL',
        'Python',
        'Git',
        'Docker',
        'Cloudflare',
        'Vercel',
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
        'Administered client Microsoft 365, Entra ID, and Google Workspace environments',
        'Supported 250+ Windows and Apple endpoints with Intune, Addigy, NinjaOne, and Autopilot',
        'Associate Google Workspace Administrator',
      ],
    },
    {
      title: 'Freelance Web Development',
      organization: 'DCL DEV',
      organizationUrl: 'https://jakedcl.com',
      period: '2024–Present',
      bullets: [
        'Build and maintain custom web apps for small-business clients',
        'Ongoing support for 6 recurring clients across hosting, DNS, CMS, and production',
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
