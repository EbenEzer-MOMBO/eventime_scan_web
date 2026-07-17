// Configuration de l'API Eventime Scanner

export const API_CONFIG = {
  BASE_URL: 'https://eventime.ga/api',
  ENDPOINTS: {
    LOGIN: '/scanner/login',
    EVENTS_AVENIR: '/scanner/events-avenir',
    EVENTS_EN_COURS: '/scanner/events-en-cours',
    EVENT_STATS: '/scanner/event-stats',
    PARTICIPANTS_LIST: '/scanner/participants-list',
    SCAN_TICKET: '/scanner/scan-ticket',
  },
  TIMEOUT: 10000,
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};
