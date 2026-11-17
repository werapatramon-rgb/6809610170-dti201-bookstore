import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/db.js';

try {
  await connectDatabase();
  await mongoose.connection.db.admin().ping();
  const count = await mongoose.connection.db.collection('books').countDocuments();
  console.log('Database ping: OK');
  console.log(Books: );
} catch (err) {
  console.error(err.message || 'Database operation failed');
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
