// Service de gestion des événements

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type {
  EventsAvenirRequest,
  EventsAvenirResponse,
  EventEnCoursRequest,
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

      // Essayer d'abord avec JSON (pour l'endpoint mobile moderne)
      let response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS_AVENIR}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ id_agent }),
      });

      console.log('🔵 [EVENT] Statut réponse événements à venir:', response.status);

      // Si erreur 404, l'endpoint n'existe peut-être pas, essayer avec FormData sur spb_index.php
      if (!response.ok && response.status === 404) {
        console.log('⚠️ [EVENT] Endpoint mobile non trouvé, tentative avec spb_index.php...');
        
        const formData = new FormData();
        formData.append('clic', 'event'); // Le bon paramètre dans spb_index.php
        formData.append('id_agent', id_agent);

        response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`, {
          method: 'POST',
          body: formData,
        });

        console.log('🔵 [EVENT] Statut réponse spb_index:', response.status);
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const textResponse = await response.text();
      console.log('🔵 [EVENT] Réponse brute événements à venir:', textResponse.substring(0, 200));

      // Gérer le cas d'une réponse vide (aucun événement)
      if (!textResponse || textResponse.trim() === '') {
        console.log('ℹ️ [EVENT] Aucun événement à venir (réponse vide)');
        return {
          success: true,
          message: 'Aucun événement à venir',
          data: [],
          count: 0,
        };
      }

      const parsedData = JSON.parse(textResponse);
      
      // Vérifier si c'est le format de l'API mobile (avec success, message, data, count)
      if (parsedData && typeof parsedData === 'object' && 'success' in parsedData) {
        console.log('✅ [EVENT] Format API mobile - Événements à venir récupérés:', parsedData.count, 'événement(s)');
        return parsedData as EventsAvenirResponse;
      }
      
      // Sinon, c'est le format spb_index.php (tableau direct d'événements)
      if (Array.isArray(parsedData)) {
        console.log('✅ [EVENT] Format spb_index.php - Événements à venir récupérés:', parsedData.length, 'événement(s)');
        return {
          success: true,
          message: 'Événements à venir récupérés avec succès',
          data: parsedData,
          count: parsedData.length,
        };
      }
      
      // Format inconnu
      console.log('⚠️ [EVENT] Format de réponse inconnu:', parsedData);
      return {
        success: false,
        message: 'Format de réponse invalide',
        data: [],
        count: 0,
      };
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
   * Récupérer l'événement en cours pour un agent
   * @param id_agent - ID de l'agent
   * @returns Événement en cours ou null
   */
  static async getEventEnCours(id_agent: string): Promise<EventEnCoursResponse> {
    try {
      // Utiliser FormData pour PHP
      const formData = new FormData();
      formData.append('clic', 'event_en_cours');
      formData.append('id_agent', id_agent);

      console.log('🔵 [EVENT] Récupération événement en cours pour agent:', id_agent);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const textResponse = await response.text();
      console.log('🔵 [EVENT] Réponse brute événement en cours:', textResponse);

      // Tenter de parser en JSON
      try {
        const data: EventEnCoursResponse = JSON.parse(textResponse);
        console.log('✅ [EVENT] Événement en cours:', data);
        return data;
      } catch {
        // Si ce n'est pas du JSON, retourner status non
        console.log('❌ [EVENT] Pas d\'événement en cours');
        return {
          status: 'non',
        };
      }
    } catch (error) {
      console.error('❌ [EVENT] Erreur lors de la récupération de l\'événement en cours:', error);
      return {
        status: 'non',
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

