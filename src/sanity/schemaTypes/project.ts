import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {detailedRichTextField} from './objects'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Shown in the Projects list, as the heading on the project\'s page, and on the homepage when featured.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page address',
      type: 'slug',
      description: 'The end of this project\'s page address: jakedcl.com/projects/<this>. Click Generate to make it from the name. Changing it breaks old links to the page.',
      options: {source: 'name', maxLength: 64},
      validation: (rule) => rule.required().error('The project needs a page address to get its own page.'),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Plain text. Shown next to the name in the Projects list (up to about 4 lines there), at the top of the project\'s page, and on the homepage when featured.',
    }),
    defineField({
      name: 'link',
      title: 'Project link',
      type: 'url',
      description: 'The live site. Shown on the project\'s page as the visit link.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      initialValue: false,
      description: 'On: this project shows in the featured block on the homepage. Several featured projects take turns, in the same order as All projects.',
    }),
    defineField({
      name: 'featuredPitch',
      title: 'Homepage pitch (optional)',
      type: 'text',
      rows: 2,
      description: 'A shorter line for the homepage feature. Leave empty to use the short description there.',
      hidden: ({document}) => document?.featured !== true,
    }),
    defineField({
      name: 'photos',
      title: 'Screenshots',
      type: 'array',
      description: 'Add as many as you like and drag to reorder. They take turns every 3 seconds in the Projects list and on the homepage, and all show on the project\'s page.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Image description (alt text)', description: 'What the screenshot shows, read by screen readers on the project\'s page.'}),
            defineField({name: 'caption', type: 'string', title: 'Caption', description: 'Optional. Shown under the screenshot on the project\'s page.'}),
          ],
        }),
      ],
    }),
    detailedRichTextField(
      'details',
      'Project page write-up',
      'The longer write-up on the project\'s own page, under the screenshots. Use headings, bullet or numbered lists, bold, italic, and links.',
    ),
    defineField({
      name: 'seo',
      title: 'Search & sharing for this project\'s page',
      type: 'pageSeo',
      description: 'Not shown on the page. What Google, browser tabs, and shared-link previews show for this project\'s page.',
    }),
    orderRankField({type: 'project'}),
    defineField({
      name: 'title',
      title: 'Old title (replaced by Name and Description)',
      type: 'array',
      of: [{type: 'block'}],
      readOnly: true,
      hidden: true,
      deprecated: {reason: 'Split into Name and Description.'},
    }),
    defineField({
      name: 'displayOrder',
      title: 'Old display order (replaced by drag-and-drop)',
      type: 'number',
      readOnly: true,
      hidden: true,
      deprecated: {reason: 'Drag projects in All projects to reorder.'},
    }),
  ],
  preview: {
    select: {title: 'name', link: 'link', media: 'photos.0', featured: 'featured'},
    prepare: ({title, link, media, featured}) => {
      let subtitle: string | undefined
      try {
        subtitle = link ? new URL(link).host : undefined
      } catch {
        subtitle = link
      }
      return {
        title: title || 'Untitled project',
        subtitle: [subtitle, featured ? 'Featured' : ''].filter(Boolean).join(' · ') || undefined,
        media,
      }
    },
  },
})
