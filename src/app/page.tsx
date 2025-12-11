'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthService } from '@/services';

export default function Home() {
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const agentData = AuthService.getAgentData();
    if (agentData) {
      console.log('✅ [ROOT] Utilisateur déjà connecté, redirection vers /home');
      router.push('/home');
    } else {
      console.log('ℹ️ [ROOT] Utilisateur non connecté, affichage du formulaire');
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser l'erreur
    setError('');
    
    // Validation des champs
    if (!matricule.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    console.log('🟢 [LOGIN PAGE] Tentative de connexion avec:', {
      matricule: matricule.trim(),
      password: '***',
    });

    try {
      setLoading(true);
      
      // Appel au service d'authentification
      const response = await AuthService.login(matricule.trim(), password.trim());
      
      console.log('🟢 [LOGIN PAGE] Réponse du service:', response);
      
      if (response.success && response.data) {
        console.log('✅ [LOGIN PAGE] Connexion réussie, sauvegarde des données...');
        
        // Sauvegarder les données de l'agent dans le localStorage
        AuthService.saveAgentData(response.data);
        
        console.log('✅ [LOGIN PAGE] Données sauvegardées, redirection vers /home');
        
        // Redirection vers la page d'accueil
        router.push('/home');
      } else {
        console.log('❌ [LOGIN PAGE] Échec de connexion:', response.message);
        
        // Afficher le message d'erreur
        setError(response.message || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error('❌ [LOGIN PAGE] Erreur lors de la connexion:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (checking) {
    return (
      <div className="min-h-screen bg-[#8BC34A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-16 w-16 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-white text-lg font-semibold">Vérification...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#8BC34A] flex flex-col items-center justify-between px-4 py-8">
      {/* Spacer pour pousser le contenu vers le centre */}
      <div className="flex-1"></div>
      
      {/* Carte de connexion */}
      <div className="w-full max-w-xl bg-[#E8E8E8] rounded-3xl shadow-2xl p-12 flex flex-col items-center">
        {/* Logo Eventime */}
        <div className="mb-12">
          <Image
            src="/logo-eventime-noel-alt.png"
            alt="Eventime Logo"
            width={200}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Message d'erreur */}
          {error && (
            <div className="w-full px-6 py-4 bg-red-100 border-2 border-red-400 rounded-2xl text-red-700 text-center animate-shake">
              <div className="flex items-center justify-center gap-2">
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
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {/* Champ Matricule */}
          <input
            type="text"
            placeholder="votre matricule"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            disabled={loading}
            className="w-full px-6 py-4 bg-white border-2 border-[#8BC34A] rounded-2xl text-gray-500 placeholder-gray-400 text-lg focus:outline-none focus:border-[#6B9E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Champ Mot de passe */}
          <input
            type="password"
            placeholder="votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-6 py-4 bg-white border-2 border-[#8BC34A] rounded-2xl text-gray-500 placeholder-gray-400 text-lg focus:outline-none focus:border-[#6B9E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Bouton Connexion */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#8BC34A] text-white text-2xl font-bold rounded-2xl hover:bg-[#7CB342] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Connexion en cours...</span>
              </>
            ) : (
              'Connexion'
            )}
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
