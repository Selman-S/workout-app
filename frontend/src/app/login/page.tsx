'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Email formatını kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Geçerli bir email adresi giriniz');
      }

      // Şifre kontrolü
      if (userData.password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }
      await login(userData.email, userData.password);
      router.push('/workout');
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 mix-blend-overlay"></div>
        <Image
          src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1920"
          alt="Background"
          fill
          sizes="100vw"
          style={{ 
            objectFit: 'cover', 
            filter: 'brightness(0.3)'
          }}
          quality={75}
          priority
        />
      </div>

   
      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Tekrar Hoş Geldiniz! 👋<br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-transparent bg-clip-text">
              Giriş Yapın
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-[fadeIn_0.8s_ease-out]">
            Antrenman planınıza devam etmek için giriş yapın.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-100 animate-[fadeIn_0.3s_ease-out]">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-[fadeIn_1s_ease-out]">
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              {/* Şifre */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-lg font-semibold rounded-lg hover:from-orange-400 hover:via-red-400 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>

          <div className="text-center text-gray-400">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-orange-500 hover:text-orange-400 transition-colors">
              Kayıt Olun
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 