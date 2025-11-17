'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TicketValidationPage() {
  const router = useRouter();

  const handleContinueScan = () => {
    // Retour vers le scanner
    router.push('/scanner');
  };

  return (
    <div className="min-h-screen bg-[#8BC34A] flex flex-col items-center justify-between px-4 py-8">
      {/* Spacer pour centrer le contenu */}
      <div className="flex-1"></div>

      {/* Carte de confirmation */}
      <div className="w-full max-w-xl bg-[#E8E8E8] rounded-3xl shadow-2xl p-12 flex flex-col items-center">
        {/* Logo Eventime */}
        <div className="mb-8">
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

        {/* Bouton Continuer à scanner */}
        <button
          onClick={handleContinueScan}
          className="w-full py-4 bg-[#8BC34A] text-white text-2xl font-bold rounded-2xl hover:bg-[#7CB342] transition-colors shadow-lg"
        >
          Continuer a scanner
        </button>
      </div>

      {/* Spacer pour centrer le contenu */}
      <div className="flex-1"></div>

      {/* Message en bas */}
      <div className="text-white text-2xl font-bold text-center mb-4">
        Ticket validé avec succès
      </div>
    </div>
  );
}

