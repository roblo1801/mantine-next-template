import { Box, Button, Center, Grid, Text, Image, Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Product, initializeCart, CartState, removeAll } from '../../redux/cartSlice';

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();

  async function removeFromCart(userId: string, productId: string) {
    const url = '/api/remove-from-cart'; // Update this with the appropriate URL for your server-side route
    const requestBody = {
      userId,
      id: productId,
    };

    try {
      const response = await axios.post(url, requestBody);

      return response.data;
    } catch (error) {
      // console.log(error);
    }
    return null;
  }

  const [transmitting, setTransmitting] = useState(false);
  const cartItems = useSelector((state: { cart: CartState }) => state.cart.items);
  const { userId, cartUpdated } = router.query;

  if (!userId) {
    return <Box>Something went wrong. Make sure you have cookies enabled to use this site</Box>;
  }

  const productFetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: products } = useSWR('/api/products', productFetcher);

  const cartFetcher = (url: string) =>
    fetch(url).then(async (res) => {
      const data = await res.json();
      dispatch(initializeCart(data));
      return data;
    });

  const { data: cart, error, isLoading } = useSWR('/api/get-cart', cartFetcher, {});

  if (error) {
    return <Box>Error</Box>;
  }

  if (isLoading) {
    return (
      <Center py={10}>
        <Loader />
      </Center>
    );
  }

  if (!products) {
    return <Loader />;
  }

  const cartItemsArray = cartItems.map((element: { id: string; quantity: any }) => {
    const product = products.find((prod: Product) => prod.id === element.id);
    if (!product) {
      return {
        id: element.id,
        quantity: element.quantity,
        name: 'Product Not Found',
        price: 0,
        description: 'Product Not Found',
        url: '',
      };
    }

    return { ...product, quantity: element.quantity };
  });

  const total = cartItemsArray.reduce(
    (acc: number, item: { quantity: number; price: number }) => acc + item.quantity * item.price,
    0
  );

  const checkOut = async () => {
    setTransmitting(true);
    const res = await axios.post(
      '/api/create-checkout-session',
      {
        items: cartItemsArray,
      },
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
    const body = await res.data;
    window.location.href = body.url;
  };

  if (cart) {
    return (
      <Grid py={10}>
        <Grid.Col span={12} sm={12} md={12} lg={12}>
          <Text size={30} weight={800}>
            Shopping Cart
          </Text>
        </Grid.Col>
        <Grid.Col span={12} sm={12} md={12} lg={12}>
          <Text size={20} weight={400}>
            {cartItemsArray.length} items
          </Text>
          <Text size={20} weight={800} color="red">
            {cartUpdated === 'true' ? 'Cart Updated to reflect inventory' : ''}
          </Text>
        </Grid.Col>
        <Grid.Col span={12} sm={8} md={8} lg={8}>
          {cartItemsArray.length > 0 ? (
            cartItemsArray.map((element, index) => (
              <Grid
                m="xs"
                style={{ border: '1px solid grey' }}
                columns={5}
                key={element.id + String(index)}
              >
                <Grid.Col span={1}>
                  <Link href={`/product/${element.id}`} passHref>
                    <Image src={element.url} />
                  </Link>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Text weight={800}>{element.name}</Text>

                  <Button
                    onClick={() => {
                      removeFromCart(Cookies.get('userId') || '', element.id);

                      dispatch(removeAll(element.id));
                    }}
                    leftIcon="❌"
                    variant="filled"
                    color="red"
                  >
                    Remove from Cart
                  </Button>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Center>
                    <Text>${element.price}</Text>
                  </Center>
                  <Text>Quantity {element.quantity}</Text>
                </Grid.Col>
              </Grid>
            ))
          ) : (
            <Text size={20} weight={800}>
              Your Cart is Empty
            </Text>
          )}
        </Grid.Col>
        <Grid.Col span={12} sm={4} md={4} lg={4} ta="center">
          <Text size={20} weight={400}>
            Total ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items): $
            {total.toFixed(2)}
          </Text>
          {transmitting ? (
            <Text>Transmitting...</Text>
          ) : (
            <Button onClick={checkOut}>Checkout</Button>
          )}
        </Grid.Col>
      </Grid>
    );
  }

  return <Box>Something went wrong. Make sure you have cookies enabled to use this site</Box>;
}
