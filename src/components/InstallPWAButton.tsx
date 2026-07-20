'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type Variant = 'login' | 'home' | 'banner';

interface InstallPWAButtonProps {
  variant?: Variant;
  className?: string;
}

function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari iOS
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export default function InstallPWAButton({ variant = 'home', className = '' }: InstallPWAButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    const ios = isIosDevice();
    setIsIos(ios);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setVisible(false);
      setInstalled(true);
      setShowIosHelp(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    // iOS n'émet pas beforeinstallprompt : on propose le guide d'installation
    if (ios) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (isIos) {
      setShowIosHelp((prev) => !prev);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('ℹ️ [PWA] Choix installation:', outcome);
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (installed || !visible) return null;

  if (variant === 'banner') {
    return (
      <div className={`w-full ${className}`}>
        <button
          type="button"
          onClick={handleInstall}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/95 text-[#8BC34A] font-semibold rounded-2xl shadow-md hover:bg-white transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          {isIos ? "Installer l'application" : 'Télécharger l\'application'}
        </button>
        {showIosHelp && <IosInstallHelp />}
      </div>
    );
  }

  if (variant === 'login') {
    return (
      <div className={`w-full max-w-xl ${className}`}>
        <button
          type="button"
          onClick={handleInstall}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-white/20 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white/30 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          {isIos ? "Installer l'app" : 'Télécharger l\'app'}
        </button>
        {showIosHelp && (
          <div className="mt-3">
            <IosInstallHelp light />
          </div>
        )}
      </div>
    );
  }

  // variant === 'home'
  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleInstall}
        className="flex items-center gap-2 text-[#8BC34A] font-semibold text-sm hover:text-[#7CB342] transition-colors"
        title="Installer Eventime Scan"
      >
        <DownloadIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{isIos ? 'Installer' : 'Télécharger'}</span>
      </button>
      {showIosHelp && (
        <div className="absolute right-6 top-24 z-50 w-[min(100vw-3rem,22rem)]">
          <IosInstallHelp />
        </div>
      )}
    </div>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

function IosInstallHelp({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 text-sm shadow-lg ${
        light
          ? 'bg-white/95 text-gray-800 border border-white/40'
          : 'bg-white text-gray-800 border border-gray-200'
      }`}
    >
      <p className="font-semibold mb-2">Installation sur iPhone / iPad</p>
      <ol className="list-decimal list-inside space-y-1 text-gray-600">
        <li>
          Appuyez sur <span className="font-semibold">Partager</span> (icône □↑)
        </li>
        <li>
          Choisissez <span className="font-semibold">Sur l&apos;écran d&apos;accueil</span>
        </li>
        <li>
          Validez avec <span className="font-semibold">Ajouter</span>
        </li>
      </ol>
    </div>
  );
}
