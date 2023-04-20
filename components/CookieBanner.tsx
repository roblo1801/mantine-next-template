// components/CookieBanner.tsx

import React, { useState } from 'react';
import { Button, Container, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Cookies from 'js-cookie';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(Cookies.get('cookies-accepted') === 'true');

  const handleAccept = () => {
    Cookies.set('cookies-accepted', 'true', { expires: 1 });
    setShowBanner(false);
    showNotification({
      title: 'Cookies Accepted',
      message: 'Thank you for accepting cookies.',
      color: 'teal',
    });
  };

  return showBanner ? (
    <Container
      p="sm"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        zIndex: 999,
      }}
    >
      <Text align="center">
        This website uses cookies to ensure you get the best experience on our website. By
        continuing to use our site, you consent to our{' '}
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="/cookie-policy" target="_blank" rel="noopener noreferrer">
          Cookie Policy
        </a>
        .
      </Text>
      <Button fullWidth mt="sm" onClick={handleAccept} style={{ display: 'block', margin: 'auto' }}>
        Accept
      </Button>
    </Container>
  ) : null;
};

export default CookieBanner;
