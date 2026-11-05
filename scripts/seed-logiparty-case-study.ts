/**
 * Seeds Logiparty case study fields on Site Settings (published + draft).
 * Does not upload images — run seed-logiparty-case-study-images.ts after, or upload in Studio.
 *
 *   npx sanity login
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=we7xgg1a NEXT_PUBLIC_SANITY_DATASET=production \
 *     npx sanity exec scripts/seed-logiparty-case-study.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

import values from './seed-logiparty-case-study.json'

const ID = '9dae2a8c-ff4f-4d8c-8cf6-411f02301eaf'
const client = getCliClient({ apiVersion: '2025-09-08' })

async function main() {
  const ids = [ID]
  const draft = await client.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: `drafts.${ID}`,
  })
  if (draft) ids.push(draft)

  const tx = client.transaction()
  for (const id of ids) tx.patch(id, (p) => p.set(values))
  await tx.commit()
  console.log(`Case study copy applied to: ${ids.join(', ')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
