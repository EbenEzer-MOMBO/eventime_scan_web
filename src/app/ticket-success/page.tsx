'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ValidationService } from '@/services';
import type { TicketValidationResponse } from '@/services/types';

export default function TicketSuccessPage() {
  const router = useRouter();
  const [ticketData, setTicketData] = useState<TicketValidationResponse | null>(null);

  useEffect(() => {
    // Récupérer les données du ticket depuis localStorage
    const storedTicket = localStorage.getItem('scanned_ticket');
    if (storedTicket) {
      try {
        const data = JSON.parse(storedTicket);
        setTicketData(data);
      } catch (error) {
        console.error('Erreur lors du parsing des données du ticket:', error);
      }
    }
  }, []);

  const handleContinueScan = () => {
    // Retour vers le scanner
    router.push('/scanner');
  };

  return (
    <div className="min-h-screen bg-[#8BC34A] flex flex-col">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Carte de succès */}
        <div className="w-full max-w-xl bg-[#E8E8E8] rounded-3xl shadow-2xl p-8 flex flex-col items-center">
          {/* Logo Eventime */}
          <div className="mb-6">
            <Image
              src="/logo-dark.png"
              alt="Eventime Logo"
              width={200}
              height={60}
              priority
              className="object-contain"
            />
          </div>

          {/* Message de succès */}
          <h1 className="text-2xl font-bold text-[#8BC34A] text-center mb-8">
            Ticket validé avec succès
          </h1>

          {/* Carte d'informations du ticket */}
          {ticketData && ticketData.data ? (
            <div className="w-full bg-white rounded-2xl shadow-md p-6 mb-8 space-y-4">
              {/* Ticket */}
              <div className="flex items-start gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3v.75M9.75 3h4.5m-4.5 15h4.5M12 3v18"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-semibold mb-1">Ticket</p>
                  <p className="text-black font-bold text-lg">{ticketData.data.ticketNumber}</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Participant */}
              <div className="flex items-start gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-semibold mb-1">Participant</p>
                  <p className="text-black font-bold text-lg">
                    {ValidationService.getParticipantName(ticketData.data)}
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Email */}
              <div className="flex items-start gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-semibold mb-1">Email</p>
                  <p className="text-black font-bold text-lg break-all">
                    {ticketData.data.participantEmailAddress}
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Statut */}
              <div className="flex items-start gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-semibold mb-1">Statut</p>
                  <p className="text-black font-bold text-lg">Validé</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-white rounded-2xl shadow-md p-6 mb-8">
              <p className="text-center text-gray-500">Chargement des données...</p>
            </div>
          )}

          {/* Bouton Continuer à scanner */}
          <button
            onClick={handleContinueScan}
            className="w-full py-4 bg-[#8BC34A] text-white text-xl font-bold rounded-2xl hover:bg-[#7CB342] transition-colors shadow-lg flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-7 h-7"
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
            Continuer à scanner
          </button>
        </div>
      </div>

      {/* Message en bas */}
      <div className="bg-[#8BC34A] text-white text-center py-6 font-bold text-xl">
        Ticket validé avec succès
      </div>
    </div>
  );
}

