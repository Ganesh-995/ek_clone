import { createHmac, timingSafeEqual, webcrypto } from 'node:crypto'
import { defaultHangerCards, defaultHeroImages } from '../../src/data/siteSettings.js'

const allowedMethods = ['GET', 'PUT']
const databaseName = process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || 'balloon_space'
let clientPromise

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto
}

async function getClientPromise() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Missing MONGODB_URI environment variable.')

  if (!clientPromise) {
    const { MongoClient } = await import('mongodb')
    clientPromise = new MongoClient(uri).connect()
  }
  return clientPromise
}

async function getDatabase() {
  const client = await getClientPromise()
  return client.db(databaseName)
}

function isAuthorized(request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  if (!token || !process.env.ADMIN_PASSWORD) return false

  const expectedToken = createHmac('sha256', process.env.ADMIN_PASSWORD).update('ek-products-admin').digest('hex')
  const actual = Buffer.from(token)
  const expected = Buffer.from(expectedToken)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      ...(init.headers || {})
    }
  })
}

function normalizeHangerCards(cards) {
  const source = Array.isArray(cards) && cards.length > 0 ? cards : defaultHangerCards
  return source
    .filter((card) => card && typeof card.image === 'string' && card.image.trim() && typeof card.title === 'string' && card.title.trim())
    .slice(0, 20)
    .map((card) => ({
      image: card.image.trim(),
      title: card.title.trim(),
      description: typeof card.description === 'string' ? card.description.trim() : ''
    }))
}

function normalizeHeroImages(images) {
  const source = Array.isArray(images) && images.length > 0 ? images : defaultHeroImages
  return source.filter((image) => typeof image === 'string' && image.trim()).slice(0, 10).map((image) => image.trim())
}

export default async (request) => {
  if (!allowedMethods.includes(request.method)) {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: allowedMethods.join(', ') } })
  }

  try {
    const collection = (await getDatabase()).collection('siteSettings')

    if (request.method === 'GET') {
      const settings = await collection.findOne({ _id: 'site-settings' })
      const heroImages = normalizeHeroImages(settings?.heroImages)
      const hangerCards = normalizeHangerCards(settings?.hangerCards)

      if (!settings || !Array.isArray(settings.heroImages) || !Array.isArray(settings.hangerCards)) {
        await collection.updateOne({ _id: 'site-settings' }, { $set: { heroImages, hangerCards } }, { upsert: true })
      }

      return json({ heroImages, hangerCards })
    }

    if (!isAuthorized(request)) {
      return json({ message: 'Unauthorized.' }, { status: 401 })
    }

    const settings = await request.json()
    const nextSettings = {}

    if (settings?.heroImages !== undefined) {
      const heroImages = settings.heroImages
      if (!Array.isArray(heroImages) || heroImages.length === 0 || heroImages.length > 10 || heroImages.some((image) => typeof image !== 'string' || !image.trim())) {
        return json({ message: 'Provide 1 to 10 valid hero image URLs.' }, { status: 400 })
      }
      nextSettings.heroImages = heroImages.map((image) => image.trim())
    }

    if (settings?.hangerCards !== undefined) {
      const hangerCards = normalizeHangerCards(settings.hangerCards)
      if (hangerCards.length === 0 || hangerCards.length > 20) {
        return json({ message: 'Provide 1 to 20 hanger cards with an image and title.' }, { status: 400 })
      }
      nextSettings.hangerCards = hangerCards
    }

    if (Object.keys(nextSettings).length === 0) {
      return json({ message: 'Nothing to update.' }, { status: 400 })
    }

    await collection.updateOne({ _id: 'site-settings' }, { $set: nextSettings }, { upsert: true })
    const updated = await collection.findOne({ _id: 'site-settings' })
    return json({
      heroImages: normalizeHeroImages(updated?.heroImages),
      hangerCards: normalizeHangerCards(updated?.hangerCards)
    })
  } catch (error) {
    return json({ message: error.message || 'Unable to load site settings.' }, { status: 500 })
  }
}