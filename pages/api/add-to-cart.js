import admin from 'firebase-admin';

// import serviceAccount from './key.json';
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();

export default async function handler(req, res) {
  const { userId, id } = req.body;

  const cartRef = db.collection('carts').doc(userId);
  const cart = await cartRef.get();
  const cartData = cart.data();
  const productExists = cartData.items.find((item) => item.id === id);
  if (productExists) {
    await cartRef.update({
      items: cartData.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    });
  } else {
    await cartRef.update({
      items: [...cartData.items, { id, quantity: 1 }],
    });
  }
  res.json({ message: 'Product added to cart' });
}
