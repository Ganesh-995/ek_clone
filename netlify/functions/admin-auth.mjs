import { createHmac, timingSafeEqual } from 'node:crypto'

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } })
  }

  try {
    const { password } = await request.json()
    const configuredPassword = process.env.ADMIN_PASSWORD
    if (!configuredPassword || typeof password !== 'string') {
      return Response.json({ message: 'Unauthorized.' }, { status: 401 })
    }

    const actual = Buffer.from(password)
    const expected = Buffer.from(configuredPassword)
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return Response.json({ message: 'Incorrect password.' }, { status: 401 })
    }

    const token = createHmac('sha256', configuredPassword).update('ek-products-admin').digest('hex')
    return Response.json({ token })
  } catch {
    return Response.json({ message: 'Invalid request.' }, { status: 400 })
  }
}