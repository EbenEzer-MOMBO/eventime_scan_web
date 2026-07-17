// Service de validation de tickets

import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import { AuthService } from './auth.service';
import type { ScannedTicketInfo, TicketValidationResponse } from './types';

/**
 * Service pour gérer la validation des tickets via /api/scanner/scan-ticket
 */
export class ValidationService {
  /**
   * Valider un ticket par scan QR
   */
  static async validateTicket(
    ticket_code: string,
    event_id?: string | number | null
  ): Promise<TicketValidationResponse | null> {
    try {
      const agent = AuthService.getAgentData();
      if (!agent?.id_agent) {
        return {
          success: false,
          message: 'Agent non connecté',
          code: 'AGENT_NOT_AUTHENTICATED',
        };
      }

      let resolvedEventId = event_id;
      if (resolvedEventId == null) {
        const storedEvent = localStorage.getItem('current_event');
        if (storedEvent) {
          try {
            resolvedEventId = JSON.parse(storedEvent).event_id;
          } catch {
            resolvedEventId = null;
          }
        }
      }

      if (resolvedEventId == null) {
        return {
          success: false,
          message: 'Événement non sélectionné',
          code: 'EVENT_REQUIRED',
        };
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCAN_TICKET}`,
        {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({
            ticket_code: String(ticket_code),
            event_id: Number(resolvedEventId),
            agent_id: String(agent.id_agent),
          }),
        }
      );

      const payload = await response.json();

      if (payload.success && payload.code === 'SCAN_SUCCESS') {
        return {
          success: true,
          message: payload.message || 'Ticket scanné avec succès',
          code: payload.code,
          data: this.normalizeTicketInfo(payload.data),
        };
      }

      // Déjà scanné : infos dans ticket_info
      if (payload.code === 'TICKET_ALREADY_SCANNED') {
        return {
          success: false,
          message: payload.message || 'Ce ticket a déjà été scanné',
          code: payload.code,
          data: this.normalizeTicketInfo(payload.ticket_info),
        };
      }

      return {
        success: false,
        message: payload.message || 'Échec de la validation',
        code: payload.code,
        data: this.normalizeTicketInfo(payload.data || payload.ticket_info),
      };
    } catch (error) {
      console.error('❌ [VALIDATION] Erreur:', error);
      return null;
    }
  }

  private static normalizeTicketInfo(raw: unknown): ScannedTicketInfo | undefined {
    if (!raw || typeof raw !== 'object') return undefined;
    const info = raw as Record<string, unknown>;
    return {
      ticket_number: String(info.ticket_number ?? info.ticketNumber ?? ''),
      participant_name: String(info.participant_name ?? ''),
      participant_email: String(
        info.participant_email ?? info.participantEmailAddress ?? ''
      ),
      buyer_name: String(info.buyer_name ?? info.buyerName ?? ''),
      event_title: info.event_title ? String(info.event_title) : undefined,
      scan_time: info.scan_time ? String(info.scan_time) : undefined,
      scanned_at: info.scanned_at ? String(info.scanned_at) : undefined,
    };
  }

  static isValidationSuccess(response: TicketValidationResponse): boolean {
    return response.success === true && response.code === 'SCAN_SUCCESS';
  }

  static isAlreadyValidated(response: TicketValidationResponse): boolean {
    return response.code === 'TICKET_ALREADY_SCANNED';
  }

  static getParticipantName(data: ScannedTicketInfo): string {
    return data.participant_name?.trim() || 'Participant';
  }

  static getBuyerName(data: ScannedTicketInfo): string {
    return data.buyer_name?.trim() || 'Acheteur';
  }
}
