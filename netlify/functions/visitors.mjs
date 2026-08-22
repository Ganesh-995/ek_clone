import { getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'

const store = getStore('site-metrics')
const activeWindowMs = 5 * 60 * 1000

function getCookie(request, name) {
  const cookies = request.headers.get('cookie') || ''
  return cookies.split(';').map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`))?.slice(name.length + 1)
}

export default async (request) => {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET' } })
  }

  const now = Date.now()
  const today = new Date(now).toISOString().slice(0, 10)
  const visitorCookie = getCookie(request, 'ek_visitor')
  const [visitorId, lastVisitDate] = visitorCookie?.split('.') || []
  const currentVisitorId = visitorId || randomUUID()
  const savedMetrics = await store.get('visitors', { type: 'json' }) || { total: 0, today: 0, date: today, active: {} }
  const metrics = savedMetrics.date === today ? savedMetrics : { ...savedMetrics, today: 0, date: today, active: {} }

  if (!visitorId) metrics.total += 1
  if (!visitorId || lastVisitDate !== today) metrics.today += 1
  metrics.active[currentVisitorId] = now
  metrics.active = Object.fromEntries(Object.entries(metrics.active).filter(([, timestamp]) => now - timestamp < activeWindowMs))
  await store.setJSON('visitors', metrics)

  const response = Response.json({ total: metrics.total, today: metrics.today, live: Object.keys(metrics.active).length })
  if (!visitorId || lastVisitDate !== today) {
    response.headers.append('Set-Cookie', `ek_visitor=${currentVisitorId}.${today}; Path=/; Max-Age=86400; SameSite=Lax`)
  }
  return response
}
