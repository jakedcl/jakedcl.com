import { client } from './client'
import { projectsQuery, settingsQuery } from './queries'
import type { Project, Settings } from '@/types/sanity'

export async function getSiteContent(): Promise<{
  projects: Project[]
  settings: Settings | null
}> {
  const [projects, settings] = await Promise.all([
    client.fetch<Project[]>(projectsQuery),
    client.fetch<Settings | null>(settingsQuery),
  ])

  return { projects, settings }
}
