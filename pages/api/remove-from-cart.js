import { db } from './firebase';

export default async function handler(req, res) {
  const { userId, id } = req.body;
  const cartRef = db.collection('carts').doc(userId);
  const cart = await cartRef.get();
  const cartData = cart.data();
  const productIndex = cartData.items.findIndex((item) => item.id === id); // Find the index of the product in the items array
  if (productIndex !== -1) {
    // If product exists in cart
    const updatedItems = [...cartData.items]; // Create a copy of the items array
    updatedItems.splice(productIndex, 1); // Remove the product from the items array
    await cartRef.update({
      items: updatedItems, // Update the cart with the updated items array
    });
    res.json({ message: 'Product removed from cart' });
  } else {
    res.json({ message: 'Product not found in cart' });
  }
}
