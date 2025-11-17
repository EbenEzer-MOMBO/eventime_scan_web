'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ScannerPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  // Simuler un scan après 2 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simuler aléatoirement un ticket déjà validé (30% de chances)
      const isAlreadyValidated = Math.random() < 0.3;
      
      if (isAlreadyValidated) {
        router.push('/ticket-already-validated');
      } else {
        router.push('/ticket-success');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="text-white hover:scale-110 transition-transform"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-white text-xl font-semibold">Scanner QR Code</h1>
        <div className="w-10"></div> {/* Spacer pour centrer le titre */}
      </div>

      {/* Zone de scan */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md aspect-square">
          {/* Cadre de scan */}
          <div className="absolute inset-0 border-4 border-[#8BC34A] rounded-3xl">
            {/* Coins du scanner */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-white rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-white rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-white rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-white rounded-br-3xl"></div>
          </div>

          {/* Icône QR Code au centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="white"
              className="w-32 h-32 opacity-30"
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
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 text-center">
        <p className="text-white text-lg mb-2">
          Positionnez le QR code dans le cadre
        </p>
        <p className="text-gray-400">
          Le scan se fera automatiquement
        </p>
      </div>
    </div>
  );
}

