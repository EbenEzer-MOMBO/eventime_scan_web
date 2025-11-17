'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Connexion:', { matricule, password });
    // Redirection vers la page d'accueil après connexion
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-[#8BC34A] flex flex-col items-center justify-between px-4 py-8">
      {/* Spacer pour pousser le contenu vers le centre */}
      <div className="flex-1"></div>
      
      {/* Carte de connexion */}
      <div className="w-full max-w-xl bg-[#E8E8E8] rounded-3xl shadow-2xl p-12 flex flex-col items-center">
        {/* Logo Eventime */}
        <div className="mb-12">
          <Image
            src="/logo-dark.png"
            alt="Eventime Logo"
            width={200}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Champ Matricule */}
          <input
            type="text"
            placeholder="votre matricule"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            className="w-full px-6 py-4 bg-white border-2 border-[#8BC34A] rounded-2xl text-gray-500 placeholder-gray-400 text-lg focus:outline-none focus:border-[#6B9E3E] transition-colors"
          />

          {/* Champ Mot de passe */}
          <input
            type="password"
            placeholder="votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-white border-2 border-[#8BC34A] rounded-2xl text-gray-500 placeholder-gray-400 text-lg focus:outline-none focus:border-[#6B9E3E] transition-colors"
          />

          {/* Bouton Connexion */}
          <button
            type="submit"
            className="w-full py-4 bg-[#8BC34A] text-white text-2xl font-bold rounded-2xl hover:bg-[#7CB342] transition-colors shadow-lg"
          >
            Connexion
          </button>
        </form>
      </div>

      {/* Spacer pour pousser le contenu vers le centre */}
      <div className="flex-1"></div>

      {/* Logo Eventime en bas */}
      <div className="mb-4">
        <Image
          src="/logo-light.png"
          alt="Eventime"
          width={180}
          height={50}
          className="object-contain"
        />
      </div>
    </div>
  );
}
