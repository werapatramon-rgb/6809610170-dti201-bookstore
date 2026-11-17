import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/db.js';
import { sampleData } from './data.js';
import { inspectDemoDatabase } from './inspect.js';

const shouldSeed = process.argv.includes('--seed');

try {
  await connectDatabase({ dbName: 'course_books_demo' });
  const db = mongoose.connection.db;

  if (shouldSeed) {
    for (const [colName, docs] of Object.entries(sampleData)) {
      for (const doc of docs) {
        await db.collection(colName).updateOne(
          { _id: doc._id },
          { $setOnInsert: doc },
          { upsert: true }
        );
      }
    }
    console.log('Sample seed complete (existing records are preserved).');
  }

  await inspectDemoDatabase(db);
} catch (err) {
  console.error(err.message || 'Demo database operation failed');
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
