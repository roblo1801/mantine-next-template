import admin from 'firebase-admin';

// import serviceAccount from './key.json';
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const productsRef = db.collection('Products');

const fetchProducts = async () => {
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

// import products from './data/products.json';

export default async function handler(req, res) {
  const products = await fetchProducts();

  res.status(200).json(products);
}
