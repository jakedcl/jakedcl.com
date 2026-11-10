import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {RESERVED_FIRST_SEGMENTS, SHORT_LINK_PATTERN} from '../../lib/routes'

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
      description: 'Shown in the Projects list and as the case study heading.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Shown after the name in the list and in the hover preview.',
    }),
    defineField({
      name: 'link',
      title: 'Project link',
      type: 'url',
      description: 'The live site. The name in the list links here, and so does the short link.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'slug',
      title: 'Short link',
      type: 'slug',
      description: 'Optional. jakedcl.com/<this> sends people to the project link. Lowercase letters, numbers, and dashes.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) =>
        rule.custom((value, context) => {
          const current = value?.current?.trim()
          if (!current) return true
          if (!SHORT_LINK_PATTERN.test(current)) return 'Use lowercase letters, numbers, and dashes only.'
          if (RESERVED_FIRST_SEGMENTS.has(current)) return `/${current} is a real page on the site.`
          const doc = context.document as {link?: string} | undefined
          if (!doc?.link) return 'Add a project link for the short link to go to.'
          return true
        }),
    }),
    defineField({
      name: 'photos',
      title: 'Screenshots',
      type: 'array',
      description: 'The first one shows in the hover preview on the Projects page.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Image description (alt text)'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
          ],
        }),
      ],
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
    select: {title: 'name', link: 'link', media: 'photos.0'},
    prepare: ({title, link, media}) => {
      let subtitle: string | undefined
      try {
        subtitle = link ? new URL(link).host : undefined
      } catch {
        subtitle = link
      }
      return {title: title || 'Untitled project', subtitle, media}
    },
  },
})
