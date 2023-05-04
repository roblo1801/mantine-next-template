import { Box, Text } from '@mantine/core';
// import { getCookie, hasCookie, setCookie } from 'cookies-next';
import Cookies from 'js-cookie';
import { db } from '../pages/api/firebase';
// import Link from 'next/link';
// import { useDispatch, useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { getCookie } from 'cookies-next';
// import { initializeCart } from '../redux/cartSlice';

export default function ShoppingCart({ cart }: any) {
  return (
    <Box pos="fixed" right={0} top={0}>
      <Text>{cart.items.length}</Text>
    </Box>
  );

  // const cartItems = useSelector((state: any) => state.cart.items);

  // const dispatch = useDispatch();

  // if (cartItems.length === 0) {
  //   return null;
  // }

  // return (
  //   <Box pos="fixed" right={0} top={0}>
  //     <Link href={`/cart/${getCookie('userId') || 'null'}`} passHref>
  //       <Indicator
  //         color="green"
  //         position="bottom-start"
  //         offset={14}
  //         disabled={cart.items.length === 0}
  //         size={30}
  //         processing
  //         label={
  //           cart.items.length > 0 ? (
  //             <Text c="black">
  //               {cart.items.reduce((acc: any, item: { quantity: any }) => acc + item.quantity, 0)}
  //             </Text>
  //           ) : null
  //         }
  //         bottom={0}
  //         left={0}
  //       >
  //         <Image alt="Cart" maw={70} mah={70} src="/cart.png" />
  //       </Indicator>
  //     </Link>
  //   </Box>
  // );
}

export async function getServerSideProps() {
  const userId = Cookies.get('userId');

  if (Cookies.get('userId')) {
    const cartRef = db.collection('carts').doc();
    Cookies.set('userId', cartRef.id);
    await cartRef.set({ items: [] });
    // console.log('Cart created successfully with UserID:', userId);
    return {
      props: {
        cart: {
          items: [],
        },
      },
    };
  }

  if (Cookies.get('userId') && userId) {
    const cartRef = db.collection('carts').doc(userId);
    const cart = await cartRef.get();
    const cartData = cart.data();
    const cartItems = cartData?.items;

    return {
      props: {
        cart: cartItems,
      },
    };
  }
  return null;
}
