import type {StructureResolver} from 'sanity/structure'

import {settingsFieldGroupPage} from './structure/settingsPages'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(
          settingsFieldGroupPage(
            S,
            'settings-page-homepage',
            'Homepage',
          ),
        ),
      S.listItem()
        .title('Case study')
        .id('case-study')
        .child(
          settingsFieldGroupPage(
            S,
            'settings-page-case-study',
            'Case study',
          ),
        ),
      S.listItem()
        .title('Projects')
        .id('projects')
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('Page heading')
                .id('projects-heading')
                .child(
                  settingsFieldGroupPage(
                    S,
                    'settings-page-projects-heading',
                    'Projects page heading',
                  ),
                ),
              S.listItem()
                .title('All projects')
                .schemaType('project')
                .child(
                  S.documentTypeList('project')
                    .title('Projects')
                    .defaultOrdering([
                      {field: 'displayOrder', direction: 'asc'},
                    ]),
                ),
            ]),
        ),
      S.listItem()
        .title('Experience')
        .id('experience')
        .child(
          settingsFieldGroupPage(
            S,
            'settings-page-experience',
            'Experience',
          ),
        ),
      S.listItem()
        .title('Skills')
        .id('skills')
        .child(
          settingsFieldGroupPage(S, 'settings-page-skills', 'Skills'),
        ),
      S.listItem()
        .title('About')
        .id('about')
        .child(
          settingsFieldGroupPage(S, 'settings-page-about', 'About'),
        ),
      S.listItem()
        .title('Search & sharing')
        .id('search-sharing')
        .child(
          settingsFieldGroupPage(
            S,
            'settings-page-search-sharing',
            'Search & sharing',
          ),
        ),
    ])
