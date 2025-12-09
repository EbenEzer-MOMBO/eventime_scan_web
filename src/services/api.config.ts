// Configuration de l'API Eventime

export const API_CONFIG = {
  BASE_URL: 'https://eventime.ga/api',
  ENDPOINTS: {
    SPB_INDEX: '/spb_index.php',
    EVENTS_AVENIR: '/mobile/events-avenir',
    EVENTS_EN_COURS: '/mobile/events-en-cours',
    PARTICIPANTS_LIST: '/mobile/participants-list',
  },
  TIMEOUT: 10000, // 10 secondes
};

// Headers par défaut pour toutes les requêtes
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

