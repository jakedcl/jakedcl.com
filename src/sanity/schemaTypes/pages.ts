import {defineArrayMember, defineField, defineType} from 'sanity'

import {imageWithAltField, richTextField} from './objects'

const pageName = (section: string) =>
  defineField({
    name: 'pageName',
    title: 'Page name',
    type: 'string',
    description: `The ${section} button in the menu on every page. Leave empty to hide the ${section} page entirely.`,
    validation: (rule) => rule.required().warning(`Empty hides the ${section} page and its menu button.`),
  })

const seo = defineField({
  name: 'seo',
  title: 'Search & sharing for this page',
  type: 'pageSeo',
  description: 'Not shown on the page. What Google, browser tabs, and shared-link previews show for this page.',
})

export const siteGlobalsType = defineType({
  name: 'siteGlobals',
  title: 'Site-wide',
  type: 'document',
  description: 'Things that show on every page. Set them once here.',
  fieldsets: [
    {name: 'notFound', title: '“Page not found” page', description: 'Shown for an address that does not exist.'},
    {
      name: 'accessibility',
      title: 'Screen-reader text',
      description: 'Not visible on screen. Read aloud by screen readers.',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    defineField({
      name: 'bigTitle',
      title: 'Big title',
      type: 'string',
      description: 'The big typed-out title at the top of every page, e.g. JAKE DCL. Also the big words on the generated link-preview card.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Your name',
      type: 'string',
      description: 'Shown under the big title on the homepage. Also your name for Google.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'The small line under your name on the homepage.',
      validation: (rule) => rule.max(60).warning('Long taglines wrap on phones.'),
    }),
    defineField({
      name: 'footer',
      title: 'Footer line',
      type: 'string',
      description: 'Small capitals at the bottom of the homepage and the Work, Experience, Skills, and About pages.',
    }),
    defineField({name: 'notFoundTitle', title: 'Heading', type: 'string', fieldset: 'notFound'}),
    defineField({name: 'notFoundBody', title: 'Text', type: 'string', fieldset: 'notFound'}),
    defineField({name: 'notFoundLinkLabel', title: 'Link back home', type: 'string', fieldset: 'notFound'}),
    defineField({
      name: 'newTabNote',
      title: 'Note on links that open a new tab',
      type: 'string',
      fieldset: 'accessibility',
      description: 'Read after any link that opens in a new tab, e.g. (opens in a new tab).',
    }),
    defineField({
      name: 'navAriaLabel',
      title: 'Name of the menu',
      type: 'string',
      fieldset: 'accessibility',
      description: 'What screen readers call the menu of page buttons, e.g. Site sections.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site-wide'})},
})

export const homePageType = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  description: 'Everything on jakedcl.com/. The big title, your name, tagline, and footer are under Site-wide.',
  fieldsets: [
    {
      name: 'feature',
      title: 'Featured work',
      description: 'Turn on “Featured on homepage” on any work item (Work > All work) to show it here. Featured items take turns in a random order each visit.',
    },
  ],
  fields: [
    richTextField('bio', 'Short bio', 'Under the menu on the homepage. Each paragraph shows as its own paragraph.'),
    defineField({
      name: 'links',
      title: 'Contact & social links',
      type: 'array',
      description: 'Shown under the bio, in this order. Also tells Google how to reach you.',
      of: [defineArrayMember({type: 'siteLink'})],
    }),
    defineField({
      name: 'featureLabel',
      title: 'Small label',
      type: 'string',
      fieldset: 'feature',
      description: 'Small capitals above the featured project name, e.g. Featured.',
    }),
    // Old single case-study feature, replaced by per-project “Featured on homepage”.
    // Hidden and read-only; the data is cleared after the project pages go live.
    defineField({name: 'showFeature', title: 'Old: show the featured case study', type: 'boolean', hidden: true, readOnly: true, deprecated: {reason: 'Use Featured on homepage on each project.'}}),
    defineField({name: 'featureSentence', title: 'Old: one-line pitch', type: 'text', hidden: true, readOnly: true, deprecated: {reason: 'Use Homepage pitch on each project.'}}),
    {...imageWithAltField('featureImage', 'Old: image', 'Replaced by the project screenshots.'), hidden: true, readOnly: true, deprecated: {reason: 'Moved into the Logiparty screenshots.'}},
    defineField({name: 'featureLinkLabel', title: 'Old: link text', type: 'string', hidden: true, readOnly: true, deprecated: {reason: 'The case study button was removed.'}}),
    seo,
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})

export const projectsPageType = defineType({
  name: 'projectsPage',
  title: 'Work page',
  type: 'document',
  description: 'jakedcl.com/work and the shared text on every work item page. The work items themselves are under All work.',
  fieldsets: [
    {name: 'projectPage', title: 'Work item pages', description: 'Text used on every work item\'s own page (jakedcl.com/work/…).'},
    {
      name: 'photoViewer',
      title: 'Screenshot viewer',
      description: 'The full-screen view that opens when someone clicks a screenshot on a project page.',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    pageName('Work'),
    defineField({
      name: 'backLinkLabel',
      title: 'Back link',
      type: 'string',
      fieldset: 'projectPage',
      description: 'The link at the top of a work item page that returns to the list, e.g. All work.',
    }),
    defineField({
      name: 'visitLinkLabel',
      title: 'Old: Visit site label',
      type: 'string',
      fieldset: 'projectPage',
      hidden: true,
      readOnly: true,
      deprecated: {reason: 'The live site is now shown as the web address itself, not a Visit site button.'},
    }),
    defineField({
      name: 'githubLinkLabel',
      title: 'GitHub source link label',
      type: 'string',
      fieldset: 'projectPage',
      description: 'The label for the GitHub source link on each project page, e.g. GitHub. Leave empty to show the GitHub address instead.',
    }),
    defineField({
      name: 'galleryAriaLabel',
      title: 'Screen-reader name for the screenshots',
      type: 'string',
      fieldset: 'projectPage',
      description: 'Not visible. What screen readers call the screenshots section, e.g. Screenshots.',
    }),
    defineField({
      name: 'openPhotoLabel',
      title: 'Screen-reader text on each screenshot',
      type: 'string',
      fieldset: 'photoViewer',
      description: 'Not visible. Read before a screenshot\'s description to say it opens larger, e.g. View larger.',
    }),
    defineField({name: 'previousPhotoLabel', title: 'Previous button', type: 'string', fieldset: 'photoViewer'}),
    defineField({name: 'nextPhotoLabel', title: 'Next button', type: 'string', fieldset: 'photoViewer'}),
    defineField({name: 'closePhotoLabel', title: 'Close button', type: 'string', fieldset: 'photoViewer'}),
    seo,
  ],
  preview: {prepare: () => ({title: 'Work page'})},
})

export const experiencePageType = defineType({
  name: 'experiencePage',
  title: 'Experience',
  type: 'document',
  description: 'Everything on jakedcl.com/experience.',
  fields: [
    pageName('Experience'),
    defineField({
      name: 'roles',
      title: 'Jobs',
      type: 'array',
      description: 'Newest first. Drag to reorder.',
      of: [defineArrayMember({type: 'experienceRole'})],
    }),
    defineField({
      name: 'seeMoreLabel',
      title: 'See More button',
      type: 'string',
      description: 'Text on the centered button under your shown jobs that opens the jobs marked "Hide behind See More". Leave empty to show every job with no button.',
    }),
    defineField({
      name: 'seeLessLabel',
      title: 'See Less button',
      type: 'string',
      description: 'Text on the same button once the jobs are open, to fold them away again. Leave empty to keep them open with no button.',
    }),
    defineField({
      name: 'educationHeading',
      title: 'Education heading',
      type: 'string',
      description: 'Heading above your schools and degrees.',
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      description: 'Shown below your jobs, above certifications. Leave empty to hide that block.',
      of: [defineArrayMember({type: 'educationEntry'})],
    }),
    defineField({
      name: 'certificationsHeading',
      title: 'Certifications heading',
      type: 'string',
      description: 'Heading above the certifications at the bottom of the page, below Education.',
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      description: 'Shown at the bottom of the page. Leave empty to hide that block.',
      of: [defineArrayMember({type: 'certification'})],
    }),
    seo,
  ],
  preview: {prepare: () => ({title: 'Experience'})},
})

export const skillsPageType = defineType({
  name: 'skillsPage',
  title: 'Skills',
  type: 'document',
  description: 'Everything on jakedcl.com/skills.',
  fields: [
    pageName('Skills'),
    defineField({
      name: 'groups',
      title: 'Skill groups',
      type: 'array',
      description: 'Each group shows its name, then its skills separated by commas. Drag to reorder.',
      of: [defineArrayMember({type: 'skillGroup'})],
    }),
    seo,
  ],
  preview: {prepare: () => ({title: 'Skills'})},
})

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  description: 'Everything on jakedcl.com/about.',
  fields: [
    pageName('About'),
    richTextField('body', 'About you', 'The full about text at the top of the page.'),
    seo,
  ],
  preview: {prepare: () => ({title: 'About'})},
})

export const caseStudyPageType = defineType({
  name: 'caseStudyPage',
  title: 'Case study (archive)',
  type: 'document',
  readOnly: true,
  __experimental_omnisearch_visibility: false,
  description: 'Archive of the old /showcase page. Its content moved into the Logiparty project page; nothing on the site reads this anymore.',
  fieldsets: [
    {name: 'gallery', title: 'Screenshots'},
    {name: 'facts', title: 'Facts'},
    {name: 'steps', title: 'Workflow steps'},
    {name: 'stack', title: 'How it’s built'},
    {name: 'process', title: 'How it shipped'},
    {name: 'links', title: 'Links at the bottom'},
  ],
  fields: [
    defineField({
      name: 'project',
      title: 'Work item',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Which work item this case study is about. Its name is the page heading and the name in the homepage feature. Leave empty to hide /showcase and the homepage feature.',
      validation: (rule) => rule.required().warning('Empty hides /showcase and the homepage feature.'),
    }),
    defineField({name: 'eyebrow', title: 'Small line above the name', type: 'string'}),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 5}),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      fieldset: 'gallery',
      description: 'Product stills, shown one at a time with Previous and Next buttons.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Image description (alt text)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'previousLabel', title: 'Previous button', type: 'string', fieldset: 'gallery'}),
    defineField({name: 'nextLabel', title: 'Next button', type: 'string', fieldset: 'gallery'}),
    defineField({
      name: 'galleryAriaLabel',
      title: 'Screen-reader name for the screenshots',
      type: 'string',
      fieldset: 'gallery',
    }),
    defineField({name: 'factsHeading', title: 'Heading', type: 'string', fieldset: 'facts'}),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      fieldset: 'facts',
      description: 'Each one shows a label and a short line; clicking shows the detail.',
      of: [defineArrayMember({type: 'caseStudyFact'})],
    }),
    defineField({name: 'factsAriaLabel', title: 'Screen-reader name for the facts', type: 'string', fieldset: 'facts'}),
    defineField({name: 'stepsHeading', title: 'Heading', type: 'string', fieldset: 'steps'}),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      fieldset: 'steps',
      description: 'Shown as numbered tabs.',
      of: [defineArrayMember({type: 'caseStudyStep'})],
    }),
    defineField({name: 'stepsAriaLabel', title: 'Screen-reader name for the steps', type: 'string', fieldset: 'steps'}),
    defineField({name: 'stackHeading', title: 'Heading', type: 'string', fieldset: 'stack'}),
    defineField({name: 'stackNote', title: 'Text', type: 'text', rows: 3, fieldset: 'stack'}),
    defineField({name: 'processHeading', title: 'Heading', type: 'string', fieldset: 'process'}),
    defineField({name: 'processNote', title: 'Text', type: 'text', rows: 3, fieldset: 'process'}),
    defineField({name: 'productLink', title: 'Product link', type: 'labeledLink', fieldset: 'links'}),
    defineField({name: 'repoLink', title: 'Code link', type: 'labeledLink', fieldset: 'links'}),
    seo,
  ],
  preview: {
    select: {name: 'project.name'},
    prepare: ({name}) => ({title: 'Case study', subtitle: name}),
  },
})

export const seoSettingsType = defineType({
  name: 'seoSettings',
  title: 'Search & sharing',
  type: 'document',
  description: 'Site-wide settings for Google, link previews, the browser icon, and saving the site to a phone. Each page’s own title and description are on that page.',
  fieldsets: [
    {name: 'google', title: 'Google'},
    {name: 'preview', title: 'Link previews', description: 'The picture and name used when any page is shared.'},
    {name: 'card', title: 'Generated preview card', description: 'Used when no preview image is uploaded. The big words come from Big title on Site-wide.'},
    {name: 'icons', title: 'Icons and phone home screen'},
  ],
  fields: [
    defineField({
      name: 'siteUrl',
      title: 'Site address',
      type: 'url',
      description: 'The main address of the site, e.g. https://jakedcl.com. Used in Google results and shared links.',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'allowIndexing',
      title: 'Let Google and other search engines list the site',
      type: 'boolean',
      fieldset: 'google',
      initialValue: true,
    }),
    defineField({
      name: 'hiddenPaths',
      title: 'Addresses search engines should skip',
      type: 'array',
      of: [{type: 'string'}],
      fieldset: 'google',
      description: 'For example /studio.',
      validation: (rule) =>
        rule.custom((value) =>
          (value as string[] | undefined)?.every((p) => p.startsWith('/')) ?? true
            ? true
            : 'Each address starts with /.',
        ),
    }),
    defineField({
      name: 'personSummary',
      title: 'Profile summary for Google',
      type: 'text',
      rows: 3,
      fieldset: 'google',
      description: 'A one-line description of you that Google reads (not shown on the page).',
    }),
    defineField({
      name: 'keywords',
      title: 'Search keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      fieldset: 'google',
    }),
    defineField({name: 'author', title: 'Author', type: 'string', fieldset: 'google'}),
    defineField({
      name: 'category',
      title: 'Site category',
      type: 'string',
      fieldset: 'google',
      description: 'One word for what the site is about, e.g. technology.',
    }),
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      fieldset: 'preview',
      description: 'Shown above a shared link in some apps.',
    }),
    defineField({
      name: 'shareImage',
      title: 'Preview image (optional)',
      type: 'image',
      fieldset: 'preview',
      description: 'Upload a 1200 × 630 image to use it on every shared link. Leave empty to use the generated card below.',
    }),
    defineField({
      name: 'shareImageAlt',
      title: 'Preview image description',
      type: 'string',
      fieldset: 'preview',
      description: 'Describes the preview picture (uploaded or generated) for screen readers.',
    }),
    defineField({name: 'cardTopLine', title: 'Top line', type: 'string', fieldset: 'card', description: 'Small grey capitals at the top.'}),
    defineField({name: 'cardGreenWord', title: 'Green word', type: 'string', fieldset: 'card', description: 'Green word at the end of the top line, e.g. AVAILABLE.'}),
    defineField({name: 'cardBottomLine', title: 'Bottom line', type: 'string', fieldset: 'card'}),
    defineField({
      name: 'favicon',
      title: 'Browser tab icon (favicon)',
      type: 'image',
      fieldset: 'icons',
      description: 'A small square image. Shown in browser tabs and bookmarks.',
    }),
    defineField({
      name: 'appIconLetters',
      title: 'Phone icon letters',
      type: 'string',
      fieldset: 'icons',
      description: 'The letters on the icon when the site is saved to a phone home screen, e.g. JD.',
      validation: (rule) => rule.max(3).warning('More than 3 letters will not fit.'),
    }),
    defineField({name: 'appName', title: 'App name', type: 'string', fieldset: 'icons', description: 'Full name when the site is installed as an app.'}),
    defineField({
      name: 'appShortName',
      title: 'App short name',
      type: 'string',
      fieldset: 'icons',
      description: 'The name under the home-screen icon.',
      validation: (rule) => rule.max(12).warning('Phones cut this off after about 12 characters.'),
    }),
    defineField({name: 'appDescription', title: 'App description', type: 'string', fieldset: 'icons'}),
  ],
  preview: {prepare: () => ({title: 'Search & sharing'})},
})
