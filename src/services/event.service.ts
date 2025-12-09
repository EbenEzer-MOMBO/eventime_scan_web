// Service de gestion des événements

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type {
  EventsAvenirResponse,
  EventEnCoursResponse,
} from './types';

/**
 * Service pour gérer les événements
 */
export class EventService {
  /**
   * Récupérer la liste des événements à venir pour un agent
   * @param id_agent - ID de l'agent
   * @returns Liste des événements à venir
   */
  static async getEventsAvenir(id_agent: string): Promise<EventsAvenirResponse> {
    try {
      console.log('🔵 [EVENT] Récupération événements à venir pour agent:', id_agent);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS_AVENIR}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ id_agent }),
      });

      console.log('🔵 [EVENT] Statut réponse événements à venir:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: EventsAvenirResponse = await response.json();
      
      if (data.success) {
        console.log(`✅ [EVENT] ${data.message} - ${data.count} événement(s)`);
      } else {
        console.log(`⚠️ [EVENT] ${data.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ [EVENT] Erreur lors de la récupération des événements à venir:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération',
        data: [],
        count: 0,
      };
    }
  }

  /**
   * Récupérer les événements en cours pour un agent
   * @param id_agent - ID de l'agent
   * @returns Liste des événements en cours
   */
  static async getEventEnCours(id_agent: string): Promise<EventEnCoursResponse> {
    try {
      console.log('🔵 [EVENT] Récupération événements en cours pour agent:', id_agent);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS_EN_COURS}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ id_agent }),
      });

      console.log('🔵 [EVENT] Statut réponse événements en cours:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: EventEnCoursResponse = await response.json();
      
      if (data.success) {
        console.log(`✅ [EVENT] ${data.message} - ${data.count} événement(s)`);
      } else {
        console.log(`⚠️ [EVENT] ${data.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ [EVENT] Erreur lors de la récupération des événements en cours:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération',
        data: [],
        count: 0,
      };
    }
  }

  /**
   * Construire l'URL complète de l'image d'un événement
   * @param imageName - Nom du fichier image
   * @returns URL complète de l'image
   */
  static getImageUrl(imageName: string): string {
    if (!imageName) return '';
    // Chemin correct selon la structure du serveur
    return `https://eventime.ga/public/storage/img-event/${imageName}`;
  }

  /**
   * Formater une date pour l'affichage
   * @param dateString - Date au format string
   * @returns Date formatée
   */
  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return dateString;
    }
  }
}

