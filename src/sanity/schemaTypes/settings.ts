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

function headingField(name: string, title: string, section: string) {
  return defineField({
    name,
    title,
    type: 'string',
    description: `The heading above the ${section} section. Leave empty to hide the heading.`,
  })
}

const roleList = (name: string, title: string, description: string) =>
  defineField({name, title, type: 'array', description, of: [resumeRole()]})

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    {
      name: 'seo',
      title: 'Search and social sharing',
      description:
        'Not shown on the page. This is what Google, link previews (iMessage, Slack, LinkedIn), and the browser tab show.',
    },
    {
      name: 'appAndErrors',
      title: 'App icon, home-screen install, and 404 page',
      description: 'Small bits of text outside the homepage.',
    },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Big title',
      type: 'string',
      description:
        'The big typed-out title at the top of the homepage, e.g. JAKE DCL. Each word types out in turn, then the yellow line draws under it.',
    }),
    defineField({
      name: 'legalName',
      title: 'Name',
      type: 'string',
      description: 'Shown under the big title. Also used as your name for Google.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'The small line under your name.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
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
    headingField('projectsHeading', 'Projects heading', 'Projects'),
    headingField('experienceHeading', 'Experience heading', 'Experience'),
    roleList('experience', 'Experience', 'Jobs, newest first. The section is hidden when this is empty.'),
    headingField('educationHeading', 'Education heading', 'Education'),
    roleList('education', 'Education', 'Schools and degrees. The section is hidden when this is empty.'),
    headingField('skillsHeading', 'Skills heading', 'Skills'),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      description: 'Skill groups. Each group shows its name, then its skills separated by commas.',
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
    headingField('certificationsHeading', 'Certifications heading', 'Certifications'),
    roleList('certifications', 'Certifications', 'The section is hidden when this is empty.'),
    defineField({
      name: 'footerText',
      title: 'Footer',
      type: 'string',
      description: 'The small line at the very bottom of the homepage.',
    }),

    // Search and social sharing
    defineField({
      name: 'siteTitle',
      title: 'Page title',
      type: 'string',
      fieldset: 'seo',
      description: 'The browser tab title and the blue link title on Google.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Google description',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
      description: 'The short blurb Google shows under the page title.',
    }),
    defineField({
      name: 'summary',
      title: 'Profile summary for Google',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
      description:
        'A one-line description of you, given to Google as your profile description (structured data). Not shown on the page.',
    }),
    defineField({
      name: 'keywords',
      title: 'Search keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      fieldset: 'seo',
      description: 'Words and names people might search for. Search engines give these little weight.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author',
      type: 'string',
      fieldset: 'seo',
      description: 'The site author and creator named in the page metadata.',
    }),
    defineField({
      name: 'metaCategory',
      title: 'Site category',
      type: 'string',
      fieldset: 'seo',
      description: 'One word for what the site is about, e.g. technology.',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Link preview title',
      type: 'string',
      fieldset: 'seo',
      description: 'The bold title when someone shares jakedcl.com in iMessage, Slack, LinkedIn, X, etc.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Link preview description',
      type: 'text',
      rows: 2,
      fieldset: 'seo',
      description: 'The line under the title in a shared link preview.',
    }),
    defineField({
      name: 'ogSiteName',
      title: 'Link preview site name',
      type: 'string',
      fieldset: 'seo',
      description: 'The site name some apps show above a shared link.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Link preview image (optional upload)',
      type: 'image',
      fieldset: 'seo',
      description:
        'Upload a 1200 x 630 image to use it as the link preview picture. Leave empty to use the generated card built from the four card lines below and the big title.',
    }),
    defineField({
      name: 'ogImageAlt',
      title: 'Link preview image description',
      type: 'string',
      fieldset: 'seo',
      description: 'Describes the preview picture for screen readers.',
    }),
    defineField({
      name: 'ogCardKicker',
      title: 'Generated card: top line',
      type: 'string',
      fieldset: 'seo',
      description: 'Small grey capitals at the top of the generated preview card.',
    }),
    defineField({
      name: 'ogCardStatus',
      title: 'Generated card: green word',
      type: 'string',
      fieldset: 'seo',
      description: 'The green word at the end of the top line, e.g. AVAILABLE. Leave empty to drop it.',
    }),
    defineField({
      name: 'ogCardFooter',
      title: 'Generated card: bottom line',
      type: 'string',
      fieldset: 'seo',
      description: 'The grey line at the bottom of the generated preview card. The big name comes from Big title.',
    }),

    // App icon, install, 404
    defineField({
      name: 'appIconText',
      title: 'App icon letters',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The letters on the icon when the site is saved to a phone home screen, e.g. JD.',
    }),
    defineField({
      name: 'appName',
      title: 'App name',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'Full name when the site is installed as an app.',
    }),
    defineField({
      name: 'appShortName',
      title: 'App short name',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The name under the home-screen icon.',
    }),
    defineField({
      name: 'appDescription',
      title: 'App description',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'Description when the site is installed as an app.',
    }),
    defineField({
      name: 'notFoundTitle',
      title: '404 page heading',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'Heading on the page shown for an address that does not exist.',
    }),
    defineField({
      name: 'notFoundBody',
      title: '404 page text',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The sentence under the 404 heading.',
    }),
    defineField({
      name: 'notFoundLinkLabel',
      title: '404 page link',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The link back to the homepage on the 404 page.',
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
