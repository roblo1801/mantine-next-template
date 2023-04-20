import { Image, Center, Loader, Button, Group, MediaQuery, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { showNotification } from '@mantine/notifications';
import useSWR from 'swr';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IconShoppingCartPlus } from '@tabler/icons-react';
import { addItem } from '../redux/cartSlice';
import styles from './index.module.css';

export type CartItem = {
  id: string;
  quantity: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  url: string;
};

export type Api = {
  name: string;
  url: string;
  price: number;
  description: string;
  id: string;
  quantity: number;
};

export default function Content() {
  const dispatch = useDispatch();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: products } = useSWR('/api/products', fetcher);

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

  return (
    <Group position="center" my={20}>
      {products ? (
        products.map((element: Product) => (
          <Stack key={element.name} className={styles.box}>
            <Center>
              <MediaQuery smallerThan="md" styles={{ width: 150 }}>
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Link href={`/product/${element.id}`} passHref className={styles.link}>
                    <Image
                      key={element.name}
                      alt={element.name}
                      src={element.url}
                      fit="scale-down"
                      maw={300}
                      radius="xs"
                      withPlaceholder
                    />
                  </Link>
                </motion.div>
              </MediaQuery>
            </Center>
            <Link href={`/product/${element.id}`} passHref className={styles.link}>
              <Center>
                {element.name.length < 18 ? element.name : `${element.name.substring(0, 17)}...`}
              </Center>
              <Center className={styles.bold}>${element.price}</Center>
            </Link>
            <Center>
              <Button
                uppercase
                rightIcon={<IconShoppingCartPlus />}
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
                variant="gradient"
                gradient={{ from: 'yellow', to: 'orange', deg: 45 }}
              >
                Add to Cart
              </Button>
            </Center>
          </Stack>
        ))
      ) : (
        <Loader />
      )}
    </Group>
  );
}
