import { createHmac, timingSafeEqual } from 'node:crypto';
import { getDatabase } from '../../../lib/mongodb';
import { defaultHangerCards, defaultHeroImages } from '../../../src/data/siteSettings';

export const runtime = 'nodejs';

const adminPassword = process.env.ADMIN_PASSWORD;

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
  const settings = await (await getDatabase()).collection('siteSettings').findOne({ _id: 'site-settings' });
  if (Array.isArray(settings?.heroImages) && settings.heroImages.length > 0) {
    return response({
      heroImages: settings.heroImages,
      hangerCards: Array.isArray(settings.hangerCards) && settings.hangerCards.length > 0 ? settings.hangerCards : defaultHangerCards
    });
  }

  const defaultSettings = { heroImages: defaultHeroImages, hangerCards: defaultHangerCards };
  await (await getDatabase()).collection('siteSettings').updateOne({ _id: 'site-settings' }, { $set: defaultSettings }, { upsert: true });
  return response(defaultSettings);
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const settings = await request.json();
    const heroImages = settings?.heroImages;
    const hangerCards = settings?.hangerCards;
    if (!Array.isArray(heroImages) || heroImages.length === 0 || heroImages.length > 10 || heroImages.some((image) => typeof image !== 'string' || !image.trim())) {
      return Response.json({ message: 'Provide 1 to 10 valid hero image URLs.' }, { status: 400 });
    }
    if (!Array.isArray(hangerCards) || hangerCards.length === 0 || hangerCards.length > 20 || hangerCards.some((card) => !card || typeof card.image !== 'string' || !card.image.trim() || typeof card.title !== 'string' || !card.title.trim() || typeof card.description !== 'string' || !card.description.trim())) {
      return Response.json({ message: 'Provide 1 to 20 hanger cards with an image, title, and description.' }, { status: 400 });
    }

    const nextSettings = {
      heroImages: heroImages.map((image) => image.trim()),
      hangerCards: hangerCards.map((card) => ({ image: card.image.trim(), title: card.title.trim(), description: card.description.trim() }))
    };
    await (await getDatabase()).collection('siteSettings').updateOne({ _id: 'site-settings' }, { $set: nextSettings }, { upsert: true });
    return response(nextSettings);
  } catch {
    return Response.json({ message: 'Invalid hero image settings.' }, { status: 400 });
  }
}