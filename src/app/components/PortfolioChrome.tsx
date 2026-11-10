'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useEffect, useReducer, type ReactNode } from 'react'

import { isSectionSlug } from '@/lib/routes'
import { introTitleCompact, type SectionNavItem } from '@/lib/sections'
import IntroName from './IntroName'
import SectionNav from './SectionNav'

const introLinkClass =
  'intro-name-link block w-full rounded-sm outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-blue'

type IntroState = {
  ready: boolean
  homeKey: number
  lastSegment: string | null
}

type IntroAction = { type: 'route'; segment: string | null }

/** Home is `(portfolio)/page.tsx` — the only route with a null segment in this layout. */
function initIntro(segment: string | null): IntroState {
  return {
    ready: segment !== null,
    homeKey: 0,
    lastSegment: segment,
  }
}

function introReducer(state: IntroState, action: IntroAction): IntroState {
  if (action.type !== 'route' || action.segment === state.lastSegment) {
    return state
  }
  if (action.segment === null) {
    const replay = state.lastSegment !== null
    return {
      ready: false,
      homeKey: replay ? state.homeKey + 1 : state.homeKey,
      lastSegment: null,
    }
  }
  return {
    ready: true,
    homeKey: state.homeKey,
    lastSegment: action.segment,
  }
}

export default function PortfolioChrome({
  heroTitle,
  navItems,
  navAriaLabel,
  children,
}: {
  heroTitle: string
  navItems: SectionNavItem[]
  navAriaLabel: string
  children: ReactNode
}) {
  const segment = useSelectedLayoutSegment()
  const isHome = segment === null
  const active =
    segment && isSectionSlug(segment) ? segment : undefined

  const [introState, dispatchIntro] = useReducer(
    introReducer,
    segment,
    initIntro,
  )

  useEffect(() => {
    dispatchIntro({ type: 'route', segment })
  }, [segment])

  const compact = introTitleCompact(heroTitle)
  const intro = (
    <IntroName
      key={introState.homeKey}
      title={heroTitle}
      compact={compact}
      ready={introState.ready}
    />
  )

  return (
    <>
      <header>
        {isHome ? (
          intro
        ) : (
          <Link href="/" className={introLinkClass}>
            {intro}
          </Link>
        )}
        <div className="mt-5">
          <SectionNav items={navItems} active={active} ariaLabel={navAriaLabel} />
        </div>
      </header>
      {children}
    </>
  )
}
