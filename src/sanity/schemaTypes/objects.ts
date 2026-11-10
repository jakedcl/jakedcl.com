import {defineArrayMember, defineField, defineType} from 'sanity'

/** Rich text used for bios: paragraphs with bold, italic, and links. */
export function richTextField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: 'array',
    description,
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
                  validation: (rule) =>
                    rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                }),
              ],
            }),
          ],
        },
      }),
    ],
  })
}

/** An image with required alt text. */
export function imageWithAltField(
  name: string,
  title: string,
  description: string,
  extraFields: ReturnType<typeof defineField>[] = [],
) {
  return defineField({
    name,
    title,
    type: 'image',
    description,
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Image description (alt text)',
        type: 'string',
        description: 'What the image shows, for screen readers and if the image fails to load.',
        validation: (rule) =>
          rule.custom((value, context) => {
            const parent = context.parent as {asset?: unknown} | undefined
            if (parent?.asset && !value?.trim()) return 'Describe the image.'
            return true
          }),
      }),
      ...extraFields,
    ],
  })
}

export const pageSeoType = defineType({
  name: 'pageSeo',
  title: 'Search & sharing for this page',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Browser tab and Google title',
      type: 'string',
      description: 'The title in the browser tab and the blue link on Google.',
      validation: (rule) => rule.required().warning(),
    }),
    defineField({
      name: 'description',
      title: 'Google description',
      type: 'text',
      rows: 3,
      description: 'The short blurb under the title on Google. Keep it under 160 characters.',
      validation: (rule) => rule.max(160).warning('Google cuts this off after about 160 characters.'),
    }),
    defineField({
      name: 'shareTitle',
      title: 'Link preview title',
      type: 'string',
      description: 'The bold title when this page is shared in iMessage, Slack, LinkedIn, X, and so on.',
    }),
    defineField({
      name: 'shareDescription',
      title: 'Link preview description',
      type: 'text',
      rows: 2,
      description: 'The line under the title in a shared link preview.',
    }),
  ],
})

export const siteLinkType = defineType({
  name: 'siteLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Text', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'href',
      title: 'Address',
      type: 'url',
      description: 'A web address, mailto:you@example.com, or tel:+15555555555.',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

export const labeledLinkType = defineType({
  name: 'labeledLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Link text', type: 'string'}),
    defineField({
      name: 'url',
      title: 'Address',
      type: 'url',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).custom((value, context) => {
          const parent = context.parent as {label?: string} | undefined
          if (parent?.label?.trim() && !value) return 'Add the address for this link, or clear the link text.'
          if (value && !parent?.label?.trim()) return 'Add the link text, or clear the address.'
          return true
        }),
    }),
  ],
})

const bullets = defineField({
  name: 'bullets',
  title: 'Bullet points',
  type: 'array',
  of: [{type: 'string'}],
})

export const experienceRoleType = defineType({
  name: 'experienceRole',
  title: 'Job',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Job title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'organization', title: 'Company', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'organizationUrl',
      title: 'Company website',
      type: 'url',
      description: 'Optional. Makes the company name a link.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'period', title: 'Dates', type: 'string', description: 'For example 10/2024–09/2025 or 2025–Present.'}),
    bullets,
  ],
  preview: {
    select: {title: 'title', organization: 'organization', period: 'period'},
    prepare: ({title, organization, period}) => ({
      title,
      subtitle: [organization, period].filter(Boolean).join(' · '),
    }),
  },
})

export const educationEntryType = defineType({
  name: 'educationEntry',
  title: 'School',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Degree', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'organization', title: 'School', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'organizationUrl',
      title: 'School website',
      type: 'url',
      description: 'Optional. Makes the school name a link.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'period', title: 'Dates', type: 'string'}),
    bullets,
  ],
  preview: {
    select: {title: 'title', organization: 'organization', period: 'period'},
    prepare: ({title, organization, period}) => ({
      title,
      subtitle: [organization, period].filter(Boolean).join(' · '),
    }),
  },
})

export const certificationType = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Certification name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'issuer', title: 'Issuer', type: 'string', description: 'Optional. Who issued it, e.g. Google.'}),
    defineField({name: 'date', title: 'Date', type: 'string', description: 'Optional. For example 05/2025.'}),
    defineField({
      name: 'credentialLinkText',
      title: 'Credential link text',
      type: 'string',
      description: 'For example View credential.',
    }),
    defineField({
      name: 'credentialUrl',
      title: 'Credential link',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'issuer'}},
})

export const skillGroupType = defineType({
  name: 'skillGroup',
  title: 'Skill group',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Group name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'items',
      title: 'Skills',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Type a skill and press Enter. They show in this order, separated by commas.',
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'label', items: 'items'},
    prepare: ({title, items}) => ({
      title,
      subtitle: Array.isArray(items) ? `${items.length} skills` : undefined,
    }),
  },
})

export const caseStudyFactType = defineType({
  name: 'caseStudyFact',
  title: 'Fact',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'teaser', title: 'Short line', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'detail', title: 'More detail (shows when clicked)', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'label', subtitle: 'teaser'}},
})

export const caseStudyStepType = defineType({
  name: 'caseStudyStep',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Step name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'body', title: 'What happens', type: 'text', rows: 3, validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export const objectTypes = [
  pageSeoType,
  siteLinkType,
  labeledLinkType,
  experienceRoleType,
  educationEntryType,
  certificationType,
  skillGroupType,
  caseStudyFactType,
  caseStudyStepType,
]
