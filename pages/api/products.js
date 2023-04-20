import { fetchProducts } from './firebase';

// import products from './data/products.json';

export default async function handler(req, res) {
  const products = await fetchProducts();

  res.status(200).json(products);
}
