import { webcrypto } from 'node:crypto';

const databaseName = process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || 'balloon_space';

let clientPromise;

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

async function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const { MongoClient } = await import('mongodb');
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    const { MongoClient } = await import('mongodb');
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function getDatabase() {
  const client = await getClientPromise();
  return client.db(databaseName);
}