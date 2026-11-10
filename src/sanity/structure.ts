import {ProjectsIcon} from '@sanity/icons/Projects'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

/**
 * Studio sidebar: one item per site page, in the same order as the site menu.
 * Each item opens its own document, so every page shows only its own fields.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('jakedcl.com')
    .items([
      S.listItem().singleton('siteGlobals'),
      S.divider(),
      S.listItem().singleton('homePage'),
      S.listItem()
        .title('Projects')
        .id('projects')
        .icon(ProjectsIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem().singleton('projectsPage'),
              orderableDocumentListDeskItem({
                type: 'project',
                id: 'all-projects',
                title: 'All projects (drag to reorder)',
                icon: ProjectsIcon,
                S,
                context,
              }),
            ]),
        ),
      S.listItem().singleton('experiencePage'),
      S.listItem().singleton('skillsPage'),
      S.listItem().singleton('aboutPage'),
      S.listItem().singleton('caseStudyPage'),
      S.divider(),
      S.listItem().singleton('seoSettings'),
      S.listItem().singleton('redirects'),
    ])
