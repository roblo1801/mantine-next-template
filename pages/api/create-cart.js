import admin from 'firebase-admin';

// import serviceAccount from './key.json';
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const createGuestCart = async () => {
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

  const response = await createGuestCart();

  res
    .status(200)
    // .setHeader(
    //   'Set-Cookie',
    //   `userId=${response}; path=/; expires=${new Date(
    //     Date.now() + 1000 * 60 * 60 * 24 * 7
    //   ).toUTCString()}; samesite=strict; domain=${process.env.NEXT_COOKIE_DOMAIN}; ${
    //     process.env.NEXT_COOKIE_DOMAIN === '192.168.1.77' ? null : 'secure'
    //   };`
    // )
    .json({ userId: response });
}
