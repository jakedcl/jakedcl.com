import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
      description: 'The live site. The name in the list links here.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
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
