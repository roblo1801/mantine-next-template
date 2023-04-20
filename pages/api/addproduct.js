import { addProduct } from './firebase';

export default async function handler(req, res) {
  const products = await addProduct(req.body);
  if (products) {
    res.status(200).json('Product added successfully!');
  } else {
    res.status(400).json('Error adding product');
  }
}
