import { type SchemaTypeDefinition } from 'sanity'

import { projectType } from './project'
import { settingsType } from './settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, settingsType],
}
