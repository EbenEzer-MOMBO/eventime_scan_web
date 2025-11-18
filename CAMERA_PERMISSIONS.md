# Configuration des autorisations caméra

## 📱 Autorisations nécessaires

### Android
Pour que le scanner QR fonctionne sur Android, vous devez ajouter les permissions suivantes dans votre fichier `AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

Si vous utilisez Capacitor ou une PWA, ces permissions sont généralement gérées automatiquement par le navigateur.

### iOS
Pour iOS, vous devez ajouter la description de l'usage de la caméra dans votre fichier `Info.plist` :

```xml
<key>NSCameraUsageDescription</key>
<string>Cette application a besoin d'accéder à votre caméra pour scanner les codes QR des tickets.</string>
```

## 🌐 Configuration PWA (Progressive Web App)

Si vous déployez l'application en tant que PWA, les autorisations sont gérées par le navigateur. Assurez-vous que :

1. **HTTPS est activé** : Les APIs de caméra nécessitent une connexion sécurisée (HTTPS) sauf pour `localhost`
2. **Service Worker est configuré** : Pour l'installation en PWA
3. **Manifest.json est présent** : Avec les bonnes configurations

### Exemple de manifest.json
```json
{
  "name": "EventTime Scanner",
  "short_name": "EventTime",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8BC34A",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔧 Gestion des autorisations dans le code

L'application demande automatiquement l'autorisation d'accès à la caméra lors de l'ouverture du scanner. Voici le flux :

1. **Demande d'autorisation** : `navigator.mediaDevices.getUserMedia()`
2. **Autorisation accordée** : La caméra démarre et le scan commence
3. **Autorisation refusée** : Un message d'erreur s'affiche avec un bouton "Réessayer"

### États de la page scanner

- **Demande en cours** : Affiche un spinner avec "Demande d'autorisation..."
- **Autorisation refusée** : Affiche un message d'erreur avec option de réessayer
- **Scan en cours** : La caméra est active avec cadre de scan animé
- **Traitement** : Affiche "Validation..." pendant l'appel API

## 📚 Bibliothèques utilisées

- **@zxing/browser** : Scanner QR code optimisé pour navigateur
- **@zxing/library** : Core de la bibliothèque ZXing

Ces bibliothèques sont compatibles avec :
- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Android & Desktop)
- ✅ Samsung Internet
- ✅ PWA sur tous les systèmes

## 🚀 Déploiement

### Pour un déploiement production :

1. **Activer HTTPS** (obligatoire pour la caméra)
2. **Configurer les permissions** selon la plateforme cible
3. **Tester sur différents navigateurs/appareils**
4. **Vérifier les performances** du scan en conditions réelles

### Test en local :

```bash
# Le scanner fonctionne en HTTP sur localhost
npm run dev
# Accéder à http://localhost:3000
```

## 🔍 Debugging

Pour déboguer les problèmes de caméra, vérifiez :

1. **Console du navigateur** : Tous les logs du scanner commencent par `[SCANNER]`
2. **Permissions du navigateur** : Settings > Site permissions > Camera
3. **HTTPS** : Requis en production
4. **Compatibilité navigateur** : Vérifier que `navigator.mediaDevices` existe

### Logs console :

- `🔵 [SCANNER]` : Informations générales
- `✅ [SCANNER]` : Succès
- `❌ [SCANNER]` : Erreurs

## 💡 Conseils d'optimisation

1. **Éclairage** : Assurez-vous que le QR code est bien éclairé
2. **Distance** : Maintenez le QR code à 10-20cm de la caméra
3. **Stabilité** : Gardez l'appareil stable pendant le scan
4. **Mise au point** : Laissez l'autofocus se stabiliser

## 🐛 Problèmes courants

### La caméra ne démarre pas
- Vérifier que HTTPS est activé (sauf localhost)
- Vérifier les permissions dans les paramètres du navigateur
- Redémarrer le navigateur

### Le scan ne détecte pas le QR code
- Améliorer l'éclairage
- Nettoyer l'objectif de la caméra
- Réduire la distance au QR code
- Vérifier que le QR code est valide

### Performance lente
- Fermer les autres applications
- Vérifier la qualité de la connexion internet
- Vider le cache du navigateur

