// Service d'authentification

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type { LoginRequest, LoginResponse } from './types';

/**
 * Service pour gérer l'authentification
 */
export class AuthService {
  /**
   * Connexion d'un agent
   * @param matricule - Matricule de l'agent
   * @param code - Code de l'agent
   * @returns Informations de l'agent connecté
   */
  static async login(matricule: string, code: string): Promise<LoginResponse> {
    try {
      // Créer les données au format FormData pour PHP
      const formData = new FormData();
      formData.append('clic', 'con');
      formData.append('matricule', matricule);
      formData.append('code', code);

      console.log('🔵 [AUTH] Requête de connexion:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`,
        matricule,
        code,
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPB_INDEX}`, {
        method: 'POST',
        body: formData,
        // Ne pas définir Content-Type, le navigateur le fera automatiquement avec le boundary
      });

      console.log('🔵 [AUTH] Statut de la réponse:', response.status, response.statusText);

      const textResponse = await response.text();
      
      console.log('🔵 [AUTH] Réponse brute de l\'API:', textResponse);
      console.log('🔵 [AUTH] Type de réponse:', typeof textResponse);
      console.log('🔵 [AUTH] Longueur de la réponse:', textResponse.length);

      // Vérifier si la réponse est "non"
      if (textResponse === 'non' || textResponse.trim() === 'non') {
        console.log('❌ [AUTH] Authentification échouée - Identifiants incorrects');
        return {
          success: false,
          message: 'Identifiants incorrects',
        };
      }

      // Parser la réponse CSV: "id_agent,matricule_agent,id_org,nom_agent"
      const parts = textResponse.split(',');
      console.log('🔵 [AUTH] Parties après split:', parts);
      
      const [id_agent, matricule_agent, id_org, nom_agent] = parts;

      if (!id_agent || !matricule_agent || !id_org || !nom_agent) {
        console.log('❌ [AUTH] Format de réponse invalide - Parties manquantes:', {
          id_agent,
          matricule_agent,
          id_org,
          nom_agent,
          totalParts: parts.length,
        });
        return {
          success: false,
          message: 'Format de réponse invalide',
        };
      }

      const agentData = {
        id_agent: id_agent.trim(),
        matricule_agent: matricule_agent.trim(),
        id_org: id_org.trim(),
        nom_agent: nom_agent.trim(),
      };

      console.log('✅ [AUTH] Connexion réussie:', agentData);

      return {
        success: true,
        data: agentData,
      };
    } catch (error) {
      console.error('❌ [AUTH] Erreur lors de la connexion:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur de connexion',
      };
    }
  }

  /**
   * Sauvegarder les informations de l'agent connecté dans le localStorage
   * @param data - Données de l'agent
   */
  static saveAgentData(data: LoginResponse['data']): void {
    if (data) {
      localStorage.setItem('agent_data', JSON.stringify(data));
    }
  }

  /**
   * Récupérer les informations de l'agent connecté depuis le localStorage
   * @returns Données de l'agent ou null
   */
  static getAgentData(): LoginResponse['data'] | null {
    const data = localStorage.getItem('agent_data');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Vérifier si un agent est connecté
   * @returns true si un agent est connecté
   */
  static isAuthenticated(): boolean {
    return this.getAgentData() !== null;
  }

  /**
   * Déconnexion - Supprimer les données de l'agent
   */
  static logout(): void {
    localStorage.removeItem('agent_data');
  }
}

