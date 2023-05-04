const admin = require('firebase-admin');

// import serviceAccount from './key.json';
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  console.log('Fetching cart\n' + new Date().toLocaleString());

  const { userId } = req.cookies;

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
  console.log('userId', userId);
  if (!userId) {
    const newUserId = await createGuestCart();
    res.setHeader('Set-Cookie', `userId=${newUserId}; path=/; max-age=31536000`);
    res.json([]);
    return;
  }

  const cartRef = db.collection('carts').doc(userId);
  const cart = await cartRef.get();
  const cartData = cart.data();
  const cartItems = cartData.items;
  res.json(cartItems);
}

// The above code will handle all the requests to the /api/get-cart endpoint. If the request is a POST request, it will process it. Otherwise, it will handle any other HTTP method.
