import React, { useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { VehicleCategory, VehicleDefinition } from '../types/travel';
import { calculateEstimatedFare, formatINR, getJourneyTypeLabel } from '../utils/fareCalculator';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';
import { ResilientImage } from './ResilientImage';

const CATEGORY_FILTERS: { id: VehicleCategory; label: string }[] = [
  { id: VehicleCategory.ALL, label: 'All Fleet (8)' },
  { id: VehicleCategory.URBANIA, label: 'Force Urbania (10–17S)' },
  { id: VehicleCategory.TEMPO, label: 'Tempo Travellers (9–20S)' },
  { id: VehicleCategory.BUS, label: 'Mini & Luxury Buses (27–50S)' },
];

export const VehicleCards: React.FC = () => {
  const {
    contactConfig,
    vehicles,
    pricingConfig,
    selectedVehicleId,
    setSelectedVehicleId,
    routeResult,
    journeyType,
    tripDays,
    includeTolls,
    includeParking,
    nightDrivingNights,
    includeGst,
    requestCustomQuotation,
    pickupPlace,
    destinationPlace,
  } = useAppConfig();

  const [activeCategory, setActiveCategory] = useState<VehicleCategory>(VehicleCategory.ALL);

  const visibleVehicles =
    activeCategory === VehicleCategory.ALL
      ? vehicles
      : vehicles.filter((v) => v.category === activeCategory);

  const handleSelectVehicle = (vehicle: VehicleDefinition, scrollToBooking = false) => {
    setSelectedVehicleId(vehicle.id);
    if (scrollToBooking) {
      const el = document.getElementById('quick-booking');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="our-fleet" className="w-full py-space-xl bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-xl">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <span className="text-label-md text-secondary uppercase font-bold tracking-widest">
              Pristine Fleet Selection • Click Any Card To Recalculate Fare
            </span>
            <h2 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight">
              Our Premium Commercial Fleet
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Every vehicle is sanitized, air-conditioned, commercially insured, and driven by tourist-certified chauffeurs. Select a vehicle below to update your live route estimate.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter Vehicles by Category"
            className="flex items-center gap-space-xs overflow-x-auto pb-1"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-space-md py-space-xs rounded-full text-label-md font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-primary text-surface-canvas shadow-sm'
                      : 'bg-surface-canvas text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {visibleVehicles.map((vehicle) => {
            const isSelected = vehicle.id === selectedVehicleId;
            const rateRule = pricingConfig.vehicleRates[vehicle.id];
            const ratePerKm = rateRule?.ratePerKm ?? 0;

            const cardEstimate = calculateEstimatedFare(
              {
                vehicleId: vehicle.id,
                oneWayRoadDistanceKm: routeResult ? routeResult.distanceKm : null,
                journeyType,
                tripDays,
                includeTolls,
                includeParking,
                nightDrivingNights,
                includeGst,
                requestCustomQuotation,
              },
              pricingConfig
            );

            const directEnquiryMsg = `*NEW ENQUIRY - JMD TOUR & TRAVELS*\n\nName: (To be shared)\nMobile: (To be shared)\nPickup: ${pickupPlace.label}\nDestination: ${destinationPlace.label}\nDistance: ${
              cardEstimate.isRouteReady
                ? `${cardEstimate.oneWayRoadDistanceKm} KM one-way (${cardEstimate.billableDistanceKm} KM billable)`
                : 'Please calculate'
            }\nJourney Type: ${getJourneyTypeLabel(journeyType)}\nVehicle: ${vehicle.name} (${vehicle.passengerCapacity} Pax)\nPassengers: Up to ${vehicle.passengerCapacity}\nTravel Date: Flexible\nReturn Date: Flexible\nEstimated Fare: ${
              cardEstimate.isRouteReady
                ? `${formatINR(cardEstimate.estimatedTotal)} (ESTIMATED FARE)`
                : `Starting ₹${ratePerKm}/km`
            }\nSpecial Requirements: Please share vehicle availability and best quotation.`;

            const directWhatsAppUrl = buildWhatsAppUrl(
              contactConfig.whatsappNumberInternational,
              directEnquiryMsg
            );

            const badgeBg =
              vehicle.badgeStyle === 'gold'
                ? 'bg-rating-gold text-primary'
                : vehicle.badgeStyle === 'secondary'
                  ? 'bg-secondary text-surface-canvas'
                  : 'bg-primary text-surface-canvas';

            return (
              <article
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle, false)}
                className={`rounded-2xl transition-all overflow-hidden flex flex-col justify-between cursor-pointer bg-surface-canvas ${
                  isSelected
                    ? 'ring-2 ring-route-active shadow-xl'
                    : 'shadow-sm hover:shadow-md border border-primary-container/6'
                }`}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative w-full h-52 bg-surface-container overflow-hidden">
                    <ResilientImage
                      src={vehicle.imageUrl}
                      alt={vehicle.imageAlt}
                      fallbackIcon={vehicle.headerIcon}
                      fallbackLabel={vehicle.shortName}
                    />
                    <div
                      className={`absolute top-3 left-3 ${badgeBg} text-label-sm font-bold px-2.5 py-1 rounded shadow-sm`}
                    >
                      {vehicle.badge}
                    </div>
                    <div className="absolute top-3 right-3 bg-rating-gold text-primary text-label-sm font-bold px-2.5 py-1 rounded shadow tabular-nums">
                      Starting ₹{ratePerKm} / KM
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-3 left-3 bg-route-active text-on-secondary text-label-sm font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                          check_circle
                        </span>
                        <span>Selected for Trip</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-space-lg flex flex-col gap-space-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-title-md font-bold text-on-surface">
                          {vehicle.name}
                        </h3>
                        <span className="text-body-sm text-secondary font-semibold">
                          Capacity: Up to {vehicle.passengerCapacity} Passengers • {vehicle.luggageLabel}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[20px] shrink-0 ${
                          vehicle.featured ? 'text-rating-gold material-symbol-filled' : 'text-secondary'
                        }`}
                        aria-hidden="true"
                      >
                        {vehicle.headerIcon}
                      </span>
                    </div>

                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {vehicle.description}
                    </p>

                    {/* Specs Strip */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {vehicle.specs.map((spec, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-surface-subtle px-2 py-1 rounded text-label-sm text-on-surface"
                        >
                          <span className="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">
                            {spec.icon}
                          </span>
                          <span>{spec.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing & Selection Actions Footer */}
                <div className="p-space-lg pt-0 flex flex-col gap-3">
                  <div className="pt-3 border-t border-primary-container/8 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-label-sm text-on-surface-variant">
                        {cardEstimate.isRouteReady ? 'Est. Fare for Active Route' : 'Per-KM Tariff'}
                      </span>
                      {cardEstimate.isRouteReady ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-title-md font-extrabold text-primary tabular-nums">
                            {formatINR(cardEstimate.estimatedTotal)}
                          </span>
                          <span className="text-label-sm text-secondary font-bold tabular-nums">
                            (₹{ratePerKm}/km)
                          </span>
                        </div>
                      ) : (
                        <span className="text-title-md font-bold text-secondary tabular-nums">
                          ₹{ratePerKm}/KM{' '}
                          <span className="text-label-sm font-normal text-on-surface-variant">
                            + Driver All.
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleSelectVehicle(vehicle, true)}
                        className={`px-3 py-2 rounded-lg text-label-md font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-secondary text-on-secondary shadow-sm'
                            : 'bg-surface-subtle hover:bg-surface-container text-primary'
                        }`}
                      >
                        {isSelected ? 'Book Selected' : 'Select'}
                      </button>

                      <a
                        href={directWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Enquire about ${vehicle.shortName} on WhatsApp`}
                        className="inline-flex items-center gap-1 bg-rating-gold hover:bg-rating-gold/90 text-primary px-3 py-2 rounded-lg text-label-md font-bold shadow transition-all whitespace-nowrap"
                      >
                        <span>Enquire</span>
                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                          chevron_right
                        </span>
                      </a>
                    </div>
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
