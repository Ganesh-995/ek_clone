import { createHmac, timingSafeEqual } from 'node:crypto';
import defaultProducts from '../../../src/data/products.json' with { type: 'json' };

const DEV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ek-admin-123';
const productStore = globalThis.__ekProductsStore ??= { data: defaultProducts };

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  const expectedToken = createHmac('sha256', DEV_ADMIN_PASSWORD).update('ek-products-admin').digest('hex');
  const actual = Buffer.from(token);
  const expected = Buffer.from(expectedToken);

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function GET() {
  return Response.json(productStore.data);
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

    productStore.data = payload;
    return Response.json({ products: payload });
  } catch {
    return Response.json({ message: 'Invalid product data.' }, { status: 400 });
  }
}
