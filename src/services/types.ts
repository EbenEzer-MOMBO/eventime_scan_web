// Types pour l'API Eventime Scanner

// ============= Authentification =============
export interface LoginRequest {
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
  id_agent: string;
}

export interface EventEnCoursResponse {
  success: boolean;
  message: string;
  data: Event[];
  count: number;
}

// ============= Stats (logique dashboard) =============
export interface EventStatsResponse {
  success: boolean;
  message?: string;
  data?: {
    participants: number;
    remaining: number;
  };
}

// ============= Participants =============
export interface Participant {
  ticket_item_id: number;
  buyer_name: string;
  ticket_number: string;
  participant_name: string;
  participant_lastname: string;
  participant_email: string;
  status: number | string;
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
export interface ScannedTicketInfo {
  ticket_number: string;
  participant_name: string;
  participant_email: string;
  buyer_name: string;
  event_title?: string;
  scan_time?: string;
  scanned_at?: string;
}

export interface TicketValidationResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: ScannedTicketInfo;
}
