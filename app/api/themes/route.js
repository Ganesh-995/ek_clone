import { createHmac, timingSafeEqual } from 'node:crypto';
import { getDatabase } from '../../../lib/mongodb';

export const runtime = 'nodejs';

const adminPassword = process.env.ADMIN_PASSWORD;

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
  const themes = await (await getDatabase()).collection('themes').find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
  return catalogResponse(themes);
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    if (!Array.isArray(payload)) {
      return Response.json({ message: 'Themes must be an array.' }, { status: 400 });
    }

    const themes = (await getDatabase()).collection('themes');
    await themes.deleteMany({});
    if (payload.length > 0) await themes.insertMany(payload);
    return catalogResponse(payload);
  } catch {
    return Response.json({ message: 'Invalid theme data.' }, { status: 400 });
  }
}
