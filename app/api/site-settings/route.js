import { createHmac, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { defaultHeroImages } from '../../../src/data/siteSettings';

const adminPassword = process.env.ADMIN_PASSWORD;

function getSettingsStore() {
  return getStore('site-settings');
}

function isAuthorized(request) {
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token || !adminPassword) return false;

  const expectedToken = createHmac('sha256', adminPassword).update('ek-products-admin').digest('hex');
  const actual = Buffer.from(token);
  const expected = Buffer.from(expectedToken);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function response(settings) {
  return Response.json(settings, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

export async function GET() {
  const store = getSettingsStore();
  const settings = await store.get('site-settings', { type: 'json' });
  if (Array.isArray(settings?.heroImages) && settings.heroImages.length > 0) return response(settings);

  const defaultSettings = { heroImages: defaultHeroImages };
  await store.setJSON('site-settings', defaultSettings);
  return response(defaultSettings);
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const settings = await request.json();
    const heroImages = settings?.heroImages;
    if (!Array.isArray(heroImages) || heroImages.length === 0 || heroImages.length > 10 || heroImages.some((image) => typeof image !== 'string' || !image.trim())) {
      return Response.json({ message: 'Provide 1 to 10 valid hero image URLs.' }, { status: 400 });
    }

    const nextSettings = { heroImages: heroImages.map((image) => image.trim()) };
    await getSettingsStore().setJSON('site-settings', nextSettings);
    return response(nextSettings);
  } catch {
    return Response.json({ message: 'Invalid hero image settings.' }, { status: 400 });
  }
}