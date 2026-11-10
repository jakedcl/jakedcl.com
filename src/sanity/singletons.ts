import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {CaseIcon} from '@sanity/icons/Case'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {HomeIcon} from '@sanity/icons/Home'
import {LinkIcon} from '@sanity/icons/Link'
import {SearchIcon} from '@sanity/icons/Search'
import {StarIcon} from '@sanity/icons/Star'
import {UserIcon} from '@sanity/icons/User'
import {defineSingleton} from 'sanity'

/** One document per site page, plus the site-wide ones. Fixed ids = type names. */
export const SINGLETONS = [
  defineSingleton({documentId: 'siteGlobals', schemaType: 'siteGlobals', title: 'Site-wide', icon: EarthGlobeIcon}),
  defineSingleton({documentId: 'homePage', schemaType: 'homePage', title: 'Homepage', icon: HomeIcon}),
  defineSingleton({documentId: 'projectsPage', schemaType: 'projectsPage', title: 'Projects page', icon: DocumentTextIcon}),
  defineSingleton({documentId: 'experiencePage', schemaType: 'experiencePage', title: 'Experience', icon: CaseIcon}),
  defineSingleton({documentId: 'skillsPage', schemaType: 'skillsPage', title: 'Skills', icon: BulbOutlineIcon}),
  defineSingleton({documentId: 'aboutPage', schemaType: 'aboutPage', title: 'About', icon: UserIcon}),
  defineSingleton({documentId: 'caseStudyPage', schemaType: 'caseStudyPage', title: 'Case study (/showcase)', icon: StarIcon}),
  defineSingleton({documentId: 'seoSettings', schemaType: 'seoSettings', title: 'Search & sharing', icon: SearchIcon}),
  defineSingleton({documentId: 'redirects', schemaType: 'redirects', title: 'Redirects', icon: LinkIcon}),
]

/** Types that only ever have their one fixed document (plus the hidden legacy settings doc). */
export const LOCKED_TYPES: ReadonlySet<string> = new Set([
  ...SINGLETONS.map((s) => s.schemaType),
  'settings',
])
