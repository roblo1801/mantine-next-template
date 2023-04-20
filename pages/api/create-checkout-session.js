// const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);
import axios from 'axios';
import stripeapi from 'stripe';
const stripe = stripeapi(process.env.STRIPE_SECRET_API_KEY);
const domain = process.env.NEXT_PUBLIC_DOMAIN;
const imagesDomain = process.env.NEXT_PUBLIC_IMAGES_DOMAIN;
import { db } from './firebase';

export default async function handler(req, res) {
  const userId = req.cookies.userId;
  const cartDoc = await db.collection('carts').doc(userId).get();
  const cartItems = cartDoc.data().items;
  const newCartItems = await axios
    .all(
      cartItems.map(async (cartItem) => {
        const productDoc = await db.collection('Products').doc(cartItem.id).get();
        const productData = productDoc.data();
        if (productData.quantity < cartItem.quantity) {
          return { ...cartItem, quantity: productData.quantity };
        }
        return cartItem;
      })
    )
    .then((results) => results.filter((e) => e.quantity > 0));
  await db.collection('carts').doc(userId).update({ items: newCartItems });
  console.log(newCartItems);
  if (
    cartItems.map((e) => e.quantity).reduce((a, b) => a + b, 0) !==
    newCartItems.map((e) => e.quantity).reduce((a, b) => a + b, 0)
  ) {
    console.log('Cart updated to reflect inventory');
    return res.json({ url: `${domain}/cart/${userId}?cartUpdated=true` });
  }

  const products = await axios.all(
    req.body.items.map(async (item) => {
      const product = await stripe.products.create({
        name: item.name,
        // description: item.description,
        images: [(imagesDomain + item.url).replace(' ', '%20')],
        shippable: true,
        tax_code: 'txcd_99999999',
        url: `${domain}/${item.id}`,
      });
      const unit_amount = Math.round(item.price * 100);
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount,
        currency: 'usd',
      });
      // products.push({ price: price.id, quantity: item.quantity });
      return { price: price.id, quantity: item.quantity };
    })
  );
  if (products.length === 0) return res.json({ url: `${domain}?nocartitems=true` });

  const totalItems = products.reduce((acc, item) => acc + item.quantity, 0);
  const shippingPrice = totalItems > 2 ? (totalItems > 4 ? 2280 : 1710) : 1020;
  // const expressShippingPrice = totalItems > 2 ? (totalItems > 4 ? 35.35 : 32.05) : 2040;
  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: { allowed_countries: ['US'] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { currency: 'usd', amount: shippingPrice },
          display_name: 'USPS Priority Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
      // {
      //   shipping_rate_data: {
      //     type: 'fixed_amount',
      //     fixed_amount: { currency: 'usd', amount: expressShippingPrice },
      //     display_name: 'USPS Express Shipping',
      //     delivery_estimate: {
      //       minimum: { unit: 'business_day', value: 2 },
      //       maximum: { unit: 'business_day', value: 3 },
      //     },
      //   },
      // },
    ],
    line_items: products,
    mode: 'payment',
    success_url: `${domain}/api/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}/?canceled=true`,
    automatic_tax: { enabled: true },
  });

  res.json({ url: session.url });
}
