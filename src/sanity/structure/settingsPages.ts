import type {StructureBuilder} from 'sanity/structure'

import {SETTINGS_ID} from '../lib/settingsId'

/** Opens the Site Settings singleton on one field group (pane id selects the group). */
export function settingsFieldGroupPage(
  S: StructureBuilder,
  paneId: string,
  title: string,
) {
  return S.document()
    .id(paneId)
    .schemaType('settings')
    .documentId(SETTINGS_ID)
    .title(title)
}
