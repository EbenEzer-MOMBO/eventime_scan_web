# Eventime Scan Web

Application web de gestion d'événements Eventime avec système de scan.

## Pages disponibles

### 1. Page de connexion (`/`)
- Formulaire d'authentification avec matricule et mot de passe
- Design avec logo Eventime
- Redirection automatique vers la page d'accueil après connexion

### 2. Page d'accueil (`/home`)
- Affichage du profil utilisateur (avatar + matricule)
- Section "Événement en cours" avec état vide
- Section "Événements à venir" avec liste des événements cliquables
- Bouton de déconnexion
- Bouton flottant de rafraîchissement

### 3. Page détail événement (`/event/[id]`)
- Image de couverture de l'événement
- Badge affichant le nombre de participants
- Bouton retour vers la page d'accueil
- Onglets "Description" et "Participants"
- Description complète de l'événement avec emojis
- Liste des participants avec leurs informations
- Bouton flottant pour scanner un QR code

### 4. Page scanner QR (`/scanner`)
- Interface de scan avec cadre vert
- Coins blancs pour délimiter la zone de scan
- Instructions pour l'utilisateur
- Simulation de scan automatique (2 secondes)
- Redirection automatique vers validation

### 5. Page validation ticket simple (`/ticket-validation`)
- Message de succès "Ticket validé avec succès"
- Logo Eventime
- Bouton "Continuer a scanner"
- Design avec fond vert et carte grise

### 6. Page validation ticket détaillée (`/ticket-success`)
- Message de succès "Ticket validé avec succès" en vert
- Carte d'informations du ticket avec :
  - Numéro de ticket
  - Nom du participant
  - Email
  - Statut "En attente" (avec icône orange)
- Bouton "Continuer à scanner" avec icône QR
- Message de succès répété en bas de page

### 7. Page ticket déjà validé (`/ticket-already-validated`)
- Message d'erreur "Le ticket est déjà validé" en rouge
- Carte d'informations du ticket avec :
  - Numéro de ticket
  - Nom du participant
  - Email
  - Statut "Validé"
- Bouton "Continuer à scanner" avec icône QR
- Barre rouge en bas de page avec message d'erreur

## Démarrage

Lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir la page de connexion.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
