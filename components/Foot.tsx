import { Image, Group, Text, Divider } from '@mantine/core';
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import Link from 'next/link';
import { AnimateKeyframes } from 'react-simple-animate';

function Foot() {
  return (
    <AnimateKeyframes
      play
      duration={5}
      delay={0}
      iterationCount="infinite"
      direction="alternate"
      keyframes={[
        'background-color: #264653;',
        'background-color: #2a9d8f',
        'background-color: #e9c46a',
        'background-color: #f4a261',
        'background-color: #e76f51',
      ]}
      easeType="cubic-bezier(0.445, 0.05, 0.55, 0.95)"
    >
      <Group sx={{ height: '60px' }} px={10} position="apart">
        <Text size={30} ff="VT323">
          TOY HAVEN
        </Text>
        <Image height={60} maw={80} fit="cover" src="/stripelogo.svg" />
        <Group position="center" className="logo" style={{ height: '100%' }}>
          <Link href="https://instagram.com/toyhavenllc" passHref>
            <IconBrandInstagram size={30} />
          </Link>
          <Link href="https://facebook.com/toyhavenllc" passHref>
            <IconBrandFacebook size={30} />
          </Link>
        </Group>
      </Group>
      <Divider w="80%" m="auto" color="black" />
      <Group sx={{ height: '60px' }} px={10} position="apart">
        <Text size={20} ff="VT323">
          <Link href="mailto:toyhaven@mernguru.com" target="_blank">
            CONTACT
          </Link>
        </Text>
        <Text size={20} ff="VT323">
          ABOUT
        </Text>
        <Text size={20} ff="VT323">
          TERMS
        </Text>
        <Text size={20} ff="VT323">
          PRIVACY
        </Text>
      </Group>
      <Divider w="80%" m="auto" color="black" />
      <Group sx={{ height: '60px' }} px={10} position="center">
        <Text size={20} ff="VT323">
          © 2023 TOY HAVEN LLC
        </Text>
      </Group>
    </AnimateKeyframes>
  );
}

export default Foot;
