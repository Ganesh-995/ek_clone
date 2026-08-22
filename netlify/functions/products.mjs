import { getStore } from '@netlify/blobs'
import defaultProducts from '../../src/data/products.json' with { type: 'json' }

const store = getStore('products')
const allowedMethods = ['GET', 'PUT']

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
