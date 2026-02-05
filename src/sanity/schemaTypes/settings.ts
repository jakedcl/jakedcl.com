import {defineField, defineType} from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'galleryPhotos',
      title: 'Gallery Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      description: 'Photos for the filmstrip gallery at the top of the homepage',
    }),
  ],
  preview: {
    select: {
      media: 'galleryPhotos.0',
    },
    prepare(selection) {
      const {media} = selection
      return {
        title: 'Site Settings',
        media,
      }
    },
  },
})

