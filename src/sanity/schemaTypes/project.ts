import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {detailedRichTextField} from './objects'

export const projectType = defineType({
  name: 'project',
  title: 'Work',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Shown in the Work list, as the heading on the work item\'s page, and on the homepage when featured.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page address',
      type: 'slug',
      description: 'The end of this work item\'s page address: jakedcl.com/work/<this>. Click Generate to make it from the name. Changing it breaks old links to the page.',
      options: {source: 'name', maxLength: 64},
      validation: (rule) => rule.required().error('The project needs a page address to get its own page.'),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Plain text. Shown next to the name in the Work list (up to about 4 lines there), at the top of the work item\'s page, and on the homepage when featured.',
    }),
    defineField({
      name: 'link',
      title: 'Live site link',
      type: 'url',
      description: 'The live site. Shown on the project\'s page as a plain link (the web address, without https:// or www).',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub source link',
      type: 'url',
      description: 'The project\'s source on GitHub. Shown on the project\'s page next to the live site link when this is filled in.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      initialValue: false,
      description: 'On: this work item shows in the featured block on the homepage. Featured items take turns in a random order each visit, and two random screenshots show in each turn.',
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
      description: 'Add as many as you like and drag to reorder. They take turns every 3 seconds in the Work list and on the homepage, and all show on the work item\'s page.',
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
      'Work page write-up',
      'The longer write-up on the work item\'s own page, under the screenshots. Use headings, bullet or numbered lists, bold, italic, and links.',
    ),
    defineField({
      name: 'seo',
      title: 'Search & sharing for this work page',
      type: 'pageSeo',
      description: 'Not shown on the page. What Google, browser tabs, and shared-link previews show for this work item\'s page.',
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
      deprecated: {reason: 'Drag work items in All work to reorder.'},
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
        title: title || 'Untitled work item',
        subtitle: [subtitle, featured ? 'Featured' : ''].filter(Boolean).join(' · ') || undefined,
        media,
      }
    },
  },
})
