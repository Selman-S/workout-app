'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

interface FitnessGoal {
  id: string;
  title: string;
  description: string;
}

const fitnessGoals: FitnessGoal[] = [
  {
    id: 'weight-loss',
    title: 'Kilo Vermek',
    description: 'Yağ yakımı odaklı antrenmanlar'
  },
  {
    id: 'muscle-gain',
    title: 'Kas Kazanmak',
    description: 'Güç ve kas kütlesi artışı odaklı antrenmanlar'
  },
  {
    id: 'endurance',
    title: 'Dayanıklılık Kazanmak',
    description: 'Kardiyo ve dayanıklılık odaklı antrenmanlar'
  },
  {
    id: 'general-fitness',
    title: 'Genel Sağlık',
    description: 'Dengeli ve genel fitness odaklı antrenmanlar'
  }
];

const experienceLevels = [
  { id: 'beginner', title: 'Yeni Başlayan', description: 'Düzenli spor yapmıyorum' },
  { id: 'intermediate', title: 'Orta Seviye', description: 'Ara sıra spor yapıyorum' },
  { id: 'advanced', title: 'İleri Seviye', description: 'Düzenli spor yapıyorum' }
];

export default function OnboardingStep3() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    fitnessLevel: '',
    daysPerWeek: '3'
  });
  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      setUserData(prevData => ({ ...prevData, ...JSON.parse(savedData) }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!userData.goal || !userData.fitnessLevel) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      // Convert string values to numbers
      const userDataToSubmit = {
        ...userData,
        age: parseInt(userData.age),
        weight: parseInt(userData.weight),
        height: parseInt(userData.height),
        daysPerWeek: parseInt(userData.daysPerWeek)
      };

      await authService.createUser(userDataToSubmit);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-700">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Son Adım! 🎯
          </h1>
          <p className="text-emerald-100">
            Hedeflerinizi belirleyelim ve size özel programınızı oluşturalım.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-100">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Fitness Hedefi */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Fitness Hedefleriniz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setUserData({ ...userData, goal: goal.id })}
                  className={`p-4 rounded-lg text-left transition-all ${
                    userData.goal === goal.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <h3 className="font-medium mb-1">{goal.title}</h3>
                  <p className={`text-sm ${
                    userData.goal === goal.id ? 'text-orange-100' : 'text-emerald-100'
                  }`}>
                    {goal.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Deneyim Seviyesi */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Deneyim Seviyeniz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setUserData({ ...userData, fitnessLevel: level.id })}
                  className={`p-4 rounded-lg text-left transition-all ${
                    userData.fitnessLevel === level.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <h3 className="font-medium mb-1">{level.title}</h3>
                  <p className={`text-sm ${
                    userData.fitnessLevel === level.id ? 'text-orange-100' : 'text-emerald-100'
                  }`}>
                    {level.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Haftalık Antrenman Günü */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Haftada Kaç Gün Antrenman Yapmak İstersiniz?</h2>
            <select
              value={userData.daysPerWeek}
              onChange={(e) => setUserData({ ...userData, daysPerWeek: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-emerald-200/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
            >
              <option value="3">3 gün / hafta</option>
              <option value="4">4 gün / hafta</option>
              <option value="5">5 gün / hafta</option>
              <option value="6">6 gün / hafta</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Program Oluşturuluyor...' : 'Programımı Oluştur'}
          </button>
        </form>
      </div>
    </div>
  );
} 