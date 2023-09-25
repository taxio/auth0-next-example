import React from 'react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Providers} from "./providers";
import {NavigationBar} from "@/components/shared/NavigationBar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth0 Example App',
  description: 'Example App of Auth0 + Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <NavigationBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
