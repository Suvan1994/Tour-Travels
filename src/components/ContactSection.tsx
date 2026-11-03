import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useAppConfig } from '../context/AppConfigContext';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';

const INITIAL_INDIA_VIEWPORT = { lat: 28.55, lng: 77.1 };

function checkQuotaError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('QuotaExceededError') ||
    msg.includes('429')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
}

interface HeadquartersFinderProps {
  searchQuery: string;
  onResolved: (pos: { lat: number; lng: number } | null) => void;
}

const HeadquartersFinder: React.FC<HeadquartersFinderProps> = ({ searchQuery, onResolved }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!map || !placesLib || !searchQuery.trim()) return;

    let cancelled = false;

    placesLib.Place.searchByText({
      textQuery: searchQuery,
      fields: ['displayName', 'formattedAddress', 'location', 'viewport'],
      maxResultCount: 1,
      region: 'IN',
    })
      .then(({ places }) => {
        if (cancelled || !places || places.length === 0) return;
        const place = places[0];
        if (place.location) {
          const coords = {
            lat: place.location.lat(),
            lng: place.location.lng(),
          };
          onResolved(coords);
          if (place.viewport) {
            map.fitBounds(place.viewport);
          } else {
            map.setCenter(coords);
            map.setZoom(13);
          }
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          checkQuotaError(err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [map, placesLib, searchQuery, onResolved]);

  return null;
};

const HUB_DESTINATION_QUERIES: Record<string, string> = {
  'Delhi NCR Hub': 'Indira Gandhi International Airport, New Delhi, India',
  'Jaipur Office': 'Jaipur, Rajasthan, India',
  'Agra Expressway Desk': 'Agra, Uttar Pradesh, India',
  'Haridwar Station Desk': 'Haridwar, Uttarakhand, India',
};

export const ContactSection: React.FC<{ hasMapsApiKey: boolean }> = ({ hasMapsApiKey }) => {
  const { contactConfig, loadRoutePreset } = useAppConfig();
  const [hqPosition, setHqPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [activeHubQuery, setActiveHubQuery] = useState<string>(
    contactConfig.headquartersPlaceSearchQuery
  );
  const [activeHubLabel, setActiveHubLabel] = useState<string>('JMD Delhi NCR Central Dispatch Hub');

  useEffect(() => {
    setActiveHubQuery(contactConfig.headquartersPlaceSearchQuery);
  }, [contactConfig.headquartersPlaceSearchQuery]);

  const whatsappChatUrl = buildWhatsAppUrl(
    contactConfig.whatsappNumberInternational,
    `Hello ${contactConfig.businessName}, I need travel assistance / a trip quotation.`
  );

  const handleHubSelect = (hubName: string) => {
    const query = HUB_DESTINATION_QUERIES[hubName] || `${hubName}, North India`;
    setActiveHubQuery(query);
    setActiveHubLabel(`JMD ${hubName}`);
  };

  const handlePlanFromHub = (hubName: string) => {
    const query = HUB_DESTINATION_QUERIES[hubName] || `${hubName}, India`;
    loadRoutePreset({
      originAddress: 'New Delhi, Delhi, India',
      destinationAddress: query,
    });
    document.getElementById('quick-booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="contact-us" className="w-full py-space-xl bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="bg-surface-canvas rounded-3xl p-space-lg lg:p-space-xl shadow-lg border border-border-subtle grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left Column: Contact Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-space-lg">
            <div className="flex flex-col gap-space-sm">
              <span className="text-label-md text-secondary uppercase font-bold tracking-widest">
                Connect With Jai Maa Durge
              </span>
              <h2 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight">
                24x7 Operations &amp; Travel Assistance
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Our central dispatch office operates round the clock. Reach us anytime for route estimates, fleet queries, or highway assistance.
              </p>
            </div>

            <div className="flex flex-col gap-space-md">
              {/* Headquarters */}
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    location_on
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label-lg font-bold text-on-surface">
                    {contactConfig.headquartersLabel}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {contactConfig.headquartersAddress}
                  </span>
                </div>
              </div>

              {/* Direct Call Line */}
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    call
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label-lg font-bold text-on-surface">Direct Call Line</span>
                  <a
                    href={contactConfig.phoneHref}
                    className="text-title-md font-bold text-primary hover:text-secondary transition-colors"
                  >
                    {contactConfig.phoneDisplay}
                  </a>
                  <span className="text-label-sm text-on-surface-variant">
                    Always Open (24x7 / 365 Days)
                  </span>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-success-green shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    chat
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label-lg font-bold text-on-surface">WhatsApp Support</span>
                  <a
                    href={whatsappChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-md font-bold text-success-green hover:underline"
                  >
                    {contactConfig.phoneDisplay} (Click to Chat)
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    mail
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label-lg font-bold text-on-surface">
                    Corporate Bookings Email
                  </span>
                  <a
                    href={`mailto:${contactConfig.email}`}
                    className="text-body-md text-primary hover:underline break-all"
                  >
                    {contactConfig.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-xs text-on-surface-variant text-label-sm">
              <span className="material-symbols-outlined text-rating-gold text-[16px]" aria-hidden="true">
                verified
              </span>
              <span>Licensed Tourist Transport Operator • All-India Permits</span>
            </div>
          </div>

          {/* Right Column: Interactive Hub Map & Corridor Chips (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-md relative bg-surface-container border border-border-subtle">
              {hasMapsApiKey ? (
                <GoogleMap
                  mapId="DEMO_MAP_ID"
                  defaultCenter={INITIAL_INDIA_VIEWPORT}
                  defaultZoom={11}
                  gestureHandling="cooperative"
                  mapTypeControl={false}
                  streetViewControl={false}
                  fullscreenControl={true}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  className="w-full h-full"
                >
                  <HeadquartersFinder searchQuery={activeHubQuery} onResolved={setHqPosition} />
                  {hqPosition && (
                    <AdvancedMarker position={hqPosition} title={activeHubLabel}>
                      <Pin
                        background="#001b3a"
                        borderColor="#F5B942"
                        glyphColor="#F5B942"
                      />
                    </AdvancedMarker>
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full bg-primary-container text-surface-canvas p-space-lg flex flex-col items-center justify-center text-center gap-2">
                  <span className="material-symbols-outlined text-rating-gold text-[32px]">
                    map
                  </span>
                  <p className="text-title-md font-bold">Interactive Dispatch Hub Map</p>
                  <p className="text-body-sm text-surface-container-high max-w-md">
                    Configure <code className="bg-surface-canvas/10 px-1.5 py-0.5 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to view live Google Maps dispatch hub pins across Delhi NCR, Jaipur, Agra, and Haridwar.
                  </p>
                </div>
              )}

              {/* Hub Overlay Badge */}
              <div className="pointer-events-none absolute bottom-4 left-4 bg-surface-canvas/95 backdrop-blur-md px-space-md py-space-xs rounded-xl shadow-md flex items-center gap-space-xs border border-border-subtle">
                <span className="w-2.5 h-2.5 rounded-full bg-success-green animate-ping" />
                <span className="text-label-md text-primary font-bold">{activeHubLabel}</span>
              </div>
            </div>

            {/* Interactive Service Hub Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs text-center text-label-sm">
              {contactConfig.serviceHubs.map((hub) => {
                const isSelected = activeHubLabel === `JMD ${hub}` || (hub === 'Delhi NCR Hub' && activeHubLabel.includes('Delhi NCR'));
                return (
                  <div
                    key={hub}
                    className={`rounded-lg p-space-sm border transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-surface-canvas border-primary shadow-sm'
                        : 'bg-surface-subtle text-on-surface border-border-subtle hover:bg-surface-container'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleHubSelect(hub)}
                      className="font-semibold w-full text-center focus:outline-none"
                    >
                      {hub}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlanFromHub(hub)}
                      className={`text-[11px] underline ${
                        isSelected ? 'text-rating-gold' : 'text-secondary'
                      }`}
                    >
                      Plan Route
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
