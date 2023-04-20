import admin from 'firebase-admin';

import serviceAccount from './key.json';

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
const productsRef = db.collection('Products');

export const fetchProducts = async () => {
  try {
    const snapshot = await productsRef.get();
    const products = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      products.push({ id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const addProduct = async ({ name, description, price, url }) => {
  try {
    const newProductRef = db.collection('Products').doc();
    await newProductRef.set({
      name,
      description,
      price,
      url,
      quantity: 1,
    });
    return true;
    console.log('Product added successfully!');
  } catch (error) {
    return false;
    console.error('Error adding product:', error);
  }
  return false;
};

export const createGuestCart = async () => {
  try {
    const cartRef = db.collection('carts').doc();
    const userId = cartRef.id;
    await cartRef.set({ items: [] });
    console.log('Cart created successfully with UserID:', userId);
    return userId;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
};
