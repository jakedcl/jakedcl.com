/** Field groups on the Site Settings singleton — one Studio sidebar page each. */
export const SETTINGS_FIELD_GROUPS = {
  homepage: 'homepage',
  caseStudy: 'caseStudy',
  projectsPage: 'projectsPage',
  experience: 'experience',
  skills: 'skills',
  about: 'about',
  searchSharing: 'searchSharing',
} as const

export type SettingsFieldGroup =
  (typeof SETTINGS_FIELD_GROUPS)[keyof typeof SETTINGS_FIELD_GROUPS]

/** Maps structure document pane ids to the field group shown on that page. */
export const SETTINGS_PANE_FIELD_GROUP: Record<string, SettingsFieldGroup> = {
  'settings-page-homepage': SETTINGS_FIELD_GROUPS.homepage,
  'settings-page-case-study': SETTINGS_FIELD_GROUPS.caseStudy,
  'settings-page-projects-heading': SETTINGS_FIELD_GROUPS.projectsPage,
  'settings-page-experience': SETTINGS_FIELD_GROUPS.experience,
  'settings-page-skills': SETTINGS_FIELD_GROUPS.skills,
  'settings-page-about': SETTINGS_FIELD_GROUPS.about,
  'settings-page-search-sharing': SETTINGS_FIELD_GROUPS.searchSharing,
}
