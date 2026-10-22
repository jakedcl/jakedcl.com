import type {StructureResolver} from 'sanity/structure'

import {SETTINGS_ID} from './lib/settingsId'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('settings')
            .documentId(SETTINGS_ID)
            .title('Site Settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}]),
        ),
    ])
