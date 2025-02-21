
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="relative pt-16">
        {/* Hero Section Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 mix-blend-overlay"></div>
          <Image
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1920"
            alt="Background"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', filter: 'brightness(0.4)' }}
            quality={75}
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
     

          <main className="py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-[fadeIn_0.6s_ease-out]">
                <h1 className="text-6xl sm:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                  Güçlü Ol,<br />
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-transparent bg-clip-text drop-shadow-2xl">
                    Formda Kal
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-300 mb-10 animate-[fadeIn_0.8s_ease-out] max-w-xl">
                  Profesyonel antrenörler tarafından hazırlanan kişisel programlarla hedeflerine ulaş.
                </p>
                <div className="relative group">
                  <Link
                    href="/register"
                    className="relative inline-block px-12 py-5 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-lg font-semibold rounded-lg hover:from-orange-400 hover:via-red-400 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    Hemen Başla
                  </Link>
                </div>
              </div>
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 group animate-[fadeIn_1s_ease-out]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <Image
                  src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200"
                  alt="Fitness Training"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-2xl group-hover:scale-110 transition-transform duration-700"
                  priority
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-xl overflow-hidden group hover:bg-gray-800/90 transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1.2s_ease-out]">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <Image
                    src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800"
                    alt="Personalized Programs"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-2">
                    Kişiselleştirilmiş Programlar
                  </h3>
                  <p className="text-gray-400">Vücut tipinize ve hedeflerinize özel antrenman planları</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-xl overflow-hidden group hover:bg-gray-800/90 transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1.2s_ease-out]">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <Image
                    src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800"
                    alt="Progress Tracking"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-2">
                    İlerleme Takibi
                  </h3>
                  <p className="text-gray-400">Gelişiminizi günlük olarak takip edin</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-xl overflow-hidden group hover:bg-gray-800/90 transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1.2s_ease-out]">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <Image
                    src="https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=800"
                    alt="Achievement System"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-2">Başarı Sistemi</h3>
                  <p className="text-gray-400">Her adımda yeni başarılar kazanın</p>
                </div>
              </div>
            </div>

            {/* Program Özellikleri */}
            <div className="mt-32">
              <h2 className="text-4xl font-bold text-white text-center mb-16">
                Program <span className="text-orange-500">Özellikleri</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Detaylı Program</h3>
                  <p className="text-gray-400">Her gün için özel hazırlanmış egzersiz planları</p>
                </div>
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Zaman Yönetimi</h3>
                  <p className="text-gray-400">Programınıza uygun antrenman süreleri</p>
                </div>
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">İlerleme Analizi</h3>
                  <p className="text-gray-400">Haftalık ve aylık gelişim raporları</p>
                </div>
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Video Kütüphanesi</h3>
                  <p className="text-gray-400">Tüm egzersizler için detaylı eğitim videoları</p>
                </div>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="mt-32 bg-gray-900/80 rounded-2xl p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
                  <p className="text-gray-300">Egzersiz</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
                  <p className="text-gray-300">Aktif Üye</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
                  <p className="text-gray-300">Program</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
                  <p className="text-gray-300">Memnuniyet</p>
                </div>
              </div>
            </div>

            {/* Egzersiz Kategorileri */}
            <div className="mt-32">
              <h2 className="text-4xl font-bold text-white text-center mb-16">
                Egzersiz <span className="text-orange-500">Kategorileri</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative h-80 rounded-xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800"
                    alt="Strength Training"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">Güç Antrenmanı</h3>
                      <p className="text-gray-300">Kas kütlesi ve güç geliştirme</p>
                    </div>
                  </div>
                </div>
                <div className="relative h-80 rounded-xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=800"
                    alt="Cardio Training"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">Kardiyo</h3>
                      <p className="text-gray-300">Dayanıklılık ve yağ yakımı</p>
                    </div>
                  </div>
                </div>
                <div className="relative h-80 rounded-xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=800"
                    alt="Flexibility Training"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">Esneklik</h3>
                      <p className="text-gray-300">Mobilite ve esneklik geliştirme</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SSS */}
            <div className="mt-32">
              <h2 className="text-4xl font-bold text-white text-center mb-16">
                Sıkça Sorulan <span className="text-orange-500">Sorular</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-3">Ne sıklıkta antrenman yapmalıyım?</h3>
                  <p className="text-gray-400">Hedeflerinize ve fitness seviyenize göre haftada 3-6 gün antrenman yapmanızı öneriyoruz. Program başlangıcında sizin için en uygun programı belirleyeceğiz.</p>
                </div>
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-3">Özel ekipmana ihtiyacım var mı?</h3>
                  <p className="text-gray-400">Programlarımız hem ev hem de spor salonu için uyarlanabilir. Başlangıç seviyesi için minimal ekipman yeterlidir.</p>
                </div>
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-3">Ne kadar sürede sonuç alabilirim?</h3>
                  <p className="text-gray-400">Düzenli antrenman ve beslenme programı ile 4-8 hafta içinde gözle görülür değişimler başlar. Herkesin genetik yapısı farklı olduğu için sonuçlar kişiden kişiye değişebilir.</p>
                </div>
                <div className="bg-gray-900/80 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-3">Beslenme desteği alabilir miyim?</h3>
                  <p className="text-gray-400">Evet, programınıza ek olarak hedeflerinize uygun beslenme önerileri de sunuyoruz. Detaylı beslenme planı için uzman diyetisyenlerimizle çalışabilirsiniz.</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-32 text-center relative">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=1920"
                  alt="CTA Background"
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover', filter: 'brightness(0.3)' }}
                  className="rounded-2xl"
                />
              </div>
              <div className="relative z-10 py-20 rounded-2xl">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Değişim İçin <span className="text-orange-500">Harekete Geç</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Profesyonel antrenman programları ve beslenme tavsiyeleriyle hedeflerine ulaş.
                </p>
                <Link
                  href="/register"
                  className="inline-block px-8 py-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Şimdi Başla
                </Link>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-32 bg-gray-900/80 backdrop-blur-lg rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Başarı Hikayeleri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1534368420009-621bfab424a8?auto=format&fit=crop&w=150"
                      alt="User 1"
                      fill
                      sizes="96px"
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                    />
                  </div>
                  <p className="text-gray-300 italic mb-4">"3 ayda vücut yağ oranımı %15 düşürdüm!"</p>
                  <p className="text-orange-500 font-semibold">Ahmet Y.</p>
                </div>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=150"
                      alt="User 2"
                      fill
                      sizes="96px"
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                    />
                  </div>
                  <p className="text-gray-300 italic mb-4">"Kas kütlemi artırırken formumu da korudum."</p>
                  <p className="text-orange-500 font-semibold">Ayşe K.</p>
                </div>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150"
                      alt="User 3"
                      fill
                      sizes="96px"
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                    />
                  </div>
                  <p className="text-gray-300 italic mb-4">"Artık daha enerjik ve güçlüyüm!"</p>
                  <p className="text-orange-500 font-semibold">Mehmet S.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
