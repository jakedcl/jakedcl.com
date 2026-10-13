import { defineArrayMember, defineField, defineType } from 'sanity'
import { ScreenshotsInput } from '../components/ScreenshotsInput'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  defineField({
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  }),
                ],
              },
            ],
          },
        }),
      ],
      description:
        'First heading (H3) is the filmstrip title. The second block is the description under it.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Project Link',
      type: 'url',
      description: 'Opened in a new tab when someone clicks this project on the filmstrip.',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [defineArrayMember({ type: 'string', name: 'skill' })],
      description: 'Tools and skills, one per row. Shown under the description on the filmstrip text frame.',
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
          ],
        }),
      ],
      components: { input: ScreenshotsInput },
      description:
        'Exactly two images. They are the second and third filmstrip frames, cover-cropped to 4:3 using the hotspot.',
      validation: (rule) => [
        rule.max(2).error('A project has two screenshot frames. Remove the extra image.'),
        rule
          .min(2)
          .warning('Add exactly two screenshots. Until then the site shows those frames as black.'),
      ],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (1, 2, 3...)',
      initialValue: 0,
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description:
        'Older stills kept on the document. The homepage filmstrip uses Screenshots, not this list.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'screenshots.0',
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title: title?.[0]?.children?.[0]?.text || 'Untitled Project',
        media,
      }
    },
  },
})
