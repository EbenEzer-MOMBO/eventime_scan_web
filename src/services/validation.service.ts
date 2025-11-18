// Service de validation de tickets

import { API_CONFIG } from './api.config';
import type { TicketValidationRequest, TicketValidationResponse } from './types';

/**
 * Service pour gérer la validation des tickets
 */
export class ValidationService {
  /**
   * Valider un ticket par scan QR
   * @param numero_billet - Numéro du billet scanné
   * @returns Résultat de la validation
   */
  static async validateTicket(numero_billet: string): Promise<TicketValidationResponse | null> {
    try {
      console.log('🔵 [VALIDATION] Validation du ticket:', numero_billet);
      
      // Utiliser FormData pour PHP compatibility
      const formData = new FormData();
      formData.append('clic', 'update');
      formData.append('numero_billet', numero_billet);

      console.log('🔵 [VALIDATION] Requête vers:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`, {
        method: 'POST',
        body: formData,
      });

      console.log('🔵 [VALIDATION] Statut de la réponse:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const textResponse = await response.text();
      console.log('🔵 [VALIDATION] Réponse brute:', textResponse.substring(0, 200));

      // Parser la réponse JSON
      const data: TicketValidationResponse = JSON.parse(textResponse);
      console.log('✅ [VALIDATION] Données parsées:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [VALIDATION] Erreur lors de la validation du ticket:', error);
      return null;
    }
  }

  /**
   * Vérifier si la validation a réussi
   * @param response - Réponse de la validation
   * @returns true si la validation est un succès
   */
  static isValidationSuccess(response: TicketValidationResponse): boolean {
    return response.result === 1;
  }

  /**
   * Vérifier si le ticket était déjà validé
   * @param response - Réponse de la validation
   * @returns true si le ticket était déjà validé
   */
  static isAlreadyValidated(response: TicketValidationResponse): boolean {
    return response.result === 0 && response.message.includes('déjà validé');
  }

  /**
   * Formater le nom du participant à partir des données du ticket
   * @param data - Données du ticket
   * @returns Nom complet formaté
   */
  static getParticipantName(data: TicketValidationResponse['data']): string {
    return `${data.civility_participant} ${data.participantName} ${data.participantLastname}`.trim();
  }

  /**
   * Formater le nom de l'acheteur à partir des données du ticket
   * @param data - Données du ticket
   * @returns Nom complet formaté
   */
  static getBuyerName(data: TicketValidationResponse['data']): string {
    return `${data.civility_buyer} ${data.buyerName}`.trim();
  }

  /**
   * Extraire les informations essentielles du ticket
   * @param data - Données du ticket
   * @returns Objet avec les informations essentielles
   */
  static extractTicketInfo(data: TicketValidationResponse['data']): {
    ticketNumber: string;
    participantName: string;
    participantEmail: string;
    buyerName: string;
    status: number;
  } {
    return {
      ticketNumber: data.ticketNumber,
      participantName: this.getParticipantName(data),
      participantEmail: data.participantEmailAddress,
      buyerName: this.getBuyerName(data),
      status: data.status,
    };
  }
}

