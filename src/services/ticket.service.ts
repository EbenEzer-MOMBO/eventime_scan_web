// Service de gestion des tickets

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type { TicketCountRequest, TicketCountResponse } from './types';

/**
 * Service pour gérer les tickets
 */
export class TicketService {
  /**
   * Récupérer le nombre de tickets restants pour un événement
   * @param id_event - ID de l'événement
   * @returns Nombre de tickets restants
   */
  static async getNbTicketRestant(id_event: string): Promise<number | null> {
    try {
      const formData = new FormData();
      formData.append('clic', 'nb_ticket_restant');
      formData.append('id_event', id_event);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`, {
        method: 'POST',
        body: formData,
      });

      const textResponse = await response.text();
      console.log('🔵 [TICKET] Tickets restants:', textResponse);

      if (textResponse === 'non' || textResponse.trim() === '') {
        return null;
      }

      const count = parseInt(textResponse, 10);
      return isNaN(count) ? null : count;
    } catch (error) {
      console.error('❌ [TICKET] Erreur lors de la récupération du nombre de tickets restants:', error);
      return null;
    }
  }

  /**
   * Récupérer le nombre de tickets validés (participants) pour un événement
   * @param id_event - ID de l'événement
   * @returns Nombre de tickets validés
   */
  static async getNbTicketValidated(id_event: string): Promise<number | null> {
    try {
      const formData = new FormData();
      formData.append('clic', 'nb_ticket_update');
      formData.append('id_event', id_event);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`, {
        method: 'POST',
        body: formData,
      });

      const textResponse = await response.text();
      console.log('🔵 [TICKET] Tickets validés:', textResponse);

      if (textResponse === 'non' || textResponse.trim() === '') {
        return null;
      }

      const count = parseInt(textResponse, 10);
      return isNaN(count) ? null : count;
    } catch (error) {
      console.error('❌ [TICKET] Erreur lors de la récupération du nombre de tickets validés:', error);
      return null;
    }
  }

  /**
   * Récupérer le nombre total de tickets pour un événement
   * @param id_event - ID de l'événement
   * @returns Nombre total de tickets
   */
  static async getNbTicketTotal(id_event: string): Promise<number | null> {
    try {
      const formData = new FormData();
      formData.append('clic', 'nb_ticket');
      formData.append('id_event', id_event);

      // Note: L'URL est en HTTP selon la documentation
      const response = await fetch(`http://eventime.ga/api/spb_index.php`, {
        method: 'POST',
        body: formData,
      });

      const textResponse = await response.text();
      console.log('🔵 [TICKET] Total de tickets:', textResponse);

      if (textResponse === 'non' || textResponse.trim() === '') {
        return null;
      }

      const count = parseInt(textResponse, 10);
      return isNaN(count) ? null : count;
    } catch (error) {
      console.error('❌ [TICKET] Erreur lors de la récupération du nombre total de tickets:', error);
      return null;
    }
  }

  /**
   * Récupérer les statistiques complètes des tickets pour un événement
   * @param id_event - ID de l'événement
   * @returns Objet avec les statistiques
   */
  static async getTicketStats(id_event: string): Promise<{
    total: number | null;
    validated: number | null;
    remaining: number | null;
  }> {
    const [total, validated, remaining] = await Promise.all([
      this.getNbTicketTotal(id_event),
      this.getNbTicketValidated(id_event),
      this.getNbTicketRestant(id_event),
    ]);

    return {
      total,
      validated,
      remaining,
    };
  }
}

