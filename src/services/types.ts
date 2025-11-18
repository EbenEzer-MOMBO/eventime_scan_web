// Types pour l'API Eventime

// ============= Authentification =============
export interface LoginRequest {
  clic: 'con';
  matricule: string;
  code: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    id_agent: string;
    matricule_agent: string;
    id_org: string;
    nom_agent: string;
  };
  message?: string;
}

// ============= Événements =============
export interface Event {
  event_id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image: string;
  event_ref: string;
  status: string;
  organizer_id: number;
  scan_date: number;
}

export interface EventsAvenirRequest {
  id_agent: string;
}

export interface EventsAvenirResponse {
  success: boolean;
  message: string;
  data: Event[];
  count: number;
}

export interface EventEnCoursRequest {
  clic: 'event_en_cours';
  id_agent: string;
}

export interface EventEnCoursResponse {
  status?: 'non';
  // Quand un événement est trouvé, contient toutes les propriétés de Event
  event_id?: number;
  title?: string;
  description?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  image?: string;
  event_ref?: string;
  status_event?: string;
  organizer_id?: number;
  created_at?: string;
  updated_at?: string;
  // Toute autre colonne de la table events sera également incluse
  [key: string]: any;
}

// ============= Tickets =============
export interface TicketCountRequest {
  clic: 'nb_ticket_restant' | 'nb_ticket_update' | 'nb_ticket';
  id_event: string;
}

export interface TicketCountResponse {
  count: string | 'non';
}

// ============= Participants =============
export interface Participant {
  ticket_item_id: number;
  buyer_name: string;
  ticket_number: string;
  participant_name: string;
  participant_lastname: string;
  participant_email: string;
  status: number;
  created_at: string;
}

export interface ParticipantsListRequest {
  event_id: string;
}

export interface ParticipantsListResponse {
  success: boolean;
  message: string;
  data: Participant[];
  count: number;
}

// ============= Validation de ticket =============
export interface TicketValidationRequest {
  clic: 'update';
  numero_billet: string;
}

export interface TicketData {
  ticket_item_id: number;
  ticketNumber: string;
  civility_buyer: string;
  buyerName: string;
  civility_participant: string;
  participantName: string;
  participantLastname: string;
  participantEmailAddress: string;
  participantTelephone: string | null;
  participantMatricule: string | null;
  event_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TicketValidationResponse {
  message: string;
  result: number;
  data: TicketData;
}

