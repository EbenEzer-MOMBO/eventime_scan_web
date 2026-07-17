// Service de gestion des tickets / stats

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type { EventStatsResponse } from './types';

/**
 * Service pour les statistiques tickets (logique dashboard organisateur)
 */
export class TicketService {
  /**
   * Participants (vendus) + tickets non scannés pour un événement
   */
  static async getEventStats(id_event: string): Promise<{
    participants: number | null;
    remaining: number | null;
  }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENT_STATS}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ event_id: id_event }),
      });

      const data: EventStatsResponse = await response.json();

      if (!data.success || !data.data) {
        return { participants: null, remaining: null };
      }

      return {
        participants: data.data.participants,
        remaining: data.data.remaining,
      };
    } catch (error) {
      console.error('❌ [TICKET] Erreur event-stats:', error);
      return { participants: null, remaining: null };
    }
  }

  /** Tickets non encore scannés */
  static async getNbTicketRestant(id_event: string): Promise<number | null> {
    const stats = await this.getEventStats(id_event);
    return stats.remaining;
  }

  /** Participants vendus */
  static async getNbTicketValidated(id_event: string): Promise<number | null> {
    const stats = await this.getEventStats(id_event);
    return stats.participants;
  }

  /**
   * Statistiques pour la page détail événement
   * total = vendus, validated = scannés, remaining = non scannés
   */
  static async getTicketStats(id_event: string): Promise<{
    total: number | null;
    validated: number | null;
    remaining: number | null;
  }> {
    const stats = await this.getEventStats(id_event);
    const participants = stats.participants;
    const notScanned = stats.remaining;
    const scanned =
      participants !== null && notScanned !== null
        ? Math.max(0, participants - notScanned)
        : null;

    return {
      total: participants,
      validated: scanned,
      remaining: notScanned,
    };
  }
}
