// layout.tsx
'use client';
import { Karla } from 'next/font/google';
import { useState } from 'react';
import Header from '../components/header';
import PageWrapper from '../components/pagewrapper';
import Sidebar from '../components/sidebar';
import './globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebaseConfig';
import SignInPage from './signin/page';

const karla = Karla({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-karla',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user] = useAuthState(auth); // Get user from useAuthState hook

  return (
    <html lang="en">
      <body className={karla.className}>
        {user ? ( // Render sidebar, header, and page wrapper only when user is signed in
          <div className="flex min-h-screen">
            <Sidebar></Sidebar>
            <Header></Header>
            <PageWrapper>{children}</PageWrapper>
          </div>
        ) : (
          <SignInPage />
        )}
      </body>
    </html>
  );
}
