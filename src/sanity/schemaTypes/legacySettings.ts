import {defineField, defineType} from 'sanity'

/**
 * The old all-in-one Site Settings document (9dae2a8c-…). Kept as an archive:
 * the site no longer reads it and it is hidden from Studio. Never delete it.
 * It still holds galleryPhotos, which no page uses.
 */
export const legacySettingsType = defineType({
  name: 'settings',
  title: 'Old Site Settings (archive)',
  type: 'document',
  readOnly: true,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: 'galleryPhotos',
      title: 'Gallery photos (archive)',
      type: 'array',
      of: [{type: 'image', fields: [{name: 'alt', type: 'string'}, {name: 'caption', type: 'string'}]}],
    }),
  ],
  preview: {prepare: () => ({title: 'Old Site Settings (archive)'})},
})
