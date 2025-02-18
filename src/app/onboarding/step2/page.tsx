'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingStep2() {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
  });
  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      setUserData(prevData => ({ ...prevData, ...JSON.parse(savedData) }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userData', JSON.stringify(userData));
    router.push('/onboarding/step3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-700">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Merhaba {userData.name}! 🎯
          </h1>
          <p className="text-emerald-100">
            Size en uygun antrenman programını oluşturabilmemiz için birkaç bilgiye ihtiyacımız var.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6 shadow-lg">
          <div>
            <label className="block text-white mb-2">Yaşınız</label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => setUserData({ ...userData, age: e.target.value })}
              placeholder="Yaş"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-emerald-200/20 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              required
              min="13"
              max="100"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Kilonuz (kg)</label>
            <input
              type="number"
              value={userData.weight}
              onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
              placeholder="Kilo"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-emerald-200/20 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              required
              min="30"
              max="200"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Boyunuz (cm)</label>
            <input
              type="number"
              value={userData.height}
              onChange={(e) => setUserData({ ...userData, height: e.target.value })}
              placeholder="Boy"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-emerald-200/20 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              required
              min="120"
              max="250"
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            Devam Et
          </button>
        </form>
      </div>
    </div>
  );
} 