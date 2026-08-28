import { getStore } from '@netlify/blobs'
import { themeCards } from '../../src/data/themes.js'
import { timingSafeEqual, createHmac } from 'node:crypto'

const store = getStore('themes')
const allowedMethods = ['GET', 'PUT']

function isAuthorized(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !process.env.ADMIN_PASSWORD) return false

  const expectedToken = createHmac('sha256', process.env.ADMIN_PASSWORD).update('ek-products-admin').digest('hex')
  const actual = Buffer.from(token)
  const expected = Buffer.from(expectedToken)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export default async (request) => {
  if (!allowedMethods.includes(request.method)) {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: allowedMethods.join(', ') },
    })
  }

  if (request.method === 'GET') {
    const themes = await store.get('catalog', { type: 'json' })
    if (themes === null || themes === undefined) {
      await store.setJSON('catalog', themeCards)
      return Response.json(themeCards)
    }
    return Response.json(themes)
  }

  if (!isAuthorized(request)) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const themes = await request.json()
    if (!Array.isArray(themes)) {
      return Response.json({ message: 'Themes must be an array.' }, { status: 400 })
    }

    await store.setJSON('catalog', themes)
    return Response.json({ themes })
  } catch {
    return Response.json({ message: 'Invalid theme data.' }, { status: 400 })
  }
}
