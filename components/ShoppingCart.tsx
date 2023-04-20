import { Indicator, Box, Image, Text, Loader } from '@mantine/core';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import { initializeCart } from '../redux/cartSlice';

export default function ShoppingCart() {
  const cartItems = useSelector((state: any) => state.cart.items);

  const dispatch = useDispatch();

  const fetcher = (url: string) =>
    fetch(url).then(async (res) => {
      const data = await res.json();
      if (Cookies.get('userId')) {
        dispatch(initializeCart(data));
      }
      return data;
    });

  const { data: cart, error, isLoading } = useSWR('/api/get-cart', fetcher, {});

  if (error) {
    return null;
  }
  if (isLoading) {
    return <Loader w={70} h={70} pos="fixed" right={0} top={0} />;
  }

  if (cart) {
    return (
      <Box pos="fixed" right={0} top={0}>
        <Link href={`/cart/${Cookies.get('userId') || 'null'}`} passHref>
          <Indicator
            color="green"
            position="bottom-start"
            offset={14}
            disabled={cartItems.length === 0}
            size={30}
            processing
            label={
              cartItems.length > 0 ? (
                <Text c="black">
                  {cartItems.reduce((acc: any, item: { quantity: any }) => acc + item.quantity, 0)}
                </Text>
              ) : null
            }
            bottom={0}
            left={0}
          >
            <Image alt="Cart" maw={70} mah={70} src="/cart.png" />
          </Indicator>
        </Link>
      </Box>
    );
  }
  return null;
}
