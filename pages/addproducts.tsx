/* eslint-disable no-alert */
import { useState } from 'react';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [url, setUrl] = useState('');

  const handleFormSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const response = await fetch('/api/addproduct', {
      method: 'POST',
      body: JSON.stringify({ name, description, price, url }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      alert('Product added successfully');
    } else {
      alert('Product could not be added');
    }
    // setName('');
    // setDescription('');
    // setPrice(0);
    // setUrl('');
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name">
          Name:
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <br />
        <label htmlFor="desc">
          Description:
          <textarea
            value={description}
            id="desc"
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <br />
        <label htmlFor="price">
          Price:
          <input
            id="price"
            type="number"
            value={price}
            onChange={(event) => setPrice(parseFloat(event.target.value))}
          />
        </label>
        <br />
        <label htmlFor="url">
          Image URL:
          <input
            id="url"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
        <br />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
