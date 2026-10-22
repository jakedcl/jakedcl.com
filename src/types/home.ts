export type HomeLink = {
  _key?: string
  label: string
  href: string
}

export type HomeRole = {
  _key?: string
  title: string
  organization: string
  organizationUrl?: string
  period: string
  bullets: string[]
}

export type HomeSkillGroup = {
  _key?: string
  label: string
  items: string[]
}
