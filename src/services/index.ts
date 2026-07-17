// Point d'entrée pour tous les services

export { AuthService } from './auth.service';
export { EventService } from './event.service';
export { TicketService } from './ticket.service';
export { ParticipantService } from './participant.service';
export { ValidationService } from './validation.service';

// Export des types
export type {
  LoginRequest,
  LoginResponse,
  Event,
  EventsAvenirRequest,
  EventsAvenirResponse,
  EventEnCoursRequest,
  EventEnCoursResponse,
  EventStatsResponse,
  Participant,
  ParticipantsListRequest,
  ParticipantsListResponse,
  ScannedTicketInfo,
  TicketValidationResponse,
} from './types';

// Export de la configuration
export { API_CONFIG, DEFAULT_HEADERS } from './api.config';
