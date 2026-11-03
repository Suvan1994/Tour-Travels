import React from 'react';
import { POPULAR_FOOTER_DESTINATIONS } from '../config/destinationsConfig';
import { useAppConfig } from '../context/AppConfigContext';
import { JourneyType } from '../types/travel';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';

const FOOTER_FLEET_SUMMARY = [
  { label: 'Sedan (Dzire / Etios)', vehicleId: 'sedan', capacityLabel: '4 Seater' },
  { label: 'Ertiga / Kia Carens', vehicleId: 'ertiga-carens', capacityLabel: '6 Seater' },
  { label: 'Toyota Innova Crysta', vehicleId: 'innova-crysta', capacityLabel: '7 Seater' },
  { label: 'Force Urbania Vans', vehicleId: 'urbania-10-13', capacityLabel: '10–17 Seater' },
  { label: 'Tempo Travellers', vehicleId: 'traveller-16', capacityLabel: '9–20 Seater' },
  { label: 'Mini & Luxury AC Buses', vehicleId: 'bus-35-40', capacityLabel: '25–50 Seater' },
];

export const Footer: React.FC = () => {
  const {
    contactConfig,
    pricingConfig,
    setSelectedVehicleId,
    loadRoutePreset,
    isAdminAuthenticated,
    setIsAdminModalOpen,
  } = useAppConfig();

  const whatsappSupportUrl = buildWhatsAppUrl(
    contactConfig.whatsappNumberInternational,
    `Hello ${contactConfig.businessName}, I would like assistance planning a road trip.`
  );

  const handleFleetClick = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    document.getElementById('our-fleet')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDestinationClick = (destinationQuery: string, isCharDham?: boolean) => {
    loadRoutePreset({
      originAddress: 'New Delhi, Delhi, India',
      destinationAddress: destinationQuery,
      days: isCharDham ? 10 : 2,
      journeyType: JourneyType.ROUND_TRIP,
      customQuote: Boolean(isCharDham),
    });
    document.getElementById('quick-booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary-container text-surface-canvas pt-space-xl pb-space-lg shadow-[0_-2px_12px_rgba(0,14,31,0.08)]">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl mb-space-xl">
          {/* Column 1: Brand Summary */}
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-canvas/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-rating-gold text-[24px]" aria-hidden="true">
                  directions_car
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-title-md text-surface-canvas font-bold">
                  {contactConfig.shortName}
                </span>
                <span className="text-label-sm text-secondary-fixed-dim">
                  Jai Maa Durge Tour &amp; Travels
                </span>
              </div>
            </div>

            <p className="text-body-sm text-surface-container-high leading-relaxed">
              Your trusted outstation cab, Force Urbania, Tempo Traveller, and luxury coach rental partner across North India. Dedicated to clean vehicles, verified highway chauffeurs, and transparent per-kilometre tariffs.
            </p>

            <div className="flex items-center gap-space-sm">
              <div className="flex items-center text-rating-gold gap-space-xs">
                <span
                  className="material-symbols-outlined material-symbol-filled text-[18px]"
                  aria-hidden="true"
                >
                  star
                </span>
                <span className="text-label-md font-bold">{contactConfig.googleRating}</span>
              </div>
              <span className="text-body-sm text-surface-dim">
                • {contactConfig.totalTripsLabel} Journeys
              </span>
            </div>
          </div>

          {/* Column 2: Our Premium Fleet */}
          <div className="flex flex-col gap-space-md">
            <h4 className="text-title-md text-surface-canvas font-bold">Our Premium Fleet</h4>
            <ul className="flex flex-col gap-space-sm text-body-sm text-surface-container-high">
              {FOOTER_FLEET_SUMMARY.map((item) => {
                const rate = pricingConfig.vehicleRates[item.vehicleId]?.ratePerKm;
                return (
                  <li key={item.vehicleId}>
                    <button
                      type="button"
                      onClick={() => handleFleetClick(item.vehicleId)}
                      className="w-full flex items-center justify-between gap-2 text-left hover:text-surface-canvas transition-colors group"
                    >
                      <span className="group-hover:underline">{item.label}</span>
                      <span className="text-label-sm text-rating-gold shrink-0">
                        {item.capacityLabel} {rate ? `• ₹${rate}/km` : ''}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Popular Destinations */}
          <div className="flex flex-col gap-space-md">
            <h4 className="text-title-md text-surface-canvas font-bold">Popular Destinations</h4>
            <div className="grid grid-cols-2 gap-space-sm text-body-sm text-surface-container-high">
              {POPULAR_FOOTER_DESTINATIONS.map((dest) => (
                <button
                  key={dest.label}
                  type="button"
                  onClick={() => handleDestinationClick(dest.destinationQuery, dest.highlight)}
                  className={`text-left hover:text-surface-canvas hover:underline transition-colors ${
                    dest.highlight ? 'text-rating-gold font-semibold' : ''
                  }`}
                >
                  {dest.label}
                </button>
              ))}
            </div>

            <div className="mt-space-sm p-space-sm rounded-lg bg-surface-canvas/5 border border-surface-canvas/10">
              <span className="text-label-md text-secondary-fixed-dim block font-bold mb-1">
                Custom Route Planning
              </span>
              <span className="text-body-sm text-surface-container-high block">
                Multi-city family holidays, pilgrimage yatras, and wedding bus fleets tailored to your itinerary.
              </span>
            </div>
          </div>

          {/* Column 4: 24x7 Direct Support */}
          <div className="flex flex-col gap-space-md">
            <h4 className="text-title-md text-surface-canvas font-bold">24x7 Direct Support</h4>
            <p className="text-body-sm text-surface-container-high">
              Outstation bookings, airport pickups, corporate fleet contracts, and round-the-clock dispatch support.
            </p>

            <div className="flex flex-col gap-space-xs">
              <a
                href={contactConfig.phoneHref}
                className="flex items-center gap-space-sm text-surface-canvas hover:text-rating-gold transition-colors"
              >
                <span className="material-symbols-outlined text-rating-gold text-[20px]" aria-hidden="true">
                  headset_mic
                </span>
                <span className="text-title-md font-bold">{contactConfig.phoneDisplay}</span>
              </a>
              <span className="text-label-sm text-surface-dim pl-7">
                Central Booking Helpline (24 Hours)
              </span>
            </div>

            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-space-sm bg-success-green hover:bg-success-green/90 text-on-secondary px-space-md py-space-sm rounded-lg text-label-lg font-bold shadow-[0_4px_16px_rgba(27,135,86,0.3)] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                chat
              </span>
              <span>Direct WhatsApp Support</span>
            </a>

            <div className="flex items-center gap-space-sm text-surface-dim text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-rating-gold" aria-hidden="true">
                security
              </span>
              <span>Verified Commercial Drivers &amp; Sanitized Fleet</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Navigation Strip */}
        <div className="pt-space-md border-t border-surface-canvas/10 flex flex-col lg:flex-row items-center justify-between gap-space-md text-label-md text-surface-dim">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>
              © {currentYear} {contactConfig.businessName}. All Rights Reserved.
            </p>
            <span className="hidden sm:inline">•</span>
            <span className="text-label-sm">
              Maps powered by Google Maps (
              <a
                href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-surface-canvas"
              >
                Terms
              </a>{' '}
              &amp;{' '}
              <a
                href="https://policies.google.com/privacy?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-surface-canvas"
              >
                Privacy
              </a>
              )
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <a href="#fare-estimator" className="hover:text-surface-canvas transition-colors">
              Fare Calculator
            </a>
            <a href="#our-fleet" className="hover:text-surface-canvas transition-colors">
              Vehicle Rates
            </a>
            <a href="#faqs" className="hover:text-surface-canvas transition-colors">
              Booking Policies
            </a>
            <a href="#contact-us" className="hover:text-surface-canvas transition-colors">
              24x7 Dispatch
            </a>
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1 text-rating-gold hover:text-surface-canvas transition-colors font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                {isAdminAuthenticated ? 'lock_open' : 'lock'}
              </span>
              <span>{isAdminAuthenticated ? 'Admin Settings' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
