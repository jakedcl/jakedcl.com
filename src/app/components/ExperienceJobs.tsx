'use client'

import { useId, useState } from 'react'

import type { Role } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'
import { RoleList } from './ResumeSections'

/**
 * Jobs on /experience. Jobs marked "Hide behind See More" in Studio fold away under a
 * centered button. Button text comes from Studio; with no See More text, every job shows.
 */
export default function ExperienceJobs({
  roles,
  seeMoreLabel,
  seeLessLabel,
  newTabNote,
}: {
  roles: Role[]
  seeMoreLabel: string
  seeLessLabel: string
  newTabNote: string
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  const shown = roles.filter((role) => !role.hideBehindSeeMore)
  const folded = roles.filter((role) => role.hideBehindSeeMore)

  if (folded.length === 0 || !seeMoreLabel) {
    return <RoleList roles={roles} newTabNote={newTabNote} />
  }

  const label = open ? seeLessLabel : seeMoreLabel

  return (
    <div>
      <RoleList roles={shown} newTabNote={newTabNote} />
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        inert={!open}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <RoleList roles={folded} newTabNote={newTabNote} />
        </div>
      </div>
      {label ? (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            className={`${contentLinkClass} inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm leading-relaxed text-ink/85`}
          >
            {label}
            <span
              aria-hidden
              className={`inline-block h-1.5 w-1.5 border-b-[1.5px] border-r-[1.5px] border-current transition-transform duration-300 motion-reduce:transition-none ${
                open ? 'translate-y-px rotate-[225deg]' : '-translate-y-[2px] rotate-45'
              }`}
            />
          </button>
        </div>
      ) : null}
    </div>
  )
}
