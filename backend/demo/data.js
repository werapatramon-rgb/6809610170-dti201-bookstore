import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const IDS = {
  drinkCocoa: new ObjectId('661000000000000000000001'),
  drinkMatcha: new ObjectId('661000000000000000000002'),
  customerSomchai: new ObjectId('661000000000000000000011'),
  catComputing: new ObjectId('661000000000000000000021'),
  authorNida: new ObjectId('661000000000000000000031'),
  authorArun: new ObjectId('661000000000000000000032'),
  bookWeb: new ObjectId('661000000000000000000041'),
  bookDb: new ObjectId('661000000000000000000042'),
  cartSomchai: new ObjectId('661000000000000000000051'),
  orderOne: new ObjectId('661000000000000000000061')
};

export const sampleData = {
  drinks: [
    { _id: IDS.drinkCocoa, name: 'Iced Cocoa', priceSatang: 4500, available: true },
    { _id: IDS.drinkMatcha, name: 'Matcha Latte', priceSatang: 5500, available: true }
  ],
  customers: [
    { _id: IDS.customerSomchai, name: 'Somchai Demo', email: 'somchai@example.com' }
  ],
  categories: [
    { _id: IDS.catComputing, name: 'Computing' }
  ],
  authors: [
    { _id: IDS.authorNida, name: 'Nida Demo' },
    { _id: IDS.authorArun, name: 'Arun Demo' }
  ],
  books: [
    {
      _id: IDS.bookWeb,
      sku: 'DEMO-001',
      title: 'Web Basics',
      categoryId: IDS.catComputing,
      authorIds: [IDS.authorNida, IDS.authorArun],
      salePriceSatang: 1800
    },
    {
      _id: IDS.bookDb,
      sku: 'DEMO-002',
      title: 'Database Basics',
      categoryId: IDS.catComputing,
      authorIds: [IDS.authorNida],
      salePriceSatang: 2500
    }
  ],
  carts: [
    {
      _id: IDS.cartSomchai,
      customerId: IDS.customerSomchai,
      items: [{ bookId: IDS.bookDb, quantity: 1 }]
    }
  ],
  orders: [
    {
      _id: IDS.orderOne,
      customerId: IDS.customerSomchai,
      status: 'paid',
      items: [{ bookId: IDS.bookWeb, quantity: 2, unitPriceSatang: 1600 }]
    }
  ]
};
