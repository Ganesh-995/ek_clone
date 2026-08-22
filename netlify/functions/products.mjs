import { getStore } from '@netlify/blobs'
import defaultProducts from '../../src/data/products.json' with { type: 'json' }
import { timingSafeEqual, createHmac } from 'node:crypto'

const store = getStore('products')
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
    const products = await store.get('catalog', { type: 'json' })
    if (products === null || products === undefined) {
      await store.setJSON('catalog', defaultProducts)
      return Response.json(defaultProducts)
    }
    return Response.json(products)
  }

  if (!isAuthorized(request)) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const products = await request.json()
    if (!Array.isArray(products)) {
      return Response.json({ message: 'Products must be an array.' }, { status: 400 })
    }

    await store.setJSON('catalog', products)
    return Response.json({ products })
  } catch {
    return Response.json({ message: 'Invalid product data.' }, { status: 400 })
  }
}
