import { getStore } from '@netlify/blobs'

const store = getStore('site-metrics')

export default async (request) => {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET' } })
  }

  const savedMetrics = await store.get('visitors', { type: 'json' })
  const count = Number(savedMetrics?.count || 0) + 1
  await store.setJSON('visitors', { count })

  return Response.json({ count })
}
