'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EventDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'description' | 'participants'>('description');

  const handleBack = () => {
    router.back();
  };

  const handleScan = () => {
    // Redirection vers la page scanner
    router.push('/scanner');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image de l'événement avec header */}
      <div className="relative h-[450px] bg-gradient-to-br from-pink-400 to-purple-600 overflow-hidden">
        {/* Image de fond - vous pouvez remplacer par une vraie image */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Bouton retour */}
        <button 
          onClick={handleBack}
          className="absolute top-6 left-6 z-20 text-white hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Badge participants */}
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-[#8BC34A] text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg">
            Participant(s): 13
          </div>
        </div>
      </div>

      {/* Titre de l'événement */}
      <div className="bg-[#8BC34A] text-white text-center py-6 px-6">
        <h1 className="text-3xl font-bold">Test cashless</h1>
      </div>

      {/* Onglets */}
      <div className="flex bg-gray-100 mx-4 mt-6 rounded-2xl overflow-hidden">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${
            activeTab === 'description'
              ? 'bg-[#8BC34A] text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${
            activeTab === 'participants'
              ? 'bg-[#8BC34A] text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          Participants
        </button>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="space-y-6">
            {/* Titre section */}
            <h2 className="text-3xl font-bold text-[#8BC34A] text-center mb-6">
              DESCRIPTION
            </h2>

            {/* Description */}
            <div className="space-y-4 text-base leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="text-2xl">🔥🎉</span>
                <span className="flex-1">
                  <strong>Fêtez en toute liberté avec &quot;Test Cashless&quot;!</strong> 🎉🔥
                </span>
              </p>

              <p className="text-justify">
                <span className="text-xl">👋</span> Bonjour, chers passionnés de fête! Le Gabon regorge de talents et d&apos;ambiances inoubliables, et c&apos;est exactement ce que nous vous proposons avec notre événement &quot;Test Cashless&quot;! 🥳🎶
              </p>

              <p className="text-justify">
                Plongez dans une aventure festive unique et dynamique où les activités variées et la musique envoûtante vous transporteront dans un univers de joie et de célébration. 🎊✨
              </p>

              <p className="text-justify">
                Que vous soyez amateur de danse, de musique live ou simplement à la recherche d&apos;une soirée mémorable entre amis, &quot;Test Cashless&quot; est l&apos;événement qu&apos;il vous faut! 💃🕺
              </p>

              <p className="flex items-start gap-2">
                <span className="text-2xl">📅</span>
                <span className="flex-1">
                  <strong>Date:</strong> [Insérer la date de l&apos;événement]
                </span>
              </p>

              <p className="flex items-start gap-2">
                <span className="text-2xl">📍</span>
                <span className="flex-1">
                  <strong>Lieu:</strong> [Insérer le lieu de l&apos;événement]
                </span>
              </p>

              <p className="text-justify">
                Ne manquez pas cette occasion de vivre des moments inoubliables et de créer des souvenirs impérissables. Réservez votre place dès maintenant et préparez-vous à faire la fête comme jamais! 🎟️🎈
              </p>

              <p className="text-center font-bold text-lg mt-6">
                On vous attend nombreux pour célébrer ensemble! 🥂🎆
              </p>

              <p className="text-center text-gray-600 italic">
                #TestCashless #FêteAuGabon #MusiqueLive #SoiréeMémorable
              </p>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-6 pb-24">
            {/* Header participants avec compteur */}
            <div className="bg-[#8BC34A] rounded-3xl p-6 flex items-center justify-center gap-6">
              <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              
              <div className="text-center text-white">
                <div className="text-5xl font-bold">13</div>
                <div className="text-xl font-semibold">Participants</div>
              </div>

              <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Liste des participants */}
            <div className="space-y-4">
              {/* Participant 1 */}
              <div className="bg-white border-2 border-orange-200 rounded-3xl p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  Y
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    <span className="font-bold text-lg truncate">YITOU Re...</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3v.75M9.75 3h4.5m-4.5 15h4.5M12 3v18"
                      />
                    </svg>
                    <span className="text-gray-600 truncate">ticket_639....</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    <span className="text-gray-600 truncate">rebec23ca@...</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    <span className="text-gray-600 truncate">Yitou Rebecca</span>
                  </div>
                </div>

                <div className="bg-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  En attente
                </div>
              </div>

              {/* Participant 2 */}
              <div className="bg-white border-2 border-orange-200 rounded-3xl p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  Y
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    <span className="font-bold text-lg truncate">YITOU Yi...</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3v.75M9.75 3h4.5m-4.5 15h4.5M12 3v18"
                      />
                    </svg>
                    <span className="text-gray-600 truncate">ticket_638....</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    <span className="text-gray-600 truncate">rebec23ca@...</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    <span className="text-gray-600 truncate">Yitou Rebecca</span>
                  </div>
                </div>

                <div className="bg-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  En attente
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton flottant Scanner QR */}
      <button 
        onClick={handleScan}
        className="fixed bottom-8 right-1/2 transform translate-x-1/2 w-20 h-20 bg-[#8BC34A] rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-[#7CB342] transition-all hover:scale-110 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
          />
        </svg>
      </button>
    </div>
  );
}

