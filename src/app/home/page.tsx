'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthService, EventService, TicketService, type Event } from '@/services';

export default function HomePage() {
  const router = useRouter();
  const [agentData, setAgentData] = useState<ReturnType<typeof AuthService.getAgentData>>(null);
  const [eventsEnCours, setEventsEnCours] = useState<Event[]>([]);
  const [eventsAvenir, setEventsAvenir] = useState<Event[]>([]);
  const [ticketStatsMap, setTicketStatsMap] = useState<Record<number, { remaining: number | null; validated: number | null }>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const data = AuthService.getAgentData();
    if (!data) {
      router.push('/');
      return;
    }
    setAgentData(data);
    loadEvents(data.id_agent);
  }, [router]);

  const loadEvents = async (id_agent: string) => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle
      const [eventEnCoursData, eventsAvenirData] = await Promise.all([
        EventService.getEventEnCours(id_agent),
        EventService.getEventsAvenir(id_agent),
      ]);

      console.log('🔍 [HOME] Événements en cours:', eventEnCoursData);
      console.log('🔍 [HOME] Événements à venir:', eventsAvenirData);

      // Récupérer tous les événements en cours
      const eventsEnCoursArray = eventEnCoursData.success ? eventEnCoursData.data : [];
      setEventsEnCours(eventsEnCoursArray);
      setEventsAvenir(eventsAvenirData.success ? eventsAvenirData.data : []);

      // Charger les statistiques pour tous les événements en cours
      if (eventsEnCoursArray.length > 0) {
        const statsPromises = eventsEnCoursArray.map(async (event) => {
          const [remaining, validated] = await Promise.all([
            TicketService.getNbTicketRestant(event.event_id.toString()),
            TicketService.getNbTicketValidated(event.event_id.toString()),
          ]);
          return {
            eventId: event.event_id,
            stats: { remaining, validated }
          };
        });

        const statsResults = await Promise.all(statsPromises);
        const statsMap: Record<number, { remaining: number | null; validated: number | null }> = {};
        statsResults.forEach(({ eventId, stats }) => {
          statsMap[eventId] = stats;
        });
        setTicketStatsMap(statsMap);
      } else {
        setTicketStatsMap({});
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!agentData) return;
    
    setRefreshing(true);
    await loadEvents(agentData.id_agent);
    setRefreshing(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
  };

  // Fonction pour vérifier si le scan est possible pour un événement
  const isScanAvailable = (event: Event): boolean => {
    if (!event.scan_date || !event.start_date) return false;
    
    const now = new Date();
    const eventStart = new Date(event.start_date);
    const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
    const hoursBeforeEvent = event.scan_date; // Nombre d'heures avant le début
    
    // Calculer l'heure à partir de laquelle le scan est possible
    const scanAvailableTime = new Date(eventStart.getTime() - (hoursBeforeEvent * 60 * 60 * 1000));
    
    // Le scan est possible si on est après l'heure autorisée et avant la fin de l'événement
    return now >= scanAvailableTime && now <= eventEnd;
  };

  // Fonction pour obtenir le message de disponibilité du scan
  const getScanAvailabilityMessage = (event: Event): string => {
    if (!event.scan_date || !event.start_date) return '';
    
    const now = new Date();
    const eventStart = new Date(event.start_date);
    const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
    const hoursBeforeEvent = event.scan_date;
    const scanAvailableTime = new Date(eventStart.getTime() - (hoursBeforeEvent * 60 * 60 * 1000));
    
    if (now < scanAvailableTime) {
      // Calculer le temps restant avant que le scan soit disponible
      const diffMs = scanAvailableTime.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 0) {
        return `Scan disponible dans ${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`;
      } else {
        return `Scan disponible dans ${diffMinutes}min`;
      }
    } else if (now >= scanAvailableTime && now <= eventEnd) {
      return 'Scan disponible maintenant';
    } else {
      return 'Scan terminé';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b">
        {/* Avatar et numéro */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {agentData?.nom_agent?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="text-3xl font-bold text-black">{agentData?.nom_agent || 'Agent'}</span>
        </div>

        {/* Matricule et déconnexion */}
        <div className="flex flex-col items-end gap-2">
          <div className="bg-[#8BC34A] text-white px-6 py-2 rounded-lg font-semibold">
            {agentData?.matricule_agent || 'N/A'}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-semibold text-lg hover:text-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="p-6">
        {/* Section Événements en cours */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-[#8BC34A]"></div>
            <h2 className="text-2xl font-bold text-black">Événements en cours</h2>
            {eventsEnCours.length > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                {eventsEnCours.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="bg-gray-100 rounded-3xl p-12 flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="animate-spin h-12 w-12 text-[#8BC34A]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-500 text-lg">Chargement...</span>
              </div>
            </div>
          ) : eventsEnCours.length > 0 ? (
            <div className="overflow-x-auto pb-4 -mx-6 px-6">
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {eventsEnCours.map((event) => {
                  const stats = ticketStatsMap[event.event_id] || { remaining: null, validated: null };
                  return (
                    <div 
                      key={event.event_id}
                      className="flex-shrink-0 w-[380px] bg-white rounded-3xl shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow"
                    >
                      {/* Image de l'événement */}
                      <div 
                        onClick={() => {
                          localStorage.setItem('current_event', JSON.stringify(event));
                          router.push(`/event/${event.event_id}`);
                        }}
                        className="relative h-64 bg-gradient-to-br from-pink-400 to-purple-600 cursor-pointer hover:opacity-95 transition-opacity"
                      >
                        {event.image && (
                          <Image
                            src={EventService.getImageUrl(event.image)}
                            alt={event.title || 'Événement'}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/30"></div>
                        
                        {/* Titre de l'événement en overlay */}
                        <div className="absolute top-6 left-6 right-20 z-10">
                          <h3 className="text-white text-2xl font-bold drop-shadow-lg line-clamp-2">
                            {event.title}
                          </h3>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
                          {/* Badge En cours */}
                          <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 animate-pulse">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            En cours
                          </span>
                          
                          {/* Badge Scan disponibilité */}
                          {event.scan_date && (
                            <span className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 ${
                              isScanAvailable(event) 
                                ? 'bg-green-500 text-white' 
                                : 'bg-yellow-500 text-white'
                            }`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                                />
                              </svg>
                              {getScanAvailabilityMessage(event)}
                            </span>
                          )}
                        </div>

                        {/* Cartes de statistiques */}
                        <div className="absolute bottom-6 left-6 right-6 z-10 grid grid-cols-2 gap-4">
                          {/* Carte Tickets restant */}
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 text-[#8BC34A]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3v.75M9.75 3h4.5m-4.5 15h4.5M12 3v18"
                                />
                              </svg>
                              <span className="text-sm font-semibold text-gray-600">Tickets restant</span>
                            </div>
                            <div className="text-4xl font-bold text-[#8BC34A]">
                              {stats.remaining !== null ? stats.remaining : '--'}
                            </div>
                          </div>

                          {/* Carte Participants */}
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 text-[#8BC34A]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                />
                              </svg>
                              <span className="text-sm font-semibold text-gray-600">Participants</span>
                            </div>
                            <div className="text-4xl font-bold text-[#8BC34A]">
                              {stats.validated !== null ? stats.validated : '--'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-500 mb-2">
                Aucun événement en cours
              </h3>
              <p className="text-gray-400 text-lg">
                En attente d&apos;un événement actif
              </p>
            </div>
          )}
        </section>

        {/* Section Événements à venir */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-[#8BC34A]"></div>
            <h2 className="text-2xl font-bold text-black">Événements à venir</h2>
            <span className="text-2xl">📅</span>
            {eventsAvenir.length > 0 && (
              <span className="bg-[#8BC34A] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {eventsAvenir.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="bg-gray-100 rounded-3xl p-12 flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="animate-spin h-12 w-12 text-[#8BC34A]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-500 text-lg">Chargement...</span>
              </div>
            </div>
          ) : eventsAvenir.length > 0 ? (
            <div className="overflow-x-auto pb-4 -mx-6 px-6">
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {eventsAvenir.map((event) => (
                  <div
                    key={event.event_id}
                    onClick={() => {
                      localStorage.setItem('current_event', JSON.stringify(event));
                      router.push(`/event/${event.event_id}`);
                    }}
                    className="flex-shrink-0 w-[320px] bg-white rounded-3xl shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    {/* Badges */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                      
                      {/* Badge Scan disponibilité */}
                      {event.scan_date && (
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          isScanAvailable(event) 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-400 text-white'
                        }`}>
                          Scan: {event.scan_date}h avant
                        </span>
                      )}
                    </div>

                    {/* Image de l'événement */}
                    <div className="relative h-48 bg-gradient-to-br from-pink-400 to-purple-600">
                      {event.image && (
                        <Image
                          src={EventService.getImageUrl(event.image)}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>

                    {/* Informations de l'événement */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-3 text-black line-clamp-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm">
                          {new Date(event.start_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                            />
                          </svg>
                          <span className="text-sm line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">
                Aucun événement à venir
              </h3>
              <p className="text-gray-400">
                Les événements apparaîtront ici
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Bouton flottant de rafraîchissement */}
      <button 
        onClick={handleRefresh}
        disabled={refreshing}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#8BC34A] rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-[#7CB342] transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-8 h-8 ${refreshing ? 'animate-spin' : ''}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
}

