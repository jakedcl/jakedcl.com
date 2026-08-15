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
    { label: '347-733-1501', href: 'tel:+13477331501' },
  ],
  summary:
    'CS grad and software developer building full-stack web apps, APIs, and production sites — with systems/ops experience that keeps things shipping reliably.',
  skills: [
    {
      label: 'Languages',
      items: ['JavaScript', 'TypeScript', 'C#', 'Python', 'SQL'],
    },
    {
      label: 'Web',
      items: ['React', 'Next.js', 'ASP.NET Core', 'Tailwind', 'REST APIs', 'PostgreSQL'],
    },
    {
      label: 'Cloud & Tools',
      items: ['Vercel', 'Render', 'AWS', 'Docker', 'Cloudflare', 'Git', 'Sanity', 'Shopify'],
    },
  ],
  experience: [
    {
      title: 'Freelance Developer & Technical Consultant',
      organization: 'DCL DEV',
      period: '2023–Present',
      bullets: [
        'Build and maintain sites and apps for 6 recurring business clients',
        'Ship production work on Vercel, Cloudflare, and Render',
      ],
    },
    {
      title: 'IT Support Technician',
      organization: 'KRNL Technology (MSP)',
      organizationUrl: 'https://krnltech.com',
      period: '10/2024–9/2025',
      bullets: [
        'Admin for 10+ Microsoft 365 and Google Workspace environments',
        'Endpoint management with Intune, Autopilot, Addigy, and NinjaOne',
      ],
    },
    {
      title: 'Technical Intern',
      organization: 'NYC Department of Investigation',
      organizationUrl: 'https://www.nyc.gov/site/doi',
      period: '6/2024–8/2024',
      bullets: ['Python + Excel data cleaning and analysis for investigative reports'],
    },
    {
      title: 'Logistics & Operations Associate',
      organization: 'New York Design and Construction',
      organizationUrl: 'https://newyorkdesignandconstruction.com',
      period: '5/2022–6/2024',
      bullets: [
        'Managed company web systems while supporting event logistics ops',
      ],
    },
    {
      title: 'Frontend / Application Development',
      organization: 'BandNada Social',
      period: '',
      bullets: [
        'Contributed across React, Rails, and React Native / Expo repos',
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
