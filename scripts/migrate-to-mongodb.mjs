import { readFile } from 'node:fs/promises';
import { MongoClient } from 'mongodb';
import { defaultHangerCards, defaultHeroImages } from '../src/data/siteSettings.js';
import { themeCards as defaultThemes } from '../src/data/themes.js';

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME || 'balloon_space';
const sourceUrl = process.env.DATA_MIGRATION_SOURCE_URL || 'https://theballoonspace.netlify.app';

if (!mongoUri) throw new Error('Missing MONGODB_URI environment variable.');

const defaultProducts = JSON.parse(await readFile(new URL('../src/data/products.json', import.meta.url), 'utf8'));

async function readSource(path, fallback) {
  try {
    const response = await fetch(`${sourceUrl}${path}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) || (data && typeof data === 'object') ? data : fallback;
  } catch {
    return fallback;
  }
}

const client = new MongoClient(mongoUri);

try {
  await client.connect();
  const database = client.db(databaseName);
  const products = await readSource('/api/products', defaultProducts);
  const themes = await readSource('/api/themes', defaultThemes);
  const settings = await readSource('/api/site-settings', { heroImages: defaultHeroImages, hangerCards: defaultHangerCards });

  if (!Array.isArray(products) || !Array.isArray(themes)) throw new Error('Source API returned invalid catalog data.');

  await database.collection('products').deleteMany({});
  if (products.length > 0) await database.collection('products').insertMany(products);
  await database.collection('products').createIndex({ id: 1 }, { unique: true });

  await database.collection('themes').deleteMany({});
  if (themes.length > 0) await database.collection('themes').insertMany(themes);
  await database.collection('themes').createIndex({ id: 1 }, { unique: true });

  await database.collection('siteSettings').updateOne(
    { _id: 'site-settings' },
    { $set: { heroImages: settings.heroImages || defaultHeroImages, hangerCards: settings.hangerCards || defaultHangerCards } },
    { upsert: true }
  );

  console.log(`Migrated ${products.length} products, ${themes.length} themes, and site settings to ${databaseName}.`);
} finally {
  await client.close();
}