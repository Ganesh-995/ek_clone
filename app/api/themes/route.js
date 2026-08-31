import { createHmac, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { themeCards } from '../../../src/data/themes.js';

const adminPassword = process.env.ADMIN_PASSWORD;

function getThemeStore() {
  return getStore('themes');
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
  const themeStore = getThemeStore();
  const themes = await themeStore.get('catalog', { type: 'json' });
  if (Array.isArray(themes)) return catalogResponse(themes);

  await themeStore.setJSON('catalog', themeCards);
  return catalogResponse(themeCards);
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

    await getThemeStore().setJSON('catalog', payload);
    return Response.json({ themes: payload });
  } catch {
    return Response.json({ message: 'Invalid theme data.' }, { status: 400 });
  }
}
