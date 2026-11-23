/**
 * Config for `npx sanity <command>` in this folder (schema deploy, exec, typegen).
 * Uses the same connection settings as the site.
 */
import {defineCliConfig} from 'sanity/cli'

import {dataset, projectId} from './src/sanity/env'

export default defineCliConfig({
  api: {projectId, dataset},
  typegen: {
    path: './src/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: './src/sanity/sanity.types.ts',
  },
})
