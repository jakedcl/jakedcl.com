import {apiVersion, dataset, projectId} from '../env'

/** Published content from the Sanity API, cached by Next for 60 seconds. */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  )
  url.searchParams.set('query', query)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }
  url.searchParams.set('perspective', 'published')
  const response = await fetch(url, {next: {revalidate: 60}})
  if (!response.ok) throw new Error(`Sanity query failed (${response.status})`)
  const body = (await response.json()) as {result: T}
  return body.result
}
