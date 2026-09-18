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

function normalizeHangerCards(cards) {
  const source = Array.isArray(cards) && cards.length > 0 ? cards : defaultHangerCards;
  return source
    .filter((card) => card && typeof card.image === 'string' && card.image.trim() && typeof card.title === 'string' && card.title.trim())
    .slice(0, 20)
    .map((card) => ({
      image: card.image.trim(),
      title: card.title.trim(),
      description: typeof card.description === 'string' ? card.description.trim() : '',
    }));
}

function normalizeHeroImages(images) {
  const source = Array.isArray(images) && images.length > 0 ? images : defaultHeroImages;
  return source.filter((image) => typeof image === 'string' && image.trim()).slice(0, 10).map((image) => image.trim());
}

export async function GET() {
  try {
    const database = await getDatabase();
    const collection = database.collection('siteSettings');
    const settings = await collection.findOne({ _id: 'site-settings' });
    const heroImages = normalizeHeroImages(settings?.heroImages);
    const hangerCards = normalizeHangerCards(settings?.hangerCards);
    if (!settings || !Array.isArray(settings.heroImages) || !Array.isArray(settings.hangerCards)) {
      await collection.updateOne({ _id: 'site-settings' }, { $set: { heroImages, hangerCards } }, { upsert: true });
    }
    return response({ heroImages, hangerCards });
  } catch {
    return response({ heroImages: defaultHeroImages, hangerCards: defaultHangerCards });
  }
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const settings = await request.json();
    const nextSettings = {};

    if (settings?.heroImages !== undefined) {
      const heroImages = settings.heroImages;
      if (!Array.isArray(heroImages) || heroImages.length === 0 || heroImages.length > 10 || heroImages.some((image) => typeof image !== 'string' || !image.trim())) {
        return Response.json({ message: 'Provide 1 to 10 valid hero image URLs.' }, { status: 400 });
      }
      nextSettings.heroImages = heroImages.map((image) => image.trim());
    }

    if (settings?.hangerCards !== undefined) {
      const hangerCards = normalizeHangerCards(settings.hangerCards);
      if (hangerCards.length === 0 || hangerCards.length > 20) {
        return Response.json({ message: 'Provide 1 to 20 hanger cards with an image and title.' }, { status: 400 });
      }
      nextSettings.hangerCards = hangerCards;
    }

    if (Object.keys(nextSettings).length === 0) {
      return Response.json({ message: 'Nothing to update.' }, { status: 400 });
    }

    await (await getDatabase()).collection('siteSettings').updateOne({ _id: 'site-settings' }, { $set: nextSettings }, { upsert: true });

    const updated = await (await getDatabase()).collection('siteSettings').findOne({ _id: 'site-settings' });
    return response({
      heroImages: Array.isArray(updated?.heroImages) && updated.heroImages.length > 0 ? updated.heroImages : defaultHeroImages,
      hangerCards: Array.isArray(updated?.hangerCards) && updated.hangerCards.length > 0 ? updated.hangerCards : defaultHangerCards
    });
  } catch {
    return Response.json({ message: 'Invalid hero image settings.' }, { status: 400 });
  }
}