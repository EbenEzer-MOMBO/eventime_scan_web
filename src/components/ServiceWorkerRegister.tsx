'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('✅ [PWA] Service Worker enregistré:', registration.scope);
      } catch (error) {
        console.error('❌ [PWA] Échec enregistrement Service Worker:', error);
      }
    };

    register();
  }, []);

  return null;
}
