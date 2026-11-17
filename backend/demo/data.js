import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;
const id = hex => new ObjectId(String(hex).padStart(24, '0'));

export const sampleData = {
  drinks: [
    { _id: id('d1'), name: 'Iced Cocoa', priceSatang: 4500, available: true },
    { _id: id('d2'), name: 'Lemon Tea', priceSatang: 3500, available: true }
  ],
  customers: [
    { _id: id('c1'), name: 'Mali Demo', email: 'mali@example.com' }
  ],
  categories: [
    { _id: id('ca1'), name: 'Computing' }
  ],
  authors: [
    { _id: id('a1'), name: 'Nida Demo' },
    { _id: id('a2'), name: 'Arun Demo' }
  ],
  books: [
    {
      _id: id('b1'),
      sku: 'DEMO-001',
      title: 'Web Basics',
      categoryId: id('ca1'),
      authorIds: [id('a1'), id('a2')],
      salePriceSatang: 1800
    },
    {
      _id: id('b2'),
      sku: 'DEMO-002',
      title: 'Database Basics',
      categoryId: id('ca1'),
      authorIds: [id('a1')],
      salePriceSatang: 2500
    }
  ],
  carts: [
    {
      _id: id('cc1'),
      customerId: id('c1'),
      items: [{ bookId: id('b2'), quantity: 1 }]
    }
  ],
  orders: [
    {
      _id: id('df1'),
      customerId: id('c1'),
      status: 'confirmed',
      currency: 'THB',
      items: [{ bookId: id('b1'), titleAtPurchase: 'Web Basics', quantity: 2, unitPriceSatang: 1600 }]
    }
  ]
};
