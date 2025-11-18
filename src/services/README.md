# Services API Eventime

Ce dossier contient tous les services pour interagir avec l'API Eventime.

## Structure

```
services/
├── types.ts              # Types TypeScript pour l'API
├── api.config.ts         # Configuration de l'API
├── auth.service.ts       # Service d'authentification
├── event.service.ts      # Service de gestion des événements
├── ticket.service.ts     # Service de gestion des tickets
├── participant.service.ts # Service de gestion des participants
├── validation.service.ts # Service de validation des tickets
├── index.ts              # Point d'entrée (exports)
└── README.md             # Ce fichier
```

## Utilisation

### 1. Authentification

```typescript
import { AuthService } from '@/services';

// Connexion
const response = await AuthService.login('matricule123', 'code456');

if (response.success) {
  // Sauvegarder les données de l'agent
  AuthService.saveAgentData(response.data);
  
  // Rediriger vers la page d'accueil
  router.push('/home');
}

// Vérifier si un agent est connecté
if (AuthService.isAuthenticated()) {
  const agentData = AuthService.getAgentData();
  console.log(agentData);
}

// Déconnexion
AuthService.logout();
```

### 2. Événements

```typescript
import { EventService } from '@/services';

// Récupérer les événements à venir
const eventsResponse = await EventService.getEventsAvenir('id_agent_123');

if (eventsResponse.success) {
  eventsResponse.data.forEach(event => {
    console.log(event.title);
    
    // Obtenir l'URL de l'image
    const imageUrl = EventService.getImageUrl(event.image);
    
    // Formater les dates
    const startDate = EventService.formatDate(event.start_date);
    const endDate = EventService.formatDate(event.end_date);
  });
}

// Récupérer l'événement en cours
const currentEvent = await EventService.getEventEnCours('id_agent_123');

if (currentEvent.status !== 'non') {
  console.log('Événement en cours:', currentEvent.title);
}
```

### 3. Tickets

```typescript
import { TicketService } from '@/services';

// Récupérer le nombre de tickets restants
const remaining = await TicketService.getNbTicketRestant('172');
console.log('Tickets restants:', remaining);

// Récupérer le nombre de tickets validés
const validated = await TicketService.getNbTicketValidated('172');
console.log('Tickets validés:', validated);

// Récupérer le nombre total de tickets
const total = await TicketService.getNbTicketTotal('172');
console.log('Total de tickets:', total);

// Obtenir toutes les statistiques en une fois
const stats = await TicketService.getTicketStats('172');
console.log('Stats:', stats);
```

### 4. Participants

```typescript
import { ParticipantService } from '@/services';

// Récupérer la liste des participants
const response = await ParticipantService.getParticipantsList('172');

if (response.success) {
  // Filtrer par statut
  const validated = ParticipantService.filterValidatedParticipants(response.data);
  const pending = ParticipantService.filterPendingParticipants(response.data);
  
  // Afficher les participants
  response.data.forEach(participant => {
    const initial = ParticipantService.getParticipantInitial(participant);
    const fullName = ParticipantService.getFullName(participant);
    const status = ParticipantService.getStatusLabel(participant);
    const statusColor = ParticipantService.getStatusColor(participant);
    
    console.log(`${initial} - ${fullName} - ${status}`);
  });
}
```

### 5. Validation de tickets

```typescript
import { ValidationService } from '@/services';

// Valider un ticket (après scan QR)
const result = await ValidationService.validateTicket('ticket_598.MOMBO');

if (result) {
  if (ValidationService.isValidationSuccess(result)) {
    // Première validation réussie
    const info = ValidationService.extractTicketInfo(result.data);
    console.log('Ticket validé:', info.participantName);
    
    // Rediriger vers la page de succès
    router.push('/ticket-success');
  } else if (ValidationService.isAlreadyValidated(result)) {
    // Ticket déjà validé
    console.log('Ticket déjà validé');
    
    // Rediriger vers la page d'erreur
    router.push('/ticket-already-validated');
  }
}
```

## Exemple complet : Page d'événement

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  EventService,
  TicketService,
  ParticipantService,
  AuthService,
  type Event,
  type Participant,
} from '@/services';

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState({ total: 0, validated: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'agent connecté
      const agentData = AuthService.getAgentData();
      if (!agentData) {
        router.push('/');
        return;
      }

      // Charger les données en parallèle
      const [eventsResponse, participantsResponse, ticketStats] = await Promise.all([
        EventService.getEventsAvenir(agentData.id_agent),
        ParticipantService.getParticipantsList(eventId),
        TicketService.getTicketStats(eventId),
      ]);

      // Trouver l'événement spécifique
      const foundEvent = eventsResponse.data.find(
        (e) => e.event_id.toString() === eventId
      );
      
      setEvent(foundEvent || null);
      setParticipants(participantsResponse.data);
      setStats(ticketStats);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>{event?.title}</h1>
      <p>Participants: {stats.validated}</p>
      <p>Tickets restants: {stats.remaining}</p>
      
      {/* Liste des participants */}
      {participants.map((participant) => (
        <div key={participant.ticket_item_id}>
          {ParticipantService.getFullName(participant)}
        </div>
      ))}
    </div>
  );
}
```

## Types disponibles

Tous les types TypeScript sont disponibles via l'export du fichier `index.ts`. Consultez `types.ts` pour la liste complète.

## Configuration

La configuration de l'API se trouve dans `api.config.ts`. Vous pouvez modifier :
- L'URL de base de l'API
- Les endpoints
- Le timeout des requêtes
- Les headers par défaut

## Notes importantes

1. **Authentification** : Utilisez toujours `AuthService.isAuthenticated()` pour vérifier si un agent est connecté avant d'accéder aux pages protégées.

2. **Gestion d'erreurs** : Tous les services gèrent les erreurs en interne et retournent des valeurs par défaut ou `null` en cas d'échec. Vérifiez toujours les valeurs de retour.

3. **LocalStorage** : Les données d'authentification sont stockées dans le `localStorage`. Assurez-vous que votre application est en mode client (`'use client'`) pour y accéder.

4. **URL HTTP** : L'endpoint `nb_ticket_total` utilise HTTP au lieu de HTTPS selon la documentation. Cela peut poser des problèmes de sécurité sur certains navigateurs.

5. **Format CSV** : L'endpoint de connexion retourne une réponse CSV qui est automatiquement parsée par le service.

