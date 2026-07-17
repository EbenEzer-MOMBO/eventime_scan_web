// Service d'authentification

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import type { LoginResponse } from './types';

/**
 * Service pour gérer l'authentification
 */
export class AuthService {
  /**
   * Connexion d'un agent
   */
  static async login(matricule: string, code: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ matricule, code }),
      });

      const data = await response.json();

      if (!data.success || !data.data) {
        return {
          success: false,
          message: data.message || 'Identifiants incorrects',
        };
      }

      return {
        success: true,
        data: {
          id_agent: String(data.data.id_agent ?? ''),
          matricule_agent: String(data.data.matricule ?? ''),
          id_org: String(data.data.id_org ?? ''),
          nom_agent: String(data.data.nom_agent ?? ''),
        },
      };
    } catch (error) {
      console.error('❌ [AUTH] Erreur lors de la connexion:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur de connexion',
      };
    }
  }

  static saveAgentData(data: LoginResponse['data']): void {
    if (data) {
      localStorage.setItem('agent_data', JSON.stringify(data));
    }
  }

  static getAgentData(): LoginResponse['data'] | null {
    const data = localStorage.getItem('agent_data');
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return this.getAgentData() !== null;
  }

  static logout(): void {
    localStorage.removeItem('agent_data');
  }
}
