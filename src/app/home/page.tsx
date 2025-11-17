'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    // Logique de déconnexion
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b">
        {/* Avatar et numéro */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            0
          </div>
          <span className="text-3xl font-bold">02</span>
        </div>

        {/* Matricule et déconnexion */}
        <div className="flex flex-col items-end gap-2">
          <div className="bg-[#8BC34A] text-white px-6 py-2 rounded-lg font-semibold">
            9bb338436b15
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-semibold text-lg hover:text-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="p-6">
        {/* Section Événement en cours */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-[#8BC34A]"></div>
            <h2 className="text-2xl font-bold">Événement en cours</h2>
          </div>

          {/* Carte état vide */}
          <div className="bg-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Image
                src="/mailbox-icon.svg"
                alt="Aucun événement"
                width={100}
                height={100}
                className="opacity-50"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-500 mb-2">
              Aucun événement en cours
            </h3>
            <p className="text-gray-400 text-lg">
              En attente d&apos;un événement actif
            </p>
          </div>
        </section>

        {/* Section Événements à venir */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-[#8BC34A]"></div>
            <h2 className="text-2xl font-bold">Événements à venir</h2>
            <span className="text-2xl">📅</span>
          </div>

          {/* Liste des événements */}
          <div className="space-y-4">
            {/* Carte événement */}
            <button
              onClick={() => router.push('/event/1')}
              className="w-full bg-white rounded-3xl shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow"
            >
              {/* Badge statut */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-[#8BC34A] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  À venir
                </span>
              </div>

              {/* Image de l'événement */}
              <div className="relative h-64 bg-gradient-to-br from-pink-400 to-purple-600">
                {/* Placeholder pour l'image - vous pouvez remplacer par une vraie image */}
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* Informations de l'événement */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-3">Test cashless</h3>
                <div className="flex items-center justify-center gap-2 text-gray-500">
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
                  <span className="text-lg">13 Nov 2025</span>
                </div>
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* Bouton flottant de rafraîchissement */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-[#8BC34A] rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-[#7CB342] transition-all hover:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
}

