/**
 * One-time copy seed for the Studio fields added in "Move all site text into Studio".
 * Uses setIfMissing on the published Site Settings document and on its draft if one exists,
 * so nothing already filled in is changed and publishing a draft later keeps these values.
 *
 *   npx sanity login            # once, if not logged in
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=we7xgg1a NEXT_PUBLIC_SANITY_DATASET=production \
 *     npx sanity exec scripts/seed-studio-copy.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

import values from './seed-studio-copy.json'

const ID = '9dae2a8c-ff4f-4d8c-8cf6-411f02301eaf'
const client = getCliClient({ apiVersion: '2025-09-08' })

async function main() {
  const ids = [ID]
  const draft = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id: `drafts.${ID}` })
  if (draft) ids.push(draft)

  const tx = client.transaction()
  for (const id of ids) tx.patch(id, (p) => p.setIfMissing(values))
  await tx.commit()
  console.log(`setIfMissing applied to: ${ids.join(', ')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
