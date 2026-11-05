import {
  ALL_FIELDS_GROUP,
  defineArrayMember,
  defineField,
  defineType,
  type FieldDefinition,
} from 'sanity'

import {
  SETTINGS_FIELD_GROUPS,
  type SettingsFieldGroup,
} from '../settingsFieldGroups'

function settingsField(
  group: SettingsFieldGroup,
  field: FieldDefinition,
) {
  return defineField({...field, group})
}

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

function headingField(
  name: string,
  title: string,
  section: string,
  group: SettingsFieldGroup,
) {
  return defineField({
    name,
    title,
    type: 'string',
    description: `The heading above the ${section} section. Leave empty to hide the heading.`,
    group,
  })
}

function portableBioField(
  name: string,
  title: string,
  description: string,
  group: SettingsFieldGroup,
) {
  return defineField({
    name,
    title,
    type: 'array',
    description,
    group,
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
  })
}

const roleList = (
  name: string,
  title: string,
  description: string,
  group: SettingsFieldGroup,
) =>
  defineField({name, title, type: 'array', description, of: [resumeRole()], group})

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: SETTINGS_FIELD_GROUPS.homepage,
      title: 'Homepage',
      default: true,
    },
    {name: SETTINGS_FIELD_GROUPS.caseStudy, title: 'Case study'},
    {name: SETTINGS_FIELD_GROUPS.projectsPage, title: 'Projects page'},
    {name: SETTINGS_FIELD_GROUPS.experience, title: 'Experience'},
    {name: SETTINGS_FIELD_GROUPS.skills, title: 'Skills'},
    {name: SETTINGS_FIELD_GROUPS.about, title: 'About'},
    {
      name: SETTINGS_FIELD_GROUPS.searchSharing,
      title: 'Search & sharing',
    },
    {...ALL_FIELDS_GROUP, hidden: true},
  ],
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
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'heroTitle',
      title: 'Big title',
      type: 'string',
      description:
        'The big typed-out title at the top of the homepage, e.g. JAKE DCL. Each word types out in turn, then the line draws under it.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'legalName',
      title: 'Name',
      type: 'string',
      description: 'Shown under the big title. Also used as your name for Google.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'The small line under your name.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'bio',
      title: 'Short bio (homepage)',
      type: 'array',
      description:
        'Short bio on the homepage, under the section buttons. Each paragraph shows as its own paragraph.',
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
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
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
    headingField(
      'projectsHeading',
      'Projects heading',
      'Projects',
      SETTINGS_FIELD_GROUPS.projectsPage,
    ),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'featuredProject',
      title: 'Featured case study project',
      type: 'reference',
      to: [{type: 'project'}],
      description:
        'Homepage feature and /showcase case study. Leave empty to hide both.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'featureLabel',
      title: 'Homepage feature label',
      type: 'string',
      description: 'Small label above the project name on the homepage, e.g. Featured.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'featureSummary',
      title: 'Homepage feature sentence',
      type: 'text',
      rows: 2,
      description: 'One strong line on the homepage feature, above the link to /showcase.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'featureImage',
      title: 'Homepage feature image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyEyebrow',
      title: 'Case study eyebrow',
      type: 'string',
      description: 'Small line at the top of /showcase.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyIntro',
      title: 'Case study intro',
      type: 'text',
      rows: 5,
      description: 'Opening paragraph on /showcase.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyGallery',
      title: 'Case study screenshots',
      type: 'array',
      description: 'Product stills for the gallery on /showcase.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt text', type: 'string'}),
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
          ],
        }),
      ],
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyFacts',
      title: 'Case study facts',
      type: 'array',
      description: 'Short labeled facts; detail text reveals on click.',
      of: [
        defineArrayMember({
          name: 'caseStudyFact',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'teaser', title: 'Short line', type: 'string'}),
            defineField({
              name: 'detail',
              title: 'Detail',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'teaser'}},
        }),
      ],
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudySteps',
      title: 'Case study workflow steps',
      type: 'array',
      description: 'Stepped walkthrough on /showcase (e.g. lock → assign → load-out).',
      of: [
        defineArrayMember({
          name: 'caseStudyStep',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Step title', type: 'string'}),
            defineField({name: 'body', title: 'Step body', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyStack',
      title: 'Case study stack note',
      type: 'text',
      rows: 3,
      description: 'Plain-language architecture paragraph on /showcase.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyProcess',
      title: 'Case study process note',
      type: 'text',
      rows: 3,
      description: 'How the work was directed and reviewed (brief, not the headline).',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyProductUrl',
      title: 'Case study product URL',
      type: 'url',
      description: 'Primary outbound link (e.g. marketing site).',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyRepoUrl',
      title: 'Case study repository URL',
      type: 'url',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyProductLinkLabel',
      title: 'Case study product link label',
      type: 'string',
      description: 'Link text for the product URL on /showcase.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.caseStudy, {
      name: 'caseStudyRepoLinkLabel',
      title: 'Case study repository link label',
      type: 'string',
      description: 'Link text for the repository URL on /showcase.',
    }),
    headingField(
      'experienceHeading',
      'Experience heading',
      'Experience',
      SETTINGS_FIELD_GROUPS.experience,
    ),
    roleList(
      'experience',
      'Experience',
      'Jobs and freelance roles on the Experience page (/experience), newest first.',
      SETTINGS_FIELD_GROUPS.experience,
    ),
    headingField(
      'certificationsHeading',
      'Certifications heading',
      'Certifications',
      SETTINGS_FIELD_GROUPS.experience,
    ),
    roleList(
      'certifications',
      'Certifications',
      'Shown at the bottom of the Experience page (/experience), below jobs. Leave empty to hide that block.',
      SETTINGS_FIELD_GROUPS.experience,
    ),
    headingField(
      'skillsHeading',
      'Skills heading',
      'Skills',
      SETTINGS_FIELD_GROUPS.skills,
    ),
    settingsField(SETTINGS_FIELD_GROUPS.skills, {
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
    settingsField(SETTINGS_FIELD_GROUPS.about, {
      name: 'aboutHeading',
      title: 'About heading',
      type: 'string',
      initialValue: 'About',
      description:
        'Nav label on /about. Leave empty to hide the About link until you are ready.',
    }),
    portableBioField(
      'aboutLong',
      'Long about (About page)',
      'Full about copy at the top of the About page (/about).',
      SETTINGS_FIELD_GROUPS.about,
    ),
    headingField(
      'educationHeading',
      'Education heading',
      'education on About',
      SETTINGS_FIELD_GROUPS.about,
    ),
    roleList(
      'education',
      'Education',
      'Schools and degrees on the About page (/about), below long about copy. Leave empty to hide that block.',
      SETTINGS_FIELD_GROUPS.about,
    ),
    defineField({
      name: 'aboutAccent',
      title: 'About button color',
      type: 'string',
      hidden: () => true,
      description:
        'Legacy field. Nav underlines use fixed theme colors (About is always green on the site).',
      options: {
        list: [
          {title: 'Yellow', value: 'yellow'},
          {title: 'Blue', value: 'blue'},
          {title: 'Red', value: 'red'},
          {title: 'Green', value: 'green'},
        ],
        layout: 'radio',
      },
      initialValue: 'green',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.homepage, {
      name: 'footerText',
      title: 'Footer',
      type: 'string',
      description: 'The small line at the very bottom of the homepage.',
    }),

    // Search and social sharing
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'siteTitle',
      title: 'Page title',
      type: 'string',
      fieldset: 'seo',
      description: 'The browser tab title and the blue link title on Google.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'metaDescription',
      title: 'Google description',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
      description: 'The short blurb Google shows under the page title.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'summary',
      title: 'Profile summary for Google',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
      description:
        'A one-line description of you, given to Google as your profile description (structured data). Not shown on the page.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'keywords',
      title: 'Search keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      fieldset: 'seo',
      description: 'Words and names people might search for. Search engines give these little weight.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'authorName',
      title: 'Author',
      type: 'string',
      fieldset: 'seo',
      description: 'The site author and creator named in the page metadata.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'metaCategory',
      title: 'Site category',
      type: 'string',
      fieldset: 'seo',
      description: 'One word for what the site is about, e.g. technology.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogTitle',
      title: 'Link preview title',
      type: 'string',
      fieldset: 'seo',
      description: 'The bold title when someone shares jakedcl.com in iMessage, Slack, LinkedIn, X, etc.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogDescription',
      title: 'Link preview description',
      type: 'text',
      rows: 2,
      fieldset: 'seo',
      description: 'The line under the title in a shared link preview.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogSiteName',
      title: 'Link preview site name',
      type: 'string',
      fieldset: 'seo',
      description: 'The site name some apps show above a shared link.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogImage',
      title: 'Link preview image (optional upload)',
      type: 'image',
      fieldset: 'seo',
      description:
        'Upload a 1200 x 630 image to use it as the link preview picture. Leave empty to use the generated card built from the four card lines below and the big title.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogImageAlt',
      title: 'Link preview image description',
      type: 'string',
      fieldset: 'seo',
      description: 'Describes the preview picture for screen readers.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogCardKicker',
      title: 'Generated card: top line',
      type: 'string',
      fieldset: 'seo',
      description: 'Small grey capitals at the top of the generated preview card.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogCardStatus',
      title: 'Generated card: green word',
      type: 'string',
      fieldset: 'seo',
      description: 'The green word at the end of the top line, e.g. AVAILABLE. Leave empty to drop it.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'ogCardFooter',
      title: 'Generated card: bottom line',
      type: 'string',
      fieldset: 'seo',
      description: 'The grey line at the bottom of the generated preview card. The big name comes from Big title.',
    }),

    // App icon, install, 404
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'appIconText',
      title: 'App icon letters',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The letters on the icon when the site is saved to a phone home screen, e.g. JD.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'appName',
      title: 'App name',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'Full name when the site is installed as an app.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'appShortName',
      title: 'App short name',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The name under the home-screen icon.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'appDescription',
      title: 'App description',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'Description when the site is installed as an app.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'notFoundTitle',
      title: '404 page heading',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'Heading on the page shown for an address that does not exist.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'notFoundBody',
      title: '404 page text',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The sentence under the 404 heading.',
    }),
    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'notFoundLinkLabel',
      title: '404 page link',
      type: 'string',
      fieldset: 'appAndErrors',
      description: 'The link back to the homepage on the 404 page.',
    }),

    settingsField(SETTINGS_FIELD_GROUPS.searchSharing, {
      name: 'galleryPhotos',
      title: 'Gallery photos (not used on site)',
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
        'Stored only — the homepage filmstrip is gone, so these photos are not shown on the site. Leave as-is unless you are cleaning up assets.',
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
