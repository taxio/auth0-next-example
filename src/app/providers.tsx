'use client';

import React from 'react';

import {UserProvider} from '@auth0/nextjs-auth0/client';
import {ChakraProvider} from '@chakra-ui/react';
import {CacheProvider} from '@chakra-ui/next-js';

import {theme} from '@/styles';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <UserProvider>
          {children}
        </UserProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
