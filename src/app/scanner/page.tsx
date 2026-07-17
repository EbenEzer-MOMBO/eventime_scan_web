'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, Suspense } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { ValidationService } from '@/services';

function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const isProcessingRef = useRef<boolean>(false); // Utiliser useRef pour éviter les problèmes de closure
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(undefined);
  const [showCameraSelector, setShowCameraSelector] = useState(false);

  useEffect(() => {
    requestCameraPermission();
    return () => {
      stopScanning();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      console.log('🔵 [SCANNER] Demande d\'autorisation caméra...');
      console.log('🔵 [SCANNER] User Agent:', navigator.userAgent);
      console.log('🔵 [SCANNER] Protocol:', window.location.protocol);
      console.log('🔵 [SCANNER] Hostname:', window.location.hostname);
      
      // Vérifier si l'API est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('❌ [SCANNER] navigator.mediaDevices non disponible');
        setHasPermission(false);
        
        // Vérifier si c'est un problème de HTTPS
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          setError('HTTPS requis : Cette fonctionnalité nécessite une connexion sécurisée (HTTPS). Veuillez accéder au site via HTTPS.');
        } else {
          setError('Navigateur non compatible : Votre navigateur ne supporte pas l\'accès à la caméra. Veuillez utiliser Chrome, Safari ou Firefox récent.');
        }
        return;
      }
      
      // Demander l'autorisation de la caméra
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      console.log('✅ [SCANNER] Autorisation accordée');
      setHasPermission(true);
      
      // Arrêter le stream de test
      stream.getTracks().forEach(track => track.stop());
      
      // Récupérer la liste des caméras disponibles
      await loadAvailableCameras();
      
      // Démarrer le scan avec la caméra par défaut
      startScanning();
    } catch (err) {
      console.error('❌ [SCANNER] Erreur d\'autorisation:', err);
      setHasPermission(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Autorisation caméra refusée. Veuillez autoriser l\'accès à la caméra dans les paramètres.');
        } else if (err.name === 'NotFoundError') {
          setError('Aucune caméra trouvée sur cet appareil.');
        } else if (err.name === 'NotSupportedError') {
          setError('Contraintes non supportées. Le navigateur ne supporte pas les paramètres de caméra demandés.');
        } else {
          setError('Erreur lors de l\'accès à la caméra: ' + err.message);
        }
      } else {
        setError('Erreur inconnue lors de l\'accès à la caméra');
      }
    }
  };

  const loadAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      console.log('🔵 [SCANNER] Caméras disponibles:', cameras);
      setAvailableCameras(cameras);
      
      // Sélectionner la caméra arrière par défaut si disponible
      const backCamera = cameras.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('arrière') ||
        camera.label.toLowerCase().includes('rear')
      );
      
      if (backCamera) {
        setSelectedCameraId(backCamera.deviceId);
        console.log('✅ [SCANNER] Caméra arrière sélectionnée:', backCamera.label);
      } else if (cameras.length > 0) {
        setSelectedCameraId(cameras[0].deviceId);
        console.log('✅ [SCANNER] Première caméra sélectionnée:', cameras[0].label);
      }
    } catch (err) {
      console.error('❌ [SCANNER] Erreur lors de la récupération des caméras:', err);
    }
  };

  const startScanning = async (cameraId?: string) => {
    if (!videoRef.current) return;

    try {
      // Arrêter le scan précédent s'il existe
      if (codeReaderRef.current && isScanning) {
        stopScanning();
      }

      setIsScanning(true);
      setError('');
      console.log('🔵 [SCANNER] Démarrage du scan avec caméra:', cameraId || 'par défaut');
      
      codeReaderRef.current = new BrowserQRCodeReader();
      
      // Utiliser la caméra sélectionnée ou la caméra par défaut
      const deviceId = cameraId || selectedCameraId;
      
      await codeReaderRef.current.decodeFromVideoDevice(
        deviceId, // ID de la caméra à utiliser
        videoRef.current,
        (result, error) => {
          // Utiliser isProcessingRef.current au lieu de isProcessing pour avoir la valeur à jour
          if (result && !isProcessingRef.current) {
            console.log('✅ [SCANNER] QR Code détecté:', result.getText());
            handleScan(result.getText());
          }
          
          if (error && error.name !== 'NotFoundException') {
            console.error('❌ [SCANNER] Erreur de scan:', error);
          }
        }
      );
      
      console.log('✅ [SCANNER] Scan démarré avec succès');
    } catch (err) {
      console.error('❌ [SCANNER] Erreur lors du démarrage:', err);
      setError('Erreur lors du démarrage du scanner');
      setIsScanning(false);
    }
  };

  const handleCameraChange = async (cameraId: string) => {
    console.log('🔵 [SCANNER] Changement de caméra:', cameraId);
    setSelectedCameraId(cameraId);
    setShowCameraSelector(false);
    await startScanning(cameraId);
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      console.log('🔵 [SCANNER] Arrêt du scan');
      // Arrêter toutes les pistes vidéo
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = async (qrData: string) => {
    // Vérifier avec la référence
    if (isProcessingRef.current) {
      console.log('⚠️ [SCANNER] Traitement déjà en cours, scan ignoré');
      return;
    }
    
    try {
      // Mettre à jour la référence ET l'état
      isProcessingRef.current = true;
      setIsProcessing(true);
      stopScanning();
      
      console.log('🔵 [SCANNER] Validation du ticket:', qrData);
      
      // Valider le ticket via l'API
      const result = await ValidationService.validateTicket(qrData, eventId);
      
      if (!result) {
        setError('Erreur lors de la validation du ticket');
        setTimeout(() => {
          isProcessingRef.current = false;
          setIsProcessing(false);
          startScanning();
        }, 2000);
        return;
      }

      // Stocker les données du ticket pour la page de résultat
      localStorage.setItem('scanned_ticket', JSON.stringify(result));
      
      // Rediriger selon le résultat
      if (ValidationService.isValidationSuccess(result)) {
        router.push('/ticket-success');
      } else if (ValidationService.isAlreadyValidated(result)) {
        router.push('/ticket-already-validated');
      } else {
        setError(result.message);
        setTimeout(() => {
          isProcessingRef.current = false;
          setIsProcessing(false);
          startScanning();
        }, 2000);
      }
    } catch (err) {
      console.error('❌ [SCANNER] Erreur de validation:', err);
      setError('Erreur lors de la validation');
      setTimeout(() => {
        isProcessingRef.current = false;
        setIsProcessing(false);
        startScanning();
      }, 2000);
    }
  };

  const handleBack = () => {
    stopScanning();
    
    // Récupérer l'événement depuis localStorage pour rediriger vers sa page
    const storedEvent = localStorage.getItem('current_event');
    if (storedEvent) {
      try {
        const event = JSON.parse(storedEvent);
        router.push(`/event/${event.event_id}`);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'événement:', error);
        router.back();
      }
    } else {
      router.back();
    }
  };

  // État de demande d'autorisation
  if (hasPermission === null) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-16 w-16 text-[#8BC34A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-xl font-semibold">Demande d&apos;autorisation...</p>
          <p className="text-gray-400 text-center">Veuillez autoriser l&apos;accès à la caméra</p>
        </div>
      </div>
    );
  }

  // Autorisation refusée
  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="text-white hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <h1 className="text-white text-xl font-semibold">Scanner QR Code</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-red-500/20 border-2 border-red-500 rounded-3xl p-8 max-w-md">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"/>
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold text-center">Accès caméra refusé</h2>
              <p className="text-gray-300 text-center">{error}</p>
              <button 
                onClick={requestCameraPermission}
                className="mt-4 bg-[#8BC34A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7CB342] transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="text-white hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <h1 className="text-white text-xl font-semibold">Scanner QR Code</h1>
        
        {/* Bouton sélecteur de caméra */}
        {availableCameras.length > 1 && (
          <button 
            onClick={() => setShowCameraSelector(!showCameraSelector)}
            className="text-white hover:scale-110 transition-transform relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            {availableCameras.length > 1 && (
              <span className="absolute -top-1 -right-1 bg-[#8BC34A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {availableCameras.length}
              </span>
            )}
          </button>
        )}
        {availableCameras.length <= 1 && <div className="w-10"></div>}
      </div>

      {/* Menu déroulant de sélection de caméra */}
      {showCameraSelector && availableCameras.length > 1 && (
        <div className="absolute top-20 right-6 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xs">
          <div className="bg-[#8BC34A] text-white px-4 py-3 font-semibold">
            Sélectionner une caméra
          </div>
          <div className="max-h-64 overflow-y-auto">
            {availableCameras.map((camera, index) => (
              <button
                key={camera.deviceId}
                onClick={() => handleCameraChange(camera.deviceId)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${
                  camera.deviceId === selectedCameraId ? 'bg-[#8BC34A]/10 font-semibold' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${camera.deviceId === selectedCameraId ? 'text-[#8BC34A]' : 'text-gray-400'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <div className="flex-1">
                    <div className={`text-sm ${camera.deviceId === selectedCameraId ? 'text-[#8BC34A]' : 'text-gray-700'}`}>
                      {camera.label || `Caméra ${index + 1}`}
                    </div>
                    {camera.deviceId === selectedCameraId && (
                      <div className="text-xs text-[#8BC34A] mt-1">✓ Active</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zone de scan avec vidéo */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md aspect-square">
          {/* Vidéo de la caméra */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            autoPlay
            playsInline
            muted
          />

          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

          {/* Cadre de scan */}
          <div className="absolute inset-0 border-4 border-[#8BC34A] rounded-3xl">
            {/* Coins du scanner */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-white rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-white rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-white rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-white rounded-br-3xl"></div>
            
            {/* Ligne de scan animée */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#8BC34A] shadow-lg shadow-[#8BC34A] animate-scan"></div>
          </div>

          {/* Indicateur de traitement */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-16 w-16 text-[#8BC34A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-white text-xl font-semibold">Validation...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions ou message d'erreur */}
      <div className="p-6 text-center">
        {error ? (
          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-4 mb-4">
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        ) : (
          <>
            <p className="text-white text-lg mb-2">
              Positionnez le QR code dans le cadre
            </p>
            <p className="text-gray-400">
              Le scan se fera automatiquement
            </p>
          </>
        )}
        
        {isScanning && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-[#8BC34A] rounded-full animate-pulse"></div>
            <p className="text-[#8BC34A] font-semibold">Scan en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-16 w-16 text-[#8BC34A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-xl font-semibold">Chargement du scanner...</p>
        </div>
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}

