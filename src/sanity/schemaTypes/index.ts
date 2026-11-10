import {type SchemaTypeDefinition} from 'sanity'

import {legacySettingsType} from './legacySettings'
import {objectTypes} from './objects'
import {
  aboutPageType,
  caseStudyPageType,
  experiencePageType,
  homePageType,
  projectsPageType,
  seoSettingsType,
  siteGlobalsType,
  skillsPageType,
} from './pages'
import {projectType} from './project'
import {redirectRuleType, redirectsType} from './redirects'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    ...objectTypes,
    redirectRuleType,
    siteGlobalsType,
    homePageType,
    projectsPageType,
    experiencePageType,
    skillsPageType,
    aboutPageType,
    caseStudyPageType,
    seoSettingsType,
    redirectsType,
    projectType,
    legacySettingsType,
  ],
}
