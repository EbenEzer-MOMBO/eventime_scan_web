# Installation PWA — Eventime Scan Web

## Contexte

Les agents de scan ont besoin d’accéder rapidement à l’app sur mobile, hors navigateur. L’option d’installation PWA permet d’ajouter Eventime Scan à l’écran d’accueil (Android / desktop Chrome-Edge, et guide iOS Safari).

## Ce qui a changé

| Élément | Fichier |
|---------|---------|
| Manifest web | `public/manifest.json` |
| Service Worker | `public/sw.js` |
| Icônes PWA | `public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png` |
| Enregistrement SW | `src/components/ServiceWorkerRegister.tsx` |
| Bouton d’installation | `src/components/InstallPWAButton.tsx` |
| Métadonnées / theme-color | `src/app/layout.tsx` |
| Bouton sur login | `src/app/page.tsx` |
| Bouton sur home | `src/app/home/page.tsx` |

### Comportement

- **Chrome / Edge / Android** : écoute de `beforeinstallprompt`, bouton « Télécharger l’app », puis prompt natif.
- **iOS Safari** : le bouton affiche un guide (Partager → Sur l’écran d’accueil).
- **Déjà installée** : le bouton est masqué (`display-mode: standalone`).
- Le Service Worker pré-cache les assets de base ; les appels API `eventime.ga` ne sont pas mis en cache.

## Comment tester

1. Build / démarrage en HTTPS (ou `localhost`) :
   ```bash
   npm run build && npm start
   ```
2. Ouvrir Chrome DevTools → Application → Manifest / Service Workers.
3. Vérifier que le bouton d’installation apparaît sur la page de login et sur `/home`.
4. Installer l’app et confirmer le mode standalone (pas de barre d’URL).
5. Sur iPhone : ouvrir Safari, toucher le bouton, suivre le guide d’ajout à l’écran d’accueil.
