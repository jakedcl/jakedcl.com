import {defineArrayMember, defineField, defineType} from 'sanity'

function resumeRole() {
  return defineArrayMember({
  name: 'resumeRole',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'organization', title: 'Organization', type: 'string'}),
    defineField({
      name: 'organizationUrl',
      title: 'Organization URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'period', title: 'Dates', type: 'string'}),
    defineField({
      name: 'bullets',
      title: 'Bullets',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'organization'},
  },
  })
}

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'home', title: 'Home', default: true},
    {name: 'resume', title: 'Resume'},
    {name: 'stored', title: 'Stored'},
  ],
  fields: [
    defineField({
      name: 'legalName',
      title: 'Name',
      type: 'string',
      group: 'home',
      description: 'Shown under the JAKE DCL title.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'home',
      description: 'The line under the name.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      group: 'home',
      description: 'Your bio. Each paragraph shows as its own paragraph on the homepage.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      group: 'home',
      description: 'Contact and social links under the bio, in order.',
      of: [
        defineArrayMember({
          name: 'siteLink',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
          },
        }),
      ],
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume PDF',
      type: 'file',
      group: 'home',
      description: 'Uploaded PDF. /resume.pdf redirects here. Nothing is served until this file is set.',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'resume',
      description: 'Used in the page description metadata. Not a visible section.',
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      group: 'resume',
      of: [resumeRole()],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      group: 'resume',
      of: [resumeRole()],
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      group: 'resume',
      of: [
        defineArrayMember({
          name: 'skillGroup',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Group', type: 'string'}),
            defineField({
              name: 'items',
              title: 'Skills',
              type: 'array',
              of: [{type: 'string'}],
              options: {layout: 'tags'},
            }),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      group: 'resume',
      of: [resumeRole()],
    }),
    defineField({
      name: 'galleryPhotos',
      title: 'Gallery Photos',
      type: 'array',
      group: 'stored',
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
      description:
        'Kept in the dataset. The homepage filmstrip is gone, so these photos are not shown on the site.',
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
