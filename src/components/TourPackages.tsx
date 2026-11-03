import React from 'react';
import { TOUR_PACKAGES } from '../config/destinationsConfig';
import { useAppConfig } from '../context/AppConfigContext';
import { JourneyType, TourPackageItem } from '../types/travel';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';
import { ResilientImage } from './ResilientImage';

export const TourPackages: React.FC = () => {
  const { contactConfig, loadRoutePreset } = useAppConfig();

  const handleLoadPackage = (pkg: TourPackageItem) => {
    loadRoutePreset({
      originAddress: pkg.originQuery,
      destinationAddress: pkg.destinationQuery,
      vehicleId: pkg.recommendedVehicleId,
      days: pkg.recommendedDays,
      journeyType: JourneyType.ROUND_TRIP,
      customQuote: Boolean(pkg.isCustomQuote),
    });

    const bookingEl = document.getElementById('quick-booking');
    bookingEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tour-packages" className="w-full py-space-xl bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <span className="text-label-md text-secondary uppercase font-bold tracking-widest">
              Handcrafted Itineraries
            </span>
            <h2 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight">
              Popular North India Tour Packages
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Door-to-door outstation circuits with seasoned hill chauffeurs and flexible sightseeing stops. Click any package to calculate live route distance &amp; estimated fare.
            </p>
          </div>

          <a
            href="#price-enquiry"
            className="inline-flex items-center gap-space-xs text-secondary text-label-lg font-bold hover:underline whitespace-nowrap"
          >
            <span>Request Custom Multi-City Itinerary</span>
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_forward
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {TOUR_PACKAGES.map((pkg) => {
            const badgeClass =
              pkg.badgeVariant === 'gold'
                ? 'bg-rating-gold text-primary'
                : pkg.badgeVariant === 'secondary'
                  ? 'bg-secondary text-surface-canvas'
                  : 'bg-primary text-surface-canvas';

            const directPkgWhatsApp = buildWhatsAppUrl(
              contactConfig.whatsappNumberInternational,
              `*NEW ENQUIRY - JMD TOUR & TRAVELS*\n\nPackage Enquiry: ${pkg.title}\nPickup: ${pkg.originQuery}\nDestination: ${pkg.destinationQuery}\nRecommended Duration: ${pkg.recommendedDays} Days\n\nPlease share best fare and itinerary details.`
            );

            return (
              <article
                key={pkg.id}
                className="bg-surface-canvas rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between border border-primary-container/6"
              >
                <div>
                  <div className="relative w-full h-48 overflow-hidden bg-surface-container">
                    <ResilientImage
                      src={pkg.imageUrl}
                      alt={pkg.imageAlt}
                      fallbackIcon="landscape"
                      fallbackLabel={pkg.title}
                    />
                    <div
                      className={`absolute top-3 left-3 ${badgeClass} text-label-sm font-bold px-2.5 py-1 rounded shadow-sm`}
                    >
                      {pkg.badge}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-surface-glass/90 backdrop-blur-md px-2.5 py-1 rounded text-primary text-label-sm font-bold">
                      {pkg.corridorTag}
                    </div>
                  </div>

                  <div className="p-space-lg flex flex-col gap-space-sm">
                    <h3 className="text-title-md font-bold text-on-surface">{pkg.title}</h3>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-space-sm text-on-surface text-label-sm pt-2">
                      {pkg.highlights.map((h, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-secondary text-[16px]"
                            aria-hidden="true"
                          >
                            {h.icon}
                          </span>
                          <span>{h.text}</span>
                        </span>
                      ))}
                      {pkg.highlightNote && (
                        <span className="text-success-green font-bold">{pkg.highlightNote}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-space-lg pt-0 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-title-md font-bold text-primary">
                      {pkg.startingPriceLabel}
                    </span>
                    <span className="text-label-sm font-normal text-on-surface-variant">
                      {pkg.priceSubLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLoadPackage(pkg)}
                      className={`inline-flex items-center gap-1 px-space-md py-space-sm rounded-lg text-label-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                        pkg.isCustomQuote
                          ? 'bg-rating-gold text-primary shadow hover:bg-rating-gold/90'
                          : 'bg-secondary text-surface-canvas hover:bg-secondary/90'
                      }`}
                    >
                      <span>{pkg.ctaLabel}</span>
                    </button>

                    <a
                      href={directPkgWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Enquire about ${pkg.title} on WhatsApp`}
                      title="Chat on WhatsApp"
                      className="w-9 h-9 rounded-lg bg-success-green hover:bg-success-green/90 text-on-secondary flex items-center justify-center transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                        chat
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
