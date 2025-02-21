'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Navbar from './Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
} 