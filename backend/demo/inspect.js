export async function inspectDemoDatabase(db) {
  const collections = ['drinks', 'customers', 'categories', 'authors', 'books', 'carts', 'orders'];
  console.log('Database: course_books_demo (separate from course_books)');

  for (const name of collections) {
    const count = await db.collection(name).countDocuments();
    console.log(${name}: );
  }

  const categories = await db.collection('categories').find().toArray();
  const authors = await db.collection('authors').find().toArray();
  const books = await db.collection('books').find().sort({ sku: 1 }).toArray();

  const catMap = new Map(categories.map(c => [String(c._id), c.name]));
  const authorMap = new Map(authors.map(a => [String(a._id), a.name]));

  for (const b of books) {
    console.log(
      JSON.stringify({
        title: b.title,
        category: catMap.get(String(b.categoryId)) ?? 'Unknown',
        authors: (b.authorIds ?? []).map(id => authorMap.get(String(id)) ?? 'Unknown'),
        salePriceSatang: b.salePriceSatang
      })
    );
  }

  const order = await db.collection('orders').findOne();
  if (order) {
    const totalSatang = (order.items ?? []).reduce(
      (sum, item) => sum + item.quantity * item.unitPriceSatang,
      0
    );
    console.log(Order total:  satang =  THB);
  }
}
