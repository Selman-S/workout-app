'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingStep1() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Save to localStorage for now
      localStorage.setItem('userData', JSON.stringify({ name }));
      router.push('/onboarding/step2');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Hoş Geldiniz! 👋
          </h1>
          <p className="text-blue-100">
            Size nasıl hitap etmemizi istersiniz?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Devam Et
          </button>
        </form>
      </div>
    </div>
  );
} 