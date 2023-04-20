import { Grid, Image, Rating, Divider, Button, Box, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Head from 'next/head';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { IconShoppingCartPlus } from '@tabler/icons';
import { Product as ProductTyping } from '../index';
import { addItem } from '../../redux/cartSlice';

export default function Product() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  async function addToCart(userId: string, productId: string) {
    const url = '/api/add-to-cart'; // Update this with the appropriate URL for your server-side route
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

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data } = useSWR('/api/products', fetcher);

  return (
    <Box py={10}>
      <Head>
        <meta charSet="utf-8" />

        <title>
          {data
            ? data
                .filter((element: ProductTyping) => element.id === id)
                .map((element: ProductTyping) => element.name)
                .toString()
            : 'Product Page'}
        </title>
      </Head>
      {data
        ? data
            .filter((element: ProductTyping) => element.id === id)
            .map((element: ProductTyping, index: number) => (
              <Grid key={element.name + index}>
                <Grid.Col span={12} sm={4}>
                  <Image src={element.url} withPlaceholder />
                </Grid.Col>
                <Grid.Col span={12} sm={6}>
                  <h1>{element.name}</h1>
                  <Rating />
                  <div>${element.price}</div>
                  <Divider />
                  <div>{element.description}</div>
                </Grid.Col>
                <Grid.Col span={12} sm={2}>
                  <div>${element.price}</div>
                  <Button
                    variant="gradient"
                    rightIcon={<IconShoppingCartPlus />}
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    onClick={() => {
                      addToCart(Cookies.get('userId') || '', element.id);
                      dispatch(addItem(element.id));
                      showNotification({
                        id: `${element.name}`,
                        icon: <Image src={element.url} />,
                        title: 'Item added Successfully',
                        message: `${element.name} has been added to Cart`,
                        color: 'white',
                      });
                    }}
                  >
                    <Text>Add to Cart</Text>
                  </Button>
                </Grid.Col>
              </Grid>
            ))
        : null}
    </Box>
  );
}
