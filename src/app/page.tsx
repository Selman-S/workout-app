'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              Workout App
            </div>
            <div className="space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-white hover:text-blue-100 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </nav>

        <main className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Kişisel Fitness Yolculuğunuzu Başlatın
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Profesyonel antrenman programları, ilerleme takibi ve kişiselleştirilmiş hedeflerle fitness hedeflerinize ulaşın.
              </p>
              <div className="space-x-4">
                <Link
                  href="/register"
                  className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Ücretsiz Başla
                </Link>
                <Link
                  href="/about"
                  className="inline-block px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg text-white">
                  <h3 className="text-xl font-semibold mb-2">Kişiselleştirilmiş Programlar</h3>
                  <p>Fitness seviyenize ve hedeflerinize uygun antrenman programları</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg text-white">
                  <h3 className="text-xl font-semibold mb-2">İlerleme Takibi</h3>
                  <p>Detaylı istatistikler ve görsellerle gelişiminizi izleyin</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg text-white">
                  <h3 className="text-xl font-semibold mb-2">Başarı Sistemi</h3>
                  <p>Hedeflerinize ulaştıkça başarılar kazanın</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg text-white">
                  <h3 className="text-xl font-semibold mb-2">Egzersiz Zamanlayıcı</h3>
                  <p>Set ve dinlenme sürelerinizi kolayca takip edin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Neden Workout App?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl text-white">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Hedef Odaklı</h3>
                <p>Kişisel hedeflerinizi belirleyin ve ilerlemenizi takip edin. Her adımda yanınızdayız.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl text-white">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Detaylı Analiz</h3>
                <p>Antrenman geçmişinizi, performansınızı ve gelişiminizi detaylı grafiklerle görüntüleyin.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl text-white">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Motivasyon</h3>
                <p>Başarılar ve rozetlerle motivasyonunuzu yüksek tutun, hedeflerinize daha hızlı ulaşın.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Fitness Yolculuğunuza Bugün Başlayın
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Ücretsiz hesap oluşturun ve hemen antrenmanlara başlayın.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Hemen Başla
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
