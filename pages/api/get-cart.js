import { createGuestCart, db } from './firebase';

export default async function handler(req, res) {
  console.log('Fetching cart\n' + new Date().toLocaleString());
  if (req.method === 'GET') {
    const { userId } = req.cookies;

    if (!userId) {
      const response = await createGuestCart();
      const cartRef = db.collection('carts').doc(response);
      const cart = await cartRef.get();
      const cartData = cart.data();
      const cartItems = cartData.items;

      res.status(200).cookie('userId', response).json(cartItems);
    }
    const cartRef = db.collection('carts').doc(userId);
    const cart = await cartRef.get();
    const cartData = cart.data();
    const cartItems = cartData.items;
    res.json(cartItems);
  }
}

// The above code will handle all the requests to the /api/get-cart endpoint. If the request is a POST request, it will process it. Otherwise, it will handle any other HTTP method.
