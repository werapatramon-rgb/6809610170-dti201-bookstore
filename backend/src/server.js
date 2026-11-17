import { connectDatabase, reportDatabaseError } from './db.js';
import { Book } from './models/Book.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3001);

try {
  await connectDatabase();
  await Book.init();
  const app = createApp();
  app.listen(port, () => {
    console.log(API listening on port );
  });
} catch (err) {
  reportDatabaseError(err);
  process.exit(1);
}
