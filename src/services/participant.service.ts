// Service de gestion des participants

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type { ParticipantsListRequest, ParticipantsListResponse, Participant } from './types';

function isValidatedStatus(status: number | string): boolean {
  const value = String(status);
  return value === '1' || value === 'scanned';
}

/**
 * Service pour gérer les participants
 */
export class ParticipantService {
  static async getParticipantsList(event_id: string): Promise<ParticipantsListResponse> {
    try {
      const body: ParticipantsListRequest = {
        event_id,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARTICIPANTS_LIST}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: ParticipantsListResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des participants:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération',
        data: [],
        count: 0,
      };
    }
  }

  static isValidated(participant: Participant): boolean {
    return isValidatedStatus(participant.status);
  }

  static filterValidatedParticipants(participants: Participant[]): Participant[] {
    return participants.filter((participant) => this.isValidated(participant));
  }

  static filterPendingParticipants(participants: Participant[]): Participant[] {
    return participants.filter((participant) => !this.isValidated(participant));
  }

  static getParticipantInitial(participant: Participant): string {
    return participant.participant_name?.charAt(0).toUpperCase() || '?';
  }

  static getFullName(participant: Participant): string {
    return `${participant.participant_name} ${participant.participant_lastname}`.trim();
  }

  static truncateText(text: string, maxLength: number = 10): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  }

  static getStatusLabel(participant: Participant): string {
    return this.isValidated(participant) ? 'Validé' : 'En attente';
  }

  static getStatusColor(participant: Participant): string {
    return this.isValidated(participant) ? 'bg-green-500' : 'bg-orange-400';
  }
}
