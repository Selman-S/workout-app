'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>
    <Navbar />
    {children}
    </AuthProvider>;
} 