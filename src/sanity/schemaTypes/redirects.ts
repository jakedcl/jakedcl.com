import {defineArrayMember, defineField, defineType} from 'sanity'

import {RESERVED_FIRST_SEGMENTS} from '../../lib/routes'

function fromPathError(value: string | undefined): string | true {
  const from = value?.trim()
  if (!from) return 'Add the old address.'
  if (!from.startsWith('/')) return 'Start with /, e.g. /education.'
  if (from === '/') return 'The homepage cannot be redirected.'
  if (/[?#\s]/.test(from)) return 'Leave out spaces, ? and #.'
  if (from.endsWith('/') ) return 'Leave off the trailing /.'
  if (from.includes('*') && !from.endsWith('/*')) return 'A * only works at the very end, after a /, e.g. /admin/*.'
  const first = from.slice(1).split('/')[0]
  if (RESERVED_FIRST_SEGMENTS.has(first)) {
    return `/${first} is a real page on the site, so a redirect from it would never be used.`
  }
  return true
}

export const redirectRuleType = defineType({
  name: 'redirectRule',
  title: 'Redirect',
  type: 'object',
  fields: [
    defineField({
      name: 'from',
      title: 'Old address',
      type: 'string',
      description: 'The address people visit, e.g. /education. End with /* to send everything under it, e.g. /admin/*.',
      validation: (rule) => rule.custom((value) => fromPathError(value as string | undefined)),
    }),
    defineField({
      name: 'to',
      title: 'Send them to',
      type: 'string',
      description: 'A page on this site, e.g. /about, or a full web address. If the old address ends with /*, end this with /* to carry the rest over.',
      validation: (rule) =>
        rule.custom((value) => {
          const to = (value as string | undefined)?.trim()
          if (!to) return 'Add where to send people.'
          if (to.startsWith('/') || /^https?:\/\//.test(to)) return true
          return 'Start with / for a page on this site, or https:// for another site.'
        }),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent',
      type: 'boolean',
      initialValue: false,
      description: 'Turn on only if the old address is gone for good. Browsers and Google remember permanent redirects.',
    }),
  ],
  preview: {
    select: {from: 'from', to: 'to', permanent: 'permanent'},
    prepare: ({from, to, permanent}) => ({
      title: `${from ?? '?'} → ${to ?? '?'}`,
      subtitle: permanent ? 'Permanent' : 'Temporary',
    }),
  },
})

export const redirectsType = defineType({
  name: 'redirects',
  title: 'Redirects',
  type: 'document',
  description: 'Send an old or short address to another page or site. Changes apply within about a minute, no redeploy needed. Project short links (jakedcl.com/skyline) are set on each project instead. A redirect here wins if both use the same address.',
  fields: [
    defineField({
      name: 'rules',
      title: 'Redirects',
      type: 'array',
      of: [defineArrayMember({type: 'redirectRule'})],
      validation: (rule) =>
        rule.custom((rules) => {
          const seen = new Set<string>()
          for (const r of (rules as Array<{from?: string}> | undefined) ?? []) {
            const from = r.from?.trim()
            if (!from) continue
            if (seen.has(from)) return `${from} is listed twice.`
            seen.add(from)
          }
          return true
        }),
    }),
  ],
  preview: {prepare: () => ({title: 'Redirects'})},
})
