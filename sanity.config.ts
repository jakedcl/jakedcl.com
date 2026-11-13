'use client'

/**
 * Sanity Studio, mounted at /studio by src/app/studio/[[...tool]]/page.tsx.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {LOCKED_TYPES, SINGLETONS} from './src/sanity/singletons'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  title: 'jakedcl.com',
  projectId,
  dataset,
  releases: {enabled: false},
  scheduledDrafts: {enabled: false},
  tasks: {enabled: false},
  document: {
    singletons: SINGLETONS,
    actions: (prev, context) => {
      if (!LOCKED_TYPES.has(context.schemaType)) return prev
      return prev.filter(
        ({action}) =>
          action !== 'delete' && action !== 'duplicate' && action !== 'unpublish',
      )
    },
    newDocumentOptions: (prev) =>
      prev.filter((template) => !LOCKED_TYPES.has(template.templateId)),
  },
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
