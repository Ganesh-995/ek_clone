import { createHmac, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import defaultProducts from '../../../src/data/products.json' with { type: 'json' };

const adminPassword = process.env.ADMIN_PASSWORD;

function getProductStore() {
  return getStore('products');
}

function catalogResponse(data) {
  return Response.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  if (!adminPassword) return false;

  const expectedToken = createHmac('sha256', adminPassword).update('ek-products-admin').digest('hex');
  const actual = Buffer.from(token);
  const expected = Buffer.from(expectedToken);

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function GET() {
  const productStore = getProductStore();
  const products = await productStore.get('catalog', { type: 'json' });
  if (Array.isArray(products)) {
    const existingIds = new Set(products.map((product) => product.id));
    const missingDemoProducts = defaultProducts.filter((product) => !existingIds.has(product.id));
    const catalog = [...products, ...missingDemoProducts];

    if (missingDemoProducts.length > 0) {
      await productStore.setJSON('catalog', catalog);
    }

    return catalogResponse(catalog);
  }

  await productStore.setJSON('catalog', defaultProducts);
  return catalogResponse(defaultProducts);
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    if (!Array.isArray(payload)) {
      return Response.json({ message: 'Products must be an array.' }, { status: 400 });
    }

    await getProductStore().setJSON('catalog', payload);
    return Response.json({ products: payload });
  } catch {
    return Response.json({ message: 'Invalid product data.' }, { status: 400 });
  }
}
