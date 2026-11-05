'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useReducer, type ReactNode } from 'react'

import {
  introTitleCompact,
  isSectionSlug,
  type SectionNavItem,
} from '@/lib/sections'
import IntroName from './IntroName'
import SectionNav from './SectionNav'

const introLinkClass =
  'intro-name-link block w-full rounded-sm outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-blue'

type IntroState = {
  ready: boolean
  homeKey: number
  lastPath: string
}

type IntroAction = { type: 'route'; pathname: string }

function initIntro(pathname: string): IntroState {
  return {
    ready: pathname !== '/',
    homeKey: 0,
    lastPath: pathname,
  }
}

function introReducer(state: IntroState, action: IntroAction): IntroState {
  if (action.type !== 'route' || action.pathname === state.lastPath) {
    return state
  }
  if (action.pathname === '/') {
    const replay = state.lastPath !== '/'
    return {
      ready: false,
      homeKey: replay ? state.homeKey + 1 : state.homeKey,
      lastPath: action.pathname,
    }
  }
  return {
    ready: true,
    homeKey: state.homeKey,
    lastPath: action.pathname,
  }
}

export default function PortfolioChrome({
  heroTitle,
  navItems,
  children,
}: {
  heroTitle: string
  navItems: SectionNavItem[]
  children: ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const sectionSegment = pathname.slice(1)
  const active = isSectionSlug(sectionSegment) ? sectionSegment : undefined

  const [introState, dispatchIntro] = useReducer(
    introReducer,
    pathname,
    initIntro,
  )

  useEffect(() => {
    dispatchIntro({ type: 'route', pathname })
  }, [pathname])

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
          <SectionNav items={navItems} active={active} />
        </div>
      </header>
      {children}
    </>
  )
}
