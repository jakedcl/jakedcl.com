import {defineField, defineType} from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'bioText',
      title: 'Bio Text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H3', value: 'h3'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Text that appears under your name (supports links and formatting)',
    }),
    defineField({
      name: 'notebookCover',
      title: 'Notebook cover',
      type: 'object',
      description:
        'COMPOSITION label on the marble cover. Leave a field blank to use the site default (Jake DCL / Web Developer / jakedcl.com).',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'subject',
          title: 'Subject',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'E-mail / website',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'notebookInside',
      title: 'Inside cover (class program)',
      type: 'object',
      description:
        'Fill-in lines at the top of the CLASS PROGRAM sheet (name, address, email, phone, school, class). The period grid stays empty. Leave a field blank to use the site default.',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          description: 'Line under Address. Defaults to the resume email.',
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description: 'Line under Email. Defaults to the resume phone number.',
        }),
        defineField({
          name: 'school',
          title: 'School',
          type: 'string',
        }),
        defineField({
          name: 'class',
          title: 'Class / title',
          type: 'string',
        }),
      ],
    }),
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
