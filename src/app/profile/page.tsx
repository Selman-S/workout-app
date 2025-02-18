'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  weeklyGoal: number;
  notifications: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: '',
      weight: 70,
      height: 170,
      age: 25,
      fitnessLevel: 'beginner',
      weeklyGoal: 5,
      notifications: true
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  // BMI hesaplama
  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    localStorage.setItem('userProfile', JSON.stringify(editedProfile));
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profil Ayarları
            </h1>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-2 rounded-lg text-white ${
                isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isEditing ? 'Kaydet' : 'Düzenle'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Kişisel Bilgiler
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İsim
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.name || 'İsimsiz'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kilo (kg)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile.weight}
                    onChange={(e) => setEditedProfile({...editedProfile, weight: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.weight} kg</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Boy (cm)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile.height}
                    onChange={(e) => setEditedProfile({...editedProfile, height: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.height} cm</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yaş
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile.age}
                    onChange={(e) => setEditedProfile({...editedProfile, age: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.age}</p>
                )}
              </div>
            </div>

            {/* Fitness Bilgileri */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fitness Bilgileri
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fitness Seviyesi
                </label>
                {isEditing ? (
                  <select
                    value={editedProfile.fitnessLevel}
                    onChange={(e) => setEditedProfile({...editedProfile, fitnessLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="beginner">Başlangıç</option>
                    <option value="intermediate">Orta</option>
                    <option value="advanced">İleri</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {profile.fitnessLevel === 'beginner' ? 'Başlangıç' :
                     profile.fitnessLevel === 'intermediate' ? 'Orta' : 'İleri'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Haftalık Antrenman Hedefi
                </label>
                {isEditing ? (
                  <select
                    value={editedProfile.weeklyGoal}
                    onChange={(e) => setEditedProfile({...editedProfile, weeklyGoal: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="3">3 gün</option>
                    <option value="4">4 gün</option>
                    <option value="5">5 gün</option>
                    <option value="6">6 gün</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.weeklyGoal} gün</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bildirimler
                </label>
                {isEditing ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedProfile.notifications}
                      onChange={(e) => setEditedProfile({...editedProfile, notifications: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Antrenman hatırlatıcıları</span>
                  </label>
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {profile.notifications ? 'Açık' : 'Kapalı'}
                  </p>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Vücut Kitle İndeksi (BMI)
                </h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {calculateBMI()}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {Number(calculateBMI()) < 18.5 ? 'Zayıf' :
                   Number(calculateBMI()) < 25 ? 'Normal' :
                   Number(calculateBMI()) < 30 ? 'Fazla Kilolu' : 'Obez'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 