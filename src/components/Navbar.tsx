'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import authService from '@/services/authService';

interface User {
  name: string;
  hasCompletedOnboarding: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="relative z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold flex items-center"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-red-600">
              Fit<span className="text-white">Life</span>
            </span>
          </Link>

          {/* Mobil menü butonu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Menüyü aç</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Masaüstü menü */}
          <div className="hidden md:flex items-center space-x-6">
            {!loading && (user ? (
              <>
                <Link 
                  href="/workout" 
                  className="relative group"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
                  <span className={`${isActive('/workout') ? 'text-orange-500' : 'text-white'} group-hover:text-orange-500 transition-colors`}>
                    Antrenman
                  </span>
                </Link>
                <Link 
                  href="/profile" 
                  className="relative group"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
                  <span className={`${isActive('/profile') ? 'text-white' : 'text-gray-300'} group-hover:text-white transition-colors`}>
                    Profil
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative group px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500/0 via-red-500/0 to-red-600/0 group-hover:from-orange-500/10 group-hover:via-red-500/10 group-hover:to-red-600/10 rounded-lg transition-all duration-300"></span>
                  <span className="relative text-gray-300 group-hover:text-white transition-colors">
                    Çıkış Yap
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/register"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kayıt Ol
                </Link>
                <Link
                  href="/login"
                  className="relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-orange-400 hover:via-red-400 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="relative z-10">Giriş Yap</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 space-y-3">
              {!loading && (user ? (
                <>
                  <Link
                    href="/workout"
                    className={`block px-4 py-2 rounded-lg ${
                      isActive('/workout') 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Antrenman
                  </Link>
                  <Link
                    href="/profile"
                    className={`block px-4 py-2 rounded-lg ${
                      isActive('/profile')
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:text-white"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                  <Link
                    href="/login"
                    className="block px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                </>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar; 