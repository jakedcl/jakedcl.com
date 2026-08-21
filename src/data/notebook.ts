import { resume } from './resume'
import type { Settings } from '@/types/sanity'

export type NotebookCoverCopy = {
  name: string
  subject: string
  email: string
}

export type NotebookInsideCopy = {
  name: string
  address: string
  school: string
  class: string
}

export type NotebookCopy = {
  cover: NotebookCoverCopy
  inside: NotebookInsideCopy
}

const pick = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

export const NOTEBOOK_COVER_FALLBACK: NotebookCoverCopy = {
  name: 'Jake DCL',
  subject: 'Web Developer',
  email: 'jakedcl.com',
}

export const NOTEBOOK_INSIDE_FALLBACK: NotebookInsideCopy = {
  name: 'Jake DCL',
  address: 'jakedcl.com',
  school: resume.education[0]?.organization ?? 'CUNY College of Staten Island',
  class: 'Web Developer',
}

export function resolveNotebookCopy(settings: Settings | null | undefined): NotebookCopy {
  return {
    cover: {
      name: pick(settings?.notebookCover?.name, NOTEBOOK_COVER_FALLBACK.name),
      subject: pick(settings?.notebookCover?.subject, NOTEBOOK_COVER_FALLBACK.subject),
      email: pick(settings?.notebookCover?.email, NOTEBOOK_COVER_FALLBACK.email),
    },
    inside: {
      name: pick(settings?.notebookInside?.name, NOTEBOOK_INSIDE_FALLBACK.name),
      address: pick(settings?.notebookInside?.address, NOTEBOOK_INSIDE_FALLBACK.address),
      school: pick(settings?.notebookInside?.school, NOTEBOOK_INSIDE_FALLBACK.school),
      class: pick(settings?.notebookInside?.class, NOTEBOOK_INSIDE_FALLBACK.class),
    },
  }
}
