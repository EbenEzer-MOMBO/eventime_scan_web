'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  EventService,
  ParticipantService,
  TicketService,
  type Event,
  type Participant
} from '@/services';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [activeTab, setActiveTab] = useState<'description' | 'participants'>('description');
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketStats, setTicketStats] = useState<{
    total: number | null;
    validated: number | null;
    remaining: number | null
  }>({ total: null, validated: null, remaining: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);

      // Récupérer l'événement depuis localStorage
      const storedEvent = localStorage.getItem('current_event');
      if (storedEvent) {
        const parsedEvent = JSON.parse(storedEvent);
        setEvent(parsedEvent);
      }

      // Charger les données en parallèle
      const [participantsResponse, stats] = await Promise.all([
        ParticipantService.getParticipantsList(eventId),
        TicketService.getTicketStats(eventId),
      ]);

      setParticipants(participantsResponse.data);
      setTicketStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les participants selon la recherche
  const filteredParticipants = participants.filter(participant => {
    const query = searchQuery.toLowerCase();
    return (
      participant.buyer_name?.toLowerCase().includes(query) ||
      participant.ticket_number?.toLowerCase().includes(query) ||
      participant.participant_email?.toLowerCase().includes(query) ||
      participant.participant_name?.toLowerCase().includes(query) ||
      participant.participant_lastname?.toLowerCase().includes(query)
    );
  });

  const handleBack = () => {
    // Rediriger vers la page d'accueil
    router.push('/home');
  };

  const handleScan = () => {
    // Redirection vers la page scanner avec l'ID de l'événement
    router.push(`/scanner?eventId=${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    );
  }

  // Récupérer les participants validés
  const validatedParticipants = ParticipantService.filterValidatedParticipants(participants);
  const pendingParticipants = ParticipantService.filterPendingParticipants(participants);

  return (
    <div className="min-h-screen bg-white">
      {/* Image de l'événement avec header */}
      <div className="relative h-[450px] bg-gradient-to-br from-pink-400 to-purple-600 overflow-hidden">
        {/* Image de fond */}
        {event?.image && (
          <Image
            src={EventService.getImageUrl(event.image)}
            alt={event.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Bouton retour */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 z-20 text-white hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Badge participants */}
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-[#8BC34A] text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg">
            Participant(s): {ticketStats.validated !== null ? ticketStats.validated : '--'}
          </div>
        </div>
      </div>

      {/* Titre de l'événement */}
      <div className="bg-[#8BC34A] text-white text-center py-6 px-6">
        <h1 className="text-3xl font-bold">{event?.title || 'Événement'}</h1>
      </div>

      {/* Onglets */}
      <div className="flex bg-gray-100 mx-4 mt-6 rounded-2xl overflow-hidden">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${activeTab === 'description'
              ? 'bg-[#8BC34A] text-white'
              : 'bg-gray-100 text-gray-500'
            }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${activeTab === 'participants'
              ? 'bg-[#8BC34A] text-white'
              : 'bg-gray-100 text-gray-500'
            }`}
        >
          Participants
        </button>
      </div>

      {/* Contenu */}
      <div className="p-6 pb-24">
        {activeTab === 'description' && (
          <div className="space-y-6">
            {/* Titre section */}
            <h2 className="text-3xl font-bold text-[#8BC34A] text-center mb-6">
              DESCRIPTION
            </h2>

            {/* Description */}
            <div className="space-y-4 text-base leading-relaxed">
              {event?.description ? (
                <div
                  className="text-justify text-gray-700"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              ) : (
                <p className="text-center text-gray-500">Aucune description disponible</p>
              )}

              {/* Informations de l'événement */}
              <div className="mt-8 space-y-4">
                {event?.start_date && (
                  <p className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                    <span className="text-2xl">📅</span>
                    <span className="flex-1">
                      <strong className="block text-gray-700">Date de début:</strong>
                      <span className="text-gray-600">
                        {EventService.formatDate(event.start_date)}
                      </span>
                    </span>
                  </p>
                )}

                {event?.end_date && (
                  <p className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                    <span className="text-2xl">🏁</span>
                    <span className="flex-1">
                      <strong className="block text-gray-700">Date de fin:</strong>
                      <span className="text-gray-600">
                        {EventService.formatDate(event.end_date)}
                      </span>
                    </span>
                  </p>
                )}

                {event?.location && (
                  <p className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                    <span className="text-2xl">📍</span>
                    <span className="flex-1">
                      <strong className="block text-gray-700">Lieu:</strong>
                      <span className="text-gray-600">{event.location}</span>
                    </span>
                  </p>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-[#8BC34A]/10 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#8BC34A]">
                      {ticketStats.total !== null ? ticketStats.total : '--'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total billets</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {ticketStats.validated !== null ? ticketStats.validated : '--'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Validés</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {ticketStats.remaining !== null ? ticketStats.remaining : '--'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Restants</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-6">
            {/* Header participants avec compteur */}
            <div className="bg-[#8BC34A] rounded-3xl p-6 flex items-center justify-center gap-6">
              <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>

              <div className="text-center text-white">
                <div className="text-5xl font-bold">{participants.length}</div>
                <div className="text-xl font-semibold">Participants</div>
              </div>

              <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un participant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-full px-6 py-4 pl-14 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8BC34A] transition-colors"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-2 ml-2">
                  {filteredParticipants.length} résultat{filteredParticipants.length > 1 ? 's' : ''} trouvé{filteredParticipants.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Liste des participants */}
            {filteredParticipants.length > 0 ? (
              <div className="space-y-4">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.ticket_item_id}
                    className={`bg-white border-2 rounded-3xl p-5 flex items-center gap-4 ${participant.status === 1 ? 'border-green-200' : 'border-orange-200'
                      }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ${ParticipantService.getStatusColor(participant)
                        }`}
                    >
                      {ParticipantService.getParticipantInitial(participant)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-500 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        <span className="font-bold text-lg text-gray-600 truncate">
                          {ParticipantService.truncateText(
                            ParticipantService.getFullName(participant),
                            20
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-500 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3v.75M9.75 3h4.5m-4.5 15h4.5M12 3v18"
                          />
                        </svg>
                        <span className="text-gray-600 truncate">
                          {ParticipantService.truncateText(participant.ticket_number, 15)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-500 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        <span className="text-gray-600 truncate">
                          {ParticipantService.truncateText(participant.participant_email, 20)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-500 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
                        <span className="text-gray-600 truncate">{participant.buyer_name}</span>
                      </div>
                    </div>

                    <div
                      className={`text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 flex-shrink-0 ${ParticipantService.getStatusColor(participant)
                        }`}
                    >
                      {participant.status === 1 ? (
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
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
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
                      )}
                      {ParticipantService.getStatusLabel(participant)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center">
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
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-500 mb-2">
                  {searchQuery ? 'Aucun résultat' : 'Aucun participant'}
                </h3>
                <p className="text-gray-400">
                  {searchQuery
                    ? `Aucun participant ne correspond à "${searchQuery}"`
                    : 'Les participants apparaîtront ici'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 bg-[#8BC34A] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#7CB342] transition-colors"
                  >
                    Réinitialiser la recherche
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bouton flottant Scanner QR */}
      <button
        onClick={handleScan}
        className="fixed bottom-8 right-1/2 transform translate-x-1/2 w-20 h-20 bg-[#8BC34A] rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-[#7CB342] transition-all hover:scale-110 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10"
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
      </button>
    </div>
  );
}
