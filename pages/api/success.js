import admin from 'firebase-admin';
import stripeapi from 'stripe';
// import serviceAccount from './key.json';
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const stripe = stripeapi(process.env.STRIPE_SECRET_API_KEY);

// Handler function for the Stripe success URL
export default async function handler(req, res) {
  const sessionId = req.query.session_id;
  const userId = req.cookies.userId;
  try {
    const session = await stripe.checkout.sessions.listLineItems(sessionId);

    const lineItems = session.data;
    const cartDoc = await db.collection('carts').doc(userId).get();
    for (const lineItem of lineItems) {
      const productQuery = await db
        .collection('Products')
        .where('name', '==', lineItem.description)
        .limit(1)
        .get();
      const productDoc = productQuery.docs[0];
      if (!productDoc.exists) {
        console.error(`Product with name ${lineItem.description} not found in Firestore`);
        continue;
      }
      const newQuantity = productDoc.data().quantity - lineItem.quantity;
      await productDoc.ref.update({ quantity: newQuantity });

      if (!cartDoc.exists) {
        console.error(`Cart with userId ${userId} not found in Firestore`);
        continue;
      }
      const cartItems = cartDoc.data().items;
      await cartDoc.ref.update({ items: [] });
    }

    // Redirect to the success page
    res.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/success`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/error`);
  }
}
