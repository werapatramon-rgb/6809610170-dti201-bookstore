import mongoose from 'mongoose';

export function getMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('Missing MONGODB_URI in .env');
  }
  if (
    uri.includes('DB_USER') ||
    uri.includes('ENCODED_PASSWORD') ||
    uri.includes('YOUR_HOST') ||
    uri.includes('<')
  ) {
    throw new Error('Please replace placeholders in .env with your real MongoDB Atlas URI');
  }
  return uri;
}

export async function connectDatabase(options = {}) {
  const uri = getMongoUri();
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    ...options
  });
  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
