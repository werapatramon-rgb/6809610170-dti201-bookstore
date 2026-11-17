import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase, reportDatabaseError } from '../src/db.js';
import { Book } from '../src/models/Book.js';
import { initialBooks } from '../src/books.js';

try {
  await connectDatabase();
  await Book.init();

  for (const item of initialBooks) {
    const titleKey = item.title.trim().toLocaleLowerCase();
    await Book.updateOne(
      { titleKey },
      { $setOnInsert: { ...item, titleKey } },
      { upsert: true }
    );
  }

  const count = await Book.countDocuments();
  console.log(Seed complete. Books: );
} catch (err) {
  reportDatabaseError(err);
} finally {
  await disconnectDatabase();
}
