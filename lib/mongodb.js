import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'ek_balloon_space';

const globalForMongo = globalThis;

const clientPromise = uri
  ? (globalForMongo.__mongoClientPromise ??= new MongoClient(uri))
  : null;

export async function connectToDatabase() {
  if (!uri || !clientPromise) {
    return { client: null, db: null, connected: false, reason: 'MONGODB_URI is not configured.' };
  }

  try {
    await clientPromise.connect();
    const db = clientPromise.db(dbName);
    return { client: clientPromise, db, connected: true, reason: null };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return { client: null, db: null, connected: false, reason: error.message };
  }
}

export async function readCollectionData(collectionName, fallbackValue) {
  if (!uri) {
    return fallbackValue;
  }

  try {
    const { db } = await connectToDatabase();
    if (!db) return fallbackValue;

    const collection = db.collection(collectionName);
    const doc = await collection.findOne({ name: collectionName });
    const data = doc?.data ?? fallbackValue;
    return Array.isArray(data) ? data : fallbackValue;
  } catch (error) {
    console.error(`Failed to read ${collectionName} from MongoDB:`, error);
    return fallbackValue;
  }
}

export async function writeCollectionData(collectionName, data) {
  if (!uri) {
    return false;
  }

  try {
    const { db } = await connectToDatabase();
    if (!db) return false;

    const collection = db.collection(collectionName);
    await collection.updateOne(
      { name: collectionName },
      { $set: { name: collectionName, data, updatedAt: new Date() } },
      { upsert: true }
    );

    return true;
  } catch (error) {
    console.error(`Failed to write ${collectionName} to MongoDB:`, error);
    return false;
  }
}
