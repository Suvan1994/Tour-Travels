import React, { useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { JourneyType } from '../types/travel';
import { calculateEstimatedFare, formatINR, getJourneyTypeLabel } from '../utils/fareCalculator';
import {
  buildWhatsAppEnquiryMessage,
  buildWhatsAppUrl,
  openExternalLinkInNewTab,
  validateBookingEnquiry,
} from '../utils/whatsappBooking';

export const PriceEnquiryBanner: React.FC = () => {
  const {
    contactConfig,
    vehicles,
    pricingConfig,
    travelDate: defaultTravelDate,
    returnDate: defaultReturnDate,
    openEnquiryModal,
  } = useAppConfig();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('urbania-10-13');
  const [journeyType, setJourneyType] = useState<JourneyType>(JourneyType.ROUND_TRIP);
  const [passengers, setPassengers] = useState<number>(12);
  const [travelDate, setTravelDate] = useState(defaultTravelDate);
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];
  const isRoundTrip = journeyType === JourneyType.ROUND_TRIP;
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateBookingEnquiry({
      name,
      mobile,
      pickup,
      destination,
      passengers,
      maxCapacity: selectedVehicle.passengerCapacity,
      travelDate,
      returnDate,
      requireReturnDate: isRoundTrip,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const rate = pricingConfig.vehicleRates[selectedVehicle.id]?.ratePerKm ?? 20;
    const baseline = calculateEstimatedFare(
      {
        vehicleId: selectedVehicle.id,
        oneWayRoadDistanceKm: null,
        journeyType,
        tripDays: 1,
        includeTolls: false,
        includeParking: false,
        nightDrivingNights: 0,
        includeGst: false,
        requestCustomQuotation: true,
      },
      pricingConfig
    );

    const payload = {
      name,
      mobile,
      pickup,
      destination,
      distanceText: 'Custom Route Quotation Requested',
      journeyTypeLabel: getJourneyTypeLabel(journeyType),
      vehicleName: `${selectedVehicle.name} (${selectedVehicle.passengerCapacity} Pax)`,
      passengers,
      travelDate,
      returnDate: isRoundTrip ? returnDate : 'N/A (One-Way)',
      estimatedFareText: baseline.isRouteReady
        ? `${formatINR(baseline.estimatedTotal)} (Estimated)`
        : `Custom Quotation Requested (Tariff starts ₹${rate}/km)`,
      specialRequirements: notes,
    };

    const message = buildWhatsAppEnquiryMessage(payload);
    const whatsappUrl = buildWhatsAppUrl(contactConfig.whatsappNumberInternational, message);

    openEnquiryModal(payload, whatsappUrl, message);
    openExternalLinkInNewTab(whatsappUrl);
  };

  return (
    <section id="price-enquiry" className="w-full py-space-xl bg-primary text-surface-canvas">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="bg-gradient-to-r from-primary-container via-primary to-primary-container rounded-3xl p-space-lg lg:p-space-xl shadow-2xl flex flex-col lg:flex-row gap-space-xl items-center border border-surface-canvas/10">
          {/* Copy Column */}
          <div className="lg:w-5/12 flex flex-col gap-space-md">
            <span className="text-label-md text-rating-gold uppercase font-bold tracking-widest">
              Custom Tour &amp; Group Quotations
            </span>
            <h2 className="text-headline-lg-mobile sm:text-headline-lg text-surface-canvas tracking-tight">
              Tell Us Your Destination. We’ll Send Your Best Fare.
            </h2>
            <p className="text-body-lg text-surface-container-high leading-relaxed">
              Planning a customized multi-city family holiday, wedding guest shuttle convoy, or corporate charter? Submit your route details to receive a tailored quotation on WhatsApp.
            </p>
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="material-symbols-outlined text-rating-gold text-[22px]" aria-hidden="true">
                  phone_in_talk
                </span>
                <a
                  href={contactConfig.phoneHref}
                  className="text-title-md font-bold text-surface-canvas hover:text-rating-gold transition-colors tabular-nums"
                >
                  {contactConfig.phoneDisplay}
                </a>
                <span className="text-label-sm bg-surface-canvas/10 px-2 py-0.5 rounded text-surface-dim">
                  24x7 Helpline
                </span>
              </div>
              <div className="flex items-center gap-space-sm text-surface-dim text-body-sm">
                <span className="material-symbols-outlined text-success-green text-[18px]" aria-hidden="true">
                  bolt
                </span>
                <span>Direct WhatsApp enquiry — fast response from our central dispatch desk.</span>
              </div>
            </div>
          </div>

          {/* Validated Form Column */}
          <div className="lg:w-7/12 w-full bg-surface-canvas text-on-surface p-space-lg rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name *"
                    aria-label="Your Full Name"
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      errors.name ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {errors.name && <span className="text-body-sm text-error">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="WhatsApp Mobile Number *"
                    aria-label="WhatsApp Mobile Number"
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      errors.mobile ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {errors.mobile && (
                    <span className="text-body-sm text-error">{errors.mobile}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup City / Address *"
                    aria-label="Pickup City"
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      errors.pickup ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {errors.pickup && (
                    <span className="text-body-sm text-error">{errors.pickup}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination / Circuit *"
                    aria-label="Destination City"
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      errors.destination ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {errors.destination && (
                    <span className="text-body-sm text-error">{errors.destination}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <select
                    value={vehicleId}
                    onChange={(e) => {
                      setVehicleId(e.target.value);
                      const v = vehicles.find((item) => item.id === e.target.value);
                      if (v && passengers > v.passengerCapacity) {
                        setPassengers(v.passengerCapacity);
                      }
                    }}
                    aria-label="Preferred Vehicle"
                    className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.shortName} (Up to {v.passengerCapacity} Pax — ₹
                        {pricingConfig.vehicleRates[v.id]?.ratePerKm}/km)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    min={1}
                    max={selectedVehicle.passengerCapacity}
                    value={passengers}
                    onChange={(e) =>
                      setPassengers(Math.max(1, parseInt(e.target.value || '1', 10)))
                    }
                    placeholder="Passengers *"
                    aria-label="Number of Passengers"
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md tabular-nums focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      errors.passengers ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {errors.passengers && (
                    <span className="text-body-sm text-error">{errors.passengers}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <select
                  value={journeyType}
                  onChange={(e) => setJourneyType(e.target.value as JourneyType)}
                  aria-label="Journey Type"
                  className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active"
                >
                  <option value={JourneyType.ROUND_TRIP}>Round Trip</option>
                  <option value={JourneyType.ONE_WAY}>One-Way Drop</option>
                </select>

                <div className="flex flex-col gap-1">
                  <input
                    type="date"
                    min={todayStr}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    aria-label="Travel Date"
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      errors.travelDate ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {errors.travelDate && (
                    <span className="text-body-sm text-error">{errors.travelDate}</span>
                  )}
                </div>

                {isRoundTrip ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="date"
                      min={travelDate || todayStr}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      aria-label="Return Date"
                      className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                        errors.returnDate ? 'border-error' : 'border-primary-container/15'
                      }`}
                    />
                    {errors.returnDate && (
                      <span className="text-body-sm text-error">{errors.returnDate}</span>
                    )}
                  </div>
                ) : (
                  <div className="h-12 px-space-md bg-surface-subtle/60 rounded-lg border border-primary-container/10 flex items-center text-body-sm text-on-surface-variant">
                    Single-Day Drop
                  </div>
                )}
              </div>

              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requirements (multi-city stops, luggage carrier, wedding convoy details...)"
                aria-label="Special Requirements"
                className="w-full p-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active"
              />

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-space-sm bg-success-green hover:bg-success-green/90 text-surface-canvas py-space-md rounded-xl text-label-lg font-bold shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  chat
                </span>
                <span>Request Best Fare on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
