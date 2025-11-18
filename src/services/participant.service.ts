// Service de gestion des participants

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type { ParticipantsListRequest, ParticipantsListResponse, Participant } from './types';

/**
 * Service pour gérer les participants
 */
export class ParticipantService {
  /**
   * Récupérer la liste des participants d'un événement
   * @param event_id - ID de l'événement
   * @returns Liste des participants
   */
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

  /**
   * Filtrer les participants validés
   * @param participants - Liste des participants
   * @returns Liste des participants validés (status = 1)
   */
  static filterValidatedParticipants(participants: Participant[]): Participant[] {
    return participants.filter((participant) => participant.status === 1);
  }

  /**
   * Filtrer les participants en attente
   * @param participants - Liste des participants
   * @returns Liste des participants en attente (status = 0)
   */
  static filterPendingParticipants(participants: Participant[]): Participant[] {
    return participants.filter((participant) => participant.status === 0);
  }

  /**
   * Obtenir l'initiale d'un participant pour l'avatar
   * @param participant - Participant
   * @returns Première lettre du nom
   */
  static getParticipantInitial(participant: Participant): string {
    return participant.participant_name?.charAt(0).toUpperCase() || '?';
  }

  /**
   * Formater le nom complet d'un participant
   * @param participant - Participant
   * @returns Nom complet formaté
   */
  static getFullName(participant: Participant): string {
    return `${participant.participant_name} ${participant.participant_lastname}`.trim();
  }

  /**
   * Tronquer un texte pour l'affichage
   * @param text - Texte à tronquer
   * @param maxLength - Longueur maximale
   * @returns Texte tronqué
   */
  static truncateText(text: string, maxLength: number = 10): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  }

  /**
   * Obtenir le statut d'un participant
   * @param participant - Participant
   * @returns Label du statut
   */
  static getStatusLabel(participant: Participant): string {
    return participant.status === 1 ? 'Validé' : 'En attente';
  }

  /**
   * Obtenir la couleur du statut d'un participant
   * @param participant - Participant
   * @returns Classe CSS pour la couleur
   */
  static getStatusColor(participant: Participant): string {
    return participant.status === 1 ? 'bg-green-500' : 'bg-orange-400';
  }
}

